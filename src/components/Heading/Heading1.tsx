import React from 'react'

import { WithStyles } from 'src/utils/withStyles'
import { withStyles } from 'src/utils/withStyles'
import { createStyles } from 'src/utils/withStyles'
import Typography from '@mui/material/Typography'

const styles = () => {
  return createStyles({
    root: {
      fontSize: 30,
    },
  })
}

interface Props extends WithStyles<typeof styles> {}

export const Heading1 = withStyles(styles)(
  ({ children, classes }: React.PropsWithChildren<Props>) => (
    <Typography variant="h1" className={classes.root}>
      {children}
    </Typography>
  ),
)
