import React from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { ApolloQueryResult } from '@apollo/client'

import { ErrorRow } from 'src/components/TableRow/ErrorRow'
import { LoadingRow } from 'src/components/TableRow/LoadingRow'
import { NoContentRow } from 'src/components/TableRow/NoContentRow'
import { EVMAccountRow } from './EVMAccountRow'

export interface Props {
  loading: boolean
  data?: FetchEthKeys
  errorMsg?: string
  refetch?: () => Promise<ApolloQueryResult<FetchEthKeys>>
}

export const EVMAccountsCard: React.FC<Props> = ({
  data,
  errorMsg,
  loading,
  refetch,
}) => {
  return (
    <Card>
      <CardHeader title="EVM Chain Accounts" />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Chain ID</TableCell>
            <TableCell>Enabled</TableCell>
            <TableCell>LINK Balance</TableCell>
            <TableCell>Native Token Balance</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <LoadingRow visible={loading} />
          <NoContentRow visible={data?.ethKeys.results?.length === 0} />
          <ErrorRow msg={errorMsg} />

          {data?.ethKeys.results?.map((ethKey, idx) => (
            <EVMAccountRow ethKey={ethKey} key={idx} refetch={refetch} />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
