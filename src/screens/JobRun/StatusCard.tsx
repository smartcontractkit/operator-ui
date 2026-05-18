import React from 'react'

import classNames from 'classnames'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import Typography from '@mui/material/Typography'

import { ElapsedDuration } from 'components/ElapsedDuration'
import { JobRunStatus } from 'src/types/generated/graphql'
import { JobRunStatusIcon } from 'src/components/Icons/JobRunStatusIcon'
import titleize from 'src/utils/titleize'

const styles = (theme: any) =>
  createStyles({
    cardContent: {
      display: 'flex',
      '&:last-child': {
        paddingBottom: theme.spacing(2),
      },
    },
    completed: {
      backgroundColor: theme.palette.success.light,
    },
    errored: {
      backgroundColor: theme.palette.error.light,
    },
    running: {
      backgroundColor: theme.palette.warning.light,
    },
    body: {
      marginLeft: theme.spacing(2),
    },
    statusText: {
      display: 'inline-block',
      textTransform: 'capitalize',
      color: theme.palette.secondary.main,
    },
    elapsedText: {
      color: theme.typography.display1.color,
    },
  })

interface Props extends WithStyles<typeof styles> {
  startedAt: string
  finishedAt?: string
  status: JobRunStatus
}

export const StatusCard = withStyles(styles)(({
  classes,
  status,
  startedAt,
  finishedAt,
}: Props) => {
  const end = React.useMemo(() => {
    switch (status) {
      case 'COMPLETED':
      case 'ERRORED':
        return finishedAt
      case 'RUNNING':
        return Date.now()
      default:
        return null
    }
  }, [status, finishedAt])

  const statusClass =
    classes[status.toLowerCase() as keyof typeof classes] || classes.running

  return (
    <Card>
      <CardContent className={classNames(classes.cardContent, statusClass)}>
        <JobRunStatusIcon width={64} status={status} />

        <div className={classes.body}>
          <Typography className={classes.statusText} variant="h5">
            {titleize(status)}
          </Typography>

          {end && (
            <ElapsedDuration
              start={startedAt}
              end={end}
              className={classes.elapsedText}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
})
