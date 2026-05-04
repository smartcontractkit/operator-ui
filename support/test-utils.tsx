import React from 'react'
import { Provider, Provider as ReduxProvider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { ThemeProvider } from '@mui/material/styles'
import { ThemeProvider as LegacyThemeProvider } from '@mui/styles'

import createStore from 'src/createStore'
import { theme } from 'src/theme'
import { ThemeModeProvider } from 'src/context/ThemeModeContext'
import thunk from 'redux-thunk'

const Router = MemoryRouter as any

const AllTheProviders = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <ThemeModeProvider>
      <ThemeProvider theme={theme}>
        <LegacyThemeProvider theme={theme}>
          <ReduxProvider store={createStore()}>{children}</ReduxProvider>
        </LegacyThemeProvider>
      </ThemeProvider>
    </ThemeModeProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult =>
  render(ui, {
    wrapper: AllTheProviders,
    ...options,
  })
interface RenderWithRouterProps {
  initialEntries?: string[]
}

// renderWithRouter behaves like 'render' except it wraps the provided ui in a
// Router.
//
// Use this when you need a router in your tests for page components and any
// component which uses react-router hooks.
const renderWithRouter = (
  ui: React.ReactElement,
  { initialEntries }: RenderWithRouterProps = { initialEntries: ['/'] },
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult => {
  return {
    ...customRender(
      <Router initialEntries={initialEntries}>{ui}</Router>,
      options,
    ),
  }
}

export const BuildInfoProvider = (props: React.PropsWithChildren<{}>) => {
  const middlewares = [thunk]
  const store = configureStore(middlewares)({
    buildInfo: {
      commitSHA: '6989a388ef26d981e771fec6710dc65bcc8fb5af',
      version: '1.0.0',
    },
  })
  return <Provider store={store}>{props.children}</Provider>
}

export * from '@testing-library/react'
export { customRender as render, renderWithRouter }
