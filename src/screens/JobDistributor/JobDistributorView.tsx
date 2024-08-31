import React from 'react'

import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import BaseLink from 'components/BaseLink'
import Button from 'components/Button'
import Content from 'components/Content'
import { Heading1 } from 'src/components/Heading/Heading1'
import { JobDistributorRow } from './JobDistributorRow'

interface Props {
  jobDistributors: ReadonlyArray<FetchFeedsManagersPayload_ResultsFields>
}

export const JobDistributorView: React.FC<Props> = ({ jobDistributors }) => {
  return (
    <Content>
      <Grid container>
        <Grid item xs={9}>
          <Heading1>Job Distributors</Heading1>
        </Grid>

        <Grid item xs={3}>
          <Grid container justify="flex-end">
            <Grid item>
              <Button
                variant="secondary"
                component={BaseLink}
                href={'/job_distributors/new'}
              >
                New Job Distributor
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>CSA Public Key</TableCell>
                  <TableCell>RPC URL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobDistributors.length === 0 && (
                  <TableRow>
                    <TableCell component="th" scope="row" colSpan={3}>
                      You haven’t created any Job Distributor yet.
                    </TableCell>
                  </TableRow>
                )}

                {jobDistributors.map((j) => (
                  <JobDistributorRow key={j.id} jobDistributor={j} />
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>
    </Content>
  )
}
