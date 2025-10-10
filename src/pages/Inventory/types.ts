export type FoodItemRow = {
  id?: string
  name?: string
  quantity?: number | string | null
  unit?: string | null
  expiration_date?: string | null
  category?: string | null
  image_url?: string | null
}

export type FoodItem = {
  id: string
  name: string
  quantity: number
  unit: string
  expirationDate: string | null
  category: string
  imageUrl: string | null
}
