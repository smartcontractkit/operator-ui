import * as React from 'react'
import { render, screen, waitFor, within } from 'support/test-utils'
import userEvent from '@testing-library/user-event'

import {
  buildJobProposal,
  buildJobProposalSpec,
} from 'support/factories/gql/fetchJobProposal'

import { SpecsView } from './SpecsView'

const { findByRole, getByRole, getByTestId, queryByText } = screen

describe('SpecsView', () => {
  let handleUpdateSpec: jest.Mock
  let handleApprove: jest.Mock
  let handleCancel: jest.Mock
  let handleReject: jest.Mock

  function renderComponent(
    specs: ReadonlyArray<JobProposal_SpecsFields>,
    proposal: JobProposalPayloadFields,
  ) {
    render(
      <SpecsView
        specs={specs}
        proposal={proposal}
        onUpdateSpec={handleUpdateSpec}
        onApprove={handleApprove}
        onCancel={handleCancel}
        onReject={handleReject}
      />,
    )
  }

  beforeEach(() => {
    handleUpdateSpec = jest.fn()
    handleApprove = jest.fn()
    handleCancel = jest.fn()
    handleReject = jest.fn()
  })

  describe('pending proposal', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      proposal = buildJobProposal({ status: 'PENDING' })
      specs = [buildJobProposalSpec({ status: 'PENDING' })]
    })

    it('renders a pending job proposal', async () => {
      renderComponent(specs, proposal)

      expect(getByTestId('codeblock')).toHaveTextContent(specs[0].definition)
      expect(queryByText(/edit/i)).toBeInTheDocument()
    })

    it('approves the proposal', async () => {
      renderComponent(specs, proposal)

      userEvent.click(getByRole('button', { name: /approve/i }))
      userEvent.click(getByRole('button', { name: /confirm/i }))
      await waitFor(() => expect(handleApprove).toHaveBeenCalled())
    })

    it('rejects the proposal', async () => {
      renderComponent(specs, proposal)

      userEvent.click(getByRole('button', { name: /reject/i }))
      userEvent.click(getByRole('button', { name: /confirm/i }))
      await waitFor(() => expect(handleReject).toHaveBeenCalled())
    })

    it('updates the spec', async () => {
      renderComponent(specs, proposal)

      userEvent.click(getByRole('button', { name: /edit/i }))

      expect(await findByRole('heading', { name: /edit job spec/i }))

      userEvent.click(getByRole('button', { name: /submit/i }))

      await waitFor(() => expect(handleUpdateSpec).toHaveBeenCalled())
    })
  })

  describe('approved proposal', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      proposal = buildJobProposal({ status: 'APPROVED' })
      specs = [buildJobProposalSpec({ status: 'APPROVED' })]
    })

    it('renders an approved job proposal', async () => {
      renderComponent(specs, proposal)

      expect(getByTestId('codeblock')).toHaveTextContent(specs[0].definition)
      expect(queryByText(/edit/i)).toBeNull()
    })

    it('cancels the proposal', async () => {
      renderComponent(specs, proposal)

      userEvent.click(getByRole('button', { name: /cancel/i }))
      userEvent.click(getByRole('button', { name: /confirm/i }))
      await waitFor(() => expect(handleCancel).toHaveBeenCalled())
    })
  })

  describe('cancelled proposal', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      proposal = buildJobProposal({ status: 'CANCELLED' })
      specs = [buildJobProposalSpec({ status: 'CANCELLED' })]
    })

    it('renders a cancelled job proposal', async () => {
      renderComponent(specs, proposal)

      expect(getByTestId('codeblock')).toHaveTextContent(specs[0].definition)
      expect(queryByText(/edit/i)).toBeInTheDocument()
    })

    it('approves the proposal', async () => {
      renderComponent(specs, proposal)

      userEvent.click(getByRole('button', { name: /approve/i }))
      userEvent.click(getByRole('button', { name: /confirm/i }))
      await waitFor(() => expect(handleApprove).toHaveBeenCalled())
    })

    it('updates the spec', async () => {
      renderComponent(specs, proposal)

      userEvent.click(getByRole('button', { name: /edit/i }))

      expect(await findByRole('heading', { name: /edit job spec/i }))

      userEvent.click(getByRole('button', { name: /submit/i }))

      await waitFor(() => expect(handleUpdateSpec).toHaveBeenCalled())
    })
  })

  describe('rejected proposal', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      proposal = buildJobProposal({ status: 'REJECTED' })
      specs = [buildJobProposalSpec({ status: 'REJECTED' })]
    })

    it('renders a rejected job proposal', async () => {
      renderComponent(specs, proposal)

      expect(getByTestId('codeblock')).toHaveTextContent(specs[0].definition)
      expect(queryByText(/edit/i)).toBeNull()
    })
  })

  describe('deleted proposal with approved spec', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      proposal = buildJobProposal({ status: 'DELETED' })
      specs = [buildJobProposalSpec({ status: 'APPROVED' })]
    })

    it('renders a deleted job proposal', async () => {
      renderComponent(specs, proposal)

      expect(getByTestId('codeblock')).toHaveTextContent(specs[0].definition)
      expect(queryByText(/edit/i)).toBeNull()
    })

    it('cancels the proposal', async () => {
      renderComponent(specs, proposal)

      userEvent.click(getByRole('button', { name: /cancel/i }))
      userEvent.click(getByRole('button', { name: /confirm/i }))
      await waitFor(() => expect(handleCancel).toHaveBeenCalled())
    })
  })

  describe('deleted proposal with cancelled spec', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      proposal = buildJobProposal({ status: 'DELETED' })
      specs = [buildJobProposalSpec({ status: 'CANCELLED' })]
    })

    it('renders a deleted job proposal', async () => {
      renderComponent(specs, proposal)

      expect(getByTestId('codeblock')).toHaveTextContent(specs[0].definition)
      expect(queryByText(/edit/i)).toBeNull()
      expect(queryByText('Cancel')).not.toBeInTheDocument()
    })
  })

  describe('deleted proposal with rejected spec', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      proposal = buildJobProposal({ status: 'DELETED' })
      specs = [buildJobProposalSpec({ status: 'REJECTED' })]
    })

    it('renders a deleted job proposal', async () => {
      renderComponent(specs, proposal)

      expect(getByTestId('codeblock')).toHaveTextContent(specs[0].definition)
      expect(queryByText(/edit/i)).toBeNull()
      expect(queryByText('Cancel')).not.toBeInTheDocument()
    })
  })

  describe('deleted proposal with pending spec', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      proposal = buildJobProposal({ status: 'DELETED' })
      specs = [buildJobProposalSpec({ status: 'PENDING' })]
    })

    it('renders a deleted job proposal', async () => {
      renderComponent(specs, proposal)

      expect(getByTestId('codeblock')).toHaveTextContent(specs[0].definition)
      expect(queryByText(/edit/i)).toBeNull()
      expect(queryByText('Cancel')).not.toBeInTheDocument()
    })
  })

  describe('revoked proposal with pending spec', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      proposal = buildJobProposal({ status: 'REVOKED' })
      specs = [buildJobProposalSpec({ status: 'PENDING' })]
    })

    it('renders a revoked job proposal', async () => {
      renderComponent(specs, proposal)

      expect(getByTestId('codeblock')).toHaveTextContent(specs[0].definition)
      expect(queryByText(/edit/i)).toBeNull()
      expect(queryByText('Cancel')).not.toBeInTheDocument()
    })
  })

  describe('Approve button', () => {
    let specs: ReadonlyArray<JobProposal_SpecsFields>
    let proposal: JobProposalPayloadFields

    beforeEach(() => {
      specs = [
        buildJobProposalSpec({ id: '106', version: 6, status: 'CANCELLED' }),
        buildJobProposalSpec({ id: '105', version: 5, status: 'PENDING' }),
        buildJobProposalSpec({ id: '104', version: 4, status: 'CANCELLED' }),
        buildJobProposalSpec({ id: '103', version: 3, status: 'CANCELLED' }),
        buildJobProposalSpec({ id: '102', version: 2, status: 'APPROVED' }),
        buildJobProposalSpec({ id: '101', version: 1, status: 'REVOKED' }),
      ]
    })

    it('is visible in latest two cancelled specs if proposal is not deleted or revoked', async () => {
      proposal = buildJobProposal({ status: 'PENDING' })
      renderComponent(specs, proposal)

      const panels = screen.getAllByTestId('expansion-panel')
      expect(panels).toHaveLength(6)
      expect(
        within(panels[0]).queryByRole('button', {
          name: 'Approve',
          hidden: false,
        }),
      ).toBeInTheDocument()
      expect(
        within(panels[1]).queryByRole('button', {
          name: 'Approve',
          hidden: true,
        }),
      ).not.toBeInTheDocument()
      expect(
        within(panels[2]).queryByRole('button', {
          name: 'Approve',
          hidden: true,
        }),
      ).toBeInTheDocument()
      expect(
        within(panels[3]).queryByRole('button', {
          name: 'Approve',
          hidden: true,
        }),
      ).not.toBeInTheDocument()
      expect(
        within(panels[4]).queryByRole('button', {
          name: 'Approve',
          hidden: true,
        }),
      ).not.toBeInTheDocument()
      expect(
        within(panels[5]).queryByRole('button', {
          name: 'Approve',
          hidden: true,
        }),
      ).not.toBeInTheDocument()
    })

    it('is visible in latest pending spec if proposal is not deleted or revoked', async () => {
      specs = [
        buildJobProposalSpec({ id: '103', version: 3, status: 'PENDING' }),
        buildJobProposalSpec({ id: '102', version: 2, status: 'PENDING' }),
        buildJobProposalSpec({ id: '101', version: 1, status: 'CANCELLED' }),
      ]
      proposal = buildJobProposal({ status: 'PENDING' })
      renderComponent(specs, proposal)

      const panels = screen.getAllByTestId('expansion-panel')
      expect(panels).toHaveLength(3)
      expect(
        within(panels[0]).queryByRole('button', {
          name: 'Approve',
          hidden: false,
        }),
      ).toBeInTheDocument()
      expect(
        within(panels[1]).queryByRole('button', {
          name: 'Approve',
          hidden: true,
        }),
      ).not.toBeInTheDocument()
      expect(
        within(panels[2]).queryByRole('button', {
          name: 'Approve',
          hidden: true,
        }),
      ).toBeInTheDocument()
    })

    it('is not visible in any specs if proposal is deleted', async () => {
      proposal = buildJobProposal({ status: 'DELETED' })
      renderComponent(specs, proposal)

      const panels = screen.getAllByTestId('expansion-panel')
      expect(panels).toHaveLength(6)
      expect(
        screen.queryByRole('button', { name: 'Approve', hidden: false }),
      ).not.toBeInTheDocument()
    })

    it('is not visible in any specs if proposal is revoked', async () => {
      proposal = buildJobProposal({ status: 'REVOKED' })
      renderComponent(specs, proposal)

      const panels = screen.getAllByTestId('expansion-panel')
      expect(panels).toHaveLength(6)
      expect(
        screen.queryByRole('button', { name: 'Approve', hidden: false }),
      ).not.toBeInTheDocument()
    })

    it('is visible with single pending job', async () => {
      proposal = buildJobProposal({ status: 'PENDING' })
      specs = [
        buildJobProposalSpec({ id: '101', version: 1, status: 'PENDING' }),
      ]
      renderComponent(specs, proposal)

      const panels = screen.getAllByTestId('expansion-panel')
      expect(panels).toHaveLength(1)
      expect(
        within(panels[0]).queryByRole('button', {
          name: 'Approve',
          hidden: false,
        }),
      ).toBeInTheDocument()
    })

    it('is visible with single cancelled job', async () => {
      proposal = buildJobProposal({ status: 'PENDING' })
      specs = [
        buildJobProposalSpec({ id: '101', version: 1, status: 'CANCELLED' }),
      ]
      renderComponent(specs, proposal)

      const panels = screen.getAllByTestId('expansion-panel')
      expect(panels).toHaveLength(1)
      expect(
        within(panels[0]).queryByRole('button', {
          name: 'Approve',
          hidden: false,
        }),
      ).toBeInTheDocument()
    })
  })
})
