import React from 'react'

import { gql, useQuery } from '@apollo/client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Grid from '@mui/material/Grid'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'

// const DeprecationWarning = () => { // Left as reference for future deprecation warnings
//   return (
//     <Card>
//       <CardHeader title="Deprecation warning" />
//       <CardContent>
//         <Typography variant="h5" gutterBottom>
//           Starting in <code>v2.9.0</code>:
//         </Typography>
//         <List dense>
//           <ListItem>
//             <ListItemIcon>
//               <RemoveCircleOutline />
//             </ListItemIcon>
//             <Typography variant="subtitle2" gutterBottom>
//               <code>P2P.V1</code> will no longer be supported and must not be
//               set in TOML configuration in order to boot. Use{' '}
//               <code>P2P.V2</code> instead. If you are using both,{' '}
//               <code>V1</code> can simply be removed.
//             </Typography>
//           </ListItem>
//         </List>
//       </CardContent>
//     </Card>
//   )
// }

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
      <Accordion defaultExpanded={expanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {title}
        </AccordionSummary>
        <AccordionDetails style={styles}>
          <SyntaxHighlighter language="toml" style={prism}>
            {toml}
          </SyntaxHighlighter>
        </AccordionDetails>
      </Accordion>
    </Typography>
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
      <Grid container>
        {/*<Grid item xs={12}>*/}
        {/*  <DeprecationWarning />*/}
        {/*</Grid>*/}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="TOML Configuration" />
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
