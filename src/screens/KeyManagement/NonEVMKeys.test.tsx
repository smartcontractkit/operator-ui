import * as React from 'react'

import { renderWithRouter, screen } from 'support/test-utils'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'

import { NonEVMKeys } from './NonEVMKeys'
import { NON_EVM_KEYS_QUERY } from 'hooks/queries/useNonEvmAccountsQuery'
import {
  buildAptosKeys,
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
