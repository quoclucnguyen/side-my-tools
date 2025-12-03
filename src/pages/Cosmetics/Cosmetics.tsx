import { useCallback, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useInfiniteQuery, type SupabaseQueryHandler } from '@/hooks/useInfiniteQuery'
import { LoadMoreButton } from '@/pages/Inventory/components/LoadMoreButton'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreateCosmeticDrawer } from './components/CreateCosmeticDrawer'
import { EditCosmeticDrawer } from './components/EditCosmeticDrawer'
import type { Cosmetic, CosmeticRow } from './types'
import { statusFilters } from './constants'
import { formatDate, formatStatus, getExpiryVariant } from './utils'

export default function CosmeticsPage() {
  const [status, setStatus] = useState<string>('all')
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')

  const trailingQuery = useCallback<SupabaseQueryHandler>((query) => {
    let q = query.order('expiry_date', { ascending: sort === 'asc', nullsFirst: false })
    if (status !== 'all') {
      q = q.eq('status', status)
    }
    return q
  }, [status, sort])

  const {
    data: rows,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasMore,
    refetch,
  } = useInfiniteQuery<CosmeticRow>({
    tableName: 'cosmetics',
    columns: 'id, user_id, name, brand, category, expiry_date, opened_date, status, notes, image_url, created_at, updated_at',
    pageSize: 8,
    trailingQuery,
  })

  const items = useMemo<Cosmetic[]>(() => rows.map((row, index) => ({
    id: String(row.id ?? `temp-${index}`),
    name: row.name ?? 'Không tên',
    brand: row.brand ?? 'Không rõ hãng',
    category: row.category ?? 'Chưa phân loại',
    expiryDate: row.expiry_date ?? null,
    openedDate: row.opened_date ?? null,
    status: row.status ?? 'active',
    notes: row.notes ?? '',
    imageUrl: row.image_url ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  })), [rows])

  const shouldUseFallback = !error && !isLoading && !isFetching && items.length === 0
  const displayItems = shouldUseFallback ? [] : items

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-muted-foreground">{displayItems.length} món mỹ phẩm</h2>
          <p className="text-sm text-muted-foreground">Lọc theo trạng thái và hạn dùng.</p>
        </div>
        <div className="flex gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(value) => setSort(value as 'asc' | 'desc')}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Sắp xếp ↑ hạn dùng</SelectItem>
              <SelectItem value="desc">Sắp xếp ↓ hạn dùng</SelectItem>
            </SelectContent>
          </Select>
          <CreateCosmeticDrawer onChanged={refetch}>
            <Button size="lg" className="rounded-2xl shadow-primary/20 shadow">
              <Plus className="h-5 w-5" />
              Thêm
            </Button>
          </CreateCosmeticDrawer>
        </div>
      </div>

      {displayItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
          Chưa có mặt hàng mỹ phẩm. Thêm dữ liệu vào bảng <span className="font-semibold">cosmetics</span> trong Supabase.
        </div>
      ) : (
        <div className="space-y-3">
          {displayItems.map((item, index) => (
            <CosmeticCard key={item.id} item={item} animationDelay={index * 40} onChanged={refetch} />
          ))}
          <LoadMoreButton
            isFetching={isFetching}
            hasMore={hasMore && !shouldUseFallback}
            onFetchNextPage={fetchNextPage}
          />
        </div>
      )}
    </section>
  )
}

function CosmeticCard({ item, animationDelay, onChanged }: { item: Cosmetic, animationDelay: number, onChanged: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Card
      className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 border-border/60 group cursor-pointer"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={() => setOpen(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
      <div className="p-4 flex gap-4">
        <div className="h-20 w-20 rounded-2xl bg-muted/30 ring-2 ring-border/30 overflow-hidden flex-shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-smooth" loading="lazy" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary transition-smooth">{item.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{item.brand}</p>
            </div>
            <Badge variant="outline" className="rounded-full text-[11px] px-2 py-0.5">{formatStatus(item.status)}</Badge>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5">{item.category}</Badge>
            <Badge variant={getExpiryVariant(item.expiryDate)} className="rounded-full text-[10px] px-2 py-0.5">{formatDate(item.expiryDate)}</Badge>
            {item.openedDate ? (
              <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5">Mở: {formatDate(item.openedDate)}</Badge>
            ) : null}
          </div>
          {item.notes ? <p className="text-xs text-muted-foreground line-clamp-2">{item.notes}</p> : null}
          <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground/80">
            {item.createdAt ? <span>Tạo: {formatDate(item.createdAt)}</span> : null}
            {item.updatedAt ? <span>Cập nhật: {formatDate(item.updatedAt)}</span> : null}
          </div>
        </div>
      </div>
      <EditCosmeticDrawer open={open} onOpenChange={setOpen} item={item} onChanged={onChanged} />
    </Card>
  )
}
