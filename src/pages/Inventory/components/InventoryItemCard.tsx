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
    deleteFoodItem(item.id);
  }

  return (
    <>
      <Card
        key={item.id}
        className='cursor-pointer transition-smooth hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 border-border/50 overflow-hidden group animate-fade-in-up bg-gradient-to-br from-card to-card/80'
        onClick={() => setDrawerOpen(true)}
      >
        <div className='flex gap-4 p-4 relative'>
          {/* Subtle hover gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth' />

          {/* Image on the left with enhanced styling */}
          <div className='flex-shrink-0 relative z-10'>
            {item.imageUrl ? (
              <div className='h-20 w-20 rounded-2xl bg-muted/30 ring-2 ring-border/30 group-hover:ring-primary/30 transition-smooth overflow-hidden shadow-md'>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className='h-full w-full object-cover group-hover:scale-110 transition-smooth'
                  loading='lazy'
                />
              </div>
            ) : (
              <div className='h-20 w-20 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 ring-2 ring-border/30 flex items-center justify-center'>
                <span className='text-muted-foreground text-xs font-medium'>No Image</span>
              </div>
            )}
          </div>

          {/* Product info on the right with better hierarchy */}
          <div className='flex-1 min-w-0 space-y-2 relative z-10'>
            {/* Line 1: Product name and delete button */}
            <div className='flex items-start justify-between gap-2'>
              <h3 className='font-bold text-base leading-tight truncate group-hover:text-primary transition-smooth'>
                {item.name}
              </h3>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={(event) => {
                  event.stopPropagation()
                  handleDelete()
                }}
                disabled={isDeleting}
                className='h-8 w-8 p-0 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 transition-bounce hover:scale-110'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>

            {/* Line 2: Quantity */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary'>
                <span className='text-sm font-bold'>{item.quantity}</span>
                <span className='text-xs font-medium'>{item.unit}</span>
              </div>
            </div>

            {/* Line 3: Badges */}
            <div className='flex items-center gap-2 flex-wrap'>
              <Badge variant='outline' className='text-[10px] rounded-full px-2 py-0.5 border-border/50 bg-muted/30 font-semibold'>
                {item.category}
              </Badge>
              <Badge
                variant={getExpirationVariant(item.expirationDate)}
                className='text-[10px] rounded-full px-2 py-0.5 font-semibold shadow-sm'
              >
                {formatExpiration(item.expirationDate)}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <InventoryItemDrawer
        item={item}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdated={onDeleted}
      />
    </>
  )
}
