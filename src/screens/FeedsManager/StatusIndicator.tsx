import { green, red } from '@mui/material/colors'
import { createStyles, WithStyles, withStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
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

export const StatusIndicator = withStyles(statusStyles)(({
  isActive,
  activeText,
  inactiveText,
  classes,
}: StatusIndicatorProps) => {
  return (
    <div className={classes.root}>
      {isActive ? (
        <CheckCircleIcon fontSize="small" className={classes.activeIcon} />
      ) : (
        <CancelIcon fontSize="small" className={classes.inactiveIcon} />
      )}

      <Typography variant="body1" display="inline" className={classes.text}>
        {isActive ? activeText : inactiveText}
      </Typography>
    </div>
  )
})
