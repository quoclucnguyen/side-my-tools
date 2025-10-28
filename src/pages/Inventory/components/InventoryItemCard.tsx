import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDeleteFoodItem } from '../hooks/useDeleteFoodItem'

import type { FoodItem } from '../types'
import { formatExpiration, getExpirationVariant } from '../utils'
import { InventoryItemDrawer } from './InventoryItemDrawer'

interface InventoryItemCardProps {
  item: FoodItem
  onDeleted?: () => void
}

export function InventoryItemCard({ item, onDeleted }: Readonly<InventoryItemCardProps>) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { mutate: deleteFoodItem, isPending: isDeleting } = useDeleteFoodItem({
    onSuccess: onDeleted,
    onError: () => alert('Không thể xóa thực phẩm. Vui lòng thử lại.'),
  })

  const handleDelete = () => {
    if (item.id.startsWith('temp-')) return

    if (!confirm(`Bạn có chắc chắn muốn xóa "${item.name}"?`)) {
      return
    }

    deleteFoodItem(Number(item.id))
  }

  return (
    <>
      <Card
        key={item.id}
        className='cursor-pointer transition-colors hover:bg-muted/50'
        onClick={() => setDrawerOpen(true)}
      >
        <div className='flex gap-4 p-4'>
          {/* Image on the left */}
          <div className='flex-shrink-0'>
            {item.imageUrl ? (
              <div className='h-16 w-16 rounded-md bg-white'>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className='h-full w-full rounded-md object-cover'
                  loading='lazy'
                />
              </div>
            ) : (
              <div className='h-16 w-16 rounded-md bg-white border flex items-center justify-center'>
                <span className='text-muted-foreground text-xs'>No Image</span>
              </div>
            )}
          </div>

          {/* Product info on the right - 2 lines */}
          <div className='flex-1 min-w-0 space-y-1'>
            {/* Line 1: Product name and delete button */}
            <div className='flex items-center justify-between'>
              <div className='font-medium text-sm truncate'>{item.name}</div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={(event) => {
                  event.stopPropagation()
                  void handleDelete()
                }}
                disabled={isDeleting}
                className='h-7 w-7 p-0 text-destructive hover:bg-destructive/10'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>

            {/* Line 2: Badges */}
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                {item.quantity} {item.unit}
              </div>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='text-xs'>
                  {item.category}
                </Badge>
                <Badge
                  variant={getExpirationVariant(item.expirationDate)}
                  className='text-xs'
                >
                  {formatExpiration(item.expirationDate)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <InventoryItemDrawer
        item={item}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  )
}
