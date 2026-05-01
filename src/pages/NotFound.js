import React from 'react'
import NotFoundSVG from 'images/four-oh-four.js'
import withStyles from '@mui/styles/withStyles'

const styles = () => ({
  logo: {
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    position: 'absolute',
  },
})

const Logo = ({ classes }) => (
  <div className={classes.logo} data-testid="not-found-page">
    <NotFoundSVG />
  </div>
)

export default withStyles(styles)(Logo)
