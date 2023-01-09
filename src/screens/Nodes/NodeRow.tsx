import React from 'react'

import { tableStyles } from 'components/Table'
import Link from 'components/Link'

import { withStyles, WithStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

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
      <TableCell>{node.sendOnly ? "SendOnly" : "Primary"}</TableCell>
    </TableRow>
  )
})
