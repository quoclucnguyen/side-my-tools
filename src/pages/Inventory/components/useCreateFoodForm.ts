import { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useGeminiClient, useUserSettings } from '@/hooks/useSettings'
import { getGeminiPreferences } from '@/lib/settings.api'
import { useAuthStore } from '@/stores/auth.store'
import {
  foodSchema,
  type FoodFormValues,
  getDefaultValues,
  supabase,
  FOOD_IMAGES_BUCKET,
  resizeImage,
  normalizeEnumValue,
  categories,
  units,
  DEFAULT_GEMINI_MODEL,
  ISO_DATE_REGEX,
  readFileAsBase64,
} from './CreateFoodDrawer.helpers'

export function useCreateFoodForm(onCreated?: () => Promise<void> | void) {
  const user = useAuthStore((state) => state.user)
  const [open, setOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiSuccess, setAiSuccess] = useState(false)

  const { isConfigured, createClient } = useGeminiClient()
  const { data: userSettings } = useUserSettings()

  const preferredModel = userSettings
    ? getGeminiPreferences(userSettings).preferredModel?.trim() || DEFAULT_GEMINI_MODEL
    : DEFAULT_GEMINI_MODEL

  const defaultValues = getDefaultValues()

  const form = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema) as Resolver<FoodFormValues>,
    defaultValues,
  })

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen) {
        setServerError(null)
        form.reset(getDefaultValues())
        setAiError(null)
        setAiSuccess(false)
        setIsAnalyzing(false)
        setPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current)
          }
          return null
        })
      }
    },
    [form],
  )

  const analyzeImageWithAi = useCallback(
    async (file: File) => {
      setIsAnalyzing(true)
      setAiSuccess(false)
      try {
        const ai = createClient()
        const base64Data = await readFileAsBase64(file)
        const prompt =
          'Phân tích hình ảnh thực phẩm và trả lời bằng JSON thuần với các thuộc tính: ' +
          "name (string), quantity (số thập phân, ví dụ 1.5), unit (một trong các giá trị: 'kg','gram','g','lít','ml','cái','hộp','gói','túi'), " +
          "expirationDate (chuỗi YYYY-MM-DD, nếu không rõ hãy ước lượng ngày hết hạn an toàn), và category (một trong: 'Rau củ','Trái cây','Thịt','Cá','Sữa','Đồ uống','Đồ khô','Khác'). " +
          'Nếu không chắc một trường, hãy để trống chuỗi.'

        const result = await ai.models.generateContent({
          model: preferredModel,
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    data: base64Data,
                    mimeType: file.type || 'image/jpeg',
                  },
                },
              ],
            },
          ],
        })

        const rawText = result.text
        if (!rawText) {
          throw new Error('Phản hồi AI không hợp lệ.')
        }

        const cleaned = rawText
          .replaceAll(/```(?:json)?/gi, "")
          .replaceAll(/```/g, "")
          .trim()
        const parsed = JSON.parse(cleaned)

        let applied = false

        if (typeof parsed.name === 'string' && parsed.name.trim()) {
          form.setValue('name', parsed.name.trim(), { shouldDirty: true, shouldTouch: true })
          applied = true
        }

        if (parsed.quantity !== undefined) {
          const quantityValue = Number(parsed.quantity)
          if (!Number.isNaN(quantityValue) && Number.isFinite(quantityValue) && quantityValue > 0) {
            form.setValue('quantity', quantityValue, { shouldDirty: true, shouldTouch: true })
            applied = true
          }
        }

        if (typeof parsed.unit === 'string') {
          const unitMatch = normalizeEnumValue(parsed.unit, units)
          if (unitMatch) {
            form.setValue('unit', unitMatch, { shouldDirty: true, shouldTouch: true })
            applied = true
          }
        }

        if (typeof parsed.expirationDate === 'string') {
          const expirationCandidate = parsed.expirationDate.trim()
          if (ISO_DATE_REGEX.test(expirationCandidate)) {
            form.setValue('expirationDate', expirationCandidate, {
              shouldDirty: true,
              shouldTouch: true,
            })
            applied = true
          }
        }

        if (typeof parsed.category === 'string') {
          const categoryMatch = normalizeEnumValue(parsed.category, categories)
          if (categoryMatch) {
            form.setValue('category', categoryMatch, { shouldDirty: true, shouldTouch: true })
            applied = true
          }
        }

        if (!applied) {
          throw new Error('AI không trả về dữ liệu hợp lệ để điền vào biểu mẫu.')
        }

        form.trigger(['name', 'quantity', 'unit', 'expirationDate', 'category'])
        setAiError(null)
        setAiSuccess(true)
      } catch (error) {
        console.error('AI analysis failed:', error)
        setAiError(
          error instanceof Error
            ? error.message
            : 'Không thể phân tích hình ảnh. Vui lòng thử lại.',
        )
      } finally {
        setIsAnalyzing(false)
      }
    },
    [createClient, form, preferredModel],
  )

  const handleAnalyzeImage = useCallback(
    async (file: File | undefined) => {
      setAiSuccess(false)
      if (!file) {
        setAiError('Vui lòng chọn hình ảnh trước khi phân tích bằng AI.')
        return
      }

      if (!isConfigured) {
        setAiError('Vui lòng cấu hình Gemini API key trong trang Cài đặt để sử dụng AI.')
        return
      }

      setAiError(null)
      await analyzeImageWithAi(file)
    },
    [analyzeImageWithAi, isConfigured],
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      setAiError(null)
      setAiSuccess(false)
      setPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current)
        }
        return file ? URL.createObjectURL(file) : null
      })
      event.target.value = ''
    },
    [],
  )

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (!user?.id) {
        setServerError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.')
        return
      }

      setServerError(null)

      const { imageFile, ...restValues } = values

      let imageUrl: string | null = null

      if (imageFile) {
        const bufferedImage = await resizeImage(imageFile)
        const uniqueId =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`
        const fileName = `${user.id}/${uniqueId}.jpg`
        const { error: uploadError } = await supabase.storage
          .from(FOOD_IMAGES_BUCKET)
          .upload(fileName, bufferedImage, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrlData } = supabase.storage
          .from(FOOD_IMAGES_BUCKET)
          .getPublicUrl(fileName)

        imageUrl = publicUrlData?.publicUrl ?? null
      }

      const payload = {
        user_id: user.id,
        name: restValues.name.trim(),
        quantity: restValues.quantity,
        unit: restValues.unit,
        expiration_date: restValues.expirationDate,
        category: restValues.category,
        image_url: imageUrl,
      }

      const { error } = await supabase.from('food_items').insert(payload)

      if (error) {
        throw error
      }

      onCreated?.()
      handleOpenChange(false)
    } catch (error) {
      console.error('Failed to create food item:', error)
      setServerError('Không thể tạo thực phẩm. Vui lòng thử lại.')
    }
  })

  return {
    open,
    setOpen: handleOpenChange,
    form,
    serverError,
    previewUrl,
    setPreviewUrl,
    isAnalyzing,
    aiError,
    aiSuccess,
    handleAnalyzeImage,
    handleFileChange,
    onSubmit,
  }
}
