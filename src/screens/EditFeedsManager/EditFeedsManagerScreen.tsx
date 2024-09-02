import React from 'react'

import { gql, useMutation } from '@apollo/client'
import { FormikHelpers } from 'formik'
import { useDispatch } from 'react-redux'
import { Redirect, useHistory, useParams } from 'react-router-dom'

import { notifyErrorMsg, notifySuccessMsg } from 'actionCreators'
import { Loading } from 'components/Feedback/Loading'
import { FormValues } from 'components/Form/FeedsManagerForm'
import { GraphqlErrorHandler } from 'src/components/ErrorHandler/GraphqlErrorHandler'
import { useFeedsManagersQuery } from 'src/hooks/queries/useFeedsManagersQuery'
import { useMutationErrorHandler } from 'src/hooks/useMutationErrorHandler'
import { parseInputErrors } from 'src/utils/inputErrors'
import { EditFeedsManagerView } from './EditFeedsManagerView'

export const UPDATE_FEEDS_MANAGER_MUTATION = gql`
  mutation UpdateFeedsManager($id: ID!, $input: UpdateFeedsManagerInput!) {
    updateFeedsManager(id: $id, input: $input) {
      ... on UpdateFeedsManagerSuccess {
        feedsManager {
          id
          name
          uri
          publicKey
          isConnectionActive
          createdAt
        }
      }
      ... on NotFoundError {
        message
        code
      }
      ... on InputErrors {
        errors {
          path
          message
          code
        }
      }
    }
  }
`

interface RouteParams {
  id: string
}

export const EditFeedsManagerScreen: React.FC = () => {
  const { id } = useParams<RouteParams>()
  const history = useHistory()
  const dispatch = useDispatch()
  const { handleMutationError } = useMutationErrorHandler()
  const { data, loading, error } = useFeedsManagersQuery()
  const [updateFeedsManager] = useMutation<
    UpdateFeedsManager,
    UpdateFeedsManagerVariables
  >(UPDATE_FEEDS_MANAGER_MUTATION)

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <GraphqlErrorHandler error={error} />
  }

  const manager = data?.feedsManagers.results.filter((x) => x.id === id)[0]

  if (!manager) {
    return (
      <Redirect
        to={{
          pathname: '/job_distributors',
        }}
      />
    )
  }

  const handleSubmit = async (
    values: FormValues,
    { setErrors }: FormikHelpers<FormValues>,
  ) => {
    try {
      const result = await updateFeedsManager({
        variables: { id: manager.id, input: { ...values } },
      })

      const payload = result.data?.updateFeedsManager
      switch (payload?.__typename) {
        case 'UpdateFeedsManagerSuccess':
          history.push('/job_distributors')

          dispatch(notifySuccessMsg('Job Distributor Updated'))

          break
        case 'NotFoundError':
          dispatch(notifyErrorMsg(payload.message))

          break
        case 'InputErrors':
          dispatch(notifyErrorMsg('Invalid Input'))

          setErrors(parseInputErrors(payload))

          break
      }
    } catch (e) {
      handleMutationError(e)
    }
  }

  return <EditFeedsManagerView data={manager} onSubmit={handleSubmit} />
}
