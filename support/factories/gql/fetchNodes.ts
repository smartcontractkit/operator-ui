// buildNode builds a node for the FetchNodes query.
export function buildNode(
  overrides?: Partial<NodesPayload_ResultsFields>,
): NodesPayload_ResultsFields {
  return {
    __typename: 'Node',
    id: '1',
    name: 'node1',
    chain: {
      id: '42',
      network: 'evm',
    },
    state: '',
    sendOnly: false,
    ...overrides,
  }
}

// buildNodes builds a list of nodes.
export function buildNodes(): ReadonlyArray<NodesPayload_ResultsFields> {
  return [
    buildNode({
      id: '1',
      name: 'node1',
      chain: {
        id: '42',
        network: 'evm',
      },
      order: 32,
    }),
    buildNode({
      id: '2',
      name: 'node2',
      chain: {
        id: '5',
        network: 'evm',
      },
    }),
  ]
}
