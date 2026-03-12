import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PrivateRoute from './PrivateRoute';
import * as AuthContext from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="mock-navigate" data-to={to}>Redirection vers {to}</div>,
}));

describe('Composant PrivateRoute', () => {

  it('doit afficher "Chargement..." quand l\'authentification est en cours de vérification', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ loading: true, token: null });

    render(
      <PrivateRoute>
        <div>Contenu Top Secret</div>
      </PrivateRoute>
    );

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
    
    expect(screen.queryByText('Contenu Top Secret')).not.toBeInTheDocument();
  });

  it('doit afficher le contenu enfant (children) si l\'utilisateur a un token', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ loading: false, token: 'mon-super-token-jwt' });

    render(
      <PrivateRoute>
        <div>Contenu Top Secret</div>
      </PrivateRoute>
    );

    expect(screen.getByText('Contenu Top Secret')).toBeInTheDocument();
    

    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  it('doit rediriger vers /login si l\'utilisateur n\'a pas de token', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ loading: false, token: null });

    render(
      <PrivateRoute>
        <div>Contenu Top Secret</div>
      </PrivateRoute>
    );

    expect(screen.queryByText('Contenu Top Secret')).not.toBeInTheDocument();

    const navigateMock = screen.getByTestId('mock-navigate');
    expect(navigateMock).toBeInTheDocument();
    expect(navigateMock).toHaveAttribute('data-to', '/login');
  });
});