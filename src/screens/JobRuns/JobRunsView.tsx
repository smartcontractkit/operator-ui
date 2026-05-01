import React from 'react'

import { gql } from '@apollo/client'
import { useHistory } from 'react-router-dom'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TablePagination from '@mui/material/TablePagination'

import Content from 'src/components/Content'
import { Heading1 } from 'src/components/Heading/Heading1'
import { JobRunsTable } from 'src/components/Table/JobRunsTable'
import { Loading } from 'src/components/Feedback/Loading'

export const JOB_RUNS_PAYLOAD__RESULTS_FIELDS = gql`
  fragment JobRunsPayload_ResultsFields on JobRun {
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

export interface Props {
  loading: boolean
  page: number
  pageSize: number
  data?: FetchJobRuns
}

export const JobRunsView: React.FC<Props> = ({
  loading,
  data,
  page,
  pageSize,
}) => {
  const history = useHistory()

  // Convert the runs into run props which are compatible with the
  // JobRunsTable
  const tableRuns = React.useMemo(() => {
    return data?.jobRuns.results.map(
      ({ allErrors, id, createdAt, finishedAt, status }) => ({
        id,
        createdAt,
        errors: allErrors,
        finishedAt,
        status,
      }),
    )
  }, [data])

  return (
    <Content>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Heading1>Job Runs</Heading1>
        </Grid>

        {loading && <Loading />}

        {data && tableRuns && (
          <Grid item xs={12}>
            <Card>
              <JobRunsTable runs={tableRuns} />
              <TablePagination
                component="div"
                count={data.jobRuns.metadata.total}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[pageSize]}
                page={page - 1}
                onPageChange={(_, p) => {
                  history.push(`/runs?page=${p + 1}&per=${pageSize}`)
                }}
                onRowsPerPageChange={() => {}} /* handler required by component, so make it a no-op */
                backIconButtonProps={{ 'aria-label': 'prev-page' }}
                nextIconButtonProps={{ 'aria-label': 'next-page' }}
              />
            </Card>
          </Grid>
        )}
      </Grid>
    </Content>
  )
}
