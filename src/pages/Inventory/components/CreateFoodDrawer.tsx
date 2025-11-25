import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type CreateFoodDrawerProps } from "./CreateFoodDrawer.helpers";
import { useCreateFoodForm } from "./useCreateFoodForm";
import { ImageField } from "./ImageField";
import { FoodFormFields } from "./FoodFormFields";

export function CreateFoodDrawer({
  onCreated,
}: Readonly<CreateFoodDrawerProps>) {
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
  } = useCreateFoodForm(onCreated);

  const imageField = (
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
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-smooth font-semibold gap-2"
        >
          <Plus className="h-5 w-5" />
          Thêm mới
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>Thêm thực phẩm</DrawerTitle>
          <DrawerDescription>
            Nhập đầy đủ thông tin để lưu vào kho.
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-6 pb-4 max-h-[50vh]">
              <div className="mx-auto w-full max-w-md space-y-4">
                <FoodFormFields
                  control={form.control}
                  isBusy={form.formState.isSubmitting}
                  serverError={serverError}
                  imageField={imageField}
                />
              </div>
            </div>

            <DrawerFooter className="px-6">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Đang lưu..." : "Lưu thực phẩm"}
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
  );
}
