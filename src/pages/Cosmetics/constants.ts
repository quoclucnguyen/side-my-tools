import type { Cosmetic } from './types'

export const statusFilters = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Đang dùng' },
  { value: 'opened', label: 'Đã mở' },
  { value: 'expired', label: 'Hết hạn' },
  { value: 'discarded', label: 'Đã bỏ' },
]

export const fallbackCosmetics: Cosmetic[] = []
