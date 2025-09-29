import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PayServicesPage from '@/app/pay-services/page'

// Mock the auth store
jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '123456789',
      cvu: '0000003100010000000001',
      alias: 'test.user.dmh',
      balance: 50000,
      createdAt: new Date(),
    },
    isAuthenticated: true,
    updateBalance: jest.fn(),
  })),
}))

describe('PayServicesPage - Sprint 4 Features', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Service List and Search', () => {
    test('should display all services without pagination', () => {
      render(<PayServicesPage />)

      // Check that all 6 services are displayed
      expect(screen.getByText('Edesur')).toBeInTheDocument()
      expect(screen.getByText('Metrogas')).toBeInTheDocument()
      expect(screen.getByText('AySA')).toBeInTheDocument()
      expect(screen.getByText('Telecom')).toBeInTheDocument()
      expect(screen.getByText('Movistar')).toBeInTheDocument()
      expect(screen.getByText('Claro')).toBeInTheDocument()
    })

    test('should have a search functionality', () => {
      render(<PayServicesPage />)

      const searchInput = screen.getByLabelText(/buscar servicio/i)
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('placeholder', 'Busca por nombre, categoría o descripción...')
    })

    test('should filter services by name', async () => {
      const user = userEvent.setup()
      render(<PayServicesPage />)

      const searchInput = screen.getByLabelText(/buscar servicio/i)

      await user.type(searchInput, 'Edesur')

      expect(screen.getByText('Edesur')).toBeInTheDocument()
      expect(screen.queryByText('Metrogas')).not.toBeInTheDocument()
      expect(screen.queryByText('AySA')).not.toBeInTheDocument()
    })

    test('should filter services by category', async () => {
      const user = userEvent.setup()
      render(<PayServicesPage />)

      const searchInput = screen.getByLabelText(/buscar servicio/i)

      await user.type(searchInput, 'Telefonía')

      expect(screen.getByText('Telecom')).toBeInTheDocument()
      expect(screen.getByText('Movistar')).toBeInTheDocument()
      expect(screen.getByText('Claro')).toBeInTheDocument()
      expect(screen.queryByText('Edesur')).not.toBeInTheDocument()
    })

    test('should show no results message when search has no matches', async () => {
      const user = userEvent.setup()
      render(<PayServicesPage />)

      const searchInput = screen.getByLabelText(/buscar servicio/i)

      await user.type(searchInput, 'NoExiste')

      expect(screen.getByText(/no se encontraron servicios/i)).toBeInTheDocument()
    })
  })

  describe('Account Number Validation', () => {
    beforeEach(async () => {
      render(<PayServicesPage />)

      // Select a service first
      const edesurCard = screen.getByText('Edesur').closest('div[role="button"], div')
      if (edesurCard) {
        fireEvent.click(edesurCard)
      }

      await waitFor(() => {
        expect(screen.getByText(/pagar edesur/i)).toBeInTheDocument()
      })
    })

    test('should show account validation step first', () => {
      expect(screen.getByLabelText(/número de cuenta/i)).toBeInTheDocument()
      expect(screen.getByText(/validar número de cuenta/i)).toBeInTheDocument()
      expect(screen.getByText(/cuentas de prueba válidas/i)).toBeInTheDocument()
    })

    test('should show valid account numbers for the selected service', () => {
      expect(screen.getByText('123456789')).toBeInTheDocument()
      expect(screen.getByText('987654321')).toBeInTheDocument()
      expect(screen.getByText('555666777')).toBeInTheDocument()
    })

    test('should validate account number correctly', async () => {
      const user = userEvent.setup()

      const accountInput = screen.getByLabelText(/número de cuenta/i)
      const validateButton = screen.getByText(/validar número de cuenta/i)

      await user.type(accountInput, '123456789')
      await user.click(validateButton)

      await waitFor(() => {
        expect(screen.getByText(/cuenta válida - facturas pendientes encontradas/i)).toBeInTheDocument()
      })
    })

    test('should show error for invalid account number', async () => {
      const user = userEvent.setup()

      const accountInput = screen.getByLabelText(/número de cuenta/i)
      const validateButton = screen.getByText(/validar número de cuenta/i)

      await user.type(accountInput, '999999999')
      await user.click(validateButton)

      await waitFor(() => {
        expect(screen.getByText(/número de cuenta inválido/i)).toBeInTheDocument()
      })
    })

    test('should validate account number format', async () => {
      const user = userEvent.setup()

      const accountInput = screen.getByLabelText(/número de cuenta/i)
      const validateButton = screen.getByText(/validar número de cuenta/i)

      // Test with letters
      await user.type(accountInput, 'abc123')
      await user.click(validateButton)

      expect(screen.getByText(/solo se permiten números/i)).toBeInTheDocument()
    })
  })

  describe('Payment Method Selection', () => {
    beforeEach(async () => {
      render(<PayServicesPage />)

      // Navigate to payment step
      const edesurCard = screen.getByText('Edesur').closest('div[role="button"], div')
      if (edesurCard) {
        fireEvent.click(edesurCard)
      }

      await waitFor(() => {
        expect(screen.getByLabelText(/número de cuenta/i)).toBeInTheDocument()
      })

      const user = userEvent.setup()
      const accountInput = screen.getByLabelText(/número de cuenta/i)
      const validateButton = screen.getByText(/validar número de cuenta/i)

      await user.type(accountInput, '123456789')
      await user.click(validateButton)

      await waitFor(() => {
        expect(screen.getByText(/cuenta válida/i)).toBeInTheDocument()
      })
    })

    test('should show wallet balance option', () => {
      expect(screen.getByText(/pagar con saldo de billetera/i)).toBeInTheDocument()
      expect(screen.getByText(/\$50\.000,00 disponible/)).toBeInTheDocument()
    })

    test('should show card payment option', () => {
      expect(screen.getByText(/pagar con tarjeta/i)).toBeInTheDocument()
    })

    test('should show card selection when card payment is selected', async () => {
      const user = userEvent.setup()

      const cardRadio = screen.getByLabelText(/pagar con tarjeta/i)
      await user.click(cardRadio)

      expect(screen.getByText(/selecciona una tarjeta/i)).toBeInTheDocument()
      expect(screen.getByText(/agregar nueva tarjeta/i)).toBeInTheDocument()
    })

    test('should show add new payment method button', async () => {
      const user = userEvent.setup()

      const cardRadio = screen.getByLabelText(/pagar con tarjeta/i)
      await user.click(cardRadio)

      const addCardButton = screen.getByText(/agregar nueva tarjeta/i)
      expect(addCardButton).toBeInTheDocument()
    })
  })

  describe('Payment Result Validation', () => {
    test('should show insufficient funds error', async () => {
      render(<PayServicesPage />)

      // Navigate through the flow
      const edesurCard = screen.getByText('Edesur').closest('div[role="button"], div')
      if (edesurCard) {
        fireEvent.click(edesurCard)
      }

      const user = userEvent.setup()

      await waitFor(() => {
        expect(screen.getByLabelText(/número de cuenta/i)).toBeInTheDocument()
      })

      const accountInput = screen.getByLabelText(/número de cuenta/i)
      await user.type(accountInput, '123456789')
      await user.click(screen.getByText(/validar número de cuenta/i))

      await waitFor(() => {
        expect(screen.getByText(/cuenta válida/i)).toBeInTheDocument()
      })

      // Enter amount higher than balance
      const amountInput = screen.getByLabelText(/monto a pagar/i)
      await user.type(amountInput, '100000')

      // Select wallet payment
      const walletRadio = screen.getByLabelText(/pagar con saldo de billetera/i)
      await user.click(walletRadio)

      expect(screen.getByText(/saldo insuficiente/i)).toBeInTheDocument()
    })

    test('should show payment summary', async () => {
      render(<PayServicesPage />)

      const edesurCard = screen.getByText('Edesur').closest('div[role="button"], div')
      if (edesurCard) {
        fireEvent.click(edesurCard)
      }

      const user = userEvent.setup()

      await waitFor(() => {
        expect(screen.getByLabelText(/número de cuenta/i)).toBeInTheDocument()
      })

      const accountInput = screen.getByLabelText(/número de cuenta/i)
      await user.type(accountInput, '123456789')
      await user.click(screen.getByText(/validar número de cuenta/i))

      await waitFor(() => {
        expect(screen.getByText(/cuenta válida/i)).toBeInTheDocument()
      })

      const amountInput = screen.getByLabelText(/monto a pagar/i)
      await user.type(amountInput, '1000')

      // Should show payment summary
      await waitFor(() => {
        expect(screen.getByText(/servicio:/i)).toBeInTheDocument()
        expect(screen.getByText(/cuenta:/i)).toBeInTheDocument()
        expect(screen.getByText(/monto a pagar:/i)).toBeInTheDocument()
        expect(screen.getByText('Edesur')).toBeInTheDocument()
        expect(screen.getByText('123456789')).toBeInTheDocument()
      })
    })
  })
})