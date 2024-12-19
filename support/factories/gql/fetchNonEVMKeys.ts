// buildAptosKey builds a Aptos Key for the FetchNonEVMKeys query.
export function buildAptosKey(
  overrides?: Partial<AptosKeysPayload_ResultsFields>,
): AptosKeysPayload_ResultsFields {
  return {
    __typename: 'AptosKey',
    id: 'aa67b61969793d51a3008cffba147bf57f1c89c423e32ce93ec9471d21e4231d',
    account: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    ...overrides,
  }
}

// buildAptosKeys builds a list of aptos keys.
export function buildAptosKeys(): ReadonlyArray<AptosKeysPayload_ResultsFields> {
  return [
    buildAptosKey({
      id: 'aa67b61969793d51a3008cffba147bf57f1c89c423e32ce93ec9471d21e4231d',
      account:
        'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    }),
    buildAptosKey({
      id: 'e09c2e1444322d91cfb9b8576ce5895e54dc5caef37c5aff4accca9272412f5b',
      account:
        'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    }),
  ]
}
