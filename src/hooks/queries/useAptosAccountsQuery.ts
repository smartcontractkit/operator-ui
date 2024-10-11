import { gql, QueryHookOptions, useQuery } from '@apollo/client'

export const APTOS_KEYS_PAYLOAD__RESULTS_FIELDS = gql`
  fragment AptosKeysPayload_ResultsFields on AptosKey {
    account
    id
  }
`

export const APTOS_KEYS_QUERY = gql`
  ${APTOS_KEYS_PAYLOAD__RESULTS_FIELDS}
  query FetchAptosKeys {
    aptosKeys {
      results {
        ...AptosKeysPayload_ResultsFields
      }
    }
  }
`

// useAptosAccountsQuery fetches the Aptos accounts.
export const useAptosAccountsQuery = (opts: QueryHookOptions = {}) => {
  return useQuery<FetchAptosKeys>(APTOS_KEYS_QUERY, opts)
}
