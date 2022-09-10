---
'@smartcontractkit/operator-ui': minor
---

Swap out compiler for testing and building for swc

Using swc leads to significant performance gains in both CI and CD, with a 60% reduction in webpack build times, and a 25% reduction in test times.

- Update to latest tsc version
- Use swc for jest tests instead of ts-jest
- Use swc for webpack builds
- Update jest dependencies
- Update jest snapshots based on JSON parsing changes in jsdom upgrade
- Update gitignore to exclude yarn error logs
- Fix serve config
- Remove unused autobind decorator
