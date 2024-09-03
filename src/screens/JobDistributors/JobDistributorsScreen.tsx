import React from 'react'

import { GraphqlErrorHandler } from 'src/components/ErrorHandler/GraphqlErrorHandler'
import { Loading } from 'src/components/Feedback/Loading'
import { useFeedsManagersQuery } from 'src/hooks/queries/useFeedsManagersQuery'
import { JobDistributorsView } from './JobDistributorsView'

export const JobDistributorsScreen = () => {
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
    <JobDistributorsView jobDistributors={data?.feedsManagers.results ?? []} />
  )
}
