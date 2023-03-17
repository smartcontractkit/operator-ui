import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { notifyErrorMsg } from 'actionCreators'
import { ApolloError } from '@apollo/client'
import { receiveSignoutSuccess } from 'actionCreators'
/**
 * Handles an unknown error which is caught from a
 * query operation. If the error returned is an authentication error, it
 * signs the user out and redirects them to the sign-in page, otherwise it
 * displays an alert with the error message.
 */
export const useQueryErrorHandler = () => {
  const [error, handleQueryError] = React.useState<unknown>()
  const history = useHistory()
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (!error) {
      return
    } else if (error instanceof ApolloError) {
      // Check for an authentication error and logout
      for (let i = 0; i < error.graphQLErrors.length; i++) {
        const err = error.graphQLErrors[i]
        if (err.extensions?.code == 'UNAUTHORIZED') {
          dispatch(receiveSignoutSuccess())
          history.push('/signin')

          return
        }
      }

      dispatch(notifyErrorMsg(error.message || 'An error occurred'))
    } else if (error instanceof Error) {
      dispatch(notifyErrorMsg(error.message || 'An error occurred'))
    } else {
      dispatch(notifyErrorMsg('An error occurred'))
    }
  }, [dispatch, error, history])

  return { handleQueryError }
}
