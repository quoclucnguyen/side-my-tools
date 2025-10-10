import { Badge } from '@/components/ui/badge'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import type { FoodItem } from '../types'
import { formatExpiration, getExpirationVariant } from '../utils'

interface InventoryItemDrawerProps {
  item: FoodItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InventoryItemDrawer({
  item,
  open,
  onOpenChange,
}: Readonly<InventoryItemDrawerProps>) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{item.name}</DrawerTitle>
          <DrawerDescription>
            Chi tiết sản phẩm trong kho
          </DrawerDescription>
        </DrawerHeader>

        <div className="mx-auto flex w-full max-w-sm flex-col gap-4 px-6 pb-6">
          {item.imageUrl ? (
            <div className="w-full bg-white rounded-md">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full max-h-64 rounded-md object-cover"
                loading="lazy"
              />
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold">
                {item.quantity} {item.unit}
              </div>
              <div className="text-sm text-muted-foreground">
                Tồn kho hiện tại
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{item.category}</Badge>
              <Badge variant={getExpirationVariant(item.expirationDate)}>
                {formatExpiration(item.expirationDate)}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              {item.expirationDate
                ? 'Theo dõi thường xuyên để tránh lãng phí.'
                : 'Không có hạn sử dụng, cập nhật khi cần.'}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
