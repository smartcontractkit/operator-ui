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

// buildAptosKey builds a Aptos Key for the FetchNonEVMKeys query.
export function buildSuiKey(
  overrides?: Partial<SuiKeysPayload_ResultsFields>,
): SuiKeysPayload_ResultsFields {
  return {
    __typename: 'SuiKey',
    id: 'aa67b61969793d51a3008cffba147bf57f1c89c423e32ce93ec9471d21e4231d',
    account: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    ...overrides,
  }
}

// buildAptosKeys builds a list of aptos keys.
export function buildSuiKeys(): ReadonlyArray<SuiKeysPayload_ResultsFields> {
  return [
    buildSuiKey({
      id: 'aa67b61969793d51a3008cffba147bf57f1c89c423e32ce93ec9471d21e4231d',
      account:
        'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    }),
    buildSuiKey({
      id: 'e09c2e1444322d91cfb9b8576ce5895e54dc5caef37c5aff4accca9272412f5b',
      account:
        'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    }),
  ]
}

// buildStellarKey builds a Stellar Key for the FetchNonEVMKeys query.
//
// `id` and `account` are deliberately the same value: a Stellar account is the
// StrKey ("G...") encoding of the ed25519 public key, and the node's key ID is
// that same address.
export function buildStellarKey(
  overrides?: Partial<StellarKeysPayload_ResultsFields>,
): StellarKeysPayload_ResultsFields {
  const account = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H'

  return {
    __typename: 'StellarKey',
    id: account,
    account,
    ...overrides,
  }
}

// buildStellarKeys builds a list of stellar keys.
export function buildStellarKeys(): ReadonlyArray<StellarKeysPayload_ResultsFields> {
  return [
    buildStellarKey(),
    buildStellarKey({
      id: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
      account: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    }),
  ]
}
