import React from 'react'

import { gql } from '@apollo/client'

import Grid from '@material-ui/core/Grid'

import Content from 'components/Content'
import { NodeCard } from './NodeCard'
import { Heading1 } from 'src/components/Heading/Heading1'

export const NODE_PAYLOAD_FIELDS = gql`
  fragment NodePayload_Fields on Node {
    id
    name
    chain {
      id
    }
    httpURL
    wsURL
    state
    sendOnly
    order
  }
`

interface Props {
  node: NodePayload_Fields
}

export const NodeView = ({ node }: Props) => {
  return (
    <>
      <Content>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Heading1>{node.name}</Heading1>
          </Grid>

          <Grid item xs={12}>
            <NodeCard node={node} />
          </Grid>
        </Grid>
      </Content>
    </>
  )
}
