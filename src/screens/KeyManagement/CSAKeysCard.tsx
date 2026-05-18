import React from 'react'

import { gql } from '@apollo/client'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { CSAKeyRow } from './CSAKeyRow'
import { ErrorRow } from 'src/components/TableRow/ErrorRow'
import { LoadingRow } from 'src/components/TableRow/LoadingRow'
import { NoContentRow } from 'src/components/TableRow/NoContentRow'

export const CSA_KEYS_PAYLOAD__RESULTS_FIELDS = gql`
  fragment CSAKeysPayload_ResultsFields on CSAKey {
    id
    publicKey
  }
`

export interface Props {
  loading: boolean
  data?: FetchCsaKeys
  errorMsg?: string
  onCreate: () => void
}

export const CSAKeysCard: React.FC<Props> = ({
  data,
  errorMsg,
  loading,
  onCreate,
}) => {
  return (
    <Card>
      <CardHeader
        action={
          data?.csaKeys.results?.length === 0 && (
            <Button variant="outlined" color="primary" onClick={onCreate}>
              New CSA Key
            </Button>
          )
        }
        title="CSA Key"
        subheader="Manage your CSA Key"
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Public Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <LoadingRow visible={loading} />
          <NoContentRow visible={data?.csaKeys.results?.length === 0} />
          <ErrorRow msg={errorMsg} />

          {data?.csaKeys.results?.map((key, idx) => (
            <CSAKeyRow csaKey={key} key={idx} />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
