import './App.css'
import {
  LayoutDashboard,
  Settings,
  UtensilsCrossed,
  LogOut,
  User,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Toaster } from 'sonner'

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
  const navigate = useNavigate()
  const { user, signOut, loading } = useAuthStore()

  const activeTitle =
    navItems.find((item) =>
      item.to === '/'
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    )?.label ?? 'Ứng dụng'

  const getNavClasses = (isActive: boolean) =>
    [
      'flex flex-1 flex-col items-center justify-center gap-1.5 rounded-full px-4 py-2.5 transition-smooth relative',
      isActive
        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
        : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
    ].join(' ')

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background text-foreground relative">
      {/* Decorative gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Enhanced header with gradient */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-gradient-to-br from-card/95 via-card/90 to-primary/5 px-5 py-4 backdrop-blur-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <h5 className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {activeTitle}
            </h5>
          </div>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-smooth border border-border/50"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/50 shadow-xl">
                <DropdownMenuItem
                  disabled
                  className="text-xs text-muted-foreground rounded-xl"
                >
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={loading}
                  className="text-destructive focus:text-destructive rounded-xl"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6 relative z-0">
        <Outlet />
      </main>

      {/* Enhanced bottom navigation with modern pill design */}
      <nav className="sticky bottom-0 z-10 border-t border-border/50 bg-gradient-to-t from-card/98 to-card/95 px-3 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 bg-muted/40 rounded-full p-1.5 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => getNavClasses(isActive)}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <Toaster position="top-center" />
    </div>
  );
}

export default App
