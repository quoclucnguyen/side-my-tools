import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const quickStats = [
  {
    label: 'Tổng mặt hàng',
    value: '12',
    description: 'Kiểm kê tuần này',
  },
  {
    label: 'Sắp hết hạn',
    value: '3',
    description: 'Cần xử lý trong 3 ngày',
  },
  {
    label: 'Hết hàng',
    value: '2',
    description: 'Chờ nhập thêm',
  },
]

const reminders = [
  {
    title: 'Kiểm tra tủ lạnh',
    description: 'Xác nhận lại số lượng rau củ trước khi đặt thêm.',
    tag: 'Kho lạnh',
  },
  {
    title: 'Đồng bộ công thức',
    description: 'Nhập thêm công thức mới để gợi ý sử dụng nguyên liệu.',
    tag: 'Gợi ý bếp',
  },
]

export default function DashboardPage() {
  return (
    <section className='space-y-4'>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold'>Bảng điều khiển</h1>
        <p className='text-sm text-muted-foreground'>
          Theo dõi nhanh tình trạng kho thực phẩm của bạn.
        </p>
      </header>

      <Card>
        <CardHeader className='pb-4'>
          <CardTitle className='text-lg'>Số liệu nổi bật</CardTitle>
          <CardDescription>
            Tổng hợp nhanh từ kiểm kê gần nhất và cảnh báo hạn dùng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            {quickStats.map((stat) => (
              <Card
                key={stat.label}
                className='border-border/60 bg-muted/40 shadow-none'
              >
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {stat.label}
                  </CardTitle>
                  <CardDescription>{stat.description}</CardDescription>
                </CardHeader>
                <CardContent className='pt-0'>
                  <p className='text-2xl font-semibold'>{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Ghi chú hôm nay</CardTitle>
          <CardDescription>
            Ưu tiên xử lý các công việc sau để giữ kho luôn tươi mới.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className='space-y-3'>
            {reminders.map((item) => (
              <li key={item.title} className='space-y-1 rounded-lg border p-3'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='text-sm font-medium'>{item.title}</p>
                  <Badge variant='outline'>{item.tag}</Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
