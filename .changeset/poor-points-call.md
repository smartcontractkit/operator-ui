---
'@smartcontractkit/operator-ui': minor
---

Fetch chainlink node build info during runtime

Previously, the chainlink version and commit sha were baked into the static assets. Now, they're fetched during runtime via the `/v2/build_info` endpoint after the user has logged in. This enables the operator ui build phase to be isolated from the chainlink build phase, as we no longer need to know the version and commit sha of the chainlink node ahead of time.
