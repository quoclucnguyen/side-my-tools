import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GoogleGenAI } from '@google/genai'
import { useAuthStore } from '@/stores/auth.store'
import { updateGeminiApiKey, loadUserSettings, updateGeminiPreferences, type UserSettings, type GeminiPreferences } from '@/lib/settings.api'

// Query keys
export const settingsKeys = {
  all: ['settings'] as const,
  user: (userId: string) => [...settingsKeys.all, 'user', userId] as const,
}

/**
 * Hook to load user settings - automatically enabled when user is authenticated
 */
export function useUserSettings() {
  const { user, initialized } = useAuthStore()

  return useQuery({
    queryKey: settingsKeys.user(user?.id || ''),
    queryFn: () => loadUserSettings(user!.id),
    enabled: !!user && initialized,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to save Gemini API key with optimistic updates
 */
export function useSaveGeminiKey() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: (apiKey: string | null) => {
      if (!user?.id) throw new Error('User not authenticated')
      return updateGeminiApiKey(user.id, apiKey)
    },
    onMutate: async (newApiKey) => {
      if (!user?.id) return

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: settingsKeys.user(user.id) })

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData<UserSettings | null>(
        settingsKeys.user(user.id)
      )

      // Optimistically update to the new value
      queryClient.setQueryData<UserSettings | null>(
        settingsKeys.user(user.id),
        (old) => old ? { ...old, gemini_api_key: newApiKey } : old
      )

      // Return a context object with the snapshotted value
      return { previousSettings }
    },
    onError: (_, __, context) => {
      if (!user?.id) return

      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSettings) {
        queryClient.setQueryData(
          settingsKeys.user(user.id),
          context.previousSettings
        )
      }
    },
    onSettled: () => {
      if (!user?.id) return

      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: settingsKeys.user(user.id) })
    },
  })
}

/**
 * Hook to check if user has Gemini API key configured
 */
export function useHasGeminiKey(): boolean {
  const { data: settings } = useUserSettings()
  return !!(settings?.gemini_api_key && settings.gemini_api_key.trim())
}

/**
 * Initialize Google GenAI client with user's API key
 */
export function useGeminiClient() {
  const { data: settings } = useUserSettings()

  // This will be used to create GenAI client when needed
  const createClient = () => {
    if (!settings?.gemini_api_key) {
      throw new Error('Gemini API key not configured')
    }

    return new GoogleGenAI({ apiKey: settings.gemini_api_key })
  }

  return {
    isConfigured: !!settings?.gemini_api_key,
    createClient,
    apiKey: settings?.gemini_api_key || null
  }
}

/**
 * Hook to fetch available Gemini models when API key is configured
 */
export function useAvailableModels() {
  const { data: settings } = useUserSettings()

  return useQuery({
    queryKey: ['gemini-models', settings?.gemini_api_key],
    queryFn: async () => {
      if (!settings?.gemini_api_key) {
        throw new Error('Gemini API key not configured')
      }

      const ai = new GoogleGenAI({ apiKey: settings.gemini_api_key })
      const models = await ai.models.list()

      // Convert async iterator to array
      const allModels = []
      for await (const model of models) {
        allModels.push(model)
      }

      return allModels
    },
    enabled: !!settings?.gemini_api_key,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes since models don't change frequently
  })
}

/**
 * Hook to save Gemini preferences with optimistic updates
 */
export function useSaveGeminiPreferences() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: (geminiPrefs: GeminiPreferences) => {
      if (!user?.id) throw new Error('User not authenticated')
      return updateGeminiPreferences(user.id, geminiPrefs)
    },
    onMutate: async (newPrefs) => {
      if (!user?.id) return

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: settingsKeys.user(user.id) })

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData<UserSettings | null>(
        settingsKeys.user(user.id)
      )

      // Optimistically update Gemini preferences
      queryClient.setQueryData<UserSettings | null>(
        settingsKeys.user(user.id),
        (old) => old ? {
          ...old,
          preferences: {
            ...old.preferences,
            gemini: {
              ...old.preferences?.gemini,
              ...newPrefs,
            }
          }
        } : old
      )

      // Return a context object with the snapshotted value
      return { previousSettings }
    },
    onError: (_, __, context) => {
      if (!user?.id) return

      // Roll back on error
      if (context?.previousSettings) {
        queryClient.setQueryData(
          settingsKeys.user(user.id),
          context.previousSettings
        )
      }
    },
    onSettled: () => {
      if (!user?.id) return

      // Invalidate to ensure data consistency
      queryClient.invalidateQueries({ queryKey: settingsKeys.user(user.id) })
    },
  })
}
