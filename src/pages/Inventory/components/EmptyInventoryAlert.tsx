import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function EmptyInventoryAlert() {
  return (
    <Alert className='border-dashed'>
      <AlertTitle>Kho trống</AlertTitle>
      <AlertDescription>
        Chưa có mặt hàng nào được ghi nhận. Thêm dữ liệu vào bảng{' '}
        <span className='font-medium'>food_items</span> trong Supabase để bắt đầu
        theo dõi.
      </AlertDescription>
    </Alert>
  )
}
