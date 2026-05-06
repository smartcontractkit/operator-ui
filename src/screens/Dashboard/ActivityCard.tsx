import React from 'react'

import { gql } from '@apollo/client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { Theme } from '@mui/material/styles'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableRow from '@mui/material/TableRow'

import BaseLink from 'src/components/BaseLink'
import Button from 'src/components/Button'
import { ErrorRow } from 'src/components/TableRow/ErrorRow'
import { LoadingRow } from 'src/components/TableRow/LoadingRow'
import { NoContentRow } from 'src/components/TableRow/NoContentRow'
import { ActivityRow } from './ActivityRow'

export const RECENT_JOB_RUNS_PAYLOAD__RESULTS_FIELDS = gql`
  fragment RecentJobRunsPayload_ResultsFields on JobRun {
    id
    allErrors
    createdAt
    finishedAt
    status
    job {
      id
    }
  }
`

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    footer: {
      borderColor: palette.divider,
      borderTop: `1px solid`,
      paddingTop: spacing(2),
      paddingBottom: spacing(2),
    },
  })

export interface Props extends WithStyles<typeof styles> {
  data?: FetchRecentJobRuns
  loading: boolean
  errorMsg?: string
  maxRunsSize: number
}

export const ActivityCard = withStyles(styles)(({
  classes,
  data,
  loading,
  errorMsg,
  maxRunsSize,
}: Props) => {
  return (
    <Card>
      <CardHeader
        title="Activity"
        action={
          <Button href={'/jobs/new'} component={BaseLink}>
            New Job
          </Button>
        }
      />

      <Table>
        <TableBody>
          <LoadingRow visible={loading} />
          <NoContentRow visible={data?.jobRuns.results?.length === 0}>
            No recent activity
          </NoContentRow>
          <ErrorRow msg={errorMsg} />

          {data?.jobRuns.results?.map((run, idx) => (
            <ActivityRow run={run} key={idx} />
          ))}
        </TableBody>

        {data && data.jobRuns.metadata.total > maxRunsSize && (
          <TableFooter>
            <TableRow>
              <TableCell className={classes.footer}>
                <Button href={'/runs'} component={BaseLink}>
                  View More
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </Card>
  )
})
