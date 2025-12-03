import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { CosmeticImageField } from './CosmeticImageField'
import { CosmeticFormFields } from './CosmeticFormFields'
import { useCosmeticForm } from './useCosmeticForm'
import type { Cosmetic } from '../types'

interface EditCosmeticDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Cosmetic
  onChanged?: () => void
}

export function EditCosmeticDrawer({ open, onOpenChange, item, onChanged }: Readonly<EditCosmeticDrawerProps>) {
  const {
    form,
    serverError,
    previewUrl,
    setPreviewUrl,
    isSubmitting,
    onSubmit,
  } = useCosmeticForm({ item, onSaved: onChanged })

  const imageField = (
    <FormField
      control={form.control}
      name="imageFile"
      render={({ field }) => (
        <FormItem>
          <CosmeticImageField
            field={field}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            isSubmitting={isSubmitting}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Chỉnh sửa mỹ phẩm</DrawerTitle>
          <DrawerDescription>Cập nhật thông tin và trạng thái.</DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-6 pb-4 max-h-[55vh]">
              <div className="mx-auto w-full max-w-md space-y-4">
                <CosmeticFormFields
                  control={form.control}
                  isBusy={isSubmitting || form.formState.isSubmitting}
                  serverError={serverError}
                  imageField={imageField}
                />
              </div>
            </div>

            <DrawerFooter className="px-6">
              <Button type="submit" disabled={isSubmitting || form.formState.isSubmitting}>
                {isSubmitting || form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
