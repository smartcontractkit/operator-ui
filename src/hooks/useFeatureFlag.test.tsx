import React from 'react'

import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { renderHook, waitFor } from '@testing-library/react'

import { useFeatureFlag, Feature, FEATURES_QUERY } from './useFeatureFlag'

function getHookWrapper(mocks: MockedResponse[] = []) {
  const wrapper: React.FC = ({ children }) => (
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  )

  return wrapper
}

describe('useFeatureFlag', () => {
  it('returns the csa feature as enabled', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: FEATURES_QUERY,
        },
        result: {
          data: {
            features: {
              __typename: 'Features',
              csa: true,
              feedsManager: true,
            },
          },
        },
      },
    ]

    const { result } = renderHook(
      () => useFeatureFlag(Feature.CSA),
      {
        wrapper: getHookWrapper(mocks),
      },
    )

    await waitFor(() => {
      expect(result.current).toEqual(true)
    })

    expect(result.current).toEqual(true)
  })

  it('returns the csa feature as disabled', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: FEATURES_QUERY,
        },
        result: {
          data: {
            features: {
              __typename: 'Features',
              csa: false,
              feedsManager: true,
            },
          },
        },
      },
    ]

    const { result } = renderHook(
      () => useFeatureFlag(Feature.CSA),
      {
        wrapper: getHookWrapper(mocks),
      },
    )

    await waitFor(() => {
      expect(result.current).toEqual(false)
    })

    expect(result.current).toEqual(false)
  })
})
