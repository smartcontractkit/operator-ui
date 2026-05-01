import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import withStyles from '@mui/styles/withStyles'

const styles = (theme) => ({
  wrapper: {
    marginTop: theme.spacing(5),
  },
  text: {
    textAlign: 'center',
  },
})

const Loading = ({ classes }) => (
  <Grid container alignItems="center">
    <Grid item xs={12} className={classes.wrapper}>
      <Typography variant="h4" className={classes.text}>
        Loading...
      </Typography>
    </Grid>
  </Grid>
)

export default withStyles(styles)(Loading)
