import { gql, QueryHookOptions, useQuery } from '@apollo/client'

export const FEEDS_MANAGERS_QUERY = gql`
  fragment FetchFeedsManagersPayload_ResultsFields on FeedsManager {
    __typename
    id
    name
    uri
    publicKey
    isConnectionActive
    createdAt
    disabledAt
  }
  query FetchFeedsManagers {
    feedsManagers {
      results {
        ...FetchFeedsManagersPayload_ResultsFields
      }
    }
  }
`

export const useFeedsManagersQuery = (
  options?: QueryHookOptions<FetchFeedsManagers>,
) => {
  return useQuery<FetchFeedsManagers>(FEEDS_MANAGERS_QUERY, options)
}
