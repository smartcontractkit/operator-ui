import * as React from 'react'

import { renderWithRouter, screen } from 'support/test-utils'

import { MockedProvider } from '@apollo/client/testing'
import { buildFeedsManagerResultFields } from 'support/factories/gql/fetchFeedsManagersWithProposals'
import { FeedsManagerView } from './FeedsManagerView'

const { findByText } = screen

describe('FeedsManagerView', () => {
  it('renders the feeds manager view', async () => {
    const mgr = buildFeedsManagerResultFields()

    renderWithRouter(
      <MockedProvider addTypename={false}>
        <FeedsManagerView
          manager={mgr}
          onDisable={() => {}}
          onEnable={() => {}}
        />
      </MockedProvider>,
    )

    expect(await findByText('Job Distributors')).toBeInTheDocument()
    expect(await findByText('Job Proposals')).toBeInTheDocument()
  })
})
