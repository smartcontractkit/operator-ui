import React from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const renderEntries = (entries: Array<Array<string>>) =>
  entries.map(([k, v]) => (
    <TableRow key={k}>
      <TableCell>{k}</TableCell>
      <TableCell>{String(v)}</TableCell>
    </TableRow>
  ))

const SpanRow: React.FC = ({ children }) => (
  <TableRow>
    <TableCell component="th" scope="row" colSpan={3}>
      {children}
    </TableCell>
  </TableRow>
)

const ErrorRow: React.FC = ({ children }) => <SpanRow>{children}</SpanRow>

const FetchingRow = () => <SpanRow>...</SpanRow>

const renderBody = (
  entries: Array<Array<string>>,
  loading: boolean,
  error: string,
) => {
  if (error) {
    return <ErrorRow>{error}</ErrorRow>
  }

  if (loading) {
    return <FetchingRow />
  }

  return renderEntries(entries)
}

export interface Props {
  entries: Array<Array<any>>
  loading: boolean
  showHead?: boolean
  title?: string
  error?: string
}

export const KeyValueListCard = ({
  loading,
  entries,
  error = '',
  showHead = false,
  title,
}: Props) => (
  <Card>
    {title && <CardHeader title={title} />}

    <Table>
      {showHead && (
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
      )}
      <TableBody>{renderBody(entries, loading, error)}</TableBody>
    </Table>
  </Card>
)
