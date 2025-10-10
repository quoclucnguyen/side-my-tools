import { getSupabaseClient } from './supabaseClient'

export interface GeminiPreferences {
  preferredModel?: string
}

export interface UserSettings {
  id: string
  user_id: string
  preferences: {
    gemini?: GeminiPreferences
    [key: string]: unknown
  }
  gemini_api_key: string | null
  created_at: string
  updated_at: string
}

export interface UpdateSettingsData {
  preferences?: Record<string, unknown>
  gemini_api_key?: string | null
}

/**
 * Load user settings from database
 */
export async function loadUserSettings(userId: string): Promise<UserSettings | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    // If no settings exist yet, return null (not an error)
    if (error.code === 'PGRST116') {
      return null
    }
    throw error
  }

  return data
}

/**
 * Save/update user settings in database
 * Creates record if it doesn't exist
 */
export async function saveUserSettings(
  userId: string,
  updates: UpdateSettingsData
): Promise<UserSettings> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Update only the Gemini API key
 */
export async function updateGeminiApiKey(
  userId: string,
  apiKey: string | null
): Promise<UserSettings> {
  return saveUserSettings(userId, { gemini_api_key: apiKey })
}

/**
 * Update user preferences
 */
export async function updatePreferences(
  userId: string,
  preferences: Record<string, unknown>
): Promise<UserSettings> {
  // First load existing settings to merge preferences
  const existingSettings = await loadUserSettings(userId)
  const mergedPreferences = {
    ...existingSettings?.preferences,
    ...preferences
  }

  return saveUserSettings(userId, { preferences: mergedPreferences })
}

/**
 * Update Gemini-specific preferences within the preferences object
 */
export async function updateGeminiPreferences(
  userId: string,
  geminiPrefs: GeminiPreferences
): Promise<UserSettings> {
  // Load existing settings
  const existingSettings = await loadUserSettings(userId)

  // Merge Gemini preferences
  const updatedPreferences = {
    ...existingSettings?.preferences,
    gemini: {
      ...existingSettings?.preferences?.gemini,
      ...geminiPrefs,
    },
  }

  return saveUserSettings(userId, { preferences: updatedPreferences })
}

/**
 * Get Gemini preferences from user settings
 */
export function getGeminiPreferences(settings: UserSettings | null): GeminiPreferences {
  return settings?.preferences?.gemini || {}
}
