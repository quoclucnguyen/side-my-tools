import type { ControllerRenderProps } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useUserSettings } from '@/hooks/useSettings'
import type { FoodFormValues } from './CreateFoodDrawer.helpers'
import { Input } from '@/components/ui/input'

interface ImageFieldProps {
  field: ControllerRenderProps<FoodFormValues, 'imageFile'>
  onAnalyze: (file: File | undefined) => void
  previewUrl: string | null
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
  isAnalyzing: boolean
  aiError: string | null
  aiSuccess: boolean
}

export function ImageField({
  field,
  onAnalyze,
  previewUrl,
  setPreviewUrl,
  isAnalyzing,
  aiError,
  aiSuccess,
}: Readonly<ImageFieldProps>) {
  const form = useFormContext()
  const { data: userSettings, isLoading: isLoadingUserSettings } = useUserSettings()
  const hasGeminiKey = !!userSettings?.gemini_api_key

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    field.onChange(file || undefined)
    const newPreviewUrl = file ? URL.createObjectURL(file) : null
    setPreviewUrl((current: string | null) => {
      if (current) {
        URL.revokeObjectURL(current)
      }
      return newPreviewUrl
    })
    event.target.value = ''
  }

  return (
    <>
      <label htmlFor="file" className="text-sm font-medium">Hình ảnh (tùy chọn)</label>
      <Input
        type="file"
        accept="image/*"
        disabled={form.formState.isSubmitting}
        onChange={handleFileChange}
        onBlur={field.onBlur}
        
      />
      <p className="text-sm text-muted-foreground">PNG hoặc JPEG, tối đa 5MB.</p>
      {previewUrl ? (
        <div className="flex items-start gap-3 rounded-md border border-dashed border-border p-3">
          <img
            src={previewUrl}
            alt="Xem trước thực phẩm"
            className="h-20 w-20 rounded-md object-cover"
          />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  field.onChange(undefined)
                  setPreviewUrl((current) => {
                    if (current) {
                      URL.revokeObjectURL(current)
                    }
                    return null
                  })
                }}
                className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                disabled={form.formState.isSubmitting || isAnalyzing}
              >
                Xóa hình
              </button>
              <button
                type="button"
                onClick={() => {
                  const file = field.value
                  onAnalyze(file instanceof File ? file : undefined)
                }}
                disabled={form.formState.isSubmitting || isAnalyzing}
                className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  'Phân tích bằng AI'
                )}
              </button>
            </div>
            {aiError ? (
              <p className="text-xs text-destructive">{aiError}</p>
            ) : null}
            {aiSuccess ? (
              <p className="text-xs text-muted-foreground">
                Đã điền gợi ý từ AI. Vui lòng kiểm tra lại thông tin trước khi lưu.
              </p>
            ) : null}
            {!hasGeminiKey && !isLoadingUserSettings ? (
              <p className="text-xs text-muted-foreground">
                Cấu hình khóa Gemini trong trang Cài đặt để kích hoạt phân tích AI.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
