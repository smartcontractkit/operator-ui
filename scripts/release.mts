#!/usr/bin/env zx
/**
 * Publish snapshot releases as a tarball to github releases
 */
import 'zx/globals'
import _readChangesets from '@changesets/read'
// See https://github.com/changesets/changesets/issues/622
const readChangesets =
  _readChangesets.default as typeof import('@changesets/read/dist/declarations/src/index.js')['default']

async function main() {
  if (!process.env.DEBUG) {
    $.verbose = false
  }
  await checkExternalScriptDependencies()
  await runAtGitRoot()
  // These values are relative to the git root
  const packDir = './assets'
  const changelogPath = './CHANGELOG.md'
  await maybeConsumeVersions()

  const { gitTag, filename } = await pkgToTarball(packDir)

  if (await checkIfReleaseExists(gitTag)) {
    warn(`Release under tag "${gitTag}" already exists, skipping...`)
    return
  }

  await createGithubRelease(packDir, filename, gitTag, changelogPath)
}
main()

interface NpmPack {
  id: string
  name: string
  version: string
  size: number
  unpackedSize: number
  shasum: string
  integrity: string
  filename: string
  files: { path: string; size: number; mode: number }[]
}

async function createGithubRelease(
  packDir: string,
  filename: string,
  gitTag: string,
  changelogPath: string,
) {
  const asset = `${packDir}/${filename}`
  log(
    `Creating release with tag "${gitTag}" with asset "${asset}" and changelog of ${changelogPath}`,
  )
  await $`gh release create ${gitTag} ${packDir}/${filename} -F ${changelogPath}`
  log(`Cleaning up...`)
  log(`Removing ${packDir}`)
  fs.remove(packDir)
}

async function maybeConsumeVersions() {
  const hasChanges = await readChangesets('.').then((sets) => sets.length > 0)
  if (!hasChanges) {
    log(`Attempting to create release....`)
    return
  }

  log(`Attempting to create snapshot release...`)
  await $`yarn changeset version --snapshot`
}

async function runAtGitRoot() {
  const gitRoot = await $`git rev-parse --show-toplevel`
  cd(gitRoot.stdout.trimEnd())
}

async function checkExternalScriptDependencies() {
  try {
    await which('gh')
  } catch {
    error(
      `This script requires "gh" to be installed, see: https://github.com/cli/cli/releases`,
    )
    process.exit(1)
  }
}

async function checkIfReleaseExists(gitTag: string): Promise<boolean> {
  return await $`gh release view ${gitTag}`
    .then((p) => {
      debug(p.stdout)
      return true
    })
    .catch((p: ProcessOutput) => {
      debug(p.stderr)
      return false
    })
}

async function pkgToTarball(packDir: string) {
  await fs.ensureDir(packDir)

  log(`Creating tarball of package to ${packDir}...`)
  const packOutput = await $`npm pack --pack-destination ${packDir} --json`
  const packInfos: NpmPack[] = JSON.parse(packOutput.stdout)
  const [packInfo] = packInfos
  // The actual file name that `npm pack` creates has @ and / symbols replaced
  const filename = packInfo.filename.replace('@', '').replace('/', '-')
  const gitTag = `v${packInfo.version}`

  return { gitTag, filename }
}

/**
 * Helper functions
 */
function log(...params: Parameters<typeof chalk['gray']>): void {
  console.log(chalk.gray(...params))
}
function debug(...params: Parameters<typeof chalk['blue']>): void {
  if (process.env.DEBUG) {
    console.debug(chalk.blue('DEBUG:'), chalk.blue(...params))
  }
}

function warn(...params: Parameters<typeof chalk['yellow']>): void {
  console.warn(chalk.yellow('WARN:'), chalk.yellow(...params))
}

function error(...params: Parameters<typeof chalk['red']>): void {
  console.error(chalk.red('ERR:'), chalk.red(...params))
}
