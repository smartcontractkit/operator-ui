import React from 'react'

import { gql } from '@apollo/client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import { DetailsCardItemValue } from 'src/components/Cards/DetailsCard'
import { ChainAccountBalanceCard } from 'screens/Dashboard/ChainAccountBalanceCard'
import { EthKey } from 'types/generated/graphql'

export const ACCOUNT_BALANCES_PAYLOAD__RESULTS_FIELDS = gql`
  fragment AccountBalancesPayload_ResultsFields on EthKey {
    address
    chain {
      id
      network
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
          <CardContent>
            <Grid item xs={12}>
              <DetailsCardItemValue value={errorMsg} />
            </Grid>
          </CardContent>
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
          <CardContent>
            <Grid item xs={12}>
              <DetailsCardItemValue value="No account available" />
            </Grid>
          </CardContent>
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
    </Card>
  )
}
