import React from 'react'

import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

export const ErrorRow = ({ msg }: { msg?: string }) => {
  if (!msg) {
    return null
  }

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {msg}
      </TableCell>
    </TableRow>
  )
}
