import React from 'react'

import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import Typography from '@mui/material/Typography'

const styles = () => {
  return createStyles({
    root: {
      fontSize: 24,
    },
  })
}

interface Props extends WithStyles<typeof styles> {}

export const Heading2 = withStyles(styles)(
  ({ children, classes }: React.PropsWithChildren<Props>) => (
    <Typography variant="h2" className={classes.root}>
      {children}
    </Typography>
  ),
)
