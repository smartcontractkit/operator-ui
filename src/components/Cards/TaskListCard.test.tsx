import React from 'react'

import { render, screen } from '@testing-library/react'

import { TaskListCard } from './TaskListCard'
import { TaskRunStatus } from 'src/utils/taskRunStatus'

const { queryByText } = screen

describe('TaskListCard', () => {
  it('renders the task graph', async () => {
    const { container } = render(
      <TaskListCard observationSource="ds1 [type=bridge name=voter_turnout];" />,
    )

    //Wait for render
    await new Promise((r) => setTimeout(r, 500))

    const ds1 = container
      .getElementsByClassName('task-run-icon-pending')
      .item(0)

    expect(ds1).toHaveAttribute('id', 'pending-run-icon-ds1')
  })

  it('renders the task graph with a completed status', async () => {
    const { container } = render(
      <TaskListCard
        observationSource="ds1 [type=bridge name=voter_turnout];"
        attributes={{ ds1: { status: TaskRunStatus.COMPLETE } }}
      />,
    )

    //Wait for render
    await new Promise((r) => setTimeout(r, 500))

    const ds1 = container
      .getElementsByClassName('task-run-icon-success')
      .item(0)

    expect(ds1).toHaveAttribute('id', 'success-run-icon-ds1')
  })

  it('renders a not found message', () => {
    render(<TaskListCard observationSource="" />)

    expect(queryByText('No Task Graph Found')).toBeInTheDocument()
  })

  it('renders an error message', () => {
    render(<TaskListCard observationSource="<1231!!@#>" />)

    expect(queryByText('Failed to parse task graph')).toBeInTheDocument()
  })
})
