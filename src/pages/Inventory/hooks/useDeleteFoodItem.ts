import { useMutation } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabaseClient'

interface UseDeleteFoodItemOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useDeleteFoodItem(options?: UseDeleteFoodItemOptions) {
  const supabase = getSupabaseClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}
