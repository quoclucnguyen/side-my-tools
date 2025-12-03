import type { ControllerRenderProps } from 'react-hook-form'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import type { CosmeticFormValues } from '../helpers'

interface CosmeticImageFieldProps {
  field: ControllerRenderProps<CosmeticFormValues, 'imageFile'>
  previewUrl: string | null
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
  isSubmitting: boolean
}

export function CosmeticImageField({ field, previewUrl, setPreviewUrl, isSubmitting }: Readonly<CosmeticImageFieldProps>) {
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
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return file ? URL.createObjectURL(file) : null
    })
    event.target.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor="cosmetic-image">Hình ảnh (tùy chọn)</label>
      <Input
        id="cosmetic-image"
        type="file"
        accept="image/*"
        disabled={isSubmitting}
        onChange={handleFileChange}
        onBlur={field.onBlur}
      />
      <p className="text-xs text-muted-foreground">JPEG/PNG, tối đa 5MB.</p>
      {previewUrl ? (
        <div className="flex items-start gap-3 rounded-md border border-dashed border-border p-3">
          <img src={previewUrl} alt="Xem trước" className="h-20 w-20 rounded-md object-cover" />
          <button
            type="button"
            onClick={() => {
              field.onChange(undefined)
              setPreviewUrl((current) => {
                if (current) URL.revokeObjectURL(current)
                return null
              })
            }}
            disabled={isSubmitting}
            className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Xóa hình
          </button>
        </div>
      ) : null}
    </div>
  )
}
