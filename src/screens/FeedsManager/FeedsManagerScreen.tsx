import React from 'react'

import { gql, useMutation } from '@apollo/client'
import { notifyErrorMsg, notifySuccessMsg } from 'actionCreators'
import { useDispatch } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import { GraphqlErrorHandler } from 'src/components/ErrorHandler/GraphqlErrorHandler'
import { Loading } from 'src/components/Feedback/Loading'
import { useFeedsManagerWithProposalsQuery } from 'src/hooks/queries/useFeedsManagerWithProposalsQuery'
import { useMutationErrorHandler } from 'src/hooks/useMutationErrorHandler'
import NotFound from 'src/pages/NotFound'
import { FeedsManagerView } from './FeedsManagerView'

export const ENABLE_FEEDS_MANAGER_MUTATION = gql`
  mutation EnableFeedsManager($id: ID!) {
    enableFeedsManager(id: $id) {
      ... on EnableFeedsManagerSuccess {
        feedsManager {
          id
          name
          uri
          publicKey
          isConnectionActive
          createdAt
          disabledAt
        }
      }
      ... on NotFoundError {
        message
        code
      }
    }
  }
`

export const DISABLE_FEEDS_MANAGER_MUTATION = gql`
  mutation DisableFeedsManager($id: ID!) {
    disableFeedsManager(id: $id) {
      ... on DisableFeedsManagerSuccess {
        feedsManager {
          id
          name
          uri
          publicKey
          isConnectionActive
          createdAt
          disabledAt
        }
      }
      ... on NotFoundError {
        message
        code
      }
    }
  }
`

interface RouteParams {
  id: string
}

export const FeedsManagerScreen: React.FC = () => {
  const { id } = useParams<RouteParams>()
  const { handleMutationError } = useMutationErrorHandler()
  const dispatch = useDispatch()

  const { data, loading, error } = useFeedsManagerWithProposalsQuery({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  })

  const [enableFeedsManager] = useMutation<
    EnableFeedsManager,
    EnableFeedsManagerVariables
  >(ENABLE_FEEDS_MANAGER_MUTATION)

  const [disableFeedsManager] = useMutation<
    DisableFeedsManager,
    DisableFeedsManagerVariables
  >(DISABLE_FEEDS_MANAGER_MUTATION)

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <GraphqlErrorHandler error={error} />
  }

  const handleEnable = async () => {
    try {
      const result = await enableFeedsManager({
        variables: { id },
      })

      const payload = result.data?.enableFeedsManager
      switch (payload?.__typename) {
        case 'EnableFeedsManagerSuccess':
          dispatch(notifySuccessMsg('Job Distributor Enabled'))
          break
        case 'NotFoundError':
          dispatch(notifyErrorMsg(payload.message))
          break
      }
    } catch (e) {
      handleMutationError(e)
    }
  }

  const handleDisable = async () => {
    try {
      const result = await disableFeedsManager({
        variables: { id },
      })

      const payload = result.data?.disableFeedsManager
      switch (payload?.__typename) {
        case 'DisableFeedsManagerSuccess':
          dispatch(notifySuccessMsg('Job Distributor Disabled'))
          break
        case 'NotFoundError':
          dispatch(notifyErrorMsg(payload.message))
          break
      }
    } catch (e) {
      handleMutationError(e)
    }
  }

  const payload = data?.feedsManager
  switch (payload?.__typename) {
    case 'NotFoundError':
      return <NotFound />
    case 'FeedsManager':
      return (
        <FeedsManagerView
          manager={payload}
          onEnable={handleEnable}
          onDisable={handleDisable}
        />
      )
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
