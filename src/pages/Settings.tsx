export default function SettingsPage() {
  return (
    <section className='space-y-4'>
      <header>
        <h1 className='text-2xl font-semibold'>Cài đặt</h1>
        <p className='text-sm text-muted-foreground'>
          Chọn các tùy chọn dưới đây để cấu hình trải nghiệm của bạn.
        </p>
      </header>
      <div className='space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm'>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>Giao diện</p>
          <p className='text-xs text-muted-foreground'>
            Tích hợp với theme provider trước đó để đổi chế độ sáng/tối.
          </p>
        </div>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>Thông báo</p>
          <p className='text-xs text-muted-foreground'>
            Tùy chỉnh tần suất thông báo và kênh nhận thông tin.
          </p>
        </div>
      </div>
    </section>
  )
}
