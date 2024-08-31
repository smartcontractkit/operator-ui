import React from 'react'

import { gql, useMutation } from '@apollo/client'
import { FormikHelpers } from 'formik'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { notifyErrorMsg, notifySuccessMsg } from 'actionCreators'
import { FormValues } from 'components/Form/FeedsManagerForm'
import { FEEDS_MANAGERS_QUERY } from 'src/hooks/queries/useFeedsManagersQuery'
import { useMutationErrorHandler } from 'src/hooks/useMutationErrorHandler'
import { parseInputErrors } from 'src/utils/inputErrors'
import { NewFeedsManagerView } from './NewFeedsManagerView'

export const CREATE_FEEDS_MANAGER_MUTATION = gql`
  mutation CreateFeedsManager($input: CreateFeedsManagerInput!) {
    createFeedsManager(input: $input) {
      ... on CreateFeedsManagerSuccess {
        feedsManager {
          id
          name
          uri
          publicKey
          isConnectionActive
          createdAt
        }
      }
      ... on SingleFeedsManagerError {
        message
        code
      }
      ... on DuplicateFeedsManagerError {
        message
        code
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

export const NewFeedsManagerScreen: React.FC = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { handleMutationError } = useMutationErrorHandler()
  const [createFeedsManager] = useMutation<
    CreateFeedsManager,
    CreateFeedsManagerVariables
  >(CREATE_FEEDS_MANAGER_MUTATION, {
    refetchQueries: [{ query: FEEDS_MANAGERS_QUERY }],
  })

  const handleSubmit = async (
    values: FormValues,
    { setErrors }: FormikHelpers<FormValues>,
  ) => {
    try {
      const result = await createFeedsManager({
        variables: { input: { ...values } },
      })

      const payload = result.data?.createFeedsManager
      switch (payload?.__typename) {
        case 'CreateFeedsManagerSuccess':
          history.push('/job_distributors')

          dispatch(notifySuccessMsg('Job Distributor Created'))

          break
        // todo: remove SingleFeedsManagerError once multi feeds manager support is released
        case 'SingleFeedsManagerError':
        case 'DuplicateFeedsManagerError':
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

  return <NewFeedsManagerView onSubmit={handleSubmit} />
}
