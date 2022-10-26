import React from 'react'

import { gql, useQuery } from '@apollo/client'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Grid from '@material-ui/core/Grid'

export const CONFIG_V2_QUERY = gql`
  query FetchConfigV2 {
    configv2 {
      user
      effective
    }
  }
`
export const ConfigurationV2Card = () => {
  const { data, loading, error } = useQuery<
    FetchConfigV2,
    FetchConfigV2Variables
  >(CONFIG_V2_QUERY, {
    fetchPolicy: 'cache-and-network',
  })

  var user: string[] = []
  if (data != undefined) {
    user = data?.configv2.user.split(/\n/).map((l) => {
      return l
    })
  } else {
    user = []
  }
  var effective: string[] = []
  if (data != undefined) {
    effective = data?.configv2.effective.split(/\n/).map((l) => {
      return l
    })
  } else {
    effective = []
  }

  return (
    <>
      <Grid item xs={12}>
        <TOMLCard
          title="TOML Configuration (user-specified)"
          error={error?.message}
          loading={loading}
          entries={user}
          showHead
        />
      </Grid>
      <Grid item xs={12}>
        <TOMLCard
          title="TOML Configuration (effective)"
          error={error?.message}
          loading={loading}
          entries={effective}
          showHead
        />
      </Grid>
    </>
  )
}

interface Props {
  entries: Array<string>
  loading: boolean
  showHead?: boolean
  title?: string
  error?: string
}

const SpanRow: React.FC = ({ children }) => (
  <TableRow>
    <TableCell component="th" scope="row" colSpan={3}>
      {children}
    </TableCell>
  </TableRow>
)

const FetchingRow = () => <SpanRow>...</SpanRow>

const ErrorRow: React.FC = ({ children }) => <SpanRow>{children}</SpanRow>

const TOMLCard = ({ loading, entries, error = '', title }: Props) => {
  if (error) {
    return <ErrorRow>{error}</ErrorRow>
  }

  if (loading) {
    return <FetchingRow />
  }

  return (
    <Card>
      {title && <CardHeader title={title} />}
      <Table>
        <TableBody>
          {entries.map((k, i) => (
            <TableRow key={title + k + i}>
              <TableCell>{k}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
