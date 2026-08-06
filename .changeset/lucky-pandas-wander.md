---
'@smartcontractkit/operator-ui': minor
---

feat: Add stellar

Requires a node exposing the `stellarKeys` GraphQL query; against older nodes the
account address dropdown will be empty. No account public key field, as a Stellar
account address already encodes the ed25519 public key.
