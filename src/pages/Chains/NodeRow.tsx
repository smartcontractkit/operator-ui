import React from 'react'

import { NodeResource } from './ChainNodes'
import { tableStyles } from 'components/Table'
import Link from 'components/Link'

import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

interface Props extends WithStyles<typeof tableStyles> {
  node: NodeResource
}

export const NodeRow = withStyles(tableStyles)(({ node, classes }: Props) => {
  return (
    <TableRow className={classes.row} hover>
      <TableCell className={classes.cell} component="th" scope="row">
        <Link className={classes.link} href={`/nodes/${node.attributes.name}`}>
          {node.attributes.name}
        </Link>
      </TableCell>

      <TableCell>{node.attributes.chainID}</TableCell>

      <TableCell>{node.attributes.state}</TableCell>
    </TableRow>
  )
})
