import React from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'

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
