import React from 'react'

import Grid from '@mui/material/Grid'
import { Theme } from '@mui/material/styles'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { TimeAgo } from 'src/components/TimeAgo'
import Link from 'src/components/Link'
import { JobRunStatusIcon } from 'src/components/Icons/JobRunStatusIcon'

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    cell: {
      padding: 0,
    },
    content: {
      position: 'relative',
      paddingLeft: 50,
    },
    status: {
      position: 'absolute',
      top: 0,
      left: 0,
      paddingTop: 18,
      paddingLeft: 30,
      borderRight: 'solid 1px',
      borderRightColor: palette.divider,
      width: 50,
      height: '100%',
    },
    runDetails: {
      paddingTop: spacing(3),
      paddingBottom: spacing(3),
      paddingLeft: spacing(4),
      paddingRight: spacing(4),
    },
  })

interface Props extends WithStyles<typeof styles> {
  run: RecentJobRunsPayload_ResultsFields
}

export const ActivityRow = withStyles(styles)(({ classes, run }: Props) => {
  return (
    <TableRow>
      <TableCell scope="row" className={classes.cell}>
        <div className={classes.content}>
          <div className={classes.status}>
            <JobRunStatusIcon width={38} status={run.status} />
          </div>

          <div className={classes.runDetails}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Link href={`/jobs/${run.job.id}`}>
                  <Typography variant="h5" color="primary" component="span">
                    Job: {run.job.id}
                  </Typography>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link href={`/runs/${run.id}`}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    component="span"
                  >
                    Run: {run.id}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body1" color="textSecondary">
          <TimeAgo tooltip>{run.createdAt}</TimeAgo>
        </Typography>
      </TableCell>
    </TableRow>
  )
})
