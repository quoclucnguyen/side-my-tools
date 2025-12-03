import pica from 'pica'
import { z } from 'zod'
import { getSupabaseClient } from '@/lib/supabaseClient'

export const COSMETICS_BUCKET =
  import.meta.env.VITE_SUPABASE_COSMETICS_BUCKET ?? 'cosmetics-images'
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

export const statusOptions = ['active', 'opened', 'expired', 'discarded'] as const
export const categoryOptions = [
  'Chăm sóc da',
  'Trang điểm',
  'Tóc',
  'Cơ thể',
  'Nước hoa',
  'Khác',
] as const

export const statusLabels: Record<(typeof statusOptions)[number], string> = {
  active: 'Đang dùng',
  opened: 'Đã mở',
  expired: 'Hết hạn',
  discarded: 'Đã bỏ',
}

export const cosmeticSchema = z.object({
  name: z.string().trim().min(2, 'Tên tối thiểu 2 ký tự'),
  brand: z.string().trim().optional(),
  category: z.enum(categoryOptions).optional(),
  expiryDate: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
      'Định dạng ngày YYYY-MM-DD'
    ),
  openedDate: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
      'Định dạng ngày YYYY-MM-DD'
    ),
  status: z.enum(statusOptions).default('active'),
  notes: z.string().trim().max(500).optional(),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_SIZE, 'Hình ảnh tối đa 5MB')
    .optional(),
})

export type CosmeticFormValues = z.infer<typeof cosmeticSchema>

export const supabase = getSupabaseClient()
const picaInstance = pica()

export const formatDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getDefaultValues = (): CosmeticFormValues => ({
  name: '',
  brand: '',
  category: 'Khác',
  expiryDate: '',
  openedDate: '',
  status: 'active',
  notes: '',
  imageFile: undefined,
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
    image.onerror = () => reject(new Error('Không thể tải hình ảnh.'))
    image.src = url
  })
