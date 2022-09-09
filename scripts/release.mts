#!/usr/bin/env zx
/**
 * Publish snapshot releases as a tarball to github releases
 */
import 'zx/globals'

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
    warn(`Release under tag "${gitTag}" already exists, skipping release...`)
    process.exit(0)
  }

  await $`gh release create ${gitTag} ${packDir}/${filename} -F ${changelogPath}`
  fs.remove(packDir)
}
main()

/**
 * Types
 */
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

async function maybeConsumeVersions() {
  const hasChanges = process.env.HAS_CHANGES === 'true'
  if (!hasChanges) {
    warn('No changesets to version, skipping consumption of changesets')
    return
  }

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
