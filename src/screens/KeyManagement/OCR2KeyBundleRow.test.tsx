import * as React from 'react'

import { render, screen } from 'support/test-utils'

import { buildOCR2KeyBundle } from 'support/factories/gql/fetchOCR2KeyBundles'
import { OCR2KeyBundleRow } from './OCR2KeyBundleRow'
import userEvent from '@testing-library/user-event'

const { getByRole, queryByText } = screen

describe('OCR2KeyBundleRow', () => {
  let handleDelete: jest.Mock

  beforeEach(() => {
    handleDelete = jest.fn()
  })

  function renderComponent(bundle: Ocr2KeyBundlesPayload_ResultsFields) {
    render(
      <table>
        <tbody>
          <OCR2KeyBundleRow bundle={bundle} onDelete={handleDelete} />
        </tbody>
      </table>,
    )
  }

  it('renders a row', () => {
    const bundle = buildOCR2KeyBundle()

    renderComponent(bundle)

    expect(queryByText(`Key ID: ${bundle.id}`)).toBeInTheDocument()
    expect(queryByText(`Chain Type: ${bundle.chainType}`)).toBeInTheDocument()
    expect(
      queryByText(`Config Public Key: ${bundle.configPublicKey}`),
    ).toBeInTheDocument()
    expect(
      queryByText(`On-Chain Public Key: ${bundle.onChainPublicKey}`),
    ).toBeInTheDocument()
    expect(
      queryByText(`Off-Chain Public Key: ${bundle.offChainPublicKey}`),
    ).toBeInTheDocument()
  })

  it('calls delete', () => {
    const bundle = buildOCR2KeyBundle()

    renderComponent(bundle)

    userEvent.click(getByRole('button', { name: /delete/i }))

    expect(handleDelete).toHaveBeenCalled()
  })
})
