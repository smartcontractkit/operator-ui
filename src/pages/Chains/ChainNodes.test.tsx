import * as React from 'react'
import { ChainResource } from './Show'
import { renderWithRouter, screen } from 'support/test-utils'
import { ChainNodes, NodeResource } from './ChainNodes'
const { queryByText } = screen

function renderComponent(n: NodeResource[], c: ChainResource) {
  renderWithRouter(<ChainNodes nodes={n} chain={c} />)
}

const nodes: Array<NodeResource> = [
  {
    id: '1',
    type: 'type',
    attributes: {
      name: 'Node1',
      chainID: '123',
      httpURL: 'http-url-node1',
      wsURL: 'ws-url-node1',
      createdAt: 'some date',
      updatedAt: 'some date',
      state: 'alive',
    },
  },
  {
    id: '2',
    type: 'type',
    attributes: {
      name: 'Node2',
      chainID: '1234',
      httpURL: 'http-url-node2',
      wsURL: 'ws-url-node2',
      createdAt: 'some date',
      updatedAt: 'some date',
      state: 'dead',
    },
  },
]

const chain1: ChainResource = {
  id: '123',
  type: 'type',
  attributes: {
    // @ts-ignore config not important for this test
    config: 'config',
    enabled: true,
    createdAt: 'some date',
    updatedAt: 'some date',
  },
}

const chain2: ChainResource = {
  id: '1234',
  type: 'type',
  attributes: {
    // @ts-ignore config not important for this test
    config: 'config',
    enabled: true,
    createdAt: 'some date',
    updatedAt: 'some date',
  },
}

describe('ChainNodes', () => {
  it('renders nodes for chainID 123', () => {
    renderComponent(nodes, chain1)

    expect(queryByText('Node1')).toBeInTheDocument()
    expect(queryByText('123')).toBeInTheDocument()
    expect(queryByText('alive')).toBeInTheDocument()
  })

  it('renders nodes for chainID 1234', () => {
    renderComponent(nodes, chain2)

    expect(queryByText('Node2')).toBeInTheDocument()
    expect(queryByText('1234')).toBeInTheDocument()
    expect(queryByText('dead')).toBeInTheDocument()
  })
})
