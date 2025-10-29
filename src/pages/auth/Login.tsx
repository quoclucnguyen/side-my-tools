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

  return (
    <div className='flex min-h-screen items-center justify-center px-4 py-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center'>
            {isSignUp ? 'Đăng ký tài khoản' : 'Đăng nhập'}
          </CardTitle>
          <CardDescription className='text-center'>
            {isSignUp
              ? 'Tạo tài khoản mới để truy cập ứng dụng'
              : 'Nhập thông tin đăng nhập của bạn'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  placeholder='your@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pl-10'
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Mật khẩu</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pl-10 pr-10'
                  required
                  disabled={loading}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
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
              <Alert variant='destructive'>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <Button type='submit' className='w-full' disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm'>
            <button
              type='button'
              onClick={() => setIsSignUp(!isSignUp)}
              className='text-primary hover:underline'
              disabled={loading}
            >
              {isSignUp
                ? 'Đã có tài khoản? Đăng nhập'
                : 'Chưa có tài khoản? Đăng ký'
              }
            </button>
          </div>

          <div className='mt-4 text-center'>
            <Link
              to='/'
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              Quay lại trang chủ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
