import { render } from '@testing-library/react'
import React from 'react'
import { D3Graph } from 'components/D3Chart/D3Graph'
import { parseDot } from 'utils/parseDot'
import { TaskRunStatus } from 'utils/taskRunStatus'

describe('D3Graph test', () => {
  it('renders a single node', async () => {
    const nodeData = parseDot(`digraph {ds1 [type=bridge name=voter_turnout];}`)
    const { container } = render(<D3Graph nodesData={nodeData} />)

    //Wait for render
    await new Promise((r) => setTimeout(r, 500))

    const ds1 = container
      .getElementsByClassName('task-run-icon-pending')
      .item(0)
    expect(ds1).toHaveAttribute('id', 'pending-run-icon-ds1')
  })

  it('renders five nodes', async () => {
    const nodeData = parseDot(`digraph {ds1 [type=bridge name=b1];
    ds2[type=bridge name=b2];
    ds3[type=bridge name=b3];
    ds4[type=bridge name=b4];
    ds5[type=bridge name=b5];
    }`)
    const { container } = render(<D3Graph nodesData={nodeData} />)

    //Wait for render
    await new Promise((r) => setTimeout(r, 500))

    const dss = container.getElementsByClassName('task-run-icon-pending')
    expect(dss.length).toBe(5)
    expect(dss.item(0)).toHaveAttribute('id', 'pending-run-icon-ds1')
    expect(dss.item(1)).toHaveAttribute('id', 'pending-run-icon-ds2')
    expect(dss.item(2)).toHaveAttribute('id', 'pending-run-icon-ds3')
    expect(dss.item(3)).toHaveAttribute('id', 'pending-run-icon-ds4')
    expect(dss.item(4)).toHaveAttribute('id', 'pending-run-icon-ds5')
  })

  it('renders 1000 nodes', async () => {
    let observationSoruce = ''
    for (let i = 0; i < 1000; i++) {
      observationSoruce += `ds${i} [type=bridge name=b${i}]\n`
    }
    const nodeData = parseDot(`digraph {${observationSoruce}}`)
    const { container } = render(<D3Graph nodesData={nodeData} />)

    //Wait for render
    await new Promise((r) => setTimeout(r, 500))

    const dss = container.getElementsByClassName('task-run-icon-pending')
    expect(dss.length).toBe(1000)

    for (let i = 0; i < 1000; i++) {
      expect(dss.item(i)).toHaveAttribute('id', `pending-run-icon-ds${i}`)
    }
  })

  it('renders 2 nodes in a loop', async () => {
    const nodeData = parseDot(`digraph {ds1 [type=bridge name=b1];
    ds2 [type=bridge name=b2];
    ds1->ds2
    ds2->ds1
    }`)
    const { container } = render(<D3Graph nodesData={nodeData} />)

    //Wait for render
    await new Promise((r) => setTimeout(r, 1000))

    const dss = container.getElementsByClassName('task-run-icon-pending')
    expect(dss.length).toBe(2)

    expect(dss.item(0)).toHaveAttribute('id', `pending-run-icon-ds1`)
    expect(dss.item(1)).toHaveAttribute('id', `pending-run-icon-ds2`)
  })

  it('renders nodes with different statuses', async () => {
    const nodeData = parseDot(`digraph {ds1 [type=bridge name=b1];
    ds2 [type=bridge name=b2];
    ds3 [type=bridge name=b3];
    ds4 [type=bridge name=b3];
    }`)

    nodeData[0].attributes = { status: TaskRunStatus.COMPLETE }
    nodeData[1].attributes = { status: TaskRunStatus.ERROR }
    nodeData[2].attributes = { status: TaskRunStatus.PENDING }
    nodeData[3].attributes = { status: TaskRunStatus.UNKNOWN }
    const { container } = render(<D3Graph nodesData={nodeData} />)

    //Wait for render
    await new Promise((r) => setTimeout(r, 500))

    const dss = container.getElementsByClassName('task-run-icon')
    expect(dss.length).toBe(4)

    expect(dss.item(0)).toHaveAttribute('id', `success-run-icon-ds1`)
    expect(dss.item(1)).toHaveAttribute('id', `error-run-icon-ds2`)
    expect(dss.item(2)).toHaveAttribute('id', `pending-run-icon-ds3`)
    expect(dss.item(3)).toHaveAttribute('id', `pending-run-icon-ds4`)
  })
})
