import { useMutation } from '@tanstack/react-query'
import { supabase, FOOD_IMAGES_BUCKET, resizeImage } from '../components/CreateFoodDrawer.helpers'
import { useAuthStore } from '@/stores/auth.store'
import type { FoodFormValues } from '../components/CreateFoodDrawer.helpers'
import { toast } from 'sonner'

interface UseUpdateFoodItemOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

type UpdateParams = {
  id: string
  values: FoodFormValues
  currentImageUrl: string | null
}

export function useUpdateFoodItem(options?: UseUpdateFoodItemOptions) {
  const user = useAuthStore((state) => state.user)

  return useMutation({
    mutationFn: async ({ id, values, currentImageUrl }: UpdateParams) => {
      if (!user?.id) {
        throw new Error('INVALID_SESSION')
      }

      const { imageFile, ...restValues } = values

      let imageUrl: string | null = currentImageUrl

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
        name: restValues.name.trim(),
        quantity: restValues.quantity,
        unit: restValues.unit,
        expiration_date: restValues.expirationDate,
        category: restValues.category,
        image_url: imageUrl,
      }

      const { error } = await supabase.from('food_items').update(payload).eq('id', id)

      if (error) {
        throw error
      }
    },
    onSuccess: ()=>{
        options?.onSuccess?.()
        toast.success('Đã cập nhật thực phẩm thành công.')
    },
    onError: options?.onError,
  })
}
