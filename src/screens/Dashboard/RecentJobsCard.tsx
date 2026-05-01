import React from 'react'

import { gql } from '@apollo/client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'

import { ErrorRow } from 'src/components/TableRow/ErrorRow'
import { LoadingRow } from 'src/components/TableRow/LoadingRow'
import { NoContentRow } from 'src/components/TableRow/NoContentRow'
import { RecentJobRow } from './RecentJobRow'

export const RECENT_JOBS_PAYLOAD__RESULTS_FIELDS = gql`
  fragment RecentJobsPayload_ResultsFields on Job {
    id
    name
    createdAt
  }
`

const styles = () =>
  createStyles({
    cardHeader: {
      borderBottom: 0,
    },
    table: {
      tableLayout: 'fixed',
    },
  })

export interface Props extends WithStyles<typeof styles> {
  data?: FetchRecentJobs
  loading: boolean
  errorMsg?: string
}

export const RecentJobsCard = withStyles(styles)(({
  classes,
  data,
  errorMsg,
  loading,
}: Props) => {
  return (
    <Card>
      <CardHeader title="Recent Jobs" className={classes.cardHeader} />

      <Table className={classes.table}>
        <TableBody>
          <LoadingRow visible={loading} />
          <NoContentRow visible={data?.jobs.results?.length === 0}>
            No recently created jobs
          </NoContentRow>
          <ErrorRow msg={errorMsg} />

          {data?.jobs.results?.map((job, idx) => (
            <RecentJobRow job={job} key={idx} />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
})
