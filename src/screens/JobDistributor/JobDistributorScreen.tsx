import React from 'react'

import { GraphqlErrorHandler } from 'src/components/ErrorHandler/GraphqlErrorHandler'
import { Loading } from 'src/components/Feedback/Loading'
import { useFeedsManagersQuery } from 'src/hooks/queries/useFeedsManagersQuery'
import { JobDistributorView } from './JobDistributorView'

export const JobDistributorScreen = () => {
  const { data, loading, error } = useFeedsManagersQuery({
    fetchPolicy: 'cache-and-network',
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <GraphqlErrorHandler error={error} />
  }

  return (
    <JobDistributorView jobDistributors={data?.feedsManagers.results ?? []} />
  )
}
