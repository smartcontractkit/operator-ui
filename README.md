# Operator UI

This package is responsible for rendering the UI of the chainlink node, which allows interactions with node jobs, jobs runs, configuration and any other related tasks.

## Setup

The GQL schema that lives within `smartcontractkit/chainlink` is used to generate client typings for this repo. See below for a list of options for generating these bindings, either based on a local chainlink repo copy, or remotely off of github.

```sh
# Assuming that your chainlink repo lives in ../chainlink (relative to this git repo root)
yarn setup

# If you have your chainlink repo in a different directory
REPO_PATH="$HOME/src/smartcontractkit/chainlink" yarn setup

# If you want to fetch the schema files from github instead, from the develop branch
# Note that you need to supply $GH_TOKEN, this is a PAT that needs read access to the
# smartcontractkit/chainlink repo.
GH_TOKEN=$GH_TOKEN yarn setup

# If you want a different branch than develop on the smartcontractkit/chainlink repo
GH_TOKEN=$GH_TOKEN REPO_REF="feature/gql_changes" yarn setup
```

## Running Chainlink Node

Assuming you already have a local chainlink node listening on port 6688, run:

```
CHAINLINK_BASEURL=http://localhost:6688 yarn start
```

Now navigate to http://localhost:3000.

If sign-in doesn't work, check your network console, it's probably a CORS issue. You may need to run your chainlink node with `[WebServer] AllowOrigins=http://localhost:3000` set in TOML config.

## Running Tests

```
yarn test
```

## Contributing

### Versioning

If your PR creates changes to the operator-ui itself, rather than tests, pipeline changes, etc. Then please create a changeset so that a new release is created, and the changelog is updated. See: https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md#what-is-a-changeset

### If your PR contains GQL Schema Changes

If your work also involves a modified schema, that means that you have a linked PR open in the `smartcontractkit/chainlink` repo. The way the status checks are setup in both repositories means that there are the following schema enforcements:

#### Chainlink

- A schema change must never be a breaking change

#### Operator UI

- All PR's have their schema's referenced against the `develop` branch of `smartcontractkit/chainlink`

Given these constraints, the workflow would look like the following:

1. Make changes to the schema, using `yarn setup` to use the local schema to test your changes
2. After the schema changes are satisfactory, and the resolver changes are implemented, open a PR for these changes in `smartcontractkit/chainlink`
3. Open a PR for the frontend changes that use the modified schema in `smartcontractkit/operator-ui`, CI should fail since the schema changes in #2 have not been merged to develop yet.
4. Merge the PR created in #2
5. CI should now pass for the PR created in #3
6. Merge in the PR created in #3
7. An automated pull requested would have been created within `smartcontractkit/chainlink` to update to the just-released version of Operator UI.
8. Merge the aforementioned PR in.

#### Referencing new Job Spec GQL Schema Fields

Note that while the GQL schema in Chainlink itself may be updated, that change is not immediately reflected in
Operator UI even after running `yarn setup`. In order to use newly added fields to a particular GQL type,
one must update the corresponding `JOB_PAYLOAD__SPEC` object appropriately.

For example, if you added a field named `blahNewField` to the `DirectRequestSpec` type in the GQL schema,
update the GQL as follows in `JobView.tsx`:

```ts
const JOB_PAYLOAD__SPEC = gql`
  fragment JobPayload_Spec on JobSpec {
    ... on CronSpec {
      schedule
    }
    ... on DirectRequestSpec {
      contractAddress
      evmChainID
      minIncomingConfirmations
      minIncomingConfirmationsEnv
      minContractPaymentLinkJuels
      requesters
      blahNewField # NEW FIELD HERE!
    }
    # ...
`
```
