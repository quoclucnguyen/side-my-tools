import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { CosmeticImageField } from './CosmeticImageField'
import { CosmeticFormFields } from './CosmeticFormFields'
import { useCosmeticForm } from './useCosmeticForm'

interface CreateCosmeticDrawerProps {
  onChanged?: () => void
  children: React.ReactNode
}

export function CreateCosmeticDrawer({ onChanged, children }: Readonly<CreateCosmeticDrawerProps>) {
  const {
    open,
    setOpen,
    form,
    serverError,
    previewUrl,
    setPreviewUrl,
    isSubmitting,
    onSubmit,
  } = useCosmeticForm({ onSaved: onChanged })

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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>Thêm mỹ phẩm</DrawerTitle>
          <DrawerDescription>Nhập thông tin sản phẩm và tải ảnh (tùy chọn).</DrawerDescription>
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
                {isSubmitting || form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu mỹ phẩm'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" type="button">
                  Hủy
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
