import React from 'react'
import { BuildInfoProvider, render, screen } from 'support/test-utils'

import { NodeInfoCard } from './NodeInfoCard'

const { queryByText } = screen

describe('NodeInfoCard', () => {
  it('renders the node info card', () => {
    render(
      <BuildInfoProvider>
        <NodeInfoCard />
      </BuildInfoProvider>,
    )

    expect(queryByText(/version/i)).toBeInTheDocument()
    expect(queryByText('1.0.0')).toBeInTheDocument()

    expect(queryByText(/sha/i)).toBeInTheDocument()
    expect(
      queryByText('6989a388ef26d981e771fec6710dc65bcc8fb5af'),
    ).toBeInTheDocument()
  })
})
