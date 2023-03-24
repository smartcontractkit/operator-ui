// buildNodePayloadFields builds the node fields.
export function buildNodePayloadFields(
  overrides?: Partial<NodePayload_Fields>,
): NodePayload_Fields {
  return {
    __typename: 'Node',
    id: '1',
    name: 'node1',
    httpURL: 'https://node1.com',
    wsURL: 'wss://node1.com',
    chain: {
      id: '42',
    },
    state: '',
    sendOnly: false,
    ...overrides,
  }
}
