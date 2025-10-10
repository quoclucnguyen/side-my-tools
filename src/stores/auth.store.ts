import { create } from 'zustand'
import type { User, AuthError } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabaseClient'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
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

    checkAuth: async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error

        set({
          user,
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
