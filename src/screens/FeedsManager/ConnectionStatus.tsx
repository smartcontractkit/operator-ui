import React from 'react'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

const connectionStatusStyles = () => {
  return createStyles({
    root: {
      display: 'flex',
    },
    connectedIcon: {
      color: green[500],
    },
    disconnectedIcon: {
      color: red[500],
    },
    text: {
      marginLeft: 4,
    },
  })
}

interface ConnectionStatusProps
  extends WithStyles<typeof connectionStatusStyles> {
  isConnected: boolean
}

export const ConnectionStatus = withStyles(connectionStatusStyles)(
  ({ isConnected, classes }: ConnectionStatusProps) => {
    return (
      <div className={classes.root}>
        {isConnected ? (
          <CheckCircleIcon fontSize="small" className={classes.connectedIcon} />
        ) : (
          <CancelIcon fontSize="small" className={classes.disconnectedIcon} />
        )}

        <Typography variant="body1" inline className={classes.text}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Typography>
      </div>
    )
  },
)
