import React from 'react'

import { gql } from '@apollo/client'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import Grid from '@material-ui/core/Grid'
import { DetailsCardItemValue } from 'src/components/Cards/DetailsCard'
import Link from 'src/components/Link'
import { ChainAccountBalanceCard } from 'screens/Dashboard/ChainAccountBalanceCard'
import { EthKey } from 'types/generated/graphql'
import CardHeader from '@material-ui/core/CardHeader'
import CircularProgress from '@material-ui/core/CircularProgress'

export const ACCOUNT_BALANCES_PAYLOAD__RESULTS_FIELDS = gql`
  fragment AccountBalancesPayload_ResultsFields on EthKey {
    address
    chain {
      id
    }
    ethBalance
    isDisabled
    linkBalance
  }
`

export interface Props {
  data?: FetchAccountBalances
  loading: boolean
  errorMsg?: string
}

export type KeysByChainID = {
  [chainID: string]: Array<EthKey>
}

export const AccountBalanceCard: React.FC<Props> = ({
  data,
  errorMsg,
  loading,
}) => {
  const results = data?.ethKeys.results
  const keysByChain: KeysByChainID = {}
  results?.forEach(function (key) {
    if (keysByChain[key.chain.id] === undefined) {
      keysByChain[key.chain.id] = []
    }
    keysByChain[key.chain.id].push(key as EthKey)
  })

  return (
    <Card>
      {errorMsg && (
        <>
          <CardHeader title="Account Balances" />
          <Grid item xs={12}>
            <DetailsCardItemValue value={errorMsg} />
          </Grid>
        </>
      )}

      {loading && (
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress data-testid="loading-spinner" size={24} />
        </Grid>
      )}

      {!results?.length && !loading && !errorMsg && (
        <>
          <CardHeader title="Account Balances" />
          <Grid item xs={12}>
            <DetailsCardItemValue value="No account available" />
          </Grid>
        </>
      )}

      {results &&
        Object.keys(keysByChain).map(function (chainID, index) {
          return (
            <ChainAccountBalanceCard
              key={chainID}
              keys={keysByChain[chainID]}
              chainID={chainID}
              hideHeaderTitle={!!index}
            />
          )
        })}

      {results && results.length > 1 && (
        <CardActions style={{ marginLeft: 8 }}>
          <Link href="/keys" color="primary">
            View more accounts
          </Link>
        </CardActions>
      )}
    </Card>
  )
}
