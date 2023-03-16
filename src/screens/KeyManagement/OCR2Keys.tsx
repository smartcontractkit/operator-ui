import React from 'react'

import { gql, useMutation } from '@apollo/client'
import { useDispatch } from 'react-redux'

import { deleteSuccessNotification } from './notifications'
import { OCR2KeysCard } from './OCR2KeysCard'
import { useOCR2KeysQuery } from 'src/hooks/queries/useOCR2KeysQuery'
import { useQueryErrorHandler } from 'hooks/useQueryErrorHandler'

export const DELETE_OCR2_KEY_BUNDLE_MUTATION = gql`
  mutation DeleteOCR2KeyBundle($id: ID!) {
    deleteOCR2KeyBundle(id: $id) {
      ... on DeleteOCR2KeyBundleSuccess {
        bundle {
          id
        }
      }
    }
  }
`

/**
 * This follows the form and structure of OCRKeys but
 */
export const OCR2Keys = () => {
  const dispatch = useDispatch()
  const { handleQueryError } = useQueryErrorHandler()
  const { data, loading, error, refetch } = useOCR2KeysQuery({
    fetchPolicy: 'network-only',
    onError: handleQueryError,
  })

  const [deleteOCR2KeyBundle] = useMutation<
    DeleteOcr2KeyBundle,
    DeleteOcr2KeyBundleVariables
  >(DELETE_OCR2_KEY_BUNDLE_MUTATION)

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteOCR2KeyBundle({ variables: { id } })

      const payload = result.data?.deleteOCR2KeyBundle
      switch (payload?.__typename) {
        case 'DeleteOCR2KeyBundleSuccess':
          dispatch(
            deleteSuccessNotification({
              keyType: 'Off-ChainReporting Key Bundle',
            }),
          )

          refetch()

          break
      }
    } catch (e) {
      handleQueryError(e)
    }
  }

  return (
    <OCR2KeysCard
      loading={loading}
      data={data}
      errorMsg={error?.message}
      onDelete={handleDelete}
    />
  )
}
