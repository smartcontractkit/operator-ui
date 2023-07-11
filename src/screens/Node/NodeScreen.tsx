import React from 'react'

import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { GraphqlErrorHandler } from 'src/components/ErrorHandler/GraphqlErrorHandler'
import { Loading } from 'src/components/Feedback/Loading'
import { NodeView, NODE_PAYLOAD_FIELDS } from './NodeView'
import NotFound from 'src/pages/NotFound'

export const NODE_QUERY = gql`
  ${NODE_PAYLOAD_FIELDS}
  query FetchNode($id: ID!) {
    node(id: $id) {
      __typename
      ... on Node {
        ...NodePayload_Fields
      }
      ... on NotFoundError {
        message
      }
    }
  }
`

interface RouteParams {
  id: string
}

export const NodeScreen = () => {
  const { id } = useParams<RouteParams>()

  const { data, loading, error } = useQuery<FetchNode, FetchNodeVariables>(
    NODE_QUERY,
    { variables: { id } },
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <GraphqlErrorHandler error={error} />
  }

  const payload = data?.node
  switch (payload?.__typename) {
    case 'Node':
      return <NodeView node={payload} />
    case 'NotFoundError':
      return <NotFound />
    default:
      return null
  }
}
