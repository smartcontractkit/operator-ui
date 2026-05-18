import React from 'react'

import { Theme } from '@mui/material/styles'
import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import Typography from '@mui/material/Typography'

import { TaskRunStatusIcon } from 'src/components/Icons/TaskRunStatusIcon'
import { TaskRunStatus } from 'src/utils/taskRunStatus'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(2),
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    content: {
      flex: 1,
      overflow: 'auto',
      paddingLeft: theme.spacing(2),
    },
    heading: {
      lineHeight: theme.spacing(5),
    },
    subheading: {
      color: theme.palette.text.secondary,
    },
    text: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    attributeKey: {
      fontWeight: 300,
    },
  })

export interface Props
  extends
    WithStyles<typeof styles>,
    Pick<JobRunPayload_TaskRunsFields, 'dotID' | 'output' | 'error' | 'type'> {
  attrs?: object
}

export const TaskRunItem = withStyles(styles)(({
  attrs,
  classes,
  dotID,
  output,
  error,
  type,
}: Props) => {
  let status: TaskRunStatus

  if (error) {
    status = TaskRunStatus.ERROR
  } else if (output == 'null') {
    status = TaskRunStatus.PENDING
  } else {
    status = TaskRunStatus.COMPLETE
  }

  return (
    <div className={classes.root}>
      <div>
        <TaskRunStatusIcon status={status} width={40} height={40} />
      </div>

      <div className={classes.content}>
        <Typography className={classes.heading} variant="h5">
          {dotID} <small className={classes.subheading}>{type}</small>
        </Typography>

        {[TaskRunStatus.COMPLETE, TaskRunStatus.ERROR].includes(status) && (
          <Typography className={classes.text} variant="body1">
            {status === TaskRunStatus.COMPLETE ? output : error}
          </Typography>
        )}

        {attrs &&
          Object.entries(attrs).map(([key, value]) => {
            if (key === 'type') {
              return null
            }

            return (
              <Typography key={key} variant="body1">
                <span className={classes.attributeKey}>{key}</span>: {value}
              </Typography>
            )
          })}
      </div>
    </div>
  )
})
