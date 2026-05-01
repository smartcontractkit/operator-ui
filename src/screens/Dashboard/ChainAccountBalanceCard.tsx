import React from 'react'
import { EthKey } from 'types/generated/graphql'
import Grid from '@mui/material/Grid'
import {
  DetailsCardItemTitle,
  DetailsCardItemValue,
} from 'components/Cards/DetailsCard'
import { fromJuels } from 'utils/tokens/link'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

export interface Props {
  keys: Array<EthKey>
  chainID: string
  hideHeaderTitle: boolean
}
export const ChainAccountBalanceCard: React.FC<Props> = ({
  keys,
  chainID,
  hideHeaderTitle,
}) => {
  return (
    <>
      <CardHeader
        title={!hideHeaderTitle && 'Account Balances'}
        subheader={'Chain ID ' + chainID}
      />

      <CardContent>
        <List dense={false} disablePadding={true}>
          {keys &&
            keys.map((key, i) => {
              return (
                <>
                  <ListItem
                    disableGutters={true}
                    key={['acc-balance', chainID.toString(), i.toString()].join(
                      '-',
                    )}
                  >
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Grid container spacing={2}>
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
                  {/* Don't show divider on the last element */}
                  {i + 1 < keys.length && <Divider />}
                </>
              )
            })}
        </List>
      </CardContent>
    </>
  )
}
