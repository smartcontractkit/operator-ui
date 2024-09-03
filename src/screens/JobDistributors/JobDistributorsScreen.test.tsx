import React from 'react'

import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { GraphQLError } from 'graphql'
import { Route } from 'react-router-dom'
import { renderWithRouter, screen, within } from 'test-utils'

import { FEEDS_MANAGERS_QUERY } from 'src/hooks/queries/useFeedsManagersQuery'
import { buildFeedsManager } from 'support/factories/gql/fetchFeedsManagers'
import { waitForLoading } from 'support/test-helpers/wait'
import { JobDistributorsScreen } from './JobDistributorsScreen'

const { findAllByRole, findByText } = screen

function renderComponent(mocks: MockedResponse[]) {
  renderWithRouter(
    <>
      <Route exact path="/job_distributors">
        <MockedProvider mocks={mocks} addTypename={false}>
          <JobDistributorsScreen />
        </MockedProvider>
      </Route>
    </>,
    { initialEntries: ['/job_distributors'] },
  )
}

describe('JobDistributorsScreen', () => {
  it('should render the list of job distributors', async () => {
    const mocks: MockedResponse[] = [
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

    await waitForLoading()

    const rows = await findAllByRole('row')

    // header counts as a row
    expect(rows).toHaveLength(2)
    expect(
      within(rows[1]).getByText('Chainlink Feeds Manager'),
    ).toBeInTheDocument()
  })

  it('should renders GQL errors', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: FEEDS_MANAGERS_QUERY,
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
