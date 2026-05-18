import * as storage from 'utils/local-storage'

const PERSIST_URL = 'persistURL'
const THEME_MODE = 'themeMode'

export type ThemeMode = 'light' | 'dark'

export function getPersistUrl(): string {
  return storage.get(PERSIST_URL) || ''
}

export function setPersistUrl(url: string): void {
  storage.set(PERSIST_URL, url)
}

export function getThemeMode(): ThemeMode {
  const mode = storage.get(THEME_MODE)

  return mode === 'dark' ? 'dark' : 'light'
}

export function setThemeMode(mode: ThemeMode): void {
  storage.set(THEME_MODE, mode)
}

export interface Auth {
  allowed?: boolean
}

export function getAuthentication(): Auth {
  return storage.getJson('authentication')
}

export function setAuthentication(auth: Auth): void {
  storage.setJson('authentication', auth)
}
