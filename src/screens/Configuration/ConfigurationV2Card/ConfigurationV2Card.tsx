import React from 'react'

import { gql, useQuery } from '@apollo/client'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
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

  if (data?.configv2.effective == 'N/A') {
    return (
      <>
        <Grid item xs={12}>
          <TOMLCard
            title="TOML Configuration (config dump)"
            error={error?.message}
            loading={loading}
            toml={data?.configv2.user}
            showHead
          />
        </Grid>
      </>
    )
  }

  return (
    <>
      <Grid item xs={12}>
        <TOMLCard
          title="TOML Configuration (user-specified)"
          error={error?.message}
          loading={loading}
          toml={data?.configv2.user}
          showHead
        />
      </Grid>
      <Grid item xs={12}>
        <TOMLCard
          title="TOML Configuration (effective)"
          error={error?.message}
          loading={loading}
          toml={data?.configv2.effective}
          showHead
        />
      </Grid>
    </>
  )
}

interface Props {
  toml?: string
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

const TOMLCard = ({ loading, toml, error = '', title }: Props) => {
  if (error) {
    return <ErrorRow>{error}</ErrorRow>
  }

  if (loading) {
    return <FetchingRow />
  }

  const styles = { marginLeft: '1em' }

  return (
    <Card>
      {title && <CardHeader title={title} />}
      <pre style={styles}>
        <code>{toml}</code>
      </pre>
    </Card>
  )
}
