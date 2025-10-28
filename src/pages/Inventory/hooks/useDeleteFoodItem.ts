import { useMutation } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { toast } from 'sonner'

interface UseDeleteFoodItemOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useDeleteFoodItem(options?: UseDeleteFoodItemOptions) {
  const supabase = getSupabaseClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }
    },
    onSuccess: () => {
      options?.onSuccess?.()
      toast.success('Đã xóa thực phẩm thành công.')
    },
    onError: options?.onError,
  })
}
