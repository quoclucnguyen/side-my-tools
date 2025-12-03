import type { BadgeProps } from '@/components/ui/badge'
import { statusLabels } from './helpers'

export type BadgeVariant = NonNullable<BadgeProps['variant']>

export const formatDate = (value: string | null) => {
  if (!value) return 'Chưa cập nhật'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Không xác định'
  return date.toLocaleDateString('vi-VN')
}

export const formatStatus = (value: string | null) => {
  if (!value) return 'Không xác định'
  return statusLabels[value as keyof typeof statusLabels] ?? value
}

export const getExpiryVariant = (value: string | null): BadgeVariant => {
  if (!value) return 'outline'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'outline'

  const diffMs = date.getTime() - Date.now()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'destructive'
  if (diffDays <= 7) return 'secondary'
  return 'default'
}
