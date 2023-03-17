import * as React from 'react'

import { render, screen, waitForElementToBeRemoved } from 'support/test-utils'

import {
  buildOCR2KeyBundle,
  buildOCR2KeyBundles,
} from 'support/factories/gql/fetchOCR2KeyBundles'
import { OCR2KeysCard, Props as OCR2KeysCardProps } from './OCR2KeysCard'
import userEvent from '@testing-library/user-event'

const { getAllByRole, getByRole, queryByRole, queryByText } = screen

function renderComponent(cardProps: OCR2KeysCardProps) {
  render(<OCR2KeysCard {...cardProps} />)
}

describe('OCR2KeysCard', () => {
  let promise: Promise<any>
  let handleDelete: jest.Mock

  beforeEach(() => {
    promise = Promise.resolve()
    handleDelete = jest.fn(() => promise)
  })

  it('renders the key bundles', () => {
    const bundles = buildOCR2KeyBundles()

    renderComponent({
      loading: false,
      data: {
        ocr2KeyBundles: {
          results: bundles,
        },
      },
      onDelete: handleDelete,
    })

    expect(getAllByRole('row')).toHaveLength(3)

    expect(queryByText(`Key ID: ${bundles[0].id}`)).toBeInTheDocument()
    expect(queryByText(`Key ID: ${bundles[1].id}`)).toBeInTheDocument()
  })

  it('renders no content', () => {
    renderComponent({
      loading: false,
      data: {
        ocr2KeyBundles: {
          results: [],
        },
      },
      onDelete: handleDelete,
    })

    expect(queryByText('No entries to show')).toBeInTheDocument()
  })

  it('renders a loading spinner', () => {
    renderComponent({
      loading: true,
      onDelete: handleDelete,
    })

    expect(queryByRole('progressbar')).toBeInTheDocument()
  })

  it('calls onDelete', async () => {
    const bundle = buildOCR2KeyBundle()
    renderComponent({
      loading: false,
      data: {
        ocr2KeyBundles: {
          results: [bundle],
        },
      },
      onDelete: handleDelete,
    })

    userEvent.click(getByRole('button', { name: /delete/i }))
    expect(queryByText(bundle.id)).toBeInTheDocument()

    userEvent.click(getByRole('button', { name: /confirm/i }))

    await waitForElementToBeRemoved(getByRole('dialog'))

    expect(handleDelete).toHaveBeenCalled()
  })
})
