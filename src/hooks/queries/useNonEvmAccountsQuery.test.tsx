import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  useNonEvmAccountsQuery,
  NON_EVM_KEYS_QUERY,
} from './useNonEvmAccountsQuery'

const mockData = {
  data: {
    aptosKeys: {
      __typename: 'AptosKeys',
      results: [
        { __typename: 'AptosKey', account: 'account1', id: '1' },
        { __typename: 'AptosKey', account: 'account2', id: '2' },
      ],
    },
    solanaKeys: {
      __typename: 'SolanaKeys',
      results: [{ __typename: 'SolanaKey', id: '3' }],
    },
    tronKeys: {
      __typename: 'TronKeys',
      results: [{ __typename: 'TronKey', id: '4' }],
    },
    tonKeys: {
      __typename: 'TONKeys',
      results: [{ __typename: 'TONKey', id: '5' }],
    },
    suiKeys: {
      __typename: 'SuiKeys',
      results: [
        { __typename: 'SuiKey', account: 'account6', id: '6' },
        { __typename: 'SuiKey', account: 'account7', id: '7' },
      ],
    },
  },
}

const mocks = [
  {
    request: {
      query: NON_EVM_KEYS_QUERY,
    },
    result: mockData,
  },
]

const TestComponent: React.FC = () => {
  const { data, loading, error } = useNonEvmAccountsQuery()

  if (loading) return <p>Loading... </p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      {data?.aptosKeys.results.map((key, i) => (
        <div key={i}>
          <p>Account: {key.account}</p>
          <p>Aptos ID: {key.id}</p>
        </div>
      ))}

      {data?.solanaKeys.results.map((key, i) => (
        <div key={i}>
          <p>Solana ID: {key.id}</p>
        </div>
      ))}

      {data?.tronKeys.results.map((key, i) => (
        <div key={i}>
          <p>Tron ID: {key.id}</p>
        </div>
      ))}

      {data?.tonKeys.results.map((key, i) => (
        <div key={i}>
          <p>TON ID: {key.id}</p>
        </div>
      ))}

      {data?.suiKeys.results.map((key, i) => (
        <div key={i}>
          <p>Account: {key.account}</p>
          <p>Sui ID: {key.id}</p>
        </div>
      ))}
    </div>
  )
}

describe('useNonEvmAccountsQuery', () => {
  test('renders data with correct graphql query', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TestComponent />
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Account: account1')).toBeInTheDocument()
      expect(screen.getByText('Aptos ID: 1')).toBeInTheDocument()
      expect(screen.getByText('Account: account2')).toBeInTheDocument()
      expect(screen.getByText('Aptos ID: 2')).toBeInTheDocument()

      expect(screen.getByText('Solana ID: 3')).toBeInTheDocument()
      expect(screen.getByText('Tron ID: 4')).toBeInTheDocument()
      expect(screen.getByText('TON ID: 5')).toBeInTheDocument()

      expect(screen.getByText('Account: account6')).toBeInTheDocument()
      expect(screen.getByText('Sui ID: 6')).toBeInTheDocument()
      expect(screen.getByText('Account: account7')).toBeInTheDocument()
      expect(screen.getByText('Sui ID: 7')).toBeInTheDocument()
    })
  })
})
