import type { BadgeProps } from '@/components/ui/badge'

type BadgeVariant = NonNullable<BadgeProps['variant']>

export const formatExpiration = (value: string | null) => {
  if (!value) return 'Chưa cập nhật'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Không xác định'
  return date.toLocaleDateString('vi-VN')
}

export const getExpirationVariant = (value: string | null): BadgeVariant => {
  if (!value) return 'outline'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'outline'

  const diffMs = date.getTime() - Date.now()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'destructive'
  if (diffDays <= 3) return 'secondary'
  return 'default'
}

export type StatusBadge = {
  label: string
  variant: BadgeVariant
} | null

export const getStatusBadge = (
  error: Error | null,
  isLoading: boolean,
  isFetching: boolean
): StatusBadge => {
  if (!error) {
    if (isLoading) {
      return {
        label: 'Đang tải dữ liệu từ Supabase...',
        variant: 'secondary',
      }
    }
    if (isFetching) {
      return {
        label: 'Đang tải thêm dữ liệu...',
        variant: 'secondary',
      }
    }
    return { label: 'Đồng bộ thành công', variant: 'outline' }
  }
  return null
}
