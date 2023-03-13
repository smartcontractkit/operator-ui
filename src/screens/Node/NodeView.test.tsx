import React from 'react'

import { render, screen } from 'test-utils'

import { NodeView } from './NodeView'
import { buildNodePayloadFields } from 'support/factories/gql/fetchNode'

const { getByRole } = screen

describe('NodeView', () => {
  function renderComponent(node: NodePayload_Fields) {
    render(<NodeView node={node} />)
  }

  it('renders the view', async () => {
    const node = buildNodePayloadFields()
    renderComponent(node)

    expect(getByRole('heading', { name: node.name })).toBeInTheDocument()
  })
})
