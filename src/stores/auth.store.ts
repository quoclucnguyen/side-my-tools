import { create } from 'zustand'
import type { User, AuthError } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { getInitDataRaw, exchangeTma } from '@/lib/tma'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  tmaLogin: (initDataRaw?: string | null) => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

type AuthStore = AuthState & AuthActions & {
  error: AuthError | null
}

export const useAuthStore = create<AuthStore>((set) => {
  const supabase = getSupabaseClient()

  // Auth listener
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email)
    set({
      user: session?.user || null,
      loading: false,
      initialized: true,
      error: null
    })
  })

  return {
    // Initial state
    user: null,
    loading: true,
    initialized: false,
    error: null,

    // Actions
    signIn: async (email: string, password: string) => {
      set({ loading: true, error: null })
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })

        if (error) {
          set({ error, loading: false })
          throw error
        }
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError, loading: false })
        throw error
      }
    },

    signUp: async (email: string, password: string) => {
      set({ loading: true, error: null })
      try {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password
        })

        if (error) {
          set({ error, loading: false })
          throw error
        }
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError, loading: false })
        throw error
      }
    },

    signOut: async () => {
      set({ loading: true, error: null })
      try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          set({ error, loading: false })
          throw error
        }
        // State will be automatically updated by auth listener
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError, loading: false })
        throw error
      }
    },

    // Đăng nhập qua Telegram Mini App: trao đổi initDataRaw lấy Supabase session
    tmaLogin: async (initDataRaw) => {
      try {
        const raw = initDataRaw ?? getInitDataRaw()
        if (!raw) return
        set({ loading: true, error: null })
        const { access_token, refresh_token } = await exchangeTma(raw)
        const { error } = await supabase.auth.setSession({ access_token, refresh_token })
        if (error) {
          set({ error, loading: false })
          throw error
        }
        // onAuthStateChange sẽ cập nhật state; đảm bảo initialized
        set((s) => ({ ...s, initialized: true, loading: false }))
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError, loading: false, initialized: true })
        throw error
      }
    },

    checkAuth: async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error

        // Nếu đã có user => hoàn tất
        if (user) {
          set({
            user,
            loading: false,
            initialized: true,
            error: null
          })
          return
        }

        // Thử bootstrap phiên qua Telegram Mini App nếu có initDataRaw
        const initDataRaw = getInitDataRaw()
        if (initDataRaw) {
          set({ loading: true })
          try {
            const { access_token, refresh_token } = await exchangeTma(initDataRaw)
            const { data, error: setErr } = await supabase.auth.setSession({ access_token, refresh_token })
            if (setErr) throw setErr
            set({
              user: data.user,
              loading: false,
              initialized: true,
              error: null
            })
            return
          } catch (e) {
            const authError = e as AuthError
            set({ error: authError, loading: false, initialized: true })
            return
          }
        }

        // Không có user và không có TMA => coi như chưa đăng nhập
        set({
          user: null,
          loading: false,
          initialized: true,
          error: null
        })
      } catch (error) {
        const authError = error as AuthError
        set({ error: authError, loading: false, initialized: true })
      }
    },

    clearError: () => set({ error: null })
  }
})
