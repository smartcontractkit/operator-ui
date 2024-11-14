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
    })
  })
})
