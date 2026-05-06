import React from 'react'

import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
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

// UpdatesTable renders a table for proposals with updates.
export const UpdatesTable = withStyles(tableStyles)(({
  classes,
  proposals,
}: Props) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>External Job ID</TableCell>
          <TableCell>Latest Version</TableCell>
          <TableCell>Last Proposed</TableCell>
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
            <TableCell>{proposal.externalJobID || '--'}</TableCell>
            <TableCell>{proposal.latestSpec.version}</TableCell>
            <TableCell>
              <TimeAgo tooltip>{proposal.latestSpec.createdAt}</TimeAgo>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})
