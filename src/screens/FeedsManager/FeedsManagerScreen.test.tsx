import * as React from 'react'

import { GraphQLError } from 'graphql'
import { Route, Switch } from 'react-router-dom'
import { renderWithRouter, screen } from 'support/test-utils'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'

import { FeedsManagerScreen } from './FeedsManagerScreen'
import { buildFeedsManagerResultFields } from 'support/factories/gql/fetchFeedsManagersWithProposals'
import { FEEDS_MANAGER_WITH_PROPOSALS_QUERY } from 'src/hooks/queries/useFeedsManagerWithProposalsQuery'

const { findByText, findByTestId } = screen

function renderComponent(mocks: MockedResponse[]) {
  renderWithRouter(
    <Switch>
      <Route exact path="/job_distributors/:id">
        <MockedProvider mocks={mocks}>
          <FeedsManagerScreen />
        </MockedProvider>
      </Route>

      <Route exact path="/job_distributors">
        job_distributors
      </Route>
    </Switch>,
    {
      initialEntries: ['/job_distributors/1'],
    },
  )
}

describe('FeedsManagerScreen', () => {
  it('renders the page', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: FEEDS_MANAGER_WITH_PROPOSALS_QUERY,
          variables: { id: '1' },
        },
        result: {
          data: {
            feedsManager: buildFeedsManagerResultFields(),
          },
        },
      },
    ]

    renderComponent(mocks)

    expect(await findByText('Job Distributors')).toBeInTheDocument()
    expect(await findByText('Job Proposals')).toBeInTheDocument()
  })

  it('should render not found page when a manager is not found', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: FEEDS_MANAGER_WITH_PROPOSALS_QUERY,
          variables: { id: '1' },
        },
        result: {
          data: {
            feedsManager: {
              __typename: 'NotFoundError',
              message: 'Not Found',
              code: '404',
            },
          },
        },
      },
    ]

    renderComponent(mocks)

    expect(await findByTestId('not-found-page')).toBeInTheDocument()
  })

  it('should redirect to /job_distributors when result type is unknown', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: FEEDS_MANAGER_WITH_PROPOSALS_QUERY,
          variables: { id: '1' },
        },
        result: {
          data: {
            feedsManager: {
              __typename: 'Unknown',
            },
          },
        },
      },
    ]

    renderComponent(mocks)

    expect(await findByText('job_distributors')).toBeInTheDocument()
  })

  it('renders GQL errors', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: FEEDS_MANAGER_WITH_PROPOSALS_QUERY,
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
