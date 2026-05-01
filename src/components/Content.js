import React from 'react'
import withStyles from '@mui/styles/withStyles'

const styles = (theme) => ({
  content: {
    padding: theme.spacing(5),
  },
})

const Content = ({ children, classes }) => {
  return <div className={classes.content}>{children}</div>
}

export default withStyles(styles)(Content)
