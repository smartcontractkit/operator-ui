import * as React from 'react'

import { GraphQLError } from 'graphql'
import {
  renderWithRouter,
  screen,
  waitForElementToBeRemoved,
} from 'support/test-utils'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'

import { OCR2Keys } from './OCR2Keys'
import {
  buildOCR2KeyBundle,
  buildOCR2KeyBundles,
} from 'support/factories/gql/fetchOCR2KeyBundles'
import Notifications from 'pages/Notifications'
import {
  OCR2_KEY_BUNDLES_QUERY,
  DELETE_OCR2_KEY_BUNDLE_MUTATION,
} from 'src/hooks/queries/useOCR2KeysQuery'
import { waitForLoading } from 'support/test-helpers/wait'

const { findByText, getByRole, queryByText } = screen

function renderComponent(mocks: MockedResponse[]) {
  renderWithRouter(
    <>
      <Notifications />
      <MockedProvider mocks={mocks} addTypename={false}>
        <OCR2Keys />
      </MockedProvider>
    </>,
  )
}

function fetchOCR2KeyBundlesQuery(
  bundles: ReadonlyArray<Ocr2KeyBundlesPayload_ResultsFields>,
) {
  return {
    request: {
      query: OCR2_KEY_BUNDLES_QUERY,
    },
    result: {
      data: {
        ocr2KeyBundles: {
          results: bundles,
        },
      },
    },
  }
}

describe('OCR2Keys', () => {
  it('renders the page', async () => {
    const payload = buildOCR2KeyBundles()
    const mocks: MockedResponse[] = [fetchOCR2KeyBundlesQuery(payload)]

    renderComponent(mocks)

    await waitForLoading()

    expect(await findByText(`Key ID: ${payload[0].id}`)).toBeInTheDocument()
  })

  it('renders GQL query errors', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: OCR2_KEY_BUNDLES_QUERY,
        },
        result: {
          errors: [new GraphQLError('Error!')],
        },
      },
    ]

    renderComponent(mocks)

    expect(await findByText('Error!')).toBeInTheDocument()
  })

  it('deletes an OCR2 Key Bundle', async () => {
    const payload = buildOCR2KeyBundle()

    const mocks: MockedResponse[] = [
      fetchOCR2KeyBundlesQuery([payload]),
      {
        request: {
          query: DELETE_OCR2_KEY_BUNDLE_MUTATION,
          variables: { id: payload.id },
        },
        result: {
          data: {
            deleteOCR2KeyBundle: {
              __typename: 'DeleteOCR2KeyBundleSuccess',
              bundle: payload,
            },
          },
        },
      },
      fetchOCR2KeyBundlesQuery([]),
    ]

    renderComponent(mocks)

    expect(await findByText(`Key ID: ${payload.id}`)).toBeInTheDocument()

    userEvent.click(getByRole('button', { name: /delete/i }))
    userEvent.click(getByRole('button', { name: /confirm/i }))

    await waitForElementToBeRemoved(getByRole('dialog'))

    expect(
      await findByText(
        'Successfully deleted Off-ChainReporting Key Bundle Key',
      ),
    ).toBeInTheDocument()

    expect(queryByText(`Key ID: ${payload.id}`)).toBeNull()
  })
})
