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
    }

    if (error instanceof ApolloError) {
      // Check for an authentication error and logout
      for (const gqlError of error.graphQLErrors) {
        if (gqlError.extensions?.code == 'UNAUTHORIZED') {
          dispatch(
            notifyErrorMsg(
              'Unauthorized, please log in with proper credentials',
            ),
          )
          dispatch(receiveSignoutSuccess())
          history.push('/signin')

          return
        }
      }
    }
    dispatch(notifyErrorMsg((error as Error).message || 'An error occurred'))
  }, [dispatch, error, history])

  return { handleQueryError }
}
