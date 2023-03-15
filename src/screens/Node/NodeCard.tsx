import React from 'react'

import Grid from '@material-ui/core/Grid'

import {
  DetailsCard,
  DetailsCardItemTitle,
  DetailsCardItemValue,
} from 'src/components/Cards/DetailsCard'

interface Props {
  node: NodePayload_Fields
}

export const NodeCard: React.FC<Props> = ({ node }) => {
  return (
    <DetailsCard>
      <Grid container>

        <Grid item xs={12} sm={4} md={3}>
          <DetailsCardItemTitle title="EVM Chain ID" />
          <DetailsCardItemValue value={node.chain.id} />
        </Grid>

        <Grid item xs={false} sm={false} md={4}></Grid>

        <Grid item xs={12} md={6}>
          <DetailsCardItemTitle title="HTTP URL" />
          <DetailsCardItemValue
            value={node.httpURL !== '' ? node.httpURL : '--'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DetailsCardItemTitle title="WS URL" />
          <DetailsCardItemValue value={node.wsURL !== '' ? node.wsURL : '--'} />
        </Grid>
      </Grid>
    </DetailsCard>
  )
}
