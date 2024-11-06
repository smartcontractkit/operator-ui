import TOML from '@iarna/toml'
import pick from 'lodash/pick'

export interface JobDefinition {
  definition: string
}

// Extracts fields from the job that are common to all specs.
const extractJobFields = (job: JobPayload_Fields, ...otherKeys: string[]) => {
  return pick(
    job,
    'type',
    'schemaVersion',
    'name',
    'externalJobID',
    'gasLimit',
    'forwardingAllowed',
    ...otherKeys,
  )
}

// Extracts the observation source from the job
const extractObservationSourceField = ({
  observationSource,
}: JobPayload_Fields) => {
  return {
    observationSource: observationSource === '' ? null : observationSource,
  }
}

// Extracts the fields matching the keys from the spec.
const extractSpecFields = <T extends object, K extends keyof T>(
  spec: T,
  ...keys: K[]
) => {
  return pick(spec, ...keys)
}

// Stringifies the job spec as TOML
const toTOMLString = (value: { [key: string]: any }) => {
  try {
    return TOML.stringify(value)
  } catch (e) {
    console.error(`Failed to stringify job spec with the following error: ${e}`)
    return ''
  }
}

export const generateJobDefinition = (
  job: JobPayload_Fields,
): JobDefinition => {
  let values: object = {}

  switch (job.spec.__typename) {
    case 'CronSpec':
      values = {
        ...extractJobFields(job, 'maxTaskDuration'),
        ...extractSpecFields(job.spec, 'schedule', 'evmChainID'),
        ...extractObservationSourceField(job),
      }

      break
    case 'DirectRequestSpec':
      values = {
        ...extractJobFields(job, 'maxTaskDuration'),
        ...extractSpecFields(
          job.spec,
          'contractAddress',
          'evmChainID',
          'minIncomingConfirmations',
          'minContractPaymentLinkJuels',
          'requesters',
        ),
        ...extractObservationSourceField(job),
      }

      break
    case 'FluxMonitorSpec':
      values = {
        ...extractJobFields(job, 'maxTaskDuration'),
        ...extractSpecFields(
          job.spec,
          'absoluteThreshold',
          'contractAddress',
          'drumbeatEnabled',
          'drumbeatSchedule',
          'drumbeatRandomDelay',
          'evmChainID',
          'idleTimerPeriod',
          'idleTimerDisabled',
          'minPayment',
          'pollTimerPeriod',
          'pollTimerDisabled',
          'threshold',
        ),
        ...extractObservationSourceField(job),
      }

      break
    case 'KeeperSpec':
      values = {
        ...extractJobFields(job),
        ...extractSpecFields(
          job.spec,
          'contractAddress',
          'evmChainID',
          'fromAddress',
        ),
        ...extractObservationSourceField(job),
      }

      break
    case 'OCRSpec':
      values = {
        ...extractJobFields(job, 'maxTaskDuration'),
        ...extractSpecFields(
          job.spec,
          'blockchainTimeout',
          'contractAddress',
          'contractConfigConfirmations',
          'contractConfigTrackerPollInterval',
          'contractConfigTrackerSubscribeInterval',
          'evmChainID',
          'isBootstrapPeer',
          'keyBundleID',
          'observationTimeout',
          'p2pv2Bootstrappers',
          'transmitterAddress',
        ),
        ...extractObservationSourceField(job),
      }

      break
    case 'OCR2Spec':
      values = {
        ...extractJobFields(job, 'maxTaskDuration'),
        ...extractSpecFields(
          job.spec,
          'blockchainTimeout',
          'contractID',
          'contractConfigConfirmations',
          'contractConfigTrackerPollInterval',
          'ocrKeyBundleID',
          'monitoringEndpoint',
          'p2pv2Bootstrappers',
          'relay',
          'relayConfig',
          'pluginType',
          'pluginConfig',
          'feedID',
        ),
        // We need to call 'extractSpecFields' again here so we get the spec
        // fields displaying in alphabetical order.
        ...extractSpecFields(job.spec, 'transmitterID'),
        ...extractObservationSourceField(job),
      }

      break
    case 'VRFSpec':
      values = {
        ...extractJobFields(job),
        ...extractSpecFields(
          job.spec,
          'coordinatorAddress',
          'evmChainID',
          'fromAddresses',
          'minIncomingConfirmations',
          'pollPeriod',
          'publicKey',
          'requestedConfsDelay',
          'requestTimeout',
          'batchCoordinatorAddress',
          'batchFulfillmentEnabled',
          'batchFulfillmentGasMultiplier',
          'chunkSize',
          'backoffInitialDelay',
          'backoffMaxDelay',
          'gasLanePrice',
          'vrfOwnerAddress',
        ),
        ...extractObservationSourceField(job),
      }

      break

    case 'BlockhashStoreSpec':
      values = {
        ...extractJobFields(job),
        ...extractSpecFields(
          job.spec,
          'coordinatorV1Address',
          'coordinatorV2Address',
          'coordinatorV2PlusAddress',
          'waitBlocks',
          'lookbackBlocks',
          'blockhashStoreAddress',
          'trustedBlockhashStoreAddress',
          'trustedBlockhashStoreBatchSize',
          'pollPeriod',
          'runTimeout',
          'evmChainID',
          'fromAddresses',
        ),
        ...extractObservationSourceField(job),
      }

      break
    case 'BlockHeaderFeederSpec':
      values = {
        ...extractJobFields(job),
        ...extractSpecFields(
          job.spec,
          'coordinatorV1Address',
          'coordinatorV2Address',
          'coordinatorV2PlusAddress',
          'waitBlocks',
          'lookbackBlocks',
          'blockhashStoreAddress',
          'batchBlockhashStoreAddress',
          'pollPeriod',
          'runTimeout',
          'evmChainID',
          'fromAddresses',
          'getBlockhashesBatchSize',
          'storeBlockhashesBatchSize',
        ),
        ...extractObservationSourceField(job),
      }
      break

    case 'BootstrapSpec':
      values = {
        ...extractJobFields(job),
        ...extractSpecFields(
          job.spec,
          'contractID',
          'relay',
          'relayConfig',
          'monitoringEndpoint',
          'blockchainTimeout',
          'contractConfigTrackerPollInterval',
          'contractConfigConfirmations',
        ),
      }

      break

    case 'GatewaySpec':
      values = {
        ...extractJobFields(job),
        ...extractSpecFields(job.spec, 'gatewayConfig'),
      }

      break

    case 'WorkflowSpec':
      values = {
        ...extractJobFields(job),
        ...extractSpecFields(
          job.spec,
          'workflowID',
          'workflow',
          'workflowOwner',
        ),
      }

      break

    case 'StandardCapabilitiesSpec':
      values = {
        ...extractJobFields(job),
        ...extractSpecFields(job.spec, 'command', 'config'),
      }

      break

    case 'WebhookSpec':
      values = {
        ...extractJobFields(job),
        ...extractObservationSourceField(job),
      }

      break

    case 'StreamSpec':
      values = {
        ...extractJobFields(job, 'maxTaskDuration'),
        ...extractSpecFields(job.spec, 'streamID'),
        ...extractObservationSourceField(job),
      }

      break

    default:
      return { definition: '' }
  }

  return {
    definition: toTOMLString(values),
  }
}
