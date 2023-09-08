import React from 'react'

import { gql, useQuery } from '@apollo/client'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Grid from '@material-ui/core/Grid'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'

export const CONFIG_V2_QUERY = gql`
  query FetchConfigV2 {
    configv2 {
      user
      effective
    }
  }
`

const SpanRow: React.FC = ({ children }) => (
  <TableRow>
    <TableCell component="th" scope="row" colSpan={3}>
      {children}
    </TableCell>
  </TableRow>
)

const FetchingRow = () => <SpanRow>...</SpanRow>

const ErrorRow: React.FC = ({ children }) => <SpanRow>{children}</SpanRow>

const TOMLPanel = ({ loading, toml, error = '', title, expanded }: Props) => {
  if (error) {
    return <ErrorRow>{error}</ErrorRow>
  }

  if (loading) {
    return <FetchingRow />
  }

  if (!title) {
    title = 'TOML'
  }

  const styles = { display: 'block' }

  return (
    <Typography>
      <ExpansionPanel defaultExpanded={expanded}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {title}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={styles}>
          <SyntaxHighlighter language="toml" style={prism}>
            {toml}
          </SyntaxHighlighter>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Typography>
  )
}

const AllowSimplePasswordsNotification = () => {
  const allowSimplePasswordsNotification = "Starting in 2.6.0, chainlink nodes will no longer AllowSimplePasswords=true for production builds. Any TOML configuration that sets the following line will fail validation checks in `node start` or `node validate`."
  return (
    <Card>
      <CardHeader title={<>{allowSimplePasswordsNotification}</>} />
  </Card>
  )
}

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
          <Card>
            <CardHeader title="TOML Configuration" />
              <AllowSimplePasswordsNotification />
            <TOMLPanel
              title="V2 config dump:"
              error={error?.message}
              loading={loading}
              toml={data?.configv2.user}
              showHead
            />
          </Card>
        </Grid>
      </>
    )
  }

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="TOML Configuration" />
            <AllowSimplePasswordsNotification />
          <TOMLPanel
            title="User specified:"
            error={error?.message}
            loading={loading}
            toml={data?.configv2.user}
            showHead
            expanded={true}
          />
          <TOMLPanel
            title="Effective (with defaults):"
            error={error?.message}
            loading={loading}
            toml={data?.configv2.effective}
            showHead
          />
        </Card>
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
  expanded?: boolean
}
