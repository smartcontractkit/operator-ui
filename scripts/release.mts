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
  await maybeConsumeVersions()
  const { gitTag, filename } = await pkgToTarball(ASSETS_DIR)
  const releaseChangelog = await createReleaseChangelog(CHANGELOG_PATH, gitTag)
  await createGithubRelease(ASSETS_DIR, filename, gitTag, releaseChangelog)
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
 * @param changelog The contents of the changelog to include in the release notes
 */
async function createGithubRelease(
  packDir: string,
  filename: string,
  gitTag: string,
  changelog: string,
) {
  if (await checkIfReleaseExists(gitTag)) {
    warn(`Release under tag "${gitTag}" already exists, skipping...`)
    return
  }

  const asset = `${packDir}/${filename}`
  log(`Creating release with tag "${gitTag}" with asset "${asset}."`)
  await $`echo ${changelog} | gh release create ${gitTag} ${asset} --notes-file -`

  log(`Cleaning up...`)
  log(`Removing ${packDir}`)
  fs.remove(packDir)
}

/**
 * Creates a modified CHANGELOG.md which excludes older version notes if necessary. Otherwise,
 * will return the original changelog contents if no modification was necessary.
 * This code will no-op and return the original changelog path if:
 * - No versions are found in the changelog
 * - No other versions are found in the changelog
 * - Changelog doesn't match expected format
 * @param changelogPath The path to the changelog
 * @param gitTag The git tag to include changes for
 */
async function createReleaseChangelog(changelogPath: string, gitTag: string) {
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
    return changelog
  } else if (matchedVersions[0].match !== `${version}`) {
    log(
      `First changelog version entry is ${matchedVersions[0].match} and not ${version}, skipping changelog modification.`,
    )
    return changelog
  } else {
    // First index is now guaranteed to be the one matching the git tag
    // We want to trim everything after (and including) the next version header
    const trimIndex = matchedVersions[1]?.index ?? changelog.length
    return changelog.substring(0, trimIndex)
  }
}

/**
 * If there are changesets (changeset files in .changeset directory), consume them and create a snapshot release.
 * That means, there's no changeset files at HEAD. This happens when:
 * 1. The changesets PR was merged (bumping versions and removing all changesets)
 *     - Create a full release
 * 2. No changesets existed, and another commit was added which didn't include a changeset.
 *     -  No-op because a release/tag should already exist ass they're derived from the version in each package.json
 */
async function maybeConsumeVersions() {
  const hasChangesets = await readChangesets('.').then(
    (sets) => sets.length > 0,
  )
  if (!hasChangesets) {
    log(`Attempting to create release....`)
    return
  }

  log(`Attempting to create snapshot release...`)
  await $`yarn changeset version --snapshot`
}

/**
 * Checks if a release already exists under the given git tag.
 */
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

async function setup() {
  // Set zx verbosity based on DEBUG env var
  if (!process.env.DEBUG) {
    $.verbose = false
  }
  await runAtGitRoot()
  await checkExternalScriptDependencies()
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
