import React from 'react'

import { ApolloError, gql, useLazyQuery, useMutation } from '@apollo/client'
import { FormikHelpers } from 'formik'
import { useDispatch } from 'react-redux'

import { notifyErrorMsg, notifySuccess } from 'actionCreators'
import BaseLink from 'src/components/BaseLink'
import { parseInputErrors } from 'src/utils/inputErrors'
import { FormValues } from 'components/Form/JobForm'
import { NewJobView } from './NewJobView'
import { useMutationErrorHandler } from 'src/hooks/useMutationErrorHandler'
import { JOBS_QUERY } from 'screens/Jobs/JobsScreen'

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      ... on CreateJobSuccess {
        job {
          id
        }
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

const SuccessNotification = ({ id }: { id: string }) => (
  <>
    Successfully created job{' '}
    <BaseLink id="created-job" href={`/jobs/${id}`}>
      {id}
    </BaseLink>
  </>
)

export const NewJobScreen = () => {
  const dispatch = useDispatch()

  const { handleMutationError } = useMutationErrorHandler()
  const [createJob] = useMutation<CreateJob, CreateJobVariables>(
    CREATE_JOB_MUTATION,
  )

  const [getJobs] = useLazyQuery<FetchJobs, FetchJobsVariables>(JOBS_QUERY, {
    variables: { offset: 0, limit: 1000 },
    fetchPolicy: 'network-only',
  })

  const handleSubmit = async (
    values: FormValues,
    { setErrors }: FormikHelpers<FormValues>,
  ) => {
    const beforeCreateJobs = await getJobs()
    try {
      const result = await createJob({
        variables: { input: { TOML: values.toml } },
      })

      const payload = result.data?.createJob
      switch (payload?.__typename) {
        case 'CreateJobSuccess':
          dispatch(
            notifySuccess(SuccessNotification, {
              id: payload.job.id,
            }),
          )

          break
        case 'InputErrors':
          dispatch(notifyErrorMsg('Invalid Input'))

          setErrors(parseInputErrors(payload))

          break
      }
    } catch (e) {
      const afterCreateJobs = await getJobs()
      //Because createJob will also try to start the job we might get errors
      // that are not related to the job creation, to check against this we
      // see if the number of jobs have increased and notify the user that
      // the job was created but the service cannot start
      const jobsBefore = beforeCreateJobs.data?.jobs?.results
      const jobsAfter = afterCreateJobs.data?.jobs?.results
      if (jobsBefore && jobsAfter && jobsBefore.length < jobsAfter.length) {
        if (e instanceof ApolloError) {
          dispatch(
            notifyErrorMsg(
              'Job successfully created but could not start service: ' +
                e.message,
            ),
          )
        } else {
          handleMutationError(e)
        }
      } else {
        handleMutationError(e)
      }
    }
  }

  return <NewJobView onSubmit={handleSubmit} />
}
