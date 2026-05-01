import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { ThemeProvider as LegacyThemeProvider } from '@mui/styles'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import moment from 'moment'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { theme } from './theme'
import { ApolloProvider } from '@apollo/client'
import { client } from './apollo'

JavascriptTimeAgo.locale(en)
moment.defaultFormat = 'YYYY-MM-DD h:mm:ss A'

export default App

if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root')

  if (rootElement) {
    const root = createRoot(rootElement)

    root.render(
      <ApolloProvider client={client}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <LegacyThemeProvider theme={theme}>
              <App />
            </LegacyThemeProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ApolloProvider>,
    )
  }
}
