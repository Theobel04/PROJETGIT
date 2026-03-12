import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import * as AuthContext from '../contexts/AuthContext';

// 1. On "mock" (simule) la navigation pour vérifier si on est bien redirigé
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. On "mock" le contexte d'authentification
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Composant Login', () => {
  let mockLogin;

  beforeEach(() => {
    // Avant chaque test, on remet les compteurs à zéro
    mockLogin = vi.fn();
    vi.mocked(AuthContext.useAuth).mockReturnValue({ login: mockLogin });
    mockNavigate.mockClear();
  });

  it('doit afficher le formulaire de connexion correctement', () => {
    // MemoryRouter est obligatoire car le composant utilise un <Link>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('doit appeler la fonction login et rediriger vers le dashboard en cas de succès', async () => {
    // On simule une réponse POSITIVE du backend
    mockLogin.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // L'utilisateur remplit le formulaire
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

    // L'utilisateur clique sur le bouton
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // On vérifie que la fonction login a été appelée avec les bons identifiants
    expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'password123');

    // waitFor est utilisé car la fonction handleSubmit est asynchrone (async/await)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it("doit afficher un message d'erreur si la connexion échoue", async () => {
    // On simule une réponse NÉGATIVE du backend
    mockLogin.mockResolvedValue({ success: false, error: 'Identifiants incorrects' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'mauvais@test.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'fauxmdp' } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // On vérifie que le message d'erreur apparaît bien sur l'écran
    await waitFor(() => {
      expect(screen.getByText('Identifiants incorrects')).toBeInTheDocument();
    });
    
    // On s'assure qu'il n'y a pas eu de redirection
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});