# @smartcontractkit/operator-ui

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
