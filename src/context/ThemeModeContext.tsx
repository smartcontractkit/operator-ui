import React from 'react'
import {
  getThemeMode,
  setThemeMode,
  type ThemeMode,
} from 'src/utils/storage'

interface ThemeModeContextValue {
  mode: ThemeMode
  toggleMode: () => void
}

const ThemeModeContext = React.createContext<ThemeModeContextValue | undefined>(
  undefined,
)

export const ThemeModeProvider: React.FC = ({ children }) => {
  const [mode, setMode] = React.useState<ThemeMode>(() => getThemeMode())

  const toggleMode = React.useCallback(() => {
    setMode((currentMode) => {
      const nextMode = currentMode === 'light' ? 'dark' : 'light'
      setThemeMode(nextMode)
      return nextMode
    })
  }, [])

  const value = React.useMemo(
    () => ({ mode, toggleMode }),
    [mode, toggleMode],
  )

  return (
    <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
  )
}

export const useThemeMode = (): ThemeModeContextValue => {
  const context = React.useContext(ThemeModeContext)

  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider')
  }

  return context
}

