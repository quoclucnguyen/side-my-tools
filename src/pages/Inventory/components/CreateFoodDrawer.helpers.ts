import pica from 'pica'
import { z } from 'zod'
import { getSupabaseClient } from '@/lib/supabaseClient'

export const categories = [
  'Rau củ',
  'Trái cây',
  'Thịt',
  'Cá',
  'Sữa',
  'Đồ uống',
  'Đồ khô',
  'Khác',
] as const

export const units = [
  'kg',
  'gram',
  'g',
  'lít',
  'ml',
  'cái',
  'hộp',
  'gói',
  'túi',
] as const

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash'
export const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const foodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Tên tối thiểu 2 ký tự'),
  quantity: z
    .coerce
    .number()
    .refine((value) => Number.isFinite(value), 'Số lượng phải là số hợp lệ')
    .gt(0, 'Số lượng phải lớn hơn 0')
    .refine((value) => Number.isInteger(value * 100), 'Tối đa 2 chữ số thập phân'),
  unit: z.enum(units),
  expirationDate: z
    .string()
    .min(1, 'Vui lòng chọn hạn sử dụng')
    .refine((value) => {
      if (!value) return false
      const selected = new Date(`${value}T00:00:00`)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return selected >= today
    }, 'Hạn sử dụng phải từ hôm nay trở về sau'),
  category: z.enum(categories),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_SIZE, 'Hình ảnh tối đa 5MB')
    .optional(),
})

export type FoodFormValues = z.infer<typeof foodSchema>

export interface CreateFoodDrawerProps {
  onCreated?: () => Promise<void> | void
}

export const supabase = getSupabaseClient()
export const picaInstance = pica()
export const FOOD_IMAGES_BUCKET =
  import.meta.env.VITE_SUPABASE_FOOD_BUCKET ?? 'food-images'

export function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDefaultValues(): FoodFormValues {
  const now = new Date()
  return {
    name: '',
    quantity: 1,
    unit: 'cái',
    expirationDate: formatDateInput(now),
    category: 'Rau củ',
    imageFile: undefined,
  }
}

export function normalizeEnumValue<T extends readonly string[]>(
  value: string,
  options: T,
): T[number] | null {
  const normalized = value.trim().toLowerCase()
  return options.find((option) => option.toLowerCase() === normalized) ?? null
}

export const readFileAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Không thể đọc dữ liệu hình ảnh.'))
        return
      }
      const base64 = reader.result.split(',')[1]
      if (!base64) {
        reject(new Error('Không thể mã hóa hình ảnh.'))
        return
      }
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Không thể đọc dữ liệu hình ảnh.'))
    reader.readAsDataURL(file)
  })

export const resizeImage = async (file: File) => {
  if (globalThis.window === undefined) {
    throw new Error('Chức năng upload chỉ khả dụng trên trình duyệt.')
  }

  let width: number
  let height: number
  const sourceCanvas = document.createElement('canvas')
  const supportsImageBitmap = 'createImageBitmap' in globalThis.window
  let bitmap: ImageBitmap | null = null
  let cleanupUrl: string | null = null

  if (supportsImageBitmap) {
    bitmap = await createImageBitmap(file)
    width = bitmap.width
    height = bitmap.height
    sourceCanvas.width = width
    sourceCanvas.height = height
    const drawingContext = sourceCanvas.getContext('2d')
    if (!drawingContext) {
      bitmap.close()
      throw new Error('Không thể xử lý hình ảnh.')
    }
    drawingContext.drawImage(bitmap, 0, 0)
  } else {
    cleanupUrl = URL.createObjectURL(file)
    const img = await loadHtmlImage(cleanupUrl)
    width = img.naturalWidth
    height = img.naturalHeight
    sourceCanvas.width = width
    sourceCanvas.height = height
    const drawingContext = sourceCanvas.getContext('2d')
    if (!drawingContext) {
      URL.revokeObjectURL(cleanupUrl)
      throw new Error('Không thể xử lý hình ảnh.')
    }
    drawingContext.drawImage(img, 0, 0)
  }

  const maxDimension = 800
  const scale = Math.min(1, maxDimension / Math.max(width, height))

  let targetCanvas = sourceCanvas
  if (scale < 1) {
    const targetWidth = Math.round(width * scale)
    const targetHeight = Math.round(height * scale)
    targetCanvas = document.createElement('canvas')
    targetCanvas.width = targetWidth
    targetCanvas.height = targetHeight

    await picaInstance.resize(sourceCanvas, targetCanvas, {
      quality: 3,
      unsharpAmount: 160,
      unsharpRadius: 0.6,
      unsharpThreshold: 2,
    })
  }

  if (bitmap) {
    bitmap.close()
  }
  if (cleanupUrl) {
    URL.revokeObjectURL(cleanupUrl)
  }

  return await picaInstance.toBlob(targetCanvas, 'image/jpeg', 0.9)
}

export const loadHtmlImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () =>
      reject(new Error('Không thể tải hình ảnh.'))
    image.src = url
  })
