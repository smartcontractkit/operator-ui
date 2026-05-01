import * as React from 'react'

import { render, screen, waitFor } from 'support/test-utils'
import userEvent from '@testing-library/user-event'

import { FeedsManagerForm, FormValues } from './FeedsManagerForm'

const { getByRole, getByTestId, getByText } = screen

describe('FeedsManagerForm', () => {
  it('validates input', async () => {
    const handleSubmit = jest.fn()
    const initialValues: FormValues = {
      name: '',
      uri: '',
      publicKey: '',
    }

    render(
      <FeedsManagerForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />,
    )

    userEvent.click(getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(getByTestId('name-helper-text')).toHaveTextContent('Required')
      expect(getByTestId('uri-helper-text')).toHaveTextContent('Required')
      expect(getByTestId('publicKey-helper-text')).toHaveTextContent('Required')
    })
  })

  it('submits the form', async () => {
    const handleSubmit = jest.fn()
    const initialValues: FormValues = {
      name: '',
      uri: '',
      publicKey: '',
    }

    render(
      <FeedsManagerForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />,
    )

    userEvent.type(
      getByRole('textbox', { name: /^name$/i }),
      'Chainlink Feeds Manager',
    )
    userEvent.type(getByRole('textbox', { name: /^uri$/i }), 'localhost:8080')
    userEvent.type(getByRole('textbox', { name: /^public key$/i }), '11111')

    userEvent.click(getByText(/submit/i))

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(
        {
          name: 'Chainlink Feeds Manager',
          uri: 'localhost:8080',
          publicKey: '11111',
        },
        expect.anything(),
      ),
    )
  })
})
