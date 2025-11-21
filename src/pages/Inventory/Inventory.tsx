import { useCallback, useMemo } from 'react'
import {
  useInfiniteQuery,
  type SupabaseQueryHandler,
} from '@/hooks/useInfiniteQuery'

import type { FoodItem, FoodItemRow } from './types'
import { fallbackItems } from './constants'
import { InventoryItemCard } from './components/InventoryItemCard'
import { EmptyInventoryAlert } from './components/EmptyInventoryAlert'
import { LoadMoreButton } from './components/LoadMoreButton'
import { FallbackDataAlert } from './components/FallbackDataAlert'
import { CreateFoodDrawer } from './components/CreateFoodDrawer'

export default function InventoryPage() {
  const orderByExpiration = useCallback<SupabaseQueryHandler>(
    (query) => query.order('expiration_date', { ascending: true, nullsFirst: false }),
    [],
  )

  const {
    data: rows,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasMore,
    refetch,
  } = useInfiniteQuery<FoodItemRow>({
    tableName: 'food_items',
    columns: 'id, name, quantity, unit, expiration_date, category, image_url',
    pageSize: 8,
    trailingQuery: orderByExpiration,
  })

  const databaseItems = useMemo<FoodItem[]>(() => {
    return rows.map((row, index) => ({
      id: String(row.id ?? `temp-${index}`),
      name: row.name ?? 'Không tên',
      quantity: Number(row.quantity ?? 0),
      unit: row.unit ?? 'đv',
      expirationDate: row.expiration_date ?? null,
      category: row.category ?? 'Chưa phân loại',
      imageUrl: row.image_url ?? null,
    }))
  }, [rows])

  const shouldUseFallback =
    !error && !isLoading && !isFetching && databaseItems.length === 0
  const items = shouldUseFallback ? fallbackItems : databaseItems


  return (
    <section className='space-y-6'>
      {/* Header with add button */}
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <h2 className='text-lg font-bold text-muted-foreground'>
            {items.length} món trong kho
          </h2>
        </div>
        <CreateFoodDrawer onCreated={refetch} />
      </div>

      {/* Inventory list */}
      {items.length === 0 ? (
        <EmptyInventoryAlert />
      ) : (
        <div className='space-y-3'>
          {items.map((item, index) => (
            <div
              key={item.id}
              className='animate-fade-in-up'
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <InventoryItemCard item={item} onDeleted={refetch} />
            </div>
          ))}
          <LoadMoreButton
            isFetching={isFetching}
            hasMore={hasMore && !shouldUseFallback}
            onFetchNextPage={fetchNextPage}
          />
        </div>
      )}

      <FallbackDataAlert shouldUseFallback={shouldUseFallback} />
    </section>
  )
}
