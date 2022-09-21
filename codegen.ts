import { CodegenConfig, generate } from '@graphql-codegen/cli'
import { Octokit } from 'octokit'
import path from 'path'

export async function getSchemaPath(token?: string): Promise<string[]> {
  // ex. $(pwd)/src/chainlink/core/web/schema
  // or ../chainlink/core/web/schema
  const repoPath = process.env.REPO_PATH
  const defaultPath = '../chainlink'

  if (repoPath && token) {
    throw Error(
      'Both $REPO_PATH and $GH_TOKEN were supplied, choose one method of fetching schemas only',
    )
  }

  if (token) {
    console.log('Running codegen based off of github files...')
    const ref = process.env.REPO_REF
    return await listSchemasOnGithub({ token, ref })
  }

  console.log('Running codegen based off of local files...')
  if (repoPath) {
    console.log(`User supplied repo path "${repoPath}" given.`)
  } else {
    console.warn(
      `No user supplied repo path given. Defaulting to "${defaultPath}".`,
    )
  }

  return [path.join(repoPath || defaultPath, 'core/web/schema')]
}

interface ListSchemasOnGithubOptions {
  /**
   * A token with read access to the chainlink repo
   */
  token: string
  /**
   * The ref to pull schema files from
   */
  ref?: string
}
async function listSchemasOnGithub({ token, ref }: ListSchemasOnGithubOptions) {
  const repo = {
    repo: 'chainlink',
    owner: 'smartcontractkit',
    ref: ref || 'develop',
  }
  if (!ref) {
    console.warn(
      `No ref supplied for ${repo.owner}/${repo.repo}, defaulting to ${repo.ref}`,
    )
  }
  const baseDir = 'core/web/schema'
  const subDirs = ['.', 'type']
  const client = new Octokit({ auth: token })
  const paths = subDirs.map((s) => path.join(baseDir, s))
  const files = await Promise.all(
    paths.map(async (path) => {
      // since we are querying for directories, we should always get an array of file objects back
      console.log(
        `Grabbing schema files from ${JSON.stringify(repo)} in path: ${path}`,
      )
      const { data: content } = await client.rest.repos.getContent({
        ...repo,
        path,
      })
      if (!Array.isArray(content)) {
        throw Error('Content has invalid shape, it should be an array of files')
      }

      return content
        .filter((f) => f.type === 'file' && f.path.includes('.graphql'))
        .map((f) => f.path)
        .map((p) => `github:${repo.owner}/${repo.repo}#${repo.ref}:${p}`)
    }),
  )
  const flatFiles = files.flat()
  return flatFiles
}

async function getConfig(): Promise<CodegenConfig> {
  const token = process.env.GH_TOKEN
  const schema = await getSchemaPath(token)
  console.log(`Pulling schema files from: ${JSON.stringify(schema, null, 1)}`)
  const config: CodegenConfig = {
    overwrite: true,
    config: {
      token,
    },
    schema,
    documents: [...schema, 'src/**/!(*.d).{ts,tsx}'],
    generates: {
      'src/types/generated/graphql.d.ts': {
        plugins: ['typescript', 'typescript-operations'],
        config: {
          immutableTypes: true,
          enumsAsTypes: true,
          omitOperationSuffix: true,
          globalNamespace: true,
          exportFragmentSpreadSubTypes: true,
        },
      },
      './graphql.schema.json': {
        plugins: ['introspection'],
      },

      'src/types/generated/possibleTypes.ts': {
        plugins: ['fragment-matcher'],
        config: {
          useExplicitTyping: true,
        },
      },
    },
  }

  return config
}

async function main() {
  const config = await getConfig()
  if (!process.env.DRY_RUN) await generate(config)
}

main()
