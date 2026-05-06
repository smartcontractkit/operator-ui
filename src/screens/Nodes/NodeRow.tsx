import React from 'react'

import { tableStyles } from 'components/Table'
import Link from 'components/Link'

import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

interface Props extends WithStyles<typeof tableStyles> {
  node: NodesPayload_ResultsFields
}

export const NodeRow = withStyles(tableStyles)(({ node, classes }: Props) => {
  return (
    <TableRow className={classes.row} hover>
      <TableCell className={classes.cell} component="th" scope="row">
        <Link className={classes.link} href={`/nodes/${node.name}`}>
          {node.name}
        </Link>
      </TableCell>
      <TableCell>{node.chain.id}</TableCell>
      <TableCell>{node.state}</TableCell>
      <TableCell>{node.sendOnly ? 'SendOnly' : 'Primary'}</TableCell>
      <TableCell>{node.order ? node.order : 'NA'}</TableCell>
    </TableRow>
  )
})
