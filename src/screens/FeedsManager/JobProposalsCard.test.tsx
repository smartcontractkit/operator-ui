import * as React from 'react'

import userEvent from '@testing-library/user-event'
import { renderWithRouter, screen } from 'support/test-utils'

import {
  buildJobProposals,
  buildApprovedJobProposal,
  buildCancelledJobProposal,
  buildRejectedJobProposal,
  buildDeletedJobProposal,
  buildRevokedJobProposal,
} from 'support/factories/gql/fetchFeedsManagersWithProposals'
import { JobProposalsCard } from './JobProposalsCard'

const { findAllByRole, getByRole, getByTestId } = screen

describe('JobProposalsCard', () => {
  it('renders the pending job proposals ', async () => {
    const proposals = buildJobProposals()

    renderWithRouter(<JobProposalsCard proposals={proposals} />)

    const rows = await findAllByRole('row')
    expect(rows).toHaveLength(2)

    expect(getByTestId('pending-badge')).toHaveTextContent('1')
  })

  it('renders the updates job proposals ', async () => {
    const proposals = [
      buildApprovedJobProposal({ pendingUpdate: true }),
      buildRejectedJobProposal({ pendingUpdate: true }),
      buildCancelledJobProposal({ pendingUpdate: true }),
      buildDeletedJobProposal({ pendingUpdate: true }),
      buildDeletedJobProposal({ pendingUpdate: false }),
      buildRevokedJobProposal({ pendingUpdate: false }),
    ]

    renderWithRouter(<JobProposalsCard proposals={proposals} />)

    expect(getByTestId('updates-badge')).toHaveTextContent('4')
    expect(getByTestId('approved-badge')).toHaveTextContent('1')
    expect(getByTestId('rejected-badge')).toHaveTextContent('1')
    expect(getByTestId('cancelled-badge')).toHaveTextContent('1')
    expect(getByTestId('deleted-badge')).toHaveTextContent('1')

    userEvent.click(getByRole('tab', { name: /updates/i }))

    const rows = await findAllByRole('row')
    expect(rows).toHaveLength(5)
  })

  it('renders the approved job proposals', async () => {
    const proposals = buildJobProposals()

    renderWithRouter(<JobProposalsCard proposals={proposals} />)

    userEvent.click(getByRole('tab', { name: /approved/i }))

    const rows = await findAllByRole('row')
    expect(rows).toHaveLength(2)
  })

  it('renders the rejected job proposals', async () => {
    const proposals = buildJobProposals()

    renderWithRouter(<JobProposalsCard proposals={proposals} />)

    userEvent.click(getByRole('tab', { name: /rejected/i }))

    const rows = await findAllByRole('row')
    expect(rows).toHaveLength(2)
  })

  it('renders the cancelled job proposals', async () => {
    const proposals = buildJobProposals()

    renderWithRouter(<JobProposalsCard proposals={proposals} />)

    userEvent.click(getByRole('tab', { name: /cancelled/i }))

    const rows = await findAllByRole('row')
    expect(rows).toHaveLength(2)
  })

  it('renders the deleted job proposals', async () => {
    const proposals = buildJobProposals()

    renderWithRouter(<JobProposalsCard proposals={proposals} />)

    userEvent.click(getByRole('tab', { name: /deleted/i }))

    const rows = await findAllByRole('row')
    expect(rows).toHaveLength(2)
  })

  it('renders the revoked job proposals', async () => {
    const proposals = buildJobProposals()

    renderWithRouter(<JobProposalsCard proposals={proposals} />)

    userEvent.click(getByRole('tab', { name: /revoked/i }))

    const rows = await findAllByRole('row')
    expect(rows).toHaveLength(2)
  })
})
