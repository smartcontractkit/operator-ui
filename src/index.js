import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import moment from 'moment'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { createAppTheme } from './theme'
import { ApolloProvider } from '@apollo/client'
import { client } from './apollo'
import { ThemeModeProvider, useThemeMode } from './context/ThemeModeContext'

JavascriptTimeAgo.locale(en)
moment.defaultFormat = 'YYYY-MM-DD h:mm:ss A'

export default App

const Root = () => {
  const { mode } = useThemeMode()
  const theme = React.useMemo(() => createAppTheme(mode), [mode])

  return (
    <ApolloProvider client={client}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </ApolloProvider>
  )
}

if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root')

  if (rootElement) {
    const root = createRoot(rootElement)

    root.render(
      <ThemeModeProvider>
        <Root />
      </ThemeModeProvider>,
    )
  }
}
