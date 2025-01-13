# @smartcontractkit/operator-ui

## 0.8.0

### Minor Changes

- 53c5f87: rename fromAddress to fromAddresses in blockhashStoreSpec
- 840b5aa: feat: create tron chain config
- 658590c: Add support for Workflow Spec job types
- 6335276: stop redirect to /job_distributors/ when there are registered job distributors
- be9296b: Peer ID field is introduced when Node is running as bootstrap peer
- b286a55: Remove the `maxGasPriceGWei` field from VRF job details page.
- e5a8cf5: #added Enable and Disable Feeds Manager mutations
- 374e9b4: Displays feed ID on OCR2 JobSpec
- 22813fc: Support creating solana chain config
- 3c7a06f: Add ability to show TOML config

  On the configuration screen, the user is now able to view their node's TOML config

- edf79be: Enable job distributor new home page and route changes
- 11e96a8: remove p2p v1 field p2pBootstrapPeers
- 06f745d: Update the VRF job spec UI to include vrfOwnerAddress; Update the BHS job spec UI to include coordinatorV2PlusAddress, trustedBlockhashStoreAddress and trustedBlockhashStoreBatchSize
- 9f9c8db: Change the Account Balance section to accommodate multiple accounts on different chains.
- 531c115: #internal support for standard capability job spec
- 0d97198: Rename Feeds Manager to Job Distributor
- 8ad69f6: chainconfig: attach chain type label to key bundle id in UI
- 55a9fe7: add new job type: BlockHeaderFeeder
- b0a636f: chainconfg: make admin address optional
- e623f73: Support APTOS in chain config
- ec48501: New job type - Gateway
- db6e6b4: Replaced "ETH balance" with "Native token balance"
- c79a9ae: #updated chain config: allow chain id and account address to be manually provided when no selections are available
- 935a76a: Display the Feeds Manager navigation in the mobile navigation drawer
- e658456: Adding notification for upcoming AllowSimplePasswords configuration breaking change in core v2.6.0
- 2c669a2: Add OCR2 Key bundle creation
- e0e85f9: Add order field in the `Nodes` screen
- 67c1a28: Added support for the display and deletion of OCR version 2 (OCR2) keys

### Patch Changes

- 197331a: - Replaced rendering library to fix a bug that crashed the UI when task list contained two nodes in a loop
  - Change Pending, Success and Error svg borders
  - Task list tooltips are not positioned so that they don't go off-screen
  - Added zoom and pan functionality to Task List
- a8d3bf9: remove filter for chaintype for bundleids in feeds manager
- 21b9c41: Add more options to the OCR2 plugin selection for FMS
- 2ab39ec: Show node type
- 8486276: fix: override unique handling logic of apollo client for chains
- a699501: Add deprecation warning for TelemetryIngress.URL and TelemetryIngress.ServerPubKey
- 7e6a14f: Add account address public key field if the chain selected is for starknet
- f0865ab: remove Next Nonce Manual Override UI setting as it is no longer connected to any backend functionality. This reduces UI complexity and avoids confussions.
- f537fba: Fixes task run status display for unfinished tasks
- 52b6d04: Add rebalancer option to OCR2 plugin selection in FMS
- ffd9ff4: Display the name of job proposals in Feeds Manager
- 44bb788: Remove legacy config chain & node mutations.
- 91e5ba4: Change the job creation error to specify that a job was created but it cannot start.
- a2b54a2: Fix a bug that would show all tasks in task list as completed
- a03e68e: Fixed a bug that caused RPC nodes to not be listed under Chains -> Nodes
- 43931df: Add OCR2 plugins selection for FMS
- d9ef282: Fix chainlink-ci workflow by adding tag input to checkout specific tag/commit for operator-ui repo
- 93aee13: Fixes Node and Chain GQL queries which call the `CreatedAt` field which was removed
- 461c900: Add deprecation warning for P2P.V1
- 4480f1f: Add support for using operator forwarder in OCR2 jobs managed by FMS
- f8e796f: Add revoked jobs tab in feeds manager
- b87b317: Fixed a bug that caused the UI to go blank when a job was malformed
- d41b999: Removing notification for AllowSimplePasswords breaking change
- 8da47c3: Remove depecration warnings for TelemetryIngress.URL, TelemtryIngress.ServerPubKey and P2P.V1
- 69b88a0: Fixes infinite loop issue on Sign Out
- 6917e8a: Fixed a bug where the Task List would not be displayed correctly if a run was successfully completed.
- 059b169: Fix bug preventing selection of "Rows per page" in jobs/ID/runs page
- c91c2a5: Allow job deletion requests to be sent from FMS
- ba8eb05: dynamic config for legacy vs. TOML; syntax highlighting; expansion panels

## 0.7.0

### Minor Changes

- d5517c9: Swap out compiler for testing and building for swc

  Using swc leads to significant performance gains in both CI and CD, with a 60% reduction in webpack build times, and a 25% reduction in test times.

  - Update to latest tsc version
  - Use swc for jest tests instead of ts-jest
  - Use swc for webpack builds
  - Update jest dependencies
  - Update jest snapshots based on JSON parsing changes in jsdom upgrade
  - Update gitignore to exclude yarn error logs
  - Fix serve config
  - Remove unused autobind decorator

- c6c81c1: Add "Key Admin Override" modal

  The `/keys` page in Operator UI now exposes several admin commands, namely:

  - An "abandon" checkbox to abandon all current transactions
  - Enable/disable a key for a given chain
  - Manually set the nonce for a key.

  See [this PR](https://github.com/smartcontractkit/chainlink/pull/7406) for a screenshot example.

- 1ab4990: Fetch chainlink node build info during runtime

  Previously, the chainlink version and commit sha were baked into the static assets. Now, they're fetched during runtime via the `/v2/build_info` endpoint after the user has logged in. This enables the operator ui build phase to be isolated from the chainlink build phase, as we no longer need to know the version and commit sha of the chainlink node ahead of time.
