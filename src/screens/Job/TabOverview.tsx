import React from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import { Theme } from '@mui/material/styles'

import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'

import Button from 'components/Button'
import BaseLink from 'components/BaseLink'
import { JobRunsTable } from 'components/Table/JobRunsTable'
import { TaskListCard } from 'components/Cards/TaskListCard'

// ShowViewMoreCount defines the minimum number of jobs to display the
// View More link
const ShowViewMoreCount = 5

const chartCardStyles = ({ spacing }: Theme) =>
  createStyles({
    runDetails: {
      paddingTop: spacing(2),
      paddingBottom: spacing(2),
      paddingLeft: spacing(2),
    },
  })

interface Props extends WithStyles<typeof chartCardStyles> {
  job: JobPayload_Fields
}

export const TabOverview = withStyles(chartCardStyles)(({
  classes,
  job,
}: Props) => {
  // Convert the runs into run props which are compatible with the
  // JobRunsTable
  const runs = React.useMemo(() => {
    return job.runs.results.map(
      ({ allErrors, id, createdAt, finishedAt, status }) => ({
        id,
        createdAt,
        errors: allErrors,
        finishedAt,
        status,
      }),
    )
  }, [job.runs])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardHeader title="Recent job runs" />

          <JobRunsTable runs={runs} />

          {job.runs.metadata.total > ShowViewMoreCount && (
            <div className={classes.runDetails}>
              <Button href={`/jobs/${job.id}/runs`} component={BaseLink}>
                View more
              </Button>
            </div>
          )}
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TaskListCard observationSource={job.observationSource} />
      </Grid>
    </Grid>
  )
})
