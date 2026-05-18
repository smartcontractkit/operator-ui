import React from 'react'

import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { formatJobSpecType } from 'src/utils/formatJobSpecType'
import { tableStyles } from 'components/Table'
import { TimeAgo } from 'components/TimeAgo'
import Link from 'components/Link'

interface Props extends WithStyles<typeof tableStyles> {
  job: JobsPayload_ResultsFields
}

export const JobRow = withStyles(tableStyles)(({ job, classes }: Props) => {
  return (
    <TableRow className={classes.row} hover>
      <TableCell className={classes.cell} component="th" scope="row">
        <Link className={classes.link} href={`/jobs/${job.id}`}>
          {job.id}
        </Link>
      </TableCell>
      <TableCell>{job.name != '' ? job.name : '--'}</TableCell>
      <TableCell>{formatJobSpecType(job.spec.__typename)}</TableCell>
      <TableCell>{job.externalJobID}</TableCell>
      <TableCell>
        <TimeAgo tooltip>{job.createdAt}</TimeAgo>
      </TableCell>
    </TableRow>
  )
})
