import './App.css'
import {
  LayoutDashboard,
  Settings,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { to: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { to: '/inventory', label: 'Kho thực phẩm', icon: UtensilsCrossed },
  { to: '/settings', label: 'Cài đặt', icon: Settings },
]

function App() {
  const location = useLocation()

  const activeTitle =
    navItems.find((item) =>
      item.to === '/'
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    )?.label ?? 'Ứng dụng'

  const getNavClasses = (isActive: boolean) =>
    [
      'flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-medium transition-all',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:text-foreground',
    ].join(' ')

  return (
    <div className='mx-auto flex min-h-screen w-full max-w-md flex-col bg-background text-foreground'>
      <header className='sticky top-0 z-10 border-b border-border bg-card/70 px-4 py-3 backdrop-blur'>
        <h5 className='text-lg font-semibold'>{activeTitle}</h5>
      </header>

      <main className='flex-1 overflow-y-auto px-4 py-6'>
        <Outlet />
      </main>

      <nav className='sticky bottom-0 z-10 border-t border-border bg-card/90 px-2 py-2 backdrop-blur'>
        <div className='flex items-center justify-between gap-2'>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => getNavClasses(isActive)}
              >
                <Icon className='h-5 w-5' aria-hidden='true' />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default App
