import * as React from 'react'

import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { GraphQLError } from 'graphql'
import { Route, Switch } from 'react-router-dom'
import { renderWithRouter, screen, waitFor } from 'support/test-utils'

import userEvent from '@testing-library/user-event'
import { FEEDS_MANAGER_WITH_PROPOSALS_QUERY } from 'src/hooks/queries/useFeedsManagerWithProposalsQuery'
import { buildFeedsManager } from 'support/factories/gql/fetchFeedsManagers'
import { buildFeedsManagerResultFields } from 'support/factories/gql/fetchFeedsManagersWithProposals'
import {
  ENABLE_FEEDS_MANAGER_MUTATION,
  FeedsManagerScreen,
} from './FeedsManagerScreen'

const {
  findByText,
  findByTestId,
  getByRole,
  getByText,
  getAllByRole,
  queryByText,
} = screen

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

  it('should enable a feed', async () => {
    const id = '1'
    const mocks: MockedResponse[] = [
      {
        request: {
          query: FEEDS_MANAGER_WITH_PROPOSALS_QUERY,
          variables: { id },
        },
        result: {
          data: {
            feedsManager: buildFeedsManagerResultFields(),
          },
        },
      },
      {
        request: {
          query: ENABLE_FEEDS_MANAGER_MUTATION,
          variables: { id },
        },
        result: {
          data: {
            enableFeedsManager: {
              feedsManager: buildFeedsManager({
                disabledAt: null,
              }),
              __typename: 'EnableFeedsManagerSuccess',
            },
          },
        },
      },
    ]

    renderComponent(mocks)

    expect(await findByText('Job Distributors')).toBeInTheDocument()
    expect(await findByText('Job Proposals')).toBeInTheDocument()
    expect(await findByText('Disabled')).toBeInTheDocument()
    expect(await queryByText('Enabled')).not.toBeInTheDocument()

    const openMenuButtons = await getAllByRole('button', {
      name: /open-menu/i,
    })
    userEvent.click(openMenuButtons[0])
    userEvent.click(await getByRole('menuitem', { name: /enable/i }))
    await waitFor(() => {
      expect(getByText('Enabled')).toBeInTheDocument()
    })
    expect(await queryByText('Disabled')).not.toBeInTheDocument()
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
