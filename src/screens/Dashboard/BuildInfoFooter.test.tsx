import React from 'react'
import { BuildInfoProvider, render, screen } from 'support/test-utils'
import { BuildInfoFooter } from './BuildInfoFooter'

const { getByRole, queryByText } = screen

describe('BuildInfoFooter', () => {
  it('renders the footer', () => {
    render(
      <BuildInfoProvider>
        <BuildInfoFooter></BuildInfoFooter>
      </BuildInfoProvider>,
    )
    expect(queryByText(/chainlink node 1\.0\.0 at commit/i)).toBeInTheDocument()
    expect(
      getByRole('link', { name: '6989a388ef26d981e771fec6710dc65bcc8fb5af' }),
    ).toHaveAttribute(
      'href',
      'https://github.com/smartcontractkit/chainlink/commit/6989a388ef26d981e771fec6710dc65bcc8fb5af',
    )
  })
})
