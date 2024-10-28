import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import React from 'react'

const statusStyles = () => {
  return createStyles({
    root: {
      display: 'flex',
    },
    activeIcon: {
      color: green[500],
    },
    inactiveIcon: {
      color: red[500],
    },
    text: {
      marginLeft: 4,
    },
  })
}

interface StatusIndicatorProps extends WithStyles<typeof statusStyles> {
  isActive: boolean
  activeText: string
  inactiveText: string
}

export const StatusIndicator = withStyles(statusStyles)(
  ({ isActive, activeText, inactiveText, classes }: StatusIndicatorProps) => {
    return (
      <div className={classes.root}>
        {isActive ? (
          <CheckCircleIcon fontSize="small" className={classes.activeIcon} />
        ) : (
          <CancelIcon fontSize="small" className={classes.inactiveIcon} />
        )}

        <Typography variant="body1" inline className={classes.text}>
          {isActive ? activeText : inactiveText}
        </Typography>
      </div>
    )
  },
)
