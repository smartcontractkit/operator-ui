import React, { useEffect } from 'react'

import Paper from '@material-ui/core/Paper'
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { selectBuildInfo } from 'src/selectors/buildInfo'
import { fetchBuildInfo } from 'src/actionCreators'

const styles = (theme: Theme) =>
  createStyles({
    style: {
      textAlign: 'center',
      padding: theme.spacing.unit * 2.5,
      position: 'fixed',
      left: '0',
      bottom: '0',
      width: '100%',
      borderRadius: 0,
    },
    bareAnchor: {
      color: theme.palette.common.black,
      textDecoration: 'none',
    },
  })

type Props = WithStyles<typeof styles>

export const BuildInfoFooter = withStyles(styles)(({ classes }: Props) => {
  const buildInfo = useSelector(selectBuildInfo, shallowEqual)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchBuildInfo())
  }, [])

  return (
    <Paper className={classes.style}>
      <Typography>
        Chainlink Node {buildInfo.version} at commit{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://github.com/smartcontractkit/chainlink/commit/${buildInfo.commitSHA}`}
          className={classes.bareAnchor}
        >
          {buildInfo.commitSHA}
        </a>
      </Typography>
    </Paper>
  )
})
