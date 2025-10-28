import { useState, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

import type { FoodItem } from '../types'
import { foodSchema, type FoodFormValues, categories, units } from './CreateFoodDrawer.helpers'
import { useUpdateFoodItem } from '../hooks/useUpdateFoodItem'

function getDefaultValues(item: FoodItem): FoodFormValues {
  return {
    name: item.name,
    quantity: item.quantity,
    unit: item.unit as typeof units[number],
    expirationDate: item.expirationDate || '',
    category: item.category as typeof categories[number],
    imageFile: undefined,
  }
}

interface InventoryItemDrawerProps {
  item: FoodItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated?: () => void
}

export function InventoryItemDrawer({
  item,
  open,
  onOpenChange,
  onUpdated,
}: Readonly<InventoryItemDrawerProps>) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(item.imageUrl || null)

  const defaultValues = useMemo(
    () => getDefaultValues(item),
    [item],
  )

  const form = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema) as Resolver<FoodFormValues>,
    defaultValues,
  })

  const { mutate: updateFoodItem, isPending } = useUpdateFoodItem({
    onSuccess: () => {
      onUpdated?.()
      setServerError(null)
      onOpenChange(false)
    },
    onError: () => {
      setServerError('Không thể cập nhật thực phẩm. Vui lòng thử lại.')
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    updateFoodItem({
      id: item.id,
      values,
      currentImageUrl: item.imageUrl,
    });
  })

  return (
    <Drawer open={open} onOpenChange={(nextOpen) => {
      onOpenChange(nextOpen)
      if (!nextOpen) {
        setServerError(null)
        form.reset()
        if (previewUrl && previewUrl !== item.imageUrl) {
          URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(item.imageUrl || null)
      }
    }}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Chỉnh sửa thực phẩm</DrawerTitle>
          <DrawerDescription>
            Cập nhật thông tin thực phẩm trong kho.
          </DrawerDescription>
        </DrawerHeader>

        <div className="mx-auto w-full max-w-md px-6 pb-2">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={form.formState.isSubmitting || isPending}
                        onChange={(event) => {
                          field.onBlur();
                          const file = event.target.files?.[0];
                          field.onChange(file);

                          setPreviewUrl((current) => {
                            if (current) {
                              URL.revokeObjectURL(current);
                            }
                            return file ? URL.createObjectURL(file) : null;
                          });

                          event.target.value = "";
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      PNG hoặc JPEG, tối đa 5MB.
                    </FormDescription>
                    {previewUrl ? (
                      <div className="flex items-start gap-3 rounded-md border border-dashed border-border p-3">
                        <img
                          src={previewUrl}
                          alt="Xem trước thực phẩm"
                          className="h-20 w-20 rounded-md object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            field.onChange(undefined);
                            setPreviewUrl((current) => {
                              if (current) {
                                URL.revokeObjectURL(current);
                              }
                              return null;
                            });
                          }}
                          disabled={form.formState.isSubmitting || isPending}
                        >
                          Xóa hình
                        </Button>
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thực phẩm</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Cà rốt hữu cơ"
                        disabled={form.formState.isSubmitting || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          disabled={form.formState.isSubmitting || isPending}
                          name={field.name}
                          ref={field.ref}
                          value={field.value ?? ""}
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn vị</FormLabel>
                      <FormControl>
                        <Select
                          disabled={form.formState.isSubmitting || isPending}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn đơn vị" />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạn sử dụng</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={form.formState.isSubmitting || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <FormControl>
                      <Select
                        disabled={form.formState.isSubmitting || isPending}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
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

              {serverError ? (
                <p className="text-sm text-destructive">{serverError}</p>
              ) : null}

              <DrawerFooter>
                <Button type="submit" disabled={form.formState.isSubmitting || isPending}>
                  {form.formState.isSubmitting || isPending
                    ? "Đang lưu..."
                    : "Lưu thay đổi"}
                </Button>
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
