// buildChains builds a chain for the FetchChains query.
export function buildChain(
  overrides?: Partial<ChainsPayload_ResultsFields>,
): ChainsPayload_ResultsFields {
  return {
    __typename: 'Chain',
    id: '5',
    enabled: true,
    ...overrides,
  }
}

// buildsChains builds a list of chains.
export function buildChains(): ReadonlyArray<ChainsPayload_ResultsFields> {
  return [
    buildChain({
      id: '5',
      enabled: true,
    }),
    buildChain({
      id: '42',
      enabled: true,
    }),
  ]
}
