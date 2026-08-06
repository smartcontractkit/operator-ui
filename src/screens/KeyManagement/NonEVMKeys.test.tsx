import * as React from 'react'

import { renderWithRouter, screen } from 'support/test-utils'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'

import { NonEVMKeys } from './NonEVMKeys'
import { NON_EVM_KEYS_QUERY } from 'hooks/queries/useNonEvmAccountsQuery'
import {
  buildAptosKeys,
  buildStellarKeys,
  buildSuiKeys,
} from 'support/factories/gql/fetchNonEVMKeys'
import Notifications from 'pages/Notifications'
import { waitForLoading } from 'support/test-helpers/wait'

const { findByText } = screen

function renderComponent(mocks: MockedResponse[]) {
  renderWithRouter(
    <>
      <Notifications />
      <MockedProvider mocks={mocks} addTypename={false}>
        <NonEVMKeys />
      </MockedProvider>
    </>,
  )
}

function fetchNonEVMKeysQuery(
  aptosKeys: ReadonlyArray<AptosKeysPayload_ResultsFields>,
) {
  return {
    request: {
      query: NON_EVM_KEYS_QUERY,
    },
    result: {
      data: {
        aptosKeys: {
          results: aptosKeys,
        },
      },
    },
  }
}

function fetchNonEVMKeysQuerySui(
  suiKeys: ReadonlyArray<SuiKeysPayload_ResultsFields>,
) {
  return {
    request: {
      query: NON_EVM_KEYS_QUERY,
    },
    result: {
      data: {
        suiKeys: {
          results: suiKeys,
        },
      },
    },
  }
}

function fetchNonEVMKeysQueryStellar(
  stellarKeys: ReadonlyArray<StellarKeysPayload_ResultsFields>,
) {
  return {
    request: {
      query: NON_EVM_KEYS_QUERY,
    },
    result: {
      data: {
        stellarKeys: {
          results: stellarKeys,
        },
      },
    },
  }
}

describe('NonEVMKeys', () => {
  it('renders the page', async () => {
    const payload = buildAptosKeys()
    const mocks: MockedResponse[] = [fetchNonEVMKeysQuery(payload)]

    renderComponent(mocks)

    await waitForLoading()

    expect(await findByText(payload[0].id)).toBeInTheDocument()
    expect(await findByText(payload[0].account)).toBeInTheDocument()
  })
})

describe('NonEVMKeys_Sui', () => {
  it('renders the page', async () => {
    const payload = buildSuiKeys()
    const mocks: MockedResponse[] = [fetchNonEVMKeysQuerySui(payload)]

    renderComponent(mocks)

    await waitForLoading()

    expect(await findByText(payload[0].id)).toBeInTheDocument()
    expect(await findByText(payload[0].account)).toBeInTheDocument()
  })
})

describe('NonEVMKeys_Stellar', () => {
  it('renders the page', async () => {
    const payload = buildStellarKeys()
    const mocks: MockedResponse[] = [fetchNonEVMKeysQueryStellar(payload)]

    renderComponent(mocks)

    await waitForLoading()

    // Only the account is asserted: the Stellar card renders a single field,
    // since a key's ID is its "G..." account address.
    expect(await findByText(payload[0].account)).toBeInTheDocument()
    expect(await findByText(payload[1].account)).toBeInTheDocument()
  })
})
