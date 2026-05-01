import React from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'

import { NonEVMKeyRow } from './NonEVMKeyRow'
import { ErrorRow } from 'src/components/TableRow/ErrorRow'
import { LoadingRow } from 'src/components/TableRow/LoadingRow'
import { NoContentRow } from 'src/components/TableRow/NoContentRow'

export interface Props {
  loading: boolean
  schema: { title: string; fields: any[] }
  data?: any
  errorMsg?: string
  onCreate: () => void
}

export const NonEVMKeysCard: React.FC<Props> = ({
  schema,
  data,
  errorMsg,
  loading,
  onCreate,
}) => {
  return (
    <Card>
      <CardHeader
        action={
          data?.results?.length === 0 && (
            <Button variant="outlined" color="primary" onClick={onCreate}>
              New Key
            </Button>
          )
        }
        title={`${schema.title} Keys`}
        subheader={`Manage your ${schema.title} Keys`}
      />
      <Table>
        <TableHead>
          {schema.fields.map((field, idx) => (
            <TableCell key={idx}>{field.label}</TableCell>
          ))}
        </TableHead>
        <TableBody>
          <LoadingRow visible={loading} />
          <NoContentRow visible={data?.results?.length === 0} />
          <ErrorRow msg={errorMsg} />

          {data?.results?.map((key: string, idx: number) => (
            <NonEVMKeyRow chainKey={key} fields={schema.fields} key={idx} />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
