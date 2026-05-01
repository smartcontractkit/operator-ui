import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from 'support/test-utils'

jest.mock('../api', () => ({
  __esModule: true,
  v2: {
    webauthn: {
      beginKeyRegistration: jest.fn(),
      finishKeyRegistration: jest.fn(),
    },
  },
  sessions: {
    destroySession: jest.fn(),
  },
}))

import * as api from '../api'
import { AccountMenu } from './AccountMenu'

describe('AccountMenu', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(window.navigator, 'credentials', {
      configurable: true,
      value: {},
    })
  })

  afterAll(() => {
    alertSpy.mockRestore()
  })

  it('keeps the UI responsive when MFA registration fails on the server', async () => {
    ;(
      api.v2.webauthn.beginKeyRegistration as jest.MockedFunction<
        typeof api.v2.webauthn.beginKeyRegistration
      >
    ).mockRejectedValue(new Error('server error'))

    render(<AccountMenu />)

    userEvent.click(screen.getByRole('button'))
    userEvent.click(
      screen.getByRole('menuitem', { name: /register mfa token/i }),
    )

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Key registration error'),
      )
    })

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
