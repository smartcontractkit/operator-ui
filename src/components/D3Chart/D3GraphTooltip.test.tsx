import { render, screen } from '@testing-library/react'
import React from 'react'
import { parseDot } from 'utils/parseDot'
import { D3Tooltip } from 'components/D3Chart/D3GraphTooltip'
const { queryByText } = screen

describe('D3Graph Tooltip test', () => {
  it('renders tooltip', async () => {
    const nodeData = parseDot(
      `digraph {ds1 [type=bridge321123 name=voter_turnout];}`,
    )
    render(<D3Tooltip data={nodeData[0]} />)

    expect(queryByText('ds1')).toBeInTheDocument()
    expect(queryByText('bridge321123')).toBeInTheDocument()
    expect(queryByText('voter_turnout')).toBeInTheDocument()
  })

  it('renders tooltip with more data', async () => {
    const nodeData = parseDot(
      `digraph {ds1 [type=bridge321123 name=voter_turnout extraData="some-data" extraData2="some-more-data"];}`,
    )
    render(<D3Tooltip data={nodeData[0]} />)

    expect(queryByText('ds1')).toBeInTheDocument()
    expect(queryByText('bridge321123')).toBeInTheDocument()
    expect(queryByText('voter_turnout')).toBeInTheDocument()
    expect(queryByText('some-data')).toBeInTheDocument()
    expect(queryByText('some-more-data')).toBeInTheDocument()
  })

  it('renders tooltip and shows on mouse-over', async () => {
    const nodeData = parseDot(
      `digraph {ds1 [type=bridge321123 name=voter_turnout];}`,
    )
    render(<D3Tooltip data={nodeData[0]} />)

    expect(queryByText('ds1')).toBeInTheDocument()
    expect(queryByText('bridge321123')).toBeInTheDocument()
    expect(queryByText('voter_turnout')).toBeInTheDocument()
  })
})
