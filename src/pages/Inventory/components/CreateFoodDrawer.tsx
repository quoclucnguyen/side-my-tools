import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer'
import { units, categories, type CreateFoodDrawerProps } from './CreateFoodDrawer.helpers'
import { useCreateFoodForm } from './useCreateFoodForm'
import { ImageField } from './ImageField'

export function CreateFoodDrawer({ onCreated }: Readonly<CreateFoodDrawerProps>) {
  const {
    open,
    setOpen,
    form,
    serverError,
    previewUrl,
    setPreviewUrl,
    isAnalyzing,
    aiError,
    aiSuccess,
    handleAnalyzeImage,
    onSubmit,
  } = useCreateFoodForm(onCreated)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm">Thêm mới</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Thêm thực phẩm</DrawerTitle>
          <DrawerDescription>
            Nhập đầy đủ thông tin để lưu vào kho.
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
                    <ImageField
                      field={field}
                      onAnalyze={handleAnalyzeImage}
                      previewUrl={previewUrl}
                      setPreviewUrl={setPreviewUrl}
                      isAnalyzing={isAnalyzing}
                      aiError={aiError}
                      aiSuccess={aiSuccess}
                    />
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
                        disabled={form.formState.isSubmitting}
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
                          disabled={form.formState.isSubmitting}
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
                          disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Đang lưu..."
                    : "Lưu thực phẩm"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" type="button">
                    Hủy
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
