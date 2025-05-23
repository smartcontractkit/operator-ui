import { gql } from '@apollo/client'
import Grid from '@material-ui/core/Grid'
import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import Button from 'src/components/Button'
import Content from 'src/components/Content'
import { Heading1 } from 'src/components/Heading/Heading1'
import { JobCard } from './JobCard'
import { JobTabs } from './JobTabs'
import { RunJobDialog } from './RunJobDialog'
import { TabDefinition } from './TabDefinition'
import { TabErrors } from './TabErrors'
import { TabOverview } from './TabOverview'
import { TabRuns } from './TabRuns'

const JOB_PAYLOAD__SPEC = gql`
  fragment JobPayload_Spec on JobSpec {
    ... on CronSpec {
      schedule
      evmChainID
    }
    ... on DirectRequestSpec {
      contractAddress
      evmChainID
      minIncomingConfirmations
      minContractPaymentLinkJuels
      requesters
    }
    ... on FluxMonitorSpec {
      absoluteThreshold
      contractAddress
      drumbeatEnabled
      drumbeatRandomDelay
      drumbeatSchedule
      evmChainID
      idleTimerDisabled
      idleTimerPeriod
      minPayment
      pollTimerDisabled
      pollTimerPeriod
      threshold
    }
    ... on KeeperSpec {
      contractAddress
      evmChainID
      fromAddress
    }
    ... on OCRSpec {
      blockchainTimeout
      contractAddress
      contractConfigConfirmations
      contractConfigTrackerPollInterval
      contractConfigTrackerSubscribeInterval
      evmChainID
      isBootstrapPeer
      keyBundleID
      observationTimeout
      p2pv2Bootstrappers
      transmitterAddress
    }
    ... on OCR2Spec {
      blockchainTimeout
      contractID
      contractConfigConfirmations
      contractConfigTrackerPollInterval
      ocrKeyBundleID
      monitoringEndpoint
      p2pv2Bootstrappers
      relay
      relayConfig
      onchainSigningStrategy
      transmitterID
      pluginType
      pluginConfig
      feedID
    }
    ... on VRFSpec {
      evmChainID
      gasLanePrice
      coordinatorAddress
      fromAddresses
      minIncomingConfirmations
      pollPeriod
      publicKey
      requestedConfsDelay
      batchCoordinatorAddress
      batchFulfillmentEnabled
      batchFulfillmentGasMultiplier
      chunkSize
      requestTimeout
      backoffInitialDelay
      backoffMaxDelay
      vrfOwnerAddress
    }
    ... on BlockhashStoreSpec {
      coordinatorV1Address
      coordinatorV2Address
      waitBlocks
      lookbackBlocks
      blockhashStoreAddress
      pollPeriod
      runTimeout
      evmChainID
      fromAddresses
      coordinatorV2PlusAddress
      trustedBlockhashStoreAddress
      trustedBlockhashStoreBatchSize
    }
    ... on BlockHeaderFeederSpec {
      coordinatorV1Address
      coordinatorV2Address
      waitBlocks
      lookbackBlocks
      blockhashStoreAddress
      batchBlockhashStoreAddress
      pollPeriod
      runTimeout
      evmChainID
      fromAddresses
      getBlockhashesBatchSize
      storeBlockhashesBatchSize
      coordinatorV2PlusAddress
    }
    ... on BootstrapSpec {
      contractID
      relay
      monitoringEndpoint
      relayConfig
      blockchainTimeout
      contractConfigTrackerPollInterval
      contractConfigConfirmations
      createdAt
    }
    ... on GatewaySpec {
      gatewayConfig
      createdAt
    }
    ... on WorkflowSpec {
      workflowID
      workflowOwner
      workflow
    }
    ... on StandardCapabilitiesSpec {
      command
      config
      createdAt
    }
    ... on StreamSpec {
      streamID
    }
  }
`

// Defines the fields for the recent runs
export const JOB_PAYLOAD__RUNS_FIELDS = gql`
  fragment JobPayload_RunsFields on JobRun {
    id
    allErrors
    status
    createdAt
    finishedAt
  }
`

// Defines the fields for the errors
export const JOB_PAYLOAD__ERRORS_FIELDS = gql`
  fragment JobPayload_ErrorsFields on JobError {
    description
    occurrences
    createdAt
    updatedAt
  }
`

export const JOB_PAYLOAD_FIELDS = gql`
  ${JOB_PAYLOAD__SPEC}
  ${JOB_PAYLOAD__RUNS_FIELDS}
  ${JOB_PAYLOAD__ERRORS_FIELDS}
  fragment JobPayload_Fields on Job {
    id
    name
    externalJobID
    observationSource
    createdAt
    schemaVersion
    type
    maxTaskDuration
    gasLimit
    forwardingAllowed
    spec {
      __typename
      ...JobPayload_Spec
    }
    runs(offset: $offset, limit: $limit) {
      results {
        ...JobPayload_RunsFields
      }
      metadata {
        total
      }
    }
    errors {
      ...JobPayload_ErrorsFields
    }
  }
`

export interface Props {
  job: JobPayload_Fields
  runsCount: number
  onDelete: () => void
  onRun: (pipelineInput: string) => void
  refetch: (page: number, per: number) => void
  refetchRecentRuns: () => void
}

export const JobView: React.FC<Props> = ({
  job,
  runsCount,
  onDelete,
  onRun,
  refetch,
  refetchRecentRuns,
}) => {
  const { path } = useRouteMatch()
  const [runDialogOpen, setRunDialogOpen] = React.useState(false)

  return (
    <>
      <Content>
        <Grid container spacing={32}>
          <Grid item xs={9}>
            <Heading1>{job.name || '--'}</Heading1>
          </Grid>
          <Grid item xs={3} style={{ textAlign: 'right' }}>
            {job.spec.__typename === 'WebhookSpec' && (
              <Button variant="primary" onClick={() => setRunDialogOpen(true)}>
                Run
              </Button>
            )}
          </Grid>
        </Grid>

        <JobCard job={job} onDelete={onDelete} />
        <JobTabs
          id={job.id}
          errorsCount={job.errors.length}
          runsCount={runsCount}
          refetchRecentRuns={refetchRecentRuns}
        />

        <Switch>
          <Route path={`${path}/definition`}>
            <TabDefinition job={job} />
          </Route>
          <Route exact path={`${path}/errors`}>
            <TabErrors job={job} />
          </Route>
          <Route exact path={`${path}/runs`}>
            <TabRuns job={job} fetchMore={refetch} />
          </Route>
          <Route exact path={path}>
            <TabOverview job={job} />
          </Route>
        </Switch>
      </Content>

      <RunJobDialog
        open={runDialogOpen}
        onClose={() => setRunDialogOpen(false)}
        onRun={onRun}
      />
    </>
  )
}
