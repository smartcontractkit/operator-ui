import React from 'react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter, screen } from 'support/test-utils'

import { SettingsMenu } from './SettingsMenu'

describe('SettingsMenu', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists dark mode preference when toggled', () => {
    renderWithRouter(<SettingsMenu />)

    userEvent.click(screen.getByRole('button'))
    userEvent.click(screen.getByRole('menuitem', { name: /dark mode/i }))

    expect(localStorage.getItem('chainlink.themeMode')).toBe('dark')
  })
})
