import React, { useMemo } from 'react'

import { useHistory } from 'react-router-dom'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'

import { ChainRow } from './ChainRow'
import Content from 'src/components/Content'
import { PageHeader } from 'src/components/PageHeader'
import { SearchTextField } from 'src/components/Search/SearchTextField'

const searchIncludes = (searchParam: string) => {
  const lowerCaseSearchParam = searchParam.toLowerCase()

  return (stringToSearch: string) => {
    return stringToSearch.toLowerCase().includes(lowerCaseSearchParam)
  }
}

export const simpleChainFilter =
  (search: string) => (chain: ChainsPayload_ResultsFields) => {
    if (search === '') {
      return true
    }

    return matchSimple(chain, search)
  }

// matchSimple does a simple match on the id
function matchSimple(chain: ChainsPayload_ResultsFields, term: string) {
  const match = searchIncludes(term)

  const dataset: string[] = [chain.id]

  return dataset.some(match)
}

export interface Props {
  chains: ReadonlyArray<ChainsPayload_ResultsFields>
  page: number
  pageSize: number
  total: number
}

export const ChainsView: React.FC<Props> = ({
  chains,
  page,
  pageSize,
  total,
}) => {
  const history = useHistory()
  const [search, setSearch] = React.useState('')

  const filteredChains = useMemo(
    () => chains.filter(simpleChainFilter(search.trim())),
    [search, chains],
  )

  return (
    <Content>
      <Grid container>
        <Grid item xs={12}>
          <PageHeader title="Chains" />
        </Grid>

        <Grid item xs={12}>
          <SearchTextField
            value={search}
            onChange={setSearch}
            placeholder="Search chains"
          />

          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Network</TableCell>
                  <TableCell>Chain ID</TableCell>
                  <TableCell>Enabled</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredChains.length === 0 && (
                  <TableRow>
                    <TableCell component="th" scope="row" colSpan={4}>
                      No chains found
                    </TableCell>
                  </TableRow>
                )}

                {filteredChains.map((chain) => (
                  <ChainRow key={chain.id} chain={chain} />
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={total}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[pageSize]}
              page={page - 1}
              onPageChange={(_, p) => {
                history.push(`/chains?page=${p + 1}&per=${pageSize}`)
              }}
              onRowsPerPageChange={() => {}} /* handler required by component, so make it a no-op */
              backIconButtonProps={{ 'aria-label': 'prev-page' }}
              nextIconButtonProps={{ 'aria-label': 'next-page' }}
            />
          </Card>
        </Grid>
      </Grid>
    </Content>
  )
}
