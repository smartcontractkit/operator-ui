import React from 'react'

import { Redirect, useParams } from 'react-router-dom'
import { GraphqlErrorHandler } from 'src/components/ErrorHandler/GraphqlErrorHandler'
import { Loading } from 'src/components/Feedback/Loading'
import { useFeedsManagerWithProposalsQuery } from 'src/hooks/queries/useFeedsManagerWithProposalsQuery'
import NotFound from 'src/pages/NotFound'
import { FeedsManagerView } from './FeedsManagerView'

interface RouteParams {
  id: string
}

export const FeedsManagerScreen: React.FC = () => {
  const { id } = useParams<RouteParams>()

  const { data, loading, error } = useFeedsManagerWithProposalsQuery({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <GraphqlErrorHandler error={error} />
  }

  const payload = data?.feedsManager
  switch (payload?.__typename) {
    case 'NotFoundError':
      return <NotFound />
    case 'FeedsManager':
      return <FeedsManagerView manager={payload} />
    default:
      return (
        <Redirect
          to={{
            pathname: '/job_distributors',
          }}
        />
      )
  }
}
