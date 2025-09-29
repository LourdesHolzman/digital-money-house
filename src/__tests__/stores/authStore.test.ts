import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '@/stores/authStore'

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset the store completely
    useAuthStore.getState().logout()
    useAuthStore.setState({
      paymentMethods: [],
      user: null,
      isAuthenticated: false
    })
    // Clear localStorage to prevent persistence interference
    localStorage.clear()
  })

  test('initial state should be unauthenticated', () => {
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.paymentMethods).toEqual([])
  })

  test('should login with correct credentials', async () => {
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      const success = await result.current.login({
        email: 'demo@digitalmoney.com',
        password: 'password123'
      })
      expect(success).toBe(true)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).not.toBeNull()
    expect(result.current.user?.email).toBe('demo@digitalmoney.com')
  })

  test('should reject login with incorrect credentials', async () => {
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      const success = await result.current.login({
        email: 'wrong@email.com',
        password: 'wrongpassword'
      })
      expect(success).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  test('should register new user', async () => {
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      const success = await result.current.register({
        email: 'new@user.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'New',
        lastName: 'User',
        phone: '+5491123456789'
      })
      expect(success).toBe(true)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.email).toBe('new@user.com')
    expect(result.current.user?.firstName).toBe('New')
    expect(result.current.user?.lastName).toBe('User')
  })

  test('should reject registration with mismatched passwords', async () => {
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      const success = await result.current.register({
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
        firstName: 'Test',
        lastName: 'User',
        phone: '+5491123456789'
      })
      expect(success).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
  })

  test('should logout user', async () => {
    const { result } = renderHook(() => useAuthStore())

    // First login
    await act(async () => {
      await result.current.login({
        email: 'demo@digitalmoney.com',
        password: 'password123'
      })
    })

    expect(result.current.isAuthenticated).toBe(true)

    // Then logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  test('should update user information', async () => {
    const { result } = renderHook(() => useAuthStore())

    // First login
    await act(async () => {
      await result.current.login({
        email: 'demo@digitalmoney.com',
        password: 'password123'
      })
    })

    const originalFirstName = result.current.user?.firstName

    // Update user
    act(() => {
      result.current.updateUser({ firstName: 'Updated' })
    })

    expect(result.current.user?.firstName).toBe('Updated')
    expect(result.current.user?.firstName).not.toBe(originalFirstName)
  })

  test('should update balance', async () => {
    const { result } = renderHook(() => useAuthStore())

    // First login
    await act(async () => {
      await result.current.login({
        email: 'demo@digitalmoney.com',
        password: 'password123'
      })
    })

    const originalBalance = result.current.user?.balance || 0

    // Update balance
    act(() => {
      result.current.updateBalance(1000)
    })

    expect(result.current.user?.balance).toBe(originalBalance + 1000)
  })

  test('should add payment method', async () => {
    const { result } = renderHook(() => useAuthStore())

    // First login
    await act(async () => {
      await result.current.login({
        email: 'demo@digitalmoney.com',
        password: 'password123'
      })
    })

    const paymentMethod = {
      cardNumber: '4111111111111111',
      cardHolder: 'Test User',
      expiryDate: '12/25',
      cvv: '123',
      type: 'credit' as const
    }

    act(() => {
      result.current.addPaymentMethod(paymentMethod)
    })

    expect(result.current.paymentMethods).toHaveLength(1)
    expect(result.current.paymentMethods[0].cardNumber).toBe('4111111111111111')
    expect(result.current.paymentMethods[0].isDefault).toBe(true)
  })

  test('should remove payment method', async () => {
    const { result } = renderHook(() => useAuthStore())

    // First login and add payment method
    await act(async () => {
      await result.current.login({
        email: 'demo@digitalmoney.com',
        password: 'password123'
      })
    })

    act(() => {
      result.current.addPaymentMethod({
        cardNumber: '4111111111111111',
        cardHolder: 'Test User',
        expiryDate: '12/25',
        cvv: '123',
        type: 'credit'
      })
    })

    const paymentMethodId = result.current.paymentMethods[0].id

    act(() => {
      result.current.removePaymentMethod(paymentMethodId)
    })

    expect(result.current.paymentMethods).toHaveLength(0)
  })

  test('should set default payment method', async () => {
    const { result } = renderHook(() => useAuthStore())

    // First login
    await act(async () => {
      await result.current.login({
        email: 'demo@digitalmoney.com',
        password: 'password123'
      })
    })

    // Add two payment methods in sequence
    act(() => {
      result.current.addPaymentMethod({
        cardNumber: '4111111111111111',
        cardHolder: 'Test User 1',
        expiryDate: '12/25',
        cvv: '123',
        type: 'credit'
      })
    })

    act(() => {
      result.current.addPaymentMethod({
        cardNumber: '5555555555554444',
        cardHolder: 'Test User 2',
        expiryDate: '12/26',
        cvv: '456',
        type: 'credit'
      })
    })

    // Get the IDs and verify initial state
    const firstCard = result.current.paymentMethods[0]
    const secondCard = result.current.paymentMethods[1]

    expect(firstCard.isDefault).toBe(true)
    expect(secondCard.isDefault).toBe(false)

    // Set second card as default
    act(() => {
      result.current.setDefaultPaymentMethod(secondCard.id)
    })

    // Check final state - find cards by ID to avoid index issues
    const updatedFirstCard = result.current.paymentMethods.find(pm => pm.id === firstCard.id)
    const updatedSecondCard = result.current.paymentMethods.find(pm => pm.id === secondCard.id)

    expect(updatedFirstCard?.isDefault).toBe(false)
    expect(updatedSecondCard?.isDefault).toBe(true)
  })
})