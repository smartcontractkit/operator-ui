import * as React from 'react'

import userEvent from '@testing-library/user-event'
import { Route } from 'react-router-dom'
import { renderWithRouter, screen } from 'support/test-utils'

import { shortenHex } from 'src/utils/shortenHex'
import { buildFeedsManagerFields } from 'support/factories/gql/fetchFeedsManagersWithProposals'
import { FeedsManagerCard } from './FeedsManagerCard'

const { getByRole, queryByText } = screen

function renderComponent(
  manager: FeedsManagerFields,
  onEnable = () => {},
  onDisable = () => {},
) {
  renderWithRouter(
    <>
      <Route path="/">
        <FeedsManagerCard
          manager={manager}
          onDisable={onDisable}
          onEnable={onEnable}
        />
      </Route>
      <Route path={`/job_distributors/${manager.id}/edit`}>
        Redirect Success
      </Route>
    </>,
  )
}

describe('FeedsManagerCard', () => {
  it('renders a disconnected Feeds Manager', () => {
    const mgr = buildFeedsManagerFields()

    renderComponent(mgr)

    expect(queryByText(mgr.name)).toBeInTheDocument()
    expect(queryByText(mgr.uri)).toBeInTheDocument()
    expect(queryByText(shortenHex(mgr.publicKey))).toBeInTheDocument()
    expect(queryByText('Disconnected')).toBeInTheDocument()
    expect(queryByText('Disabled')).toBeInTheDocument()
  })

  it('renders an enabled Feeds Manager', () => {
    const mgr = buildFeedsManagerFields({ disabledAt: null })

    renderComponent(mgr)

    expect(queryByText(mgr.name)).toBeInTheDocument()
    expect(queryByText(mgr.uri)).toBeInTheDocument()
    expect(queryByText(shortenHex(mgr.publicKey))).toBeInTheDocument()
    expect(queryByText('Disconnected')).toBeInTheDocument()
    expect(queryByText('Enabled')).toBeInTheDocument()
  })

  it('renders a connected boostrapper Feeds Manager', () => {
    // Create a new manager with connected bootstrap values
    const mgr = buildFeedsManagerFields({
      isConnectionActive: true,
    })

    renderComponent(mgr)

    expect(queryByText(mgr.name)).toBeInTheDocument()
    expect(queryByText(mgr.uri)).toBeInTheDocument()
    expect(queryByText(shortenHex(mgr.publicKey))).toBeInTheDocument()
    expect(queryByText('Flux Monitor')).toBeNull()
    expect(queryByText('Connected')).toBeInTheDocument()
    expect(queryByText('Disabled')).toBeInTheDocument()
  })

  it('navigates to edit', () => {
    renderComponent(buildFeedsManagerFields())

    userEvent.click(getByRole('button', { name: /open-menu/i }))
    userEvent.click(getByRole('menuitem', { name: /edit/i }))

    expect(queryByText('Redirect Success')).toBeInTheDocument()
  })

  it('calls onEnable when enable menu item is clicked', () => {
    const onEnableMock = jest.fn()
    const onDisableMock = jest.fn()

    const mgr = buildFeedsManagerFields({ disabledAt: new Date() })

    renderComponent(mgr, onEnableMock, onDisableMock)

    userEvent.click(screen.getByRole('button', { name: /open-menu/i }))
    userEvent.click(screen.getByRole('menuitem', { name: /enable/i }))

    expect(onEnableMock).toHaveBeenCalledTimes(1)
  })

  it('calls onDisable when disable menu item is clicked', () => {
    const onEnableMock = jest.fn()
    const onDisableMock = jest.fn()

    const mgr = buildFeedsManagerFields({ disabledAt: null })
    renderComponent(mgr, onEnableMock, onDisableMock)

    userEvent.click(screen.getByRole('button', { name: /open-menu/i }))

    userEvent.click(screen.getByRole('menuitem', { name: /disable/i }))

    expect(onDisableMock).toHaveBeenCalledTimes(1)
  })
})
