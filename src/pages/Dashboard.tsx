import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Package, AlertTriangle, ShoppingCart, Sparkles } from 'lucide-react'

const quickStats = [
  {
    label: 'Tổng mặt hàng',
    value: '12',
    description: 'Kiểm kê tuần này',
    icon: Package,
    color: 'from-primary/80 to-primary',
    bgColor: 'bg-primary/10',
  },
  {
    label: 'Sắp hết hạn',
    value: '3',
    description: 'Cần xử lý trong 3 ngày',
    icon: AlertTriangle,
    color: 'from-accent/80 to-accent',
    bgColor: 'bg-accent/10',
  },
  {
    label: 'Hết hàng',
    value: '2',
    description: 'Chờ nhập thêm',
    icon: ShoppingCart,
    color: 'from-secondary/80 to-secondary',
    bgColor: 'bg-secondary/10',
  },
]

const reminders = [
  {
    title: 'Kiểm tra tủ lạnh',
    description: 'Xác nhận lại số lượng rau củ trước khi đặt thêm.',
    tag: 'Kho lạnh',
    icon: '🥬',
  },
  {
    title: 'Đồng bộ công thức',
    description: 'Nhập thêm công thức mới để gợi ý sử dụng nguyên liệu.',
    tag: 'Gợi ý bếp',
    icon: '👨‍🍳',
  },
]

export default function DashboardPage() {
  return (
    <section className='space-y-6'>
      {/* Hero header with gradient */}
      <header className='space-y-3 pb-2'>
        <div className='flex items-center gap-2'>
          <Sparkles className='h-6 w-6 text-primary animate-pulse' />
          <h1 className='text-3xl font-extrabold tracking-tight bg-gradient-to-br from-primary via-foreground to-secondary bg-clip-text text-transparent'>
            Bảng điều khiển
          </h1>
        </div>
        <p className='text-base text-muted-foreground leading-relaxed'>
          Theo dõi nhanh tình trạng kho thực phẩm của bạn.
        </p>
      </header>

      {/* Stats cards with icons and gradients */}
      <div className='grid grid-cols-3 gap-3'>
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className='border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-smooth overflow-hidden relative group animate-fade-in-up'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-smooth`} />

              <CardHeader className='pb-3 pt-4 px-3 relative z-10'>
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-2 transition-bounce group-hover:scale-110`}>
                  <Icon className='h-5 w-5 text-primary' />
                </div>
                <CardTitle className='text-3xl font-extrabold tracking-tight'>
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent className='px-3 pb-4 relative z-10'>
                <p className='text-[10px] font-semibold text-foreground/70 uppercase tracking-wide mb-0.5'>
                  {stat.label}
                </p>
                <p className='text-[9px] text-muted-foreground leading-tight'>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Reminders card with modern design */}
      <Card className='border-border/50 shadow-lg shadow-black/5 overflow-hidden animate-fade-in-up' style={{ animationDelay: '300ms' }}>
        <div className='absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl' />

        <CardHeader className='relative z-10'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-1 bg-gradient-to-b from-primary to-accent rounded-full' />
            <div>
              <CardTitle className='text-xl font-bold'>Ghi chú hôm nay</CardTitle>
              <CardDescription className='text-sm mt-1'>
                Ưu tiên xử lý các công việc sau để giữ kho luôn tươi mới.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className='relative z-10'>
          <ul className='space-y-3'>
            {reminders.map((item, index) => (
              <li
                key={item.title}
                className='space-y-2 rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-4 hover:shadow-md hover:border-primary/30 transition-smooth group animate-fade-in-up'
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex items-center gap-3 flex-1'>
                    <div className='text-2xl group-hover:scale-110 transition-bounce'>
                      {item.icon}
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-semibold leading-tight mb-1'>
                        {item.title}
                      </p>
                      <p className='text-xs text-muted-foreground leading-relaxed'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant='outline'
                    className='shrink-0 rounded-full px-2.5 py-0.5 text-[10px] border-primary/30 bg-primary/5 text-primary font-semibold'
                  >
                    {item.tag}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
