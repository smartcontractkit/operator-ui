import React from 'react'

import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

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
