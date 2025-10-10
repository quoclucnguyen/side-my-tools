import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface FallbackDataAlertProps {
  shouldUseFallback: boolean
}

export function FallbackDataAlert({ shouldUseFallback }: Readonly<FallbackDataAlertProps>) {
  if (!shouldUseFallback) return null

  return (
    <Alert className='border-dashed'>
      <AlertTitle>Dữ liệu minh họa</AlertTitle>
      <AlertDescription>
        Hiển thị dữ liệu mẫu khi chưa có dữ liệu thực tế trong Supabase. Sau khi thêm
        bản ghi, tải lại trang để đồng bộ.
      </AlertDescription>
    </Alert>
  )
}
