/* eslint-disable react/display-name */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import { SignIn } from './SignIn' // Adjust the import path as needed
import { notifyErrorMsg } from 'actionCreators'
import { AuthActionType } from 'src/reducers/actions'

// Mock dependencies
jest.mock('components/Logos/Hexagon', () => () => <div>HexagonLogo</div>)
jest.mock('components/Button', () => ({ children, ...props }) => (
  <button {...props}>{children}</button>
))
jest.mock('../utils/storage', () => ({
  getPersistUrl: jest.fn(() => '/dashboard'),
}))
jest.mock('axios')

// Mock Material-UI styles
const mockClasses = {
  container: 'container',
  cardContent: 'card-content',
  headerRow: 'header-row',
  error: 'error',
  errorText: 'error-text',
}

// Create Redux mock store
const mockStore = configureStore([])
const store = mockStore({
  authentication: { fetching: false, allowed: false },
  notifications: { errors: [] },
})

describe('pages/Signin', () => {
  const renderComponent = (props = {}, initialEntries = ['/']) => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <SignIn
            classes={mockClasses}
            fetching={false}
            authenticated={false}
            errors={[]}
            submitSignIn={jest.fn()}
            {...props}
          />
        </MemoryRouter>
      </Provider>,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    store.clearActions()
  })

  test('renders sign-in form', () => {
    renderComponent()
    expect(screen.getByText('HexagonLogo')).toBeInTheDocument()
    expect(screen.getByText('Operator')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByText('Access Account')).toBeInTheDocument()
  })

  test('updates email and password inputs', () => {
    renderComponent()
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com')
    expect(screen.getByLabelText('Password')).toHaveValue('password123')
  })

  test('submits form with credentials', () => {
    const mockSubmitSignIn = jest.fn()
    renderComponent({ submitSignIn: mockSubmitSignIn })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByText('Access Account'))
    expect(mockSubmitSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  test('redirects when authenticated', () => {
    renderComponent({ authenticated: true })
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument()
  })

  test('checks if OIDC is enabled', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ enabled: true }),
      }),
    )
    renderComponent()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/oidc-enabled'),
      )
    })

    expect(screen.getByText('Login with OIDC')).toBeInTheDocument()
  })

  test('handles successful OIDC token exchange', async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ success: true }),
        }),
      ) // For the /oidc-exchange call
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ enabled: false }),
        }),
      ) // For the /oidc-enabled call

    renderComponent({}, ['/?code=abc123&state=xyz'])

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('/oidc-exchange'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: 'abc123', state: 'xyz' }),
          credentials: 'include',
        }),
      )
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('/oidc-enabled'),
      )
      expect(store.getActions()).toContainEqual({
        type: AuthActionType.RECEIVE_SIGNIN_SUCCESS,
        authenticated: true,
      })
    })
  })

  test('handles failed OIDC token exchange', async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              success: false,
              message: 'Token exchange failed',
            }),
        }),
      ) // Mock for /oidc-exchange
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ enabled: false }),
        }),
      ) // Mock for /oidc-enabled

    renderComponent({}, ['/?code=abc123&state=xyz'])

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('/oidc-exchange'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: 'abc123', state: 'xyz' }),
          credentials: 'include',
        }),
      )
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('/oidc-enabled'),
      )
      expect(store.getActions()).toContainEqual(
        notifyErrorMsg('Authentication failed'),
      )
    })
  })

  test('handles OIDC provider error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ enabled: false }),
      }),
    )
    renderComponent({}, ['/?error=access_denied'])

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        notifyErrorMsg('Authentication failed'),
      )
    })
  })
})
