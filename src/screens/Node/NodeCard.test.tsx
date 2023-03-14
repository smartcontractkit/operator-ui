import * as React from 'react'

import { render, screen } from 'support/test-utils'

import { NodeCard } from './NodeCard'
import { buildNodePayloadFields } from 'support/factories/gql/fetchNode'

const { queryByText } = screen

describe('NodeCard', () => {
  function renderComponent(node: NodePayload_Fields) {
    render(<NodeCard node={node} />)
  }

  it('renders a node', () => {
    const node = buildNodePayloadFields()

    renderComponent(node)

    expect(queryByText(node.chain.id)).toBeInTheDocument()
    expect(queryByText(node.httpURL)).toBeInTheDocument()
    expect(queryByText(node.wsURL)).toBeInTheDocument()
  })
})
