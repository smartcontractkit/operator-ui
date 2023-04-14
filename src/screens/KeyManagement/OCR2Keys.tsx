import React from 'react'

import { useDispatch } from 'react-redux'

import { deleteSuccessNotification } from './notifications'
import { OCR2KeysCard } from './OCR2KeysCard'
import {
  useCreateOCR2KeyBundleMutation,
  useDeleteOCR2KeyBundleMutation,
  useOCR2KeysQuery,
} from 'src/hooks/queries/useOCR2KeysQuery'
import { useQueryErrorHandler } from 'hooks/useQueryErrorHandler'
import { notifySuccessMsg } from 'actionCreators'

export const OCR2Keys = () => {
  const dispatch = useDispatch()
  const { handleQueryError } = useQueryErrorHandler()
  const { data, loading, refetch } = useOCR2KeysQuery({
    fetchPolicy: 'network-only',
    onError: handleQueryError,
  })

  const [deleteOCR2KeyBundle] = useDeleteOCR2KeyBundleMutation()
  const [createOCR2KeyBundle] = useCreateOCR2KeyBundleMutation()

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

  const handleCreate = async (chainType: string) => {
    try {
      const result = await createOCR2KeyBundle({ variables: { chainType } })

      const payload = result.data?.createOCR2KeyBundle
      switch (payload?.__typename) {
        case 'CreateOCR2KeyBundleSuccess':
          dispatch(notifySuccessMsg(chainType + ' OCR2 key bundle created'))
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
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  )
}
