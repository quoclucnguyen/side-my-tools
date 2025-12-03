export type CosmeticRow = {
  id?: string
  user_id?: string | null
  name?: string | null
  brand?: string | null
  category?: string | null
  expiry_date?: string | null
  opened_date?: string | null
  status?: string | null
  notes?: string | null
  image_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type Cosmetic = {
  id: string
  name: string
  brand: string
  category: string
  expiryDate: string | null
  openedDate: string | null
  status: string
  notes: string
  imageUrl: string | null
  createdAt: string | null
  updatedAt: string | null
}
