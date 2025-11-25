import React from 'react'
import { type Control } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categories, units, type FoodFormValues } from './CreateFoodDrawer.helpers'

interface FoodFormFieldsProps {
  control: Control<FoodFormValues>
  isBusy: boolean
  serverError: string | null
  imageField: React.ReactNode
}

export function FoodFormFields({
  control,
  isBusy,
  serverError,
  imageField,
}: Readonly<FoodFormFieldsProps>) {
  return (
    <>
      {imageField}

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên thực phẩm</FormLabel>
            <FormControl>
              <Input
                placeholder="Ví dụ: Cà rốt hữu cơ"
                disabled={isBusy}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={isBusy}
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
          control={control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đơn vị</FormLabel>
              <FormControl>
                <Select
                  disabled={isBusy}
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
        control={control}
        name="expirationDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hạn sử dụng</FormLabel>
            <FormControl>
              <Input
                type="date"
                disabled={isBusy}
                {...field}
              />
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
              <Select
                disabled={isBusy}
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
    </>
  )
}
