import React, { useEffect } from 'react'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { selectBuildInfo } from 'src/selectors/buildInfo'
import { fetchBuildInfo } from 'src/actionCreators'

const styles = (theme: Theme) => {
  return createStyles({
    cell: {
      paddingTop: theme.spacing.unit * 1.5,
      paddingBottom: theme.spacing.unit * 1.5,
    },
  })
}
type Props = WithStyles<typeof styles>

export const NodeInfoCard = withStyles(styles)(({ classes }: Props) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchBuildInfo())
  })
  const buildInfo = useSelector(selectBuildInfo, shallowEqual)

  return (
    <Card>
      <CardHeader title="Node" />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.cell}>
              <Typography>Version</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {buildInfo.version}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.cell}>
              <Typography>SHA</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {buildInfo.commitSHA}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  )
})
