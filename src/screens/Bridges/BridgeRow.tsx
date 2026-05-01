import React from 'react'

import { WithStyles } from '@mui/styles'
import withStyles from '@mui/styles/withStyles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import Link from 'components/Link'
import { tableStyles } from 'components/Table'

interface Props extends WithStyles<typeof tableStyles> {
  bridge: BridgesPayload_ResultsFields
}

export const BridgeRow = withStyles(tableStyles)(({
  bridge,
  classes,
}: Props) => {
  return (
    <TableRow className={classes.row} key={bridge.name} hover>
      <TableCell scope="row" component="th">
        <Link className={classes.link} href={`/bridges/${bridge.name}`}>
          {bridge.name}
        </Link>
      </TableCell>
      <TableCell>
        <Typography variant="body1">{bridge.url}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1">{bridge.confirmations}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1">{bridge.minimumContractPayment}</Typography>
      </TableCell>
    </TableRow>
  )
})
