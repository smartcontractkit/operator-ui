import React from 'react'

import { Route, Switch } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import { buildFeedsManager } from 'support/factories/gql/fetchFeedsManagers'
import { renderWithRouter, screen, within } from 'support/test-utils'
import { JobDistributorView } from './JobDistributorView'

const { getAllByRole, getByRole, getByText, findByText } = screen

function renderComponent(
  mockData: ReadonlyArray<FetchFeedsManagersPayload_ResultsFields>,
) {
  renderWithRouter(
    <Switch>
      <Route exact path="/job_distributors">
        <JobDistributorView jobDistributors={mockData} />,
      </Route>
      <Route exact path="/job_distributors/new">
        New Job Distributor Page
      </Route>
      <Route exact path="/job_distributors/1">
        Edit Job Distributor Page
      </Route>
    </Switch>,
    { initialEntries: ['/job_distributors'] },
  )
}

describe('JobDistributorView', () => {
  test('should render the list of job distributors', () => {
    renderComponent([
      buildFeedsManager(),
      buildFeedsManager({
        name: 'Job Distributor 2',
        id: '2',
        isConnectionActive: true,
      }),
    ])

    expect(getByRole('heading')).toHaveTextContent('Job Distributors')

    // header row counts as 1 row too
    const rows = getAllByRole('row')
    expect(rows).toHaveLength(3)

    expect(getByText('Name')).toBeInTheDocument()
    expect(getByText('Status')).toBeInTheDocument()
    expect(getByText('CSA Public Key')).toBeInTheDocument()
    expect(getByText('RPC URL')).toBeInTheDocument()

    expect(
      within(rows[1]).getByText('Chainlink Feeds Manager'),
    ).toBeInTheDocument()
    expect(within(rows[1]).getByText('Disconnected')).toBeInTheDocument()
    expect(within(rows[1]).getByText('localhost:8080')).toBeInTheDocument()

    expect(within(rows[2]).getByText('Job Distributor 2')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Connected')).toBeInTheDocument()
    expect(within(rows[2]).getByText('localhost:8080')).toBeInTheDocument()
  })

  test('should navigate to create new job distributor page when new button is clicked', async () => {
    renderComponent([buildFeedsManager()])

    userEvent.click(getByText(/New Job Distributor/i))

    expect(await findByText('New Job Distributor Page')).toBeInTheDocument()
  })

  test('should show placeholder message when there are no job distributors', async () => {
    renderComponent([])

    expect(
      await findByText('You haven’t created any Job Distributor yet.'),
    ).toBeInTheDocument()
  })

  test('should navigate to detail job distributor page when row is clicked', async () => {
    renderComponent([buildFeedsManager()])

    userEvent.click(getByText(/chainlink feeds manager/i))

    expect(await findByText('Edit Job Distributor Page')).toBeInTheDocument()
  })
})
