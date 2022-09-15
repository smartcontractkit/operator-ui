import React from 'react'
import { Provider, Provider as ReduxProvider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import configureStore from 'redux-mock-store'
import { MuiThemeProvider } from '@material-ui/core/styles'

import createStore from 'src/createStore'
import { theme } from 'src/theme'
import thunk from 'redux-thunk'

const AllTheProviders: React.FC = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <ReduxProvider store={createStore()}>{children}</ReduxProvider>
    </MuiThemeProvider>
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
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
      options,
    ),
  }
}

export const BuildInfoProvider: React.FC = (props) => {
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
