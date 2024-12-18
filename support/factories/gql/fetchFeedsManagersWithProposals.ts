import isoDate, { MINUTE_MS } from 'test-helpers/isoDate'

// buildFeedsManagerResultFields is a convenience function to construct a result
// with default build values.
export function buildFeedsManagerResultFields(): FeedsManagerPayload_ResultsFields {
  return {
    ...buildFeedsManagerFields(),
    jobProposals: buildJobProposals(),
  }
}

// buildFeedsManagerFields builds the feeds manager fields for a
// FetchFeedsManagersWithProposals query.
export function buildFeedsManagerFields(
  overrides?: Partial<FeedsManagerFields>,
): FeedsManagerFields {
  return {
    __typename: 'FeedsManager',
    id: '1',
    name: 'Chainlink Feeds Manager',
    uri: 'localhost:8080',
    publicKey: '1111',
    isConnectionActive: false,
    disabledAt: new Date(),
    chainConfigs: [],
    ...overrides,
  }
}

// buildPendingJobProposal builds an pending job proposal.
export function buildPendingJobProposal(
  overrides?: Partial<FeedsManager_JobProposalsFields>,
): FeedsManager_JobProposalsFields {
  const minuteAgo = isoDate(Date.now() - MINUTE_MS)

  return {
    id: '100',
    name: 'LINK / USD | OCR1 | contract 0x961924A4d9B3538e8CfB0e85dbEcD5B19EC34d39',
    remoteUUID: '00000000-0000-0000-0000-000000000001',
    status: 'PENDING',
    pendingUpdate: false,
    latestSpec: {
      createdAt: minuteAgo,
      version: 1,
    },
    ...overrides,
  }
}

// buildApprovedJobProposal builds an approved job proposal.
export function buildApprovedJobProposal(
  overrides?: Partial<FeedsManager_JobProposalsFields>,
): FeedsManager_JobProposalsFields {
  const minuteAgo = isoDate(Date.now() - MINUTE_MS)

  return {
    id: '200',
    name: 'LINK / USD | OCR1 | contract 0x961924A4d9B3538e8CfB0e85dbEcD5B19EC34d39',
    remoteUUID: '00000000-0000-0000-0000-000000000002',
    externalJobID: '00000000-0000-0000-0000-000000000002',
    status: 'APPROVED',
    pendingUpdate: false,
    latestSpec: {
      createdAt: minuteAgo,
      version: 1,
    },
    ...overrides,
  }
}

// buildRejectedJobProposal builds an rejected job proposal.
export function buildRejectedJobProposal(
  overrides?: Partial<FeedsManager_JobProposalsFields>,
): FeedsManager_JobProposalsFields {
  const minuteAgo = isoDate(Date.now() - MINUTE_MS)

  return {
    id: '300',
    name: 'LINK / USD | OCR1 | contract 0x961924A4d9B3538e8CfB0e85dbEcD5B19EC34d39',
    remoteUUID: '00000000-0000-0000-0000-000000000003',
    status: 'REJECTED',
    pendingUpdate: false,
    latestSpec: {
      createdAt: minuteAgo,
      version: 1,
    },
    ...overrides,
  }
}

// buildCancelledJobProposal builds an cancelled job proposal.
export function buildCancelledJobProposal(
  overrides?: Partial<FeedsManager_JobProposalsFields>,
): FeedsManager_JobProposalsFields {
  const minuteAgo = isoDate(Date.now() - MINUTE_MS)

  return {
    id: '400',
    name: 'LINK / USD | OCR1 | contract 0x961924A4d9B3538e8CfB0e85dbEcD5B19EC34d39',
    remoteUUID: '00000000-0000-0000-0000-000000000004',
    status: 'CANCELLED',
    pendingUpdate: false,
    latestSpec: {
      createdAt: minuteAgo,
      version: 1,
    },
    ...overrides,
  }
}

// buildDeletedJobProposal builds an cancelled job proposal.
export function buildDeletedJobProposal(
  overrides?: Partial<FeedsManager_JobProposalsFields>,
): FeedsManager_JobProposalsFields {
  const minuteAgo = isoDate(Date.now() - MINUTE_MS)

  return {
    id: '400',
    remoteUUID: '00000000-0000-0000-0000-000000000004',
    status: 'DELETED',
    pendingUpdate: true,
    latestSpec: {
      createdAt: minuteAgo,
      version: 1,
    },
    ...overrides,
  }
}

// buildRevokedJobProposal builds an cancelled job proposal.
export function buildRevokedJobProposal(
  overrides?: Partial<FeedsManager_JobProposalsFields>,
): FeedsManager_JobProposalsFields {
  const minuteAgo = isoDate(Date.now() - MINUTE_MS)

  return {
    id: '400',
    remoteUUID: '00000000-0000-0000-0000-000000000004',
    status: 'REVOKED',
    pendingUpdate: false,
    latestSpec: {
      createdAt: minuteAgo,
      version: 1,
    },
    ...overrides,
  }
}

// buildJobProposals builds a list of job proposals each containing a different
// status for a FetchFeedsManagersWithProposals query
export function buildJobProposals(): FeedsManager_JobProposalsFields[] {
  return [
    buildPendingJobProposal(),
    buildApprovedJobProposal(),
    buildRejectedJobProposal(),
    buildCancelledJobProposal(),
    buildDeletedJobProposal(),
    buildRevokedJobProposal(),
  ]
}
