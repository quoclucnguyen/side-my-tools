import { type Control } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categoryOptions, statusOptions, type CosmeticFormValues } from '../helpers'

interface CosmeticFormFieldsProps {
  control: Control<CosmeticFormValues>
  isBusy: boolean
  serverError: string | null
  imageField: React.ReactNode
}

const statusLabels: Record<(typeof statusOptions)[number], string> = {
  active: 'Đang dùng',
  opened: 'Đã mở',
  expired: 'Hết hạn',
  discarded: 'Đã bỏ',
}

export function CosmeticFormFields({ control, isBusy, serverError, imageField }: Readonly<CosmeticFormFieldsProps>) {
  return (
    <>
      {imageField}

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên mỹ phẩm</FormLabel>
            <FormControl>
              <Input placeholder="Ví dụ: Kem dưỡng ẩm" disabled={isBusy} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thương hiệu</FormLabel>
            <FormControl>
              <Input placeholder="Ví dụ: La Roche-Posay" disabled={isBusy} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Danh mục</FormLabel>
            <FormControl>
              <Select disabled={isBusy} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hạn dùng</FormLabel>
              <FormControl>
                <Input type="date" disabled={isBusy} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="openedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày mở (tùy chọn)</FormLabel>
              <FormControl>
                <Input type="date" disabled={isBusy} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trạng thái</FormLabel>
            <FormControl>
              <Select disabled={isBusy} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ghi chú</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder="Thêm lưu ý bảo quản, hạn sau mở nắp..." disabled={isBusy} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}
    </>
  )
}
