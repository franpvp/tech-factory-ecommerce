import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';

jest.mock('../config/env', () => ({
  ENV: {
    SERVICE_CLIENTES: 'http://fake-api'
  }
}));

let mockAccounts = [];

jest.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    accounts: mockAccounts
  })
}));

global.fetch = jest.fn();

const TestConsumer = () => {
  const { rol, loadingRol, refetchRol } =
    require('../context/AuthContext').useAuth();

  return (
    <div>
      <span data-testid="rol">{rol}</span>
      <span data-testid="loading">{String(loadingRol)}</span>
      <button onClick={refetchRol}>refetch</button>
    </div>
  );
};

describe('AuthContext', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('cuando no hay cuentas MSAL, rol es null y loading false', async () => {
    mockAccounts = [];

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('rol')).toHaveTextContent('');
    });
  });

  test('obtiene el rol desde el backend correctamente', async () => {
    mockAccounts = [{ username: 'qa@test.com' }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        usuario: {
          tipoUsuarioDTO: {
            nombreTipo: 'ADMIN'
          }
        }
      })
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('rol')).toHaveTextContent('ADMIN');
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://fake-api/email/qa%40test.com'
    );
  });

  test('si el backend falla, rol queda null', async () => {
    mockAccounts = [{ username: 'qa@test.com' }];

    fetch.mockResolvedValueOnce({ ok: false });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('rol')).toHaveTextContent('');
    });
  });

  test('refetchRol vuelve a ejecutar la llamada', async () => {
    mockAccounts = [{ username: 'qa@test.com' }];

    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        usuario: {
          tipoUsuarioDTO: {
            nombreTipo: 'CLIENTE'
          }
        }
      })
    });

    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('rol')).toHaveTextContent('CLIENTE');
    });

    await user.click(screen.getByText('refetch'));

    expect(fetch).toHaveBeenCalledTimes(2);
  });

});