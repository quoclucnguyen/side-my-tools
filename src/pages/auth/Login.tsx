import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useRawInitData } from '@tma.js/sdk-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp, user, loading, error, clearError, tmaLogin } = useAuthStore()

  const [isSignUp, setIsSignUp] = useState(false)
  const hasAttemptedTmaLogin = useRef(false)
  const rawInitData = useRawInitData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Attempt Telegram Mini App login automatically when init data is available
  useEffect(() => {
    if (!hasAttemptedTmaLogin.current && rawInitData) {
      hasAttemptedTmaLogin.current = true
      tmaLogin(rawInitData).catch((err) => {
        console.error('Telegram login failed:', err)
      })
    }
  }, [rawInitData, tmaLogin])

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [user, navigate, location])

  // Clear error when switching between login/signup
  useEffect(() => {
    clearError()
  }, [isSignUp, clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      return
    }

    try {
      if (isSignUp) {
        await signUp(email, password)
        // Show success message for signup
        alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.')
      } else {
        await signIn(email, password)
        // Navigation will happen automatically via useEffect
      }
    } catch (error) {
      // Error is handled in the store
      console.error('Auth error:', error)
    }
  }

  if (user) {
    return null // Will redirect via useEffect
  }

  // Show loading screen while authentication is in progress
  if (loading && !user) {
    return (
      <div className='flex min-h-screen items-center justify-center px-4 py-8'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center px-4 py-8 relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float' style={{ animationDelay: '1.5s' }} />
      </div>

      <Card className='w-full max-w-md shadow-2xl shadow-primary/10 border-border/50 backdrop-blur-sm bg-card/95 animate-fade-in-up'>
        <CardHeader className='space-y-3 text-center pb-6'>
          {/* App icon */}
          <div className='mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30'>
            <svg className='w-8 h-8 text-primary-foreground' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
            </svg>
          </div>

          <CardTitle className='text-3xl font-extrabold bg-gradient-to-br from-primary via-foreground to-secondary bg-clip-text text-transparent'>
            {isSignUp ? 'Đăng ký tài khoản' : 'Đăng nhập'}
          </CardTitle>
          <CardDescription className='text-base'>
            {isSignUp
              ? 'Tạo tài khoản mới để truy cập ứng dụng'
              : 'Nhập thông tin đăng nhập của bạn'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='font-semibold'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-4 top-3.5 h-4 w-4 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  placeholder='your@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pl-11 h-12 rounded-xl border-border/50 focus:border-primary transition-smooth'
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='font-semibold'>Mật khẩu</Label>
              <div className='relative'>
                <Lock className='absolute left-4 top-3.5 h-4 w-4 text-muted-foreground' />
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pl-11 pr-12 h-12 rounded-xl border-border/50 focus:border-primary transition-smooth'
                  required
                  disabled={loading}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-1 top-1 h-10 w-10 rounded-lg hover:bg-muted transition-smooth'
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-muted-foreground' />
                  ) : (
                    <Eye className='h-4 w-4 text-muted-foreground' />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant='destructive' className='rounded-xl border-destructive/30'>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <Button
              type='submit'
              className='w-full h-12 rounded-xl font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-smooth'
              disabled={loading}
            >
              {loading && <Loader2 className='mr-2 h-5 w-5 animate-spin' />}
              {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
            </Button>
          </form>

          <div className='mt-8 text-center text-sm space-y-4'>
            <button
              type='button'
              onClick={() => setIsSignUp(!isSignUp)}
              className='text-primary hover:text-primary/80 font-semibold transition-smooth'
              disabled={loading}
            >
              {isSignUp
                ? 'Đã có tài khoản? Đăng nhập'
                : 'Chưa có tài khoản? Đăng ký'
              }
            </button>

            <div>
              <Link
                to='/'
                className='text-muted-foreground hover:text-foreground transition-smooth'
              >
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
