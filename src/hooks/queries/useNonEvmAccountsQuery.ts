import { gql, QueryHookOptions, useQuery } from '@apollo/client'

export const APTOS_KEYS_PAYLOAD__RESULTS_FIELDS = gql`
  fragment AptosKeysPayload_ResultsFields on AptosKey {
    account
    id
  }
`

export const SOLANA_KEYS_PAYLOAD__RESULTS_FIELDS = gql`
  fragment SolanaKeysPayload_ResultsFields on SolanaKey {
    id
  }
`

export const NON_EVM_KEYS_QUERY = gql`
  ${APTOS_KEYS_PAYLOAD__RESULTS_FIELDS}
  ${SOLANA_KEYS_PAYLOAD__RESULTS_FIELDS}
  query FetchNonEvmKeys {
    aptosKeys {
      results {
        ...AptosKeysPayload_ResultsFields
      }
    }
    solanaKeys {
      results {
        ...SolanaKeysPayload_ResultsFields
      }
    }
  }
`

// useNonEvmAccountsQuery fetches the non evm accounts.
export const useNonEvmAccountsQuery = (opts: QueryHookOptions = {}) => {
  return useQuery<FetchNonEvmKeys>(NON_EVM_KEYS_QUERY, opts)
}
