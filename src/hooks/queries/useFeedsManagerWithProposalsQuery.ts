import { gql, QueryHookOptions, useQuery } from '@apollo/client'

const FEEDS_MANAGER__CHAIN_CONFIG_FIELDS = gql`
  fragment FeedsManager_ChainConfigFields on FeedsManagerChainConfig {
    id
    chainID
    chainType
    accountAddr
    adminAddr
    accountAddrPubKey
    fluxMonitorJobConfig {
      enabled
    }
    ocr1JobConfig {
      enabled
      isBootstrap
      multiaddr
      p2pPeerID
      keyBundleID
    }
    ocr2JobConfig {
      enabled
      isBootstrap
      multiaddr
      forwarderAddress
      p2pPeerID
      keyBundleID
      plugins {
        commit
        execute
        median
        mercury
        rebalancer
      }
    }
  }
`

export const FEEDS_MANAGER_FIELDS = gql`
  ${FEEDS_MANAGER__CHAIN_CONFIG_FIELDS}
  fragment FeedsManagerFields on FeedsManager {
    id
    name
    uri
    publicKey
    isConnectionActive
    chainConfigs {
      ...FeedsManager_ChainConfigFields
    }
  }
`

export const FEEDS_MANAGER__JOB_PROPOSAL_FIELDS = gql`
  fragment FeedsManager_JobProposalsFields on JobProposal {
    id
    name
    externalJobID
    remoteUUID
    status
    pendingUpdate
    latestSpec {
      createdAt
      version
    }
  }
`

export const FEEDS_MANAGER_PAYLOAD__RESULTS_FIELDS = gql`
  ${FEEDS_MANAGER_FIELDS}
  ${FEEDS_MANAGER__JOB_PROPOSAL_FIELDS}
  fragment FeedsManagerPayload_ResultsFields on FeedsManager {
    ...FeedsManagerFields
    jobProposals {
      ...FeedsManager_JobProposalsFields
    }
  }
`

export const FEEDS_MANAGER_WITH_PROPOSALS_QUERY = gql`
  ${FEEDS_MANAGER_PAYLOAD__RESULTS_FIELDS}
  query FetchFeedManagerWithProposals($id: ID!) {
    feedsManager(id: $id) {
      ...FeedsManagerPayload_ResultsFields
      ... on NotFoundError {
        message
        code
      }
    }
  }
`

export const useFeedsManagerWithProposalsQuery = (
  opts: QueryHookOptions<
    FetchFeedManagerWithProposals,
    FetchFeedManagerWithProposalsVariables
  > = {},
) => {
  return useQuery<
    FetchFeedManagerWithProposals,
    FetchFeedManagerWithProposalsVariables
  >(FEEDS_MANAGER_WITH_PROPOSALS_QUERY, opts)
}
