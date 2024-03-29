import { CardTitle } from 'components/CardTitle'
import { Card, Grid } from '@material-ui/core'
import Content from 'components/Content'
import React from 'react'
import { ChainResource } from './Show'
import ChainNodesList from './NodesList'
import { Resource, Node } from 'core/store/models'

export type NodeResource = Resource<Node>

interface Props {
  nodes: NodeResource[]
  chain: ChainResource
}

export const ChainNodes = ({ nodes, chain }: Props) => {
  const filterByChainID = function (node: NodeResource): boolean {
    return node.attributes.chainID === chain.id
  }
  return (
    <Content>
      {chain && (
        <Grid container spacing={40}>
          <Grid item xs={12}>
            <Card>
              <CardTitle divider>Nodes</CardTitle>
              <ChainNodesList nodes={nodes} nodeFilter={filterByChainID} />
            </Card>
          </Grid>
        </Grid>
      )}
    </Content>
  )
}
