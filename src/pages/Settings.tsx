import React, { useState } from 'react'
import { Key, Loader2, Check, AlertCircle } from 'lucide-react'
import { useUserSettings, useSaveGeminiKey, useAvailableModels, useSaveGeminiPreferences } from '@/hooks/useSettings'
import { getGeminiPreferences } from '@/lib/settings.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SettingsPage() {
  const { data: settings, isLoading: isLoadingSettings, error: settingsError } = useUserSettings()
  const saveGeminiKeyMutation = useSaveGeminiKey()
  const { data: availableModels, isLoading: isLoadingModels, error: modelsError } = useAvailableModels()
  const saveGeminiPreferencesMutation = useSaveGeminiPreferences()

  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [selectedModel, setSelectedModel] = useState('')

  // Update local state when settings load
  React.useEffect(() => {
    if (settings?.gemini_api_key) {
      setApiKey(settings.gemini_api_key)
    }

    const geminiPrefs = getGeminiPreferences(settings || null)
    if (geminiPrefs.preferredModel) {
      setSelectedModel(geminiPrefs.preferredModel)
    } else if (availableModels?.length) {
      // Default to gemini-2.5-flash if available
      const defaultModel = availableModels.find(model => model.name?.includes('gemini-2.5-flash'))
      setSelectedModel(defaultModel?.name || '')
    }
  }, [settings, availableModels])

  const handleSaveGeminiKey = async () => {
    const trimmedKey = apiKey.trim()

    // If current key matches saved key, no need to save
    if (trimmedKey === (settings?.gemini_api_key || '')) {
      return
    }

    // Validate API key format (basic validation)
    if (trimmedKey && !trimmedKey.startsWith('AIza')) {
      alert('API key phải bắt đầu bằng "AIza"')
      return
    }

    try {
      await saveGeminiKeyMutation.mutateAsync(trimmedKey || null)
      // Keep the key visible briefly for feedback
    } catch (error) {
      console.error('Failed to save API key:', error)
    }
  }

  const handleClearApiKey = async () => {
    if (confirm('Bạn có chắc muốn xóa API key không?')) {
      setApiKey('')
      try {
        await saveGeminiKeyMutation.mutateAsync(null)
        // Clear model selection when API key is cleared
        setSelectedModel('')
        await saveGeminiPreferencesMutation.mutateAsync({})
      } catch (error) {
        console.error('Failed to clear API key:', error)
      }
    }
  }

  const handleSaveModelPreference = async () => {
    if (!selectedModel) return

    const currentPrefs = getGeminiPreferences(settings || null)
    if (currentPrefs.preferredModel === selectedModel) {
      return
    }

    try {
      await saveGeminiPreferencesMutation.mutateAsync({ preferredModel: selectedModel })
    } catch (error) {
      console.error('Failed to save model preference:', error)
    }
  }

  if (isLoadingSettings) {
    return (
      <section className='space-y-4'>
        <header>
          <h1 className='text-2xl font-semibold'>Cài đặt</h1>
          <p className='text-sm text-muted-foreground'>
            Đang tải cài đặt...
          </p>
        </header>
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      </section>
    )
  }

  return (
    <section className='space-y-6'>
      <header className='space-y-3 pb-2'>
        <h1 className='text-3xl font-extrabold tracking-tight bg-gradient-to-br from-primary via-foreground to-secondary bg-clip-text text-transparent'>
          Cài đặt
        </h1>
        <p className='text-base text-muted-foreground leading-relaxed'>
          Chọn các tùy chọn dưới đây để cấu hình trải nghiệm của bạn.
        </p>
      </header>

      {settingsError && (
        <Alert variant='destructive' className='rounded-xl border-destructive/30'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Không thể tải cài đặt. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
      )}

      {/* Gemini API Configuration */}
      <Card className='border-border/50 shadow-lg shadow-black/5 overflow-hidden animate-fade-in-up'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl' />
        <CardHeader className='relative z-10'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
              <Key className='h-5 w-5 text-primary' />
            </div>
            <div>
              <CardTitle className='text-xl font-bold'>Cấu hình Gemini AI</CardTitle>
              <CardDescription className='text-sm mt-1'>
                Thiết lập API key của Google Gemini để sử dụng các tính năng AI.
              </CardDescription>
            </div>
          </div>
          <CardDescription className='mt-3 pl-13'>
            Lấy API key tại{' '}
            <a
              href='https://aistudio.google.com/app/apikey'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:text-primary/80 font-semibold transition-smooth'
            >
              Google AI Studio →
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-5 relative z-10'>
          <div className='space-y-2'>
            <Label htmlFor='gemini-api-key' className='font-semibold'>Gemini API Key</Label>
            <div className='flex gap-2'>
              <Input
                id='gemini-api-key'
                type={showApiKey ? 'text' : 'password'}
                placeholder='AIza...'
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className='flex-1 h-11 rounded-xl border-border/50 focus:border-primary transition-smooth'
                disabled={saveGeminiKeyMutation.isPending}
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={saveGeminiKeyMutation.isPending}
                className='rounded-xl h-11 px-4 hover:bg-muted transition-smooth'
              >
                {showApiKey ? 'Ẩn' : 'Hiện'}
              </Button>
            </div>
            <p className='text-xs text-muted-foreground'>
              API key được lưu an toàn trong cơ sở dữ liệu của bạn.
            </p>
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={handleSaveGeminiKey}
              disabled={saveGeminiKeyMutation.isPending || (apiKey.trim() === (settings?.gemini_api_key || ''))}
              className='flex-1 h-11 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-smooth'
            >
              {saveGeminiKeyMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Check className='mr-2 h-4 w-4' />
                  Lưu API Key
                </>
              )}
            </Button>

            {settings?.gemini_api_key && (
              <Button
                variant='outline'
                onClick={handleClearApiKey}
                disabled={saveGeminiKeyMutation.isPending}
                className='rounded-xl h-11 px-5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-smooth'
              >
                Xóa
              </Button>
            )}
          </div>

          {saveGeminiKeyMutation.isError && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                Không thể lưu API key. Vui lòng thử lại.
              </AlertDescription>
            </Alert>
          )}

          {saveGeminiKeyMutation.isSuccess && !saveGeminiKeyMutation.isPending && (
            <Alert>
              <Check className='h-4 w-4' />
              <AlertDescription>
                API key đã được lưu thành công!
              </AlertDescription>
            </Alert>
          )}

          {/* Model Selection - Only show when API key is configured */}
          {settings?.gemini_api_key && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='gemini-model'>Model ưa thích</Label>
                {isLoadingModels ? (
                  <div className='flex items-center gap-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span className='text-sm text-muted-foreground'>Đang tải danh sách model...</span>
                  </div>
                ) : modelsError ? (
                  <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>
                      Không thể tải danh sách model. Vui lòng thử lại sau.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className='flex gap-2'>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className='flex-1'>
                        <SelectValue placeholder='Chọn model Gemini' />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels?.map((model) => (
                          <SelectItem key={model.name || ''} value={model.name || ''}>
                            {model.displayName || model.name || 'Unknown Model'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleSaveModelPreference}
                      disabled={saveGeminiPreferencesMutation.isPending || !selectedModel || selectedModel === getGeminiPreferences(settings || null).preferredModel}
                      size='sm'
                    >
                      {saveGeminiPreferencesMutation.isPending ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Check className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                )}
                <p className='text-xs text-muted-foreground'>
                  Chọn model Gemini mà bạn muốn sử dụng cho các tính năng AI.
                </p>
              </div>

              {saveGeminiPreferencesMutation.isSuccess && !saveGeminiPreferencesMutation.isPending && (
                <Alert>
                  <Check className='h-4 w-4' />
                  <AlertDescription>
                    Model preference đã được lưu thành công!
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {settings?.gemini_api_key && (
            <div className='text-sm text-muted-foreground'>
              ✅ Gemini AI đã được cấu hình và sẵn sàng sử dụng.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Settings */}
      <div className='space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm'>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>Giao diện</p>
          <p className='text-xs text-muted-foreground'>
            Tích hợp với theme provider trước đó để đổi chế độ sáng/tối.
          </p>
        </div>
        <div className='space-y-1'>
          <p className='text-sm font-medium'>Thông báo</p>
          <p className='text-xs text-muted-foreground'>
            Tùy chỉnh tần suất thông báo và kênh nhận thông tin.
          </p>
        </div>
      </div>
    </section>
  )
}
