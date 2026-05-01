import React from 'react'

import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { TimeAgo } from 'components/TimeAgo'

interface Props {
  job: JobPayload_Fields
}

export const TabErrors: React.FC<Props> = ({ job }) => {
  const tableHeaders = ['Occurrences', 'Created', 'Last Seen', 'Message']

  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {job.errors.length === 0 && (
            <TableRow>
              <TableCell component="th" scope="row" colSpan={5}>
                No errors
              </TableCell>
            </TableRow>
          )}

          {job.errors.map((err, idx) => (
            <TableRow key={idx}>
              <TableCell>{err.occurrences}</TableCell>
              <TableCell>
                <TimeAgo tooltip>{err.createdAt}</TimeAgo>
              </TableCell>
              <TableCell>
                <TimeAgo tooltip>{err.updatedAt}</TimeAgo>
              </TableCell>
              <TableCell>{err.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
