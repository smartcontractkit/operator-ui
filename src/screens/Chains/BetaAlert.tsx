import React from 'react'

import { Theme } from '@mui/material/styles'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import WarningIcon from '@mui/icons-material//Warning'

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.primary.light,
      padding: theme.spacing(2),
      display: 'flex',
    },
    icon: {
      marginRight: theme.spacing(1),
    },
  })

interface Props extends WithStyles<typeof styles> {}

export const BetaAlert = withStyles(styles)(({ classes }: Props) => {
  return (
    <Paper className={classes.paper}>
      <WarningIcon className={classes.icon} />
      <Typography>Multi-chain functionality is in Beta</Typography>
    </Paper>
  )
})
