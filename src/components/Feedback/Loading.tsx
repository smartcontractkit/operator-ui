import React from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import { Theme } from '@mui/material/styles'

import { WithStyles } from '@mui/styles'
import withStyles from '@mui/styles/withStyles'

const styles = (theme: Theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {}

export const Loading = withStyles(styles)(({ classes }: Props) => (
  <Grid container className={classes.root}>
    <Grid item xs={12} className={classes.gridItem}>
      <CircularProgress data-testid="loading-spinner" />
    </Grid>
  </Grid>
))
