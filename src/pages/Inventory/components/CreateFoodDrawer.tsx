import { useCallback, useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import pica from 'pica'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth.store'
import { getSupabaseClient } from '@/lib/supabaseClient'

const categories = [
  'Rau củ',
  'Trái cây',
  'Thịt',
  'Cá',
  'Sữa',
  'Đồ uống',
  'Đồ khô',
  'Khác',
] as const

const units = [
  'kg',
  'gram',
  'g',
  'lít',
  'ml',
  'cái',
  'hộp',
  'gói',
  'túi',
] as const

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

const foodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Tên tối thiểu 2 ký tự'),
  quantity: z
    .coerce
    .number()
    .refine((value) => Number.isFinite(value), 'Số lượng phải là số hợp lệ')
    .gt(0, 'Số lượng phải lớn hơn 0')
    .refine((value) => Number.isInteger(value * 100), 'Tối đa 2 chữ số thập phân'),
  unit: z.enum(units),
  expirationDate: z
    .string()
    .min(1, 'Vui lòng chọn hạn sử dụng')
    .refine((value) => {
      if (!value) return false
      const selected = new Date(`${value}T00:00:00`)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return selected >= today
    }, 'Hạn sử dụng phải từ hôm nay trở về sau'),
  category: z.enum(categories),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_SIZE, 'Hình ảnh tối đa 5MB')
    .optional(),
})

type FoodFormValues = z.infer<typeof foodSchema>

interface CreateFoodDrawerProps {
  onCreated?: () => Promise<void> | void
}

const supabase = getSupabaseClient()
const picaInstance = pica()
const FOOD_IMAGES_BUCKET =
  import.meta.env.VITE_SUPABASE_FOOD_BUCKET ?? 'food-images'

function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDefaultValues(): FoodFormValues {
  const now = new Date()
  return {
    name: '',
    quantity: 1,
    unit: 'cái',
    expirationDate: formatDateInput(now),
    category: 'Rau củ',
    imageFile: undefined,
  }
}

export function CreateFoodDrawer({ onCreated }: Readonly<CreateFoodDrawerProps>) {
  const user = useAuthStore((state) => state.user)
  const [open, setOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const defaultValues = useMemo(() => getDefaultValues(), [])

  const form = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema) as Resolver<FoodFormValues>,
    defaultValues,
  })

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen) {
        setServerError(null)
        form.reset(getDefaultValues())
        setPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current)
          }
          return null
        })
      }
    },
    [form],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (!user?.id) {
        setServerError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.')
        return
      }

      setServerError(null)

      const { imageFile, ...restValues } = values

      let imageUrl: string | null = null

      if (imageFile) {
        const bufferedImage = await resizeImage(imageFile)
        const uniqueId =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`
        const fileName = `${user.id}/${uniqueId}.jpg`
        const { error: uploadError } = await supabase.storage
          .from(FOOD_IMAGES_BUCKET)
          .upload(fileName, bufferedImage, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrlData } = supabase.storage
          .from(FOOD_IMAGES_BUCKET)
          .getPublicUrl(fileName)

        imageUrl = publicUrlData?.publicUrl ?? null
      }

      const payload = {
        user_id: user.id,
        name: restValues.name.trim(),
        quantity: restValues.quantity,
        unit: restValues.unit,
        expiration_date: restValues.expirationDate,
        category: restValues.category,
        image_url: imageUrl,
      }

      const { error } = await supabase.from('food_items').insert(payload)

      if (error) {
        throw error
      }

      if (onCreated) {
        await onCreated()
      }

      handleOpenChange(false)
    } catch (error) {
      console.error('Failed to create food item:', error)
      setServerError('Không thể tạo thực phẩm. Vui lòng thử lại.')
    }
  })

  const resizeImage = async (file: File) => {
    if (typeof window === 'undefined') {
      throw new Error('Chức năng upload chỉ khả dụng trên trình duyệt.')
    }

    let width: number
    let height: number
    const sourceCanvas = document.createElement('canvas')
    const supportsImageBitmap = 'createImageBitmap' in window
    let bitmap: ImageBitmap | null = null
    let cleanupUrl: string | null = null

    if (supportsImageBitmap) {
      bitmap = await createImageBitmap(file)
      width = bitmap.width
      height = bitmap.height
      sourceCanvas.width = width
      sourceCanvas.height = height
      const drawingContext = sourceCanvas.getContext('2d')
      if (!drawingContext) {
        bitmap.close()
        throw new Error('Không thể xử lý hình ảnh.')
      }
      drawingContext.drawImage(bitmap, 0, 0)
    } else {
      cleanupUrl = URL.createObjectURL(file)
      const img = await loadHtmlImage(cleanupUrl)
      width = img.naturalWidth
      height = img.naturalHeight
      sourceCanvas.width = width
      sourceCanvas.height = height
      const drawingContext = sourceCanvas.getContext('2d')
      if (!drawingContext) {
        URL.revokeObjectURL(cleanupUrl)
        throw new Error('Không thể xử lý hình ảnh.')
      }
      drawingContext.drawImage(img, 0, 0)
    }

    const maxDimension = 800
    const scale = Math.min(1, maxDimension / Math.max(width, height))

    let targetCanvas = sourceCanvas
    if (scale < 1) {
      const targetWidth = Math.round(width * scale)
      const targetHeight = Math.round(height * scale)
      targetCanvas = document.createElement('canvas')
      targetCanvas.width = targetWidth
      targetCanvas.height = targetHeight

      await picaInstance.resize(sourceCanvas, targetCanvas, {
        quality: 3,
        unsharpAmount: 160,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
      })
    }

    if (bitmap) {
      bitmap.close()
    }
    if (cleanupUrl) {
      URL.revokeObjectURL(cleanupUrl)
    }

    return await picaInstance.toBlob(targetCanvas, 'image/jpeg', 0.9)
  }

  const loadHtmlImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = (error) => reject(error)
      image.src = url
    })

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button size='sm'>Thêm mới</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Thêm thực phẩm</DrawerTitle>
          <DrawerDescription>
            Nhập đầy đủ thông tin để lưu vào kho.
          </DrawerDescription>
        </DrawerHeader>

        <div className='mx-auto w-full max-w-md px-6 pb-2'>
          <Form {...form}>
            <form onSubmit={onSubmit} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thực phẩm</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ví dụ: Cà rốt hữu cơ'
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-3'>
                <FormField
                  control={form.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='0.01'
                          min='0'
                          disabled={form.formState.isSubmitting}
                          name={field.name}
                          ref={field.ref}
                          value={
                            field.value === undefined || field.value === null
                              ? ''
                              : field.value
                          }
                          onChange={(event) => field.onChange(event.target.value)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='unit'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn vị</FormLabel>
                      <FormControl>
                        <Select
                          disabled={form.formState.isSubmitting}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Chọn đơn vị' />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='expirationDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạn sử dụng</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <FormControl>
                      <Select
                        disabled={form.formState.isSubmitting}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Chọn danh mục' />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name='imageFile'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        accept='image/*'
                        disabled={form.formState.isSubmitting}
                        onChange={(event) => {
                          field.onBlur()
                          const file = event.target.files?.[0]
                          field.onChange(file)

                          setPreviewUrl((current) => {
                            if (current) {
                              URL.revokeObjectURL(current)
                            }
                            return file ? URL.createObjectURL(file) : null
                          })

                          event.target.value = ''
                        }}
                      />
                    </FormControl>
                    <FormDescription>PNG hoặc JPEG, tối đa 5MB.</FormDescription>
                    {previewUrl ? (
                      <div className='flex items-start gap-3 rounded-md border border-dashed border-border p-3'>
                        <img
                          src={previewUrl}
                          alt='Xem trước thực phẩm'
                          className='h-20 w-20 rounded-md object-cover'
                        />
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            field.onChange(undefined)
                            setPreviewUrl((current) => {
                              if (current) {
                                URL.revokeObjectURL(current)
                              }
                              return null
                            })
                          }}
                          disabled={form.formState.isSubmitting}
                        >
                          Xóa hình
                        </Button>
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError ? (
                <p className='text-sm text-destructive'>{serverError}</p>
              ) : null}

              <DrawerFooter>
                <Button type='submit' disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu thực phẩm'}
                </Button>
                <DrawerClose asChild>
                  <Button variant='outline' type='button'>
                    Hủy
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
