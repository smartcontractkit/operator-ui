import * as React from 'react'

import { render, screen } from 'support/test-utils'

import { NewFeedsManagerView } from './NewFeedsManagerView'

const { getByTestId, getByText } = screen

describe('NewFeedsManagerView', () => {
  it('renders with initial values', () => {
    const handleSubmit = jest.fn()

    render(<NewFeedsManagerView onSubmit={handleSubmit} />)

    expect(getByText('Register Job Distributor')).toBeInTheDocument()
    expect(getByTestId('feeds-manager-form')).toHaveFormValues({
      name: '',
      uri: '',
      publicKey: '',
    })
  })
})
