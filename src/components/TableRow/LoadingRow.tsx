import React from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import { Theme } from '@mui/material/styles'
import { WithStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import withStyles from '@mui/styles/withStyles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

const styles = (theme: Theme) =>
  createStyles({
    cell: {
      padding: theme.spacing(2),
    },
  })

interface Props extends WithStyles<typeof styles> {
  visible: boolean
}

export const LoadingRow = withStyles(styles)(({ classes, visible }: Props) => {
  if (!visible) {
    return null
  }

  return (
    <TableRow>
      {/* Sets a high column count to insure this is always centered regardless
        of the number of columns in the table.
         */}
      <TableCell colSpan={100} align="center" className={classes.cell}>
        <CircularProgress data-testid="loading-spinner" size={24} />
      </TableCell>
    </TableRow>
  )
})
