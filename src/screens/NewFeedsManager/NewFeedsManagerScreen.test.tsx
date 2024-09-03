import * as React from 'react'

import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import { GraphQLError } from 'graphql'
import { Route } from 'react-router-dom'
import { renderWithRouter, screen } from 'support/test-utils'

import Notifications from 'pages/Notifications'
import { FEEDS_MANAGERS_QUERY } from 'src/hooks/queries/useFeedsManagersQuery'
import { buildFeedsManager } from 'support/factories/gql/fetchFeedsManagers'
import {
  CREATE_FEEDS_MANAGER_MUTATION,
  NewFeedsManagerScreen,
} from './NewFeedsManagerScreen'

const { findByTestId, findByText, getByRole, getByText, getByTestId } = screen

function renderComponent(mocks: MockedResponse[]) {
  renderWithRouter(
    <>
      <Notifications />
      <Route exact path="/">
        <MockedProvider mocks={mocks} addTypename={false}>
          <NewFeedsManagerScreen />
        </MockedProvider>
      </Route>

      <Route path="/job_distributors">Redirect Success</Route>
    </>,
  )
}

describe('NewFeedsManagerScreen', () => {
  it('renders the page', async () => {
    renderComponent([])

    expect(getByText('Register Job Distributor')).toBeInTheDocument()
    expect(getByTestId('feeds-manager-form')).toBeInTheDocument()
  })

  it('submits the form', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: CREATE_FEEDS_MANAGER_MUTATION,
          variables: {
            input: {
              name: 'Chainlink Feeds Manager',
              uri: 'localhost:8080',
              publicKey: '1111',
            },
          },
        },
        result: {
          data: {
            createFeedsManager: {
              __typename: 'CreateFeedsManagerSuccess',
              feedsManager: buildFeedsManager(),
            },
          },
        },
      },
      {
        request: {
          query: FEEDS_MANAGERS_QUERY,
        },
        result: {
          data: {
            feedsManagers: {
              results: [buildFeedsManager()],
            },
          },
        },
      },
    ]

    renderComponent(mocks)

    userEvent.type(
      getByRole('textbox', { name: 'Name *' }),
      'Chainlink Feeds Manager',
    )
    userEvent.type(getByRole('textbox', { name: 'URI *' }), 'localhost:8080')
    userEvent.type(getByRole('textbox', { name: 'Public Key *' }), '1111')

    userEvent.click(getByRole('button', { name: /submit/i }))

    expect(await findByText('Job Distributor Created')).toBeInTheDocument()
    expect(await findByText('Redirect Success')).toBeInTheDocument()
  })

  it('handles input errors', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: CREATE_FEEDS_MANAGER_MUTATION,
          variables: {
            input: {
              name: 'Chainlink Feeds Manager',
              uri: 'localhost:8080',
              publicKey: '1111',
            },
          },
        },
        result: {
          data: {
            createFeedsManager: {
              __typename: 'InputErrors',
              errors: [
                {
                  code: 'INPUT_ERROR',
                  message: 'invalid hex value',
                  path: 'input/publicKey',
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: FEEDS_MANAGERS_QUERY,
        },
        result: {
          data: {
            feedsManagers: {
              results: [],
            },
          },
        },
      },
    ]

    renderComponent(mocks)

    userEvent.type(
      getByRole('textbox', { name: 'Name *' }),
      'Chainlink Feeds Manager',
    )
    userEvent.type(getByRole('textbox', { name: 'URI *' }), 'localhost:8080')
    userEvent.type(getByRole('textbox', { name: 'Public Key *' }), '1111')

    userEvent.click(getByRole('button', { name: /submit/i }))

    expect(await findByText('Invalid Input')).toBeInTheDocument()
    expect(await findByTestId('publicKey-helper-text')).toHaveTextContent(
      'invalid hex value',
    )
  })

  it('renders mutation GQL errors', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: CREATE_FEEDS_MANAGER_MUTATION,
          variables: {
            input: {
              name: 'Chainlink Feeds Manager',
              uri: 'localhost:8080',
              publicKey: '1111',
            },
          },
        },
        result: {
          errors: [new GraphQLError('Mutation Error!')],
        },
      },
    ]

    renderComponent(mocks)

    userEvent.type(
      getByRole('textbox', { name: 'Name *' }),
      'Chainlink Feeds Manager',
    )
    userEvent.type(getByRole('textbox', { name: 'URI *' }), 'localhost:8080')
    userEvent.type(getByRole('textbox', { name: 'Public Key *' }), '1111')

    userEvent.click(getByRole('button', { name: /submit/i }))

    expect(await findByText('Mutation Error!')).toBeInTheDocument()
  })
})
