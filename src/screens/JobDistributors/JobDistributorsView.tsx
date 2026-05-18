import React from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import BaseLink from 'components/BaseLink'
import Button from 'components/Button'
import Content from 'components/Content'
import { PageHeader } from 'src/components/PageHeader'
import { JobDistributorsRow } from './JobDistributorsRow'

interface Props {
  jobDistributors: ReadonlyArray<FetchFeedsManagersPayload_ResultsFields>
}

export const JobDistributorsView: React.FC<Props> = ({ jobDistributors }) => {
  return (
    <Content>
      <Grid container>
        <Grid item xs={12}>
          <PageHeader
            title="Job Distributors"
            actions={
              <Button
                variant="secondary"
                component={BaseLink}
                href={'/job_distributors/new'}
              >
                New Job Distributor
              </Button>
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Connection Status</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>CSA Public Key</TableCell>
                  <TableCell>RPC URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobDistributors.length === 0 && (
                  <TableRow>
                    <TableCell component="th" scope="row" colSpan={3}>
                      Job Distributors have not been registered
                    </TableCell>
                  </TableRow>
                )}

                {jobDistributors.map((j) => (
                  <JobDistributorsRow key={j.id} jobDistributor={j} />
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>
    </Content>
  )
}
