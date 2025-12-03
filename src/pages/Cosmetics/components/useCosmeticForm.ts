import { useCallback, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/auth.store'
import {
  COSMETICS_BUCKET,
  cosmeticSchema,
  getDefaultValues,
  resizeImage,
  supabase,
  type CosmeticFormValues,
  statusOptions,
  categoryOptions,
} from '../helpers'
import type { Cosmetic } from '../types'

interface UseCosmeticFormParams {
  item?: Cosmetic | null
  onSaved?: () => void
}

export function useCosmeticForm({ item, onSaved }: UseCosmeticFormParams) {
  const user = useAuthStore((state) => state.user)
  const [open, setOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(item?.imageUrl ?? null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: CosmeticFormValues = useMemo(() => (
    item
      ? {
          name: item.name,
          brand: item.brand || '',
          category: (item.category as typeof categoryOptions[number] | undefined) || 'Khác',
          expiryDate: item.expiryDate || '',
          openedDate: item.openedDate || '',
          status: (item.status as typeof statusOptions[number]) || 'active',
          notes: item.notes || '',
          imageFile: undefined,
        }
      : getDefaultValues()
  ), [item])

  const form = useForm<CosmeticFormValues>({
    resolver: zodResolver(cosmeticSchema) as Resolver<CosmeticFormValues>,
    defaultValues,
  })

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (nextOpen && item?.imageUrl) {
        setPreviewUrl(item.imageUrl)
      }
      if (!nextOpen) {
        setServerError(null)
        form.reset(defaultValues)
        setPreviewUrl((current) => {
          if (current) URL.revokeObjectURL(current)
          return null
        })
      }
    },
    [defaultValues, form, item?.imageUrl],
  )

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    form.setValue('imageFile', file)
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return file ? URL.createObjectURL(file) : null
    })
    event.target.value = ''
  }, [form])

  const onSubmit = form.handleSubmit(async (values) => {
    if (!user?.id) {
      setServerError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.')
      return
    }

    setIsSubmitting(true)
    setServerError(null)

    try {
      const { imageFile, ...rest } = values
      let imageUrl = item?.imageUrl ?? null

      if (imageFile) {
        const buffered = await resizeImage(imageFile)
        const uniqueId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`
        const fileName = `${user.id}/${uniqueId}.jpg`
        const { error: uploadError } = await supabase.storage
          .from(COSMETICS_BUCKET)
          .upload(fileName, buffered, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from(COSMETICS_BUCKET)
          .getPublicUrl(fileName)

        imageUrl = publicUrlData?.publicUrl ?? null
      }

      const payload = {
        user_id: user.id,
        name: rest.name.trim(),
        brand: rest.brand?.trim() || null,
        category: rest.category || null,
        expiry_date: rest.expiryDate || null,
        opened_date: rest.openedDate || null,
        status: rest.status,
        notes: rest.notes?.trim() || null,
        image_url: imageUrl,
      }

      if (item?.id) {
        const { error } = await supabase.from('cosmetics').update(payload).eq('id', item.id)
        if (error) throw error
        toast.success('Đã cập nhật mỹ phẩm.')
      } else {
        const { error } = await supabase.from('cosmetics').insert(payload)
        if (error) throw error
        toast.success('Đã thêm mỹ phẩm mới.')
      }

      onSaved?.()
      handleOpenChange(false)
    } catch (error) {
      console.error('Failed to save cosmetic:', error)
      setServerError('Không thể lưu mỹ phẩm. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  })

  return {
    form,
    open,
    setOpen: handleOpenChange,
    previewUrl,
    setPreviewUrl,
    serverError,
    isSubmitting,
    handleFileChange,
    onSubmit,
  }
}
