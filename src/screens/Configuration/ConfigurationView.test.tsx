import * as React from 'react'

import { BuildInfoProvider, renderWithRouter, screen } from 'support/test-utils'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { ConfigurationView } from './ConfigurationView'

const { findByText } = screen

describe('ConfigurationView', () => {
  it('renders the cards', async () => {
    const mocks: MockedResponse[] = []

    renderWithRouter(
      <BuildInfoProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ConfigurationView />
        </MockedProvider>
      </BuildInfoProvider>,
    )

    expect(await findByText('Node')).toBeInTheDocument()
    expect(await findByText('Job Runs')).toBeInTheDocument()
    expect(await findByText('Logging')).toBeInTheDocument()
  })
})
