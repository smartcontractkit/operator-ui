import * as React from 'react'
import { BuildInfoProvider, renderWithRouter, screen } from 'support/test-utils'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'

import { DashboardView } from './DashboardView'

const { findByText } = screen

describe('DashboardView', () => {
  it('renders the cards', async () => {
    const mocks: MockedResponse[] = []

    renderWithRouter(
      <BuildInfoProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <DashboardView />
        </MockedProvider>
      </BuildInfoProvider>,
    )

    expect(await findByText('Activity')).toBeInTheDocument()
    expect(await findByText('Account Balances')).toBeInTheDocument()
    expect(await findByText('Recent Jobs')).toBeInTheDocument()
  })
})
