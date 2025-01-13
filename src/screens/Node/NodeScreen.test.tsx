import * as React from 'react'

import { GraphQLError } from 'graphql'
import { Route } from 'react-router-dom'
import { renderWithRouter, screen } from 'support/test-utils'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'

import { NodeScreen, NODE_QUERY } from './NodeScreen'
import { buildNodePayloadFields } from 'support/factories/gql/fetchNode'
import Notifications from 'pages/Notifications'
import { waitForLoading } from 'support/test-helpers/wait'

const { findByTestId, findByText } = screen

function renderComponent(mocks: MockedResponse[]) {
  renderWithRouter(
    <>
      <Notifications />
      <Route exact path="/nodes/:id">
        <MockedProvider mocks={mocks} addTypename={false}>
          <NodeScreen />
        </MockedProvider>
      </Route>

      <Route exact path="/chains/:network/:id">
        Redirect Success
      </Route>
    </>,
    { initialEntries: ['/nodes/1'] },
  )
}

function fetchNodeQuery(node: NodePayload_Fields) {
  return {
    request: {
      query: NODE_QUERY,
      variables: { id: '1' },
    },
    result: {
      data: {
        node,
      },
    },
  }
}

describe('NodeScreen', () => {
  it('renders the page', async () => {
    const payload = buildNodePayloadFields()
    const mocks: MockedResponse[] = [fetchNodeQuery(payload)]

    renderComponent(mocks)

    await waitForLoading()

    expect(await findByText(payload.name)).toBeInTheDocument()
  })

  it('renders the not found page', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: NODE_QUERY,
          variables: { id: '1' },
        },
        result: {
          data: {
            node: {
              __typename: 'NotFoundError',
              message: 'node not found',
            },
          },
        },
      },
    ]

    renderComponent(mocks)

    await waitForLoading()

    expect(await findByTestId('not-found-page')).toBeInTheDocument()
  })

  it('renders GQL query errors', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: NODE_QUERY,
          variables: { id: '1' },
        },
        result: {
          errors: [new GraphQLError('Error!')],
        },
      },
    ]

    renderComponent(mocks)

    expect(await findByText('Error: Error!')).toBeInTheDocument()
  })
})
