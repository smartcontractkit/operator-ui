import * as React from 'react'

import { Route } from 'react-router-dom'
import { renderWithRouter, screen } from 'support/test-utils'
import userEvent from '@testing-library/user-event'

import { NodeRow } from './NodeRow'
import { buildNode } from 'support/factories/gql/fetchNodes'

const { findByText, getByRole, queryByText } = screen

function renderComponent(node: NodesPayload_ResultsFields) {
  renderWithRouter(
    <>
      <Route exact path="/">
        <table>
          <tbody>
            <NodeRow node={node} />
          </tbody>
        </table>
      </Route>
      <Route exact path="/nodes/:id">
        Link Success
      </Route>
    </>,
  )
}

describe('NodeRow', () => {
  it('renders the row', () => {
    const node = buildNode()

    renderComponent(node)

    expect(queryByText('node1')).toBeInTheDocument()
    expect(queryByText('42')).toBeInTheDocument()
  })

  it('links to the row details', async () => {
    const node = buildNode()

    renderComponent(node)

    const link = getByRole('link', { name: /1/i })
    expect(link).toHaveAttribute('href', '/nodes/node1')

    userEvent.click(link)

    expect(await findByText('Link Success')).toBeInTheDocument()
  })
})
