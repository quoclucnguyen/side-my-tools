import type { FoodItem } from './types'

export const fallbackItems: FoodItem[] = [
  {
    id: 'sample-1',
    name: 'Ức gà',
    quantity: 6,
    unit: 'miếng',
    expirationDate: '2025-03-01',
    category: 'Protein',
    imageUrl: null,
  },
  {
    id: 'sample-2',
    name: 'Sữa hạnh nhân',
    quantity: 2,
    unit: 'hộp',
    expirationDate: '2025-02-28',
    category: 'Đồ uống',
    imageUrl: null,
  },
  {
    id: 'sample-3',
    name: 'Rau củ hỗn hợp',
    quantity: 4,
    unit: 'túi',
    expirationDate: null,
    category: 'Rau củ',
    imageUrl: null,
  },
]
