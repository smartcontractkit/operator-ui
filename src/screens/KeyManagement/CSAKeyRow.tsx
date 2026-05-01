import React from 'react'

import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { CopyIconButton } from 'src/components/Copy/CopyIconButton'

interface Props {
  csaKey: CsaKeysPayload_ResultsFields
}

export const CSAKeyRow: React.FC<Props> = ({ csaKey }) => {
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body1">
          {csaKey.publicKey} <CopyIconButton data={csaKey.publicKey} />
        </Typography>
      </TableCell>
    </TableRow>
  )
}
