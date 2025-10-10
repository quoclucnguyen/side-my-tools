interface LoadMoreButtonProps {
  isFetching: boolean
  hasMore: boolean
  onFetchNextPage: () => void
}

export function LoadMoreButton({
  isFetching,
  hasMore,
  onFetchNextPage,
}: Readonly<LoadMoreButtonProps>) {
  if (!hasMore) return null

  return (
    <div className='flex justify-center'>
      <button
        type='button'
        onClick={() =>  onFetchNextPage()}
        disabled={isFetching}
        className='rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-60'
      >
        {isFetching ? 'Đang tải...' : 'Tải thêm mặt hàng'}
      </button>
    </div>
  )
}
