import React, { useEffect } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Theme } from '@mui/material/styles'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { selectBuildInfo } from 'src/selectors/buildInfo'
import { fetchBuildInfo } from 'src/actionCreators'

const styles = (theme: Theme) => {
  return createStyles({
    cell: {
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
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
