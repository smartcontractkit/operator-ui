import React from 'react'

import Chip from '@mui/material/Chip'
import { WithStyles } from '@mui/styles'
import withStyles from '@mui/styles/withStyles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import Link from 'components/Link'
import { tableStyles } from 'components/Table'
import { TimeAgo } from 'src/components/TimeAgo'

interface Props extends WithStyles<typeof tableStyles> {
  proposals: FeedsManager_JobProposalsFields[]
}

// InactiveTable renders a table for rejected and cancelled proposals.
export const InactiveTable = withStyles(tableStyles)(({
  classes,
  proposals,
}: Props) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Latest Version</TableCell>
          <TableCell>Last Proposed</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {proposals?.map((proposal) => (
          <TableRow key={proposal.id} className={classes.row} hover>
            <TableCell className={classes.cell} component="th" scope="row">
              <Link
                className={classes.link}
                href={`/job_proposals/${proposal.id}`}
              >
                {proposal.id}
              </Link>
            </TableCell>

            <TableCell>{proposal.name || '--'}</TableCell>
            <TableCell>{proposal.latestSpec.version}</TableCell>
            <TableCell>
              <TimeAgo tooltip>{proposal.latestSpec.createdAt}</TimeAgo>
            </TableCell>
            <TableCell align="right">
              {proposal.pendingUpdate && (
                <Chip label="Update Available" color="primary" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})
