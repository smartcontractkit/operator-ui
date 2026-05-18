import React from 'react'

import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

export const NoContentRow = ({
  children,
  visible,
}: React.PropsWithChildren<{ visible: boolean }>) => {
  if (!visible) {
    return null
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {children ? children : 'No entries to show'}
      </TableCell>
    </TableRow>
  )
}
