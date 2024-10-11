import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  useAptosAccountsQuery,
  APTOS_KEYS_QUERY,
} from './useAptosAccountsQuery'

const mockData = {
  data: {
    aptosKeys: {
      __typename: 'AptosKeys',
      results: [
        { __typename: 'AptosKey', account: 'account1', id: '1' },
        { __typename: 'AptosKey', account: 'account2', id: '2' },
      ],
    },
  },
}

const mocks = [
  {
    request: {
      query: APTOS_KEYS_QUERY,
    },
    result: mockData,
  },
]

const TestComponent: React.FC = () => {
  const { data, loading, error } = useAptosAccountsQuery()

  if (loading) return <p>Loading... </p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      {data?.aptosKeys.results.map((key, i) => (
        <div key={i}>
          <p>Account: {key.account}</p>
          <p>ID: {key.id}</p>
        </div>
      ))}
    </div>
  )
}

describe('useAptosAccountsQuery', () => {
  test('renders data with correct graphql query', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TestComponent />
      </MockedProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Account: account1')).toBeInTheDocument()
      expect(screen.getByText('ID: 1')).toBeInTheDocument()
      expect(screen.getByText('Account: account2')).toBeInTheDocument()
      expect(screen.getByText('ID: 2')).toBeInTheDocument()
    })
  })
})
