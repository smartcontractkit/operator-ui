import React from 'react'
import { EthKey } from 'types/generated/graphql'
import Grid from '@material-ui/core/Grid'
import {
  DetailsCardItemTitle,
  DetailsCardItemValue,
} from 'components/Cards/DetailsCard'
import { fromJuels } from 'utils/tokens/link'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

export interface Props {
  keys: Array<EthKey>
  chainID: string
}
export const ChainAccountBalanceCard: React.FC<Props> = ({ keys, chainID }) => {
  return (
    <Card>
      <CardHeader title="Account Balances" subheader={'Chain ID ' + chainID} />
      <CardContent>
        <List>
          {keys &&
            keys.map((key, i) => {
              return (
                <ListItem disableGutters={true} divider={true} key={i}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Grid container spacing={16}>
                          <Grid item xs={12}>
                            <DetailsCardItemTitle title="Address" />
                            <DetailsCardItemValue value={key.address} />
                          </Grid>
                          <Grid item xs={6}>
                            <DetailsCardItemTitle title="Native Token Balance" />
                            <DetailsCardItemValue
                              value={key.ethBalance || '--'}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <DetailsCardItemTitle title="LINK Balance" />
                            <DetailsCardItemValue
                              value={
                                key.linkBalance
                                  ? fromJuels(key.linkBalance)
                                  : '--'
                              }
                            />
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    }
                  ></ListItemText>
                </ListItem>
              )
            })}
        </List>
      </CardContent>
    </Card>
  )
}
