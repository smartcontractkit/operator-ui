import { generateJobDefinition } from './generateJobDefinition'

describe('generateJobDefinition', () => {
  // Defines other job fields which aren't used in the test but is needed to
  // satify the JobPayload_Fields typing.
  const otherJobFields = {
    createdAt: new Date(),
    errors: [],
    runs: {
      results: [],
      metadata: { total: 0 },
    },
  }

  it('generates a valid Cron definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'cron',
      schemaVersion: 1,
      name: 'cron job',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      gasLimit: 1000,
      spec: {
        __typename: 'CronSpec',
        schedule: '*/2 * * * *',
      },
      observationSource:
        '    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\"hi\\": \\"hello\\"}"];\n    parse    [type=jsonparse path="data,result"];\n    multiply [type=multiply times=100];\n    fetch -> parse -> multiply;\n',
      ...otherJobFields,
    }

    const expectedOutput = `type = "cron"
schemaVersion = 1
name = "cron job"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
maxTaskDuration = "10s"
schedule = "*/2 * * * *"
observationSource = """
    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\\\"hi\\\\": \\\\"hello\\\\"}"];
    parse    [type=jsonparse path="data,result"];
    multiply [type=multiply times=100];
    fetch -> parse -> multiply;
"""
`

    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid Direct Request definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'directrequest',
      schemaVersion: 1,
      name: 'direct request job',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      spec: {
        __typename: 'DirectRequestSpec',
        contractAddress: '0x0000000000000000000000000000000000000000',
        evmChainID: '42',
        minIncomingConfirmations: 3,
        minContractPaymentLinkJuels: '100000000000000',
        requesters: ['0x59bbE8CFC79c76857fE0eC27e67E4957370d72B5'],
      },
      observationSource:
        '    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\"hi\\": \\"hello\\"}"];\n    parse    [type=jsonparse path="data,result"];\n    multiply [type=multiply times=100];\n    fetch -> parse -> multiply;\n',
      ...otherJobFields,
    }

    const expectedOutput = `type = "directrequest"
schemaVersion = 1
name = "direct request job"
externalJobID = "00000000-0000-0000-0000-0000000000001"
maxTaskDuration = "10s"
contractAddress = "0x0000000000000000000000000000000000000000"
evmChainID = "42"
minIncomingConfirmations = 3
minContractPaymentLinkJuels = "100000000000000"
requesters = [ "0x59bbE8CFC79c76857fE0eC27e67E4957370d72B5" ]
observationSource = """
    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\\\"hi\\\\": \\\\"hello\\\\"}"];
    parse    [type=jsonparse path="data,result"];
    multiply [type=multiply times=100];
    fetch -> parse -> multiply;
"""
`

    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid Keeper definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'keeper',
      schemaVersion: 1,
      name: 'keeper job',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      gasLimit: 1000,
      forwardingAllowed: false,
      spec: {
        __typename: 'KeeperSpec',
        contractAddress: '0x0000000000000000000000000000000000000000',
        evmChainID: '42',
        fromAddress: '0xa8037A20989AFcBC51798de9762b351D63ff462e',
      },
      observationSource:
        '    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\"hi\\": \\"hello\\"}"];\n    parse    [type=jsonparse path="data,result"];\n    multiply [type=multiply times=100];\n    fetch -> parse -> multiply;\n',
      ...otherJobFields,
    }

    const expectedOutput = `type = "keeper"
schemaVersion = 1
name = "keeper job"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
forwardingAllowed = false
contractAddress = "0x0000000000000000000000000000000000000000"
evmChainID = "42"
fromAddress = "0xa8037A20989AFcBC51798de9762b351D63ff462e"
observationSource = """
    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\\\"hi\\\\": \\\\"hello\\\\"}"];
    parse    [type=jsonparse path="data,result"];
    multiply [type=multiply times=100];
    fetch -> parse -> multiply;
"""
`

    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid Flux Monitor definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'fluxmonitor',
      schemaVersion: 1,
      name: 'flux monitor job',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      gasLimit: 1000,
      spec: {
        __typename: 'FluxMonitorSpec',
        absoluteThreshold: 1,
        contractAddress: '0x0000000000000000000000000000000000000000',
        drumbeatEnabled: true,
        drumbeatSchedule: '@every 10m',
        drumbeatRandomDelay: '10s',
        evmChainID: '42',
        idleTimerDisabled: false,
        idleTimerPeriod: '1s',
        minPayment: '100',
        pollTimerDisabled: false,
        pollTimerPeriod: '1m0s',
        threshold: 0.5,
      },
      observationSource:
        '    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\"hi\\": \\"hello\\"}"];\n    parse    [type=jsonparse path="data,result"];\n    multiply [type=multiply times=100];\n    fetch -> parse -> multiply;\n',
      ...otherJobFields,
    }

    const expectedOutput = `type = "fluxmonitor"
schemaVersion = 1
name = "flux monitor job"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
maxTaskDuration = "10s"
absoluteThreshold = 1
contractAddress = "0x0000000000000000000000000000000000000000"
drumbeatEnabled = true
drumbeatSchedule = "@every 10m"
drumbeatRandomDelay = "10s"
evmChainID = "42"
idleTimerPeriod = "1s"
idleTimerDisabled = false
minPayment = "100"
pollTimerPeriod = "1m0s"
pollTimerDisabled = false
threshold = 0.5
observationSource = """
    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\\\"hi\\\\": \\\\"hello\\\\"}"];
    parse    [type=jsonparse path="data,result"];
    multiply [type=multiply times=100];
    fetch -> parse -> multiply;
"""
`

    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid OCR definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'offchainreporting',
      schemaVersion: 1,
      name: 'ocr job',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      gasLimit: 1000,
      spec: {
        __typename: 'OCRSpec',
        blockchainTimeout: '20s',
        contractAddress: '0x1469877c88F19E273EFC7Ef3C9D944574583B8a0',
        contractConfigConfirmations: 3,
        contractConfigTrackerPollInterval: '1m0s',
        contractConfigTrackerSubscribeInterval: '2m0s',
        evmChainID: '42',
        keyBundleID:
          '4ee612467c3caea7bdab57ab62937adfc4d195516c30139a737f85098b35d9af',
        isBootstrapPeer: false,
        observationTimeout: '10s',
        p2pv2Bootstrappers: [
          '12D3KooWL3XJ9EMCyZvmmGXL2LMiVBtrVa2BuESsJiXkSj7333Jw@localhost:5001',
        ],
        transmitterAddress: '0x01010CaB43e77116c95745D219af1069fE050d7A',
      },
      runs: {
        results: [],
        metadata: { total: 0 },
      },
      observationSource:
        '    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\"hi\\": \\"hello\\"}"];\n    parse    [type=jsonparse path="data,result"];\n    multiply [type=multiply times=100];\n    fetch -> parse -> multiply;\n',
      createdAt: new Date(),
      errors: [],
    }

    const expectedOutput = `type = "offchainreporting"
schemaVersion = 1
name = "ocr job"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
maxTaskDuration = "10s"
blockchainTimeout = "20s"
contractAddress = "0x1469877c88F19E273EFC7Ef3C9D944574583B8a0"
contractConfigConfirmations = 3
contractConfigTrackerPollInterval = "1m0s"
contractConfigTrackerSubscribeInterval = "2m0s"
evmChainID = "42"
isBootstrapPeer = false
keyBundleID = "4ee612467c3caea7bdab57ab62937adfc4d195516c30139a737f85098b35d9af"
observationTimeout = "10s"
p2pv2Bootstrappers = [
  "12D3KooWL3XJ9EMCyZvmmGXL2LMiVBtrVa2BuESsJiXkSj7333Jw@localhost:5001"
]
transmitterAddress = "0x01010CaB43e77116c95745D219af1069fE050d7A"
observationSource = """
    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\\\"hi\\\\": \\\\"hello\\\\"}"];
    parse    [type=jsonparse path="data,result"];
    multiply [type=multiply times=100];
    fetch -> parse -> multiply;
"""
`

    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid OCR Bootstrap definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'offchainreporting',
      schemaVersion: 1,
      name: 'ocr job',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      gasLimit: 1000,
      spec: {
        __typename: 'OCRSpec',
        blockchainTimeout: '20s',
        contractAddress: '0x1469877c88F19E273EFC7Ef3C9D944574583B8a0',
        contractConfigConfirmations: 3,
        contractConfigTrackerPollInterval: '1m0s',
        contractConfigTrackerSubscribeInterval: '2m0s',
        evmChainID: '42',
        isBootstrapPeer: true,
        keyBundleID:
          '4ee612467c3caea7bdab57ab62937adfc4d195516c30139a737f85098b35d9af',
        observationTimeout: '10s',
        p2pv2Bootstrappers: [
          '12D3KooWL3XJ9EMCyZvmmGXL2LMiVBtrVa2BuESsJiXkSj7333Jw@localhost:5001',
        ],
        transmitterAddress: null,
      },
      runs: {
        results: [],
        metadata: { total: 0 },
      },
      observationSource:
        '    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\"hi\\": \\"hello\\"}"];\n    parse    [type=jsonparse path="data,result"];\n    multiply [type=multiply times=100];\n    fetch -> parse -> multiply;\n',
      createdAt: new Date(),
      errors: [],
    }

    const expectedOutput = `type = "offchainreporting"
schemaVersion = 1
name = "ocr job"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
maxTaskDuration = "10s"
blockchainTimeout = "20s"
contractAddress = "0x1469877c88F19E273EFC7Ef3C9D944574583B8a0"
contractConfigConfirmations = 3
contractConfigTrackerPollInterval = "1m0s"
contractConfigTrackerSubscribeInterval = "2m0s"
evmChainID = "42"
isBootstrapPeer = true
keyBundleID = "4ee612467c3caea7bdab57ab62937adfc4d195516c30139a737f85098b35d9af"
observationTimeout = "10s"
p2pv2Bootstrappers = [
  "12D3KooWL3XJ9EMCyZvmmGXL2LMiVBtrVa2BuESsJiXkSj7333Jw@localhost:5001"
]
observationSource = """
    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\\\"hi\\\\": \\\\"hello\\\\"}"];
    parse    [type=jsonparse path="data,result"];
    multiply [type=multiply times=100];
    fetch -> parse -> multiply;
"""
`
    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid OCR 2 definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'offchainreporting2',
      schemaVersion: 1,
      name: 'ocr 2 job',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      gasLimit: 1000,
      spec: {
        __typename: 'OCR2Spec',
        blockchainTimeout: '20s',
        contractID: '0x1469877c88F19E273EFC7Ef3C9D944574583B8a0',
        contractConfigConfirmations: 3,
        contractConfigTrackerPollInterval: '1m0s',
        ocrKeyBundleID:
          '4ee612467c3caea7bdab57ab62937adfc4d195516c30139a737f85098b35d9af',
        monitoringEndpoint: 'https://monitoring.endpoint',
        p2pv2Bootstrappers: [
          '/ip4/139.59.41.32/tcp/12000/p2p/12D3KooWGKhStcrvCr5RBYKaSRNX4ojrxHcmpJuFmHWenT6aAQAY',
        ],
        relay: 'evm',
        relayConfig: {
          chainID: 1337,
        },
        pluginType: 'median',
        pluginConfig: {
          juelsPerFeeCoinSource: '1000000000',
        },
        transmitterID: '0x01010CaB43e77116c95745D219af1069fE050d7A',
        feedID: 'feed-id',
      },
      runs: {
        results: [],
        metadata: { total: 0 },
      },
      observationSource:
        '    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\"hi\\": \\"hello\\"}"];\n    parse    [type=jsonparse path="data,result"];\n    multiply [type=multiply times=100];\n    fetch -> parse -> multiply;\n',
      createdAt: new Date(),
      errors: [],
    }

    const expectedOutput = `type = "offchainreporting2"
schemaVersion = 1
name = "ocr 2 job"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
maxTaskDuration = "10s"
blockchainTimeout = "20s"
contractID = "0x1469877c88F19E273EFC7Ef3C9D944574583B8a0"
contractConfigConfirmations = 3
contractConfigTrackerPollInterval = "1m0s"
ocrKeyBundleID = "4ee612467c3caea7bdab57ab62937adfc4d195516c30139a737f85098b35d9af"
monitoringEndpoint = "https://monitoring.endpoint"
p2pv2Bootstrappers = [
  "/ip4/139.59.41.32/tcp/12000/p2p/12D3KooWGKhStcrvCr5RBYKaSRNX4ojrxHcmpJuFmHWenT6aAQAY"
]
relay = "evm"
pluginType = "median"
feedID = "feed-id"
transmitterID = "0x01010CaB43e77116c95745D219af1069fE050d7A"
observationSource = """
    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\\\"hi\\\\": \\\\"hello\\\\"}"];
    parse    [type=jsonparse path="data,result"];
    multiply [type=multiply times=100];
    fetch -> parse -> multiply;
"""

[relayConfig]
chainID = 1_337

[pluginConfig]
juelsPerFeeCoinSource = "1000000000"
`

    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid VRF definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'vrf',
      schemaVersion: 1,
      name: 'vrf job',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      gasLimit: 1000,
      spec: {
        __typename: 'VRFSpec',
        coordinatorAddress: '0x0000000000000000000000000000000000000000',
        evmChainID: '42',
        fromAddresses: ['0x3cCad4715152693fE3BC4460591e3D3Fbd071b42'],
        minIncomingConfirmations: 6,
        pollPeriod: '10s',
        publicKey:
          '0x92594ee04c179eb7d439ff1baacd98b81a7d7a6ed55c86ca428fa025bd9c914301',
        requestedConfsDelay: 0,
        requestTimeout: '1h',
        batchCoordinatorAddress: '0x0000000000000000000000000000000000000000',
        batchFulfillmentEnabled: true,
        batchFulfillmentGasMultiplier: 1.0,
        chunkSize: 25,
        backoffInitialDelay: '1m',
        backoffMaxDelay: '1h',
        gasLanePrice: '200 gwei',
        vrfOwnerAddress: '0x457eF369D905DbD122a95A099Cf749D37CbE9341',
      },
      observationSource:
        '    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\"hi\\": \\"hello\\"}"];\n    parse    [type=jsonparse path="data,result"];\n    multiply [type=multiply times=100];\n    fetch -> parse -> multiply;\n',
      ...otherJobFields,
    }

    const expectedOutput = `type = "vrf"
schemaVersion = 1
name = "vrf job"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
coordinatorAddress = "0x0000000000000000000000000000000000000000"
evmChainID = "42"
fromAddresses = [ "0x3cCad4715152693fE3BC4460591e3D3Fbd071b42" ]
minIncomingConfirmations = 6
pollPeriod = "10s"
publicKey = "0x92594ee04c179eb7d439ff1baacd98b81a7d7a6ed55c86ca428fa025bd9c914301"
requestedConfsDelay = 0
requestTimeout = "1h"
batchCoordinatorAddress = "0x0000000000000000000000000000000000000000"
batchFulfillmentEnabled = true
batchFulfillmentGasMultiplier = 1
chunkSize = 25
backoffInitialDelay = "1m"
backoffMaxDelay = "1h"
gasLanePrice = "200 gwei"
vrfOwnerAddress = "0x457eF369D905DbD122a95A099Cf749D37CbE9341"
observationSource = """
    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\\\"hi\\\\": \\\\"hello\\\\"}"];
    parse    [type=jsonparse path="data,result"];
    multiply [type=multiply times=100];
    fetch -> parse -> multiply;
"""
`
    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid Webhook definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'webhook',
      schemaVersion: 1,
      name: 'webhook job',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      gasLimit: 1000,
      spec: {
        __typename: 'WebhookSpec',
      },
      observationSource:
        '    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\"hi\\": \\"hello\\"}"];\n    parse    [type=jsonparse path="data,result"];\n    multiply [type=multiply times=100];\n    fetch -> parse -> multiply;\n',
      ...otherJobFields,
    }

    const expectedOutput = `type = "webhook"
schemaVersion = 1
name = "webhook job"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
observationSource = """
    fetch    [type=http method=POST url="http://localhost:8001" requestData="{\\\\"hi\\\\": \\\\"hello\\\\"}"];
    parse    [type=jsonparse path="data,result"];
    multiply [type=multiply times=100];
    fetch -> parse -> multiply;
"""
`
    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid Bootstrap definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'bootstrap',
      schemaVersion: 1,
      name: 'bootstrap',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      gasLimit: 1000,
      spec: {
        __typename: 'BootstrapSpec',
        contractID: '0x0000000000000000000000000000000000000000',
        relay: 'evm',
        relayConfig: {
          chainID: 1337,
        },
        monitoringEndpoint: 'https://monitoring.endpoint',
        blockchainTimeout: '',
        contractConfigTrackerPollInterval: '60s',
        contractConfigConfirmations: 1,
        createdAt: '',
      },
      observationSource: '',
      ...otherJobFields,
    }

    const expectedOutput = `type = "bootstrap"
schemaVersion = 1
name = "bootstrap"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
contractID = "0x0000000000000000000000000000000000000000"
relay = "evm"
monitoringEndpoint = "https://monitoring.endpoint"
blockchainTimeout = ""
contractConfigTrackerPollInterval = "60s"
contractConfigConfirmations = 1

[relayConfig]
chainID = 1_337
`
    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid blockhashstore definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'blockhashstore',
      schemaVersion: 1,
      name: 'blockhashstore',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '0s',
      gasLimit: 1000,
      spec: {
        __typename: 'BlockhashStoreSpec',
        evmChainID: '42161',
        fromAddresses: ['0x52926EF10c19E810a52f11e942E502B15c7E2fEE'],
        coordinatorV1Address: '0x3cCad4715152693fE3BC4460591e3D3Fbd071b42',
        coordinatorV2Address: '0xD427446551a93F4686799EDEcA33Bbb741115a5b',
        coordinatorV2PlusAddress: '0xd5af166B311768b4678A5eE431089FdA48d58bfe',
        blockhashStoreAddress: '0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE',
        trustedBlockhashStoreAddress:
          '0x1Cbdef9B2c247FD31B972242E63ff26eA02466e2',
        trustedBlockhashStoreBatchSize: 100,
        pollPeriod: '300ms',
        waitBlocks: 30,
        lookbackBlocks: 240,
        runTimeout: '10s',
      },
      observationSource: '',
      ...otherJobFields,
    }

    const expectedOutput = `type = "blockhashstore"
schemaVersion = 1
name = "blockhashstore"
externalJobID = "00000000-0000-0000-0000-0000000000001"
gasLimit = 1_000
coordinatorV1Address = "0x3cCad4715152693fE3BC4460591e3D3Fbd071b42"
coordinatorV2Address = "0xD427446551a93F4686799EDEcA33Bbb741115a5b"
coordinatorV2PlusAddress = "0xd5af166B311768b4678A5eE431089FdA48d58bfe"
waitBlocks = 30
lookbackBlocks = 240
blockhashStoreAddress = "0x5C210eF41CD1a72de73bF76eC39637bB0d3d7BEE"
trustedBlockhashStoreAddress = "0x1Cbdef9B2c247FD31B972242E63ff26eA02466e2"
trustedBlockhashStoreBatchSize = 100
pollPeriod = "300ms"
runTimeout = "10s"
evmChainID = "42161"
fromAddresses = [ "0x52926EF10c19E810a52f11e942E502B15c7E2fEE" ]
`
    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid Gateway definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'gateway',
      schemaVersion: 1,
      name: 'gateway test',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '0s',
      spec: {
        __typename: 'GatewaySpec',
        gatewayConfig: {
          NodeServerConfig: { Port: 8080 },
        },
        createdAt: '',
      },
      observationSource: '',
      ...otherJobFields,
    }

    const expectedOutput = `type = "gateway"
schemaVersion = 1
name = "gateway test"
externalJobID = "00000000-0000-0000-0000-0000000000001"

[gatewayConfig.NodeServerConfig]
Port = 8_080
`
    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid Workflow definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'workflow',
      schemaVersion: 1,
      name: 'workflow test',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      spec: {
        __typename: 'WorkflowSpec',
        workflowID: '<workflow id>',
        workflow: '<workflow spec>',
        workflowOwner: '<workflow owner>',
      },
      observationSource: '',
      ...otherJobFields,
    }

    const expectedOutput = `type = "workflow"
schemaVersion = 1
name = "workflow test"
externalJobID = "00000000-0000-0000-0000-0000000000001"
workflowID = "<workflow id>"
workflow = "<workflow spec>"
workflowOwner = "<workflow owner>"
`
    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })

  it('generates a valid StandardCapabilities definition', () => {
    const job: JobPayload_Fields = {
      id: '1',
      type: 'standardcapabilities',
      schemaVersion: 1,
      name: 'standardcapabilities test',
      externalJobID: '00000000-0000-0000-0000-0000000000001',
      maxTaskDuration: '10s',
      spec: {
        __typename: 'StandardCapabilitiesSpec',
        command: '<command>',
        config: '<config>',
        createdAt: '',
      },
      observationSource: '',
      ...otherJobFields,
    }

    const expectedOutput = `type = "standardcapabilities"
schemaVersion = 1
name = "standardcapabilities test"
externalJobID = "00000000-0000-0000-0000-0000000000001"
command = "<command>"
config = "<config>"
`

    const output = generateJobDefinition(job)
    expect(output.definition).toEqual(expectedOutput)
  })
})
