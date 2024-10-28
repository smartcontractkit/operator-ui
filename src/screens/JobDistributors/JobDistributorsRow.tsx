import React from 'react'

import { withStyles, WithStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import Link from 'components/Link'
import { tableStyles } from 'components/Table'
import { CopyIconButton } from 'src/components/Copy/CopyIconButton'
import { shortenHex } from 'src/utils/shortenHex'
import { StatusIndicator } from '../FeedsManager/StatusIndicator'

interface Props extends WithStyles<typeof tableStyles> {
  jobDistributor: FetchFeedsManagersPayload_ResultsFields
}

export const JobDistributorsRow = withStyles(tableStyles)(
  ({ jobDistributor, classes }: Props) => {
    return (
      <TableRow className={classes.row} hover>
        <TableCell className={classes.cell} component="th" scope="row">
          <Link
            className={classes.link}
            href={`/job_distributors/${jobDistributor.id}`}
          >
            {jobDistributor.name}
          </Link>
        </TableCell>
        <TableCell>
          <StatusIndicator
            isActive={jobDistributor.isConnectionActive}
            activeText="Connected"
            inactiveText="Disconnected"
          />
        </TableCell>
        <TableCell>
          <StatusIndicator
            isActive={!jobDistributor.disabledAt}
            activeText="Enabled"
            inactiveText="Disabled"
          />
        </TableCell>
        <TableCell>
          {shortenHex(jobDistributor.publicKey, { start: 6, end: 6 })}
          <CopyIconButton data={jobDistributor.publicKey} />
        </TableCell>
        <TableCell>{jobDistributor.uri}</TableCell>
      </TableRow>
    )
  },
)
