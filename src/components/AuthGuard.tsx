import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/auth.store'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation()
  const { user, initialized, checkAuth } = useAuthStore()

  // Check auth status on mount
  useEffect(() => {
    if (!initialized) {
      checkAuth()
    }
  }, [initialized, checkAuth])

  // Show loading while checking auth
  if (!initialized) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto' />
          <p className='text-sm text-muted-foreground'>Đang kiểm tra xác thực...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated, remember the intended location
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  // Render children if authenticated
  return <>{children}</>
}
