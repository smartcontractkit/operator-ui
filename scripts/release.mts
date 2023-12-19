#!/usr/bin/env zx
/**
 * Publish snapshot releases as a tarball to github releases
 */
import 'zx/globals'
import _readChangesets from '@changesets/read'
// See https://github.com/changesets/changesets/issues/622
const readChangesets =
  _readChangesets.default as typeof import('@changesets/read/dist/declarations/src/index.js')['default']

// These paths are relative to the git root
const ASSETS_DIR = './assets'
const CHANGELOG_PATH = './CHANGELOG.md'

async function main() {
  await setup()
  await checkExternalScriptDependencies()
  await maybeConsumeVersions()
  const { gitTag, filename } = await pkgToTarball(ASSETS_DIR)
  await modifyChangelog(CHANGELOG_PATH, gitTag)
  await createGithubRelease(ASSETS_DIR, filename, gitTag, CHANGELOG_PATH)
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

/**
 * Creates a Github release through the Github CLI, if the release doesn't already exist.
 * @param packDir The directory where the tarball is located
 * @param filename The filename of the tarball
 * @param gitTag The git tag to create the release under
 * @param changelogPath The path to the changelog
 */
async function createGithubRelease(
  packDir: string,
  filename: string,
  gitTag: string,
  changelogPath: string,
) {
  if (await checkIfReleaseExists(gitTag)) {
    warn(`Release under tag "${gitTag}" already exists, skipping...`)
    return
  }

  const asset = `${packDir}/${filename}`
  log(
    `Creating release with tag "${gitTag}" with asset "${asset}" and changelog of ${changelogPath}`,
  )
  await $`gh release create ${gitTag} ${packDir}/${filename} -F ${changelogPath}`

  log(`Cleaning up...`)
  log(`Removing ${packDir}`)
  fs.remove(packDir)
}

/**
 * Modifies the CHANGELOG.md to exclude older version notes so they're not included in the release.
 * This code is dependent on how the changelog is formatted, and will no-op if the changelog doesn't
 * match the expected format.
 * @param changelogPath The path to the changelog
 * @param gitTag The git tag to include changes for
 */
async function modifyChangelog(changelogPath: string, gitTag: string) {
  log(`Modifying changelog to only include changes for ${gitTag}...`)
  const changelog = await fs.readFile(changelogPath, 'utf-8')

  // git tag version to changelog version header format (v0.0.0-0 -> ## 0.0.0-0)
  const version = `## ${gitTag.substring(1)}`
  // Pattern for "## x.y.z" with an optional snapshot release suffix (-abc123)
  const changelogHeaderVersionPattern =
    /^## [0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}(?:-[0-9a-z]{1,15}){0,1}$/gm

  const matchedVersions: { match: string; index: number }[] = [
    ...changelog.matchAll(changelogHeaderVersionPattern),
  ]
    .map((m) => {
      return { match: m[0], index: m.index }
    })
    .filter((m): m is { match: string; index: number } => m.index !== undefined) // filter out undefined indexes
    .sort((a, b) => a.index! - b.index!) // sort ascending by index (top to bottom)

  if (matchedVersions.length === 0) {
    warn(`No versions found in changelog, skipping changelog modification.`)
    return
  } else if (
    matchedVersions.length === 1 &&
    matchedVersions[0].match === `${version}`
  ) {
    log(
      `Only changelog entry is for ${version}, skipping changelog modification.`,
    )
    return
  } else if (matchedVersions[0].match !== `${version}`) {
    log(
      `First changelog version entry is ${matchedVersions[0].match} and not ${version}, skipping changelog modification.`,
    )
    return
  } else {
    // First index is now guaranteed to be the one matching the git tag
    // Second index is the next version entry as we sorted the array by index
    const secondVersionMatch = matchedVersions[1]

    // trim the changelog to the second version match
    const trimmedChangelog = changelog.substring(0, secondVersionMatch.index)
    await fs.writeFile(changelogPath, trimmedChangelog)
  }
}

/**
 * If there are changesets (changeset files in .changeset directory), consume them and create a snapshot release.
 * Otherwise, that means the changesets PR was merged and we can create a release full release.
 */
async function maybeConsumeVersions() {
  const hasChanges = await readChangesets('.').then((sets) => sets.length > 0)
  if (!hasChanges) {
    log(`Attempting to create release....`)
    return
  }

  log(`Attempting to create snapshot release...`)
  await $`yarn changeset version --snapshot`
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
 * Setup the script by changing the working directory to the git root and setting zx verbosity.
 */
async function setup() {
  // Set zx verbosity based on DEBUG env var
  if (!process.env.DEBUG) {
    $.verbose = false
  }

  await runAtGitRoot()
}

/**
 * Change the working directory to the git root.
 */
async function runAtGitRoot() {
  const gitRoot = await $`git rev-parse --show-toplevel`
  cd(gitRoot.stdout.trimEnd())
}

/**
 * Check that external dependencies are installed.
 * Currently only checks for "gh" (Github CLI).
 */
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
