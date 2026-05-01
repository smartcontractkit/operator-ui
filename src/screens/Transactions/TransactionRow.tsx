import React from 'react'

import { WithStyles } from '@mui/styles'
import withStyles from '@mui/styles/withStyles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { shortenHex } from 'src/utils/shortenHex'
import { tableStyles } from 'components/Table'
import Link from 'components/Link'

interface Props extends WithStyles<typeof tableStyles> {
  tx: EthTransactionsPayload_ResultsFields
}

export const TransactionRow = withStyles(tableStyles)(({
  tx,
  classes,
}: Props) => {
  return (
    <TableRow className={classes.row} hover>
      <TableCell className={classes.cell} component="th" scope="row">
        <Link className={classes.link} href={`/transactions/${tx.hash}`}>
          {shortenHex(tx.hash, { start: 8, end: 8 })}
        </Link>
      </TableCell>
      <TableCell>{tx.chain.id}</TableCell>
      <TableCell>{shortenHex(tx.from, { start: 8, end: 8 })}</TableCell>
      <TableCell>{shortenHex(tx.to, { start: 8, end: 8 })}</TableCell>
      <TableCell>{tx.nonce}</TableCell>
      <TableCell>{tx.sentAt || '--'}</TableCell>
    </TableRow>
  )
})
