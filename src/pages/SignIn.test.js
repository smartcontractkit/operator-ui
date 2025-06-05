import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import axios from 'axios'
import { SignIn } from './SignIn' // Adjust the import path as needed
import { notifyErrorMsg } from 'actionCreators'
import { AuthActionType } from 'src/reducers/actions'

// Mock dependencies
jest.mock('components/Logos/Hexagon', function Hexagon() {
  return <div>HexagonLogo</div>
})
jest.mock('components/Button', function Button({ children, ...props }) {
  return <button {...props}>{children}</button>
})
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
    axios.get.mockResolvedValue({ data: { enabled: false } })
    axios.post.mockResolvedValue({ data: { success: true } })
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
    axios.get.mockResolvedValueOnce({ data: { enabled: true } })
    renderComponent()

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/oidc-enabled'),
      )
    })

    // Check OIDC button appears when enabled
    expect(screen.getByText('Login with OIDC')).toBeInTheDocument()
  })

  test('handles successful OIDC token exchange', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } })
    renderComponent({}, ['/?code=abc123&state=xyz'])

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/oidc-exchange'),
        { code: 'abc123', state: 'xyz' },
        { withCredentials: true },
      )
      expect(store.getActions()).toContainEqual({
        type: AuthActionType.RECEIVE_SIGNIN_SUCCESS,
        authenticated: true,
      })
    })
  })

  test('handles failed OIDC token exchange', async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: false, message: 'Token exchange failed' },
    })
    renderComponent({}, ['/?code=abc123&state=xyz'])

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/oidc-exchange'),
        { code: 'abc123', state: 'xyz' },
        { withCredentials: true },
      )
      expect(store.getActions()).toContainEqual(
        notifyErrorMsg('Token exchange failed'),
      )
    })
  })

  test('handles OIDC provider error', async () => {
    renderComponent({}, ['/?error=access_denied'])

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        notifyErrorMsg('Authentication failed'),
      )
    })
  })
})
