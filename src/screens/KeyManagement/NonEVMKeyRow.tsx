import React from 'react'

import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { CopyIconButton } from 'src/components/Copy/CopyIconButton'

interface Props {
  chainKey: any
  fields: any[]
}

export const NonEVMKeyRow: React.FC<Props> = ({ chainKey, fields }) => {
  return (
    <TableRow hover>
      {fields.map((field, idx) => (
        <TableCell key={idx}>
          <Typography variant="body1">
            {chainKey[field.key]}{' '}
            {field.copy && <CopyIconButton data={chainKey[field.key]} />}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  )
}
