// buildFeedsManager builds a feeds manager for the FetchFeedsManagers query.
export function buildFeedsManager(
  overrides?: Partial<FetchFeedsManagersPayload_ResultsFields>,
): FetchFeedsManagersPayload_ResultsFields {
  return {
    __typename: 'FeedsManager',
    id: '1',
    name: 'Chainlink Feeds Manager',
    uri: 'localhost:8080',
    publicKey: '1111',
    isConnectionActive: false,
    createdAt: new Date(),
    disabledAt: new Date(),
    ...overrides,
  }
}
