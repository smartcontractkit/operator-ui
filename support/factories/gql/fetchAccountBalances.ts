// buildETHKey builds a eth key for the FetchETHKeys query.
export function buildETHKey(
  overrides?: Partial<AccountBalancesPayload_ResultsFields>,
): AccountBalancesPayload_ResultsFields {
  return {
    __typename: 'EthKey',
    address: '0x0000000000000000000000000000000000000001',
    chain: {
      __typename: 'Chain',
      id: '42',
      network: 'evm',
    },
    ethBalance: '0.100000000000000000',
    isDisabled: false,
    linkBalance: '1000000000000000000',
    ...overrides,
  }
}

// buildETHKeys builds a list of eth keys.
export function buildETHKeys(): ReadonlyArray<AccountBalancesPayload_ResultsFields> {
  return [
    buildETHKey(),
    buildETHKey({
      address: '0x0000000000000000000000000000000000000002',
    }),
  ]
}
