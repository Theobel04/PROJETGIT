import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import * as AuthContext from '../contexts/AuthContext';

// 1. Mock de la navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. Mock du contexte d'authentification
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Composant Register', () => {
  let mockRegister;

  beforeEach(() => {
    // On remet les fonctions à zéro avant chaque test
    mockRegister = vi.fn();
    vi.mocked(AuthContext.useAuth).mockReturnValue({ register: mockRegister });
    mockNavigate.mockClear();
  });

  it('doit afficher le formulaire d\'inscription avec tous ses champs', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /inscription/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nom:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    // On utilise la chaîne exacte pour ne pas confondre les deux champs "mot de passe"
    expect(screen.getByLabelText('Mot de passe:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmer le mot de passe:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });

  it('doit bloquer l\'inscription et afficher une erreur si les mots de passe ne correspondent pas', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // On remplit le formulaire avec des mots de passe différents
    fireEvent.change(screen.getByLabelText(/nom:/i), { target: { value: 'Theo' } });
    fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: 'theo@test.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe:'), { target: { value: 'different123' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    // On vérifie que le message d'erreur local s'affiche
    expect(await screen.findByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
    
    // TRÈS IMPORTANT : On vérifie que la fonction register() n'a JAMAIS été appelée
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('doit appeler la fonction register et rediriger vers /dashboard en cas de succès', async () => {
    // On simule un retour positif du backend
    mockRegister.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nom:/i), { target: { value: 'Theo' } });
    fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: 'theo@test.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe:'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    // On vérifie que les bons paramètres ont été envoyés (attention à l'ordre : email, password, name)
    expect(mockRegister).toHaveBeenCalledWith('theo@test.com', 'password123', 'Theo');

    // On vérifie la redirection
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('doit afficher une erreur du backend si l\'inscription échoue (ex: email déjà pris)', async () => {
    // On simule un échec venant du backend
    mockRegister.mockResolvedValue({ success: false, error: 'Cet email est déjà utilisé' });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nom:/i), { target: { value: 'Theo' } });
    fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: 'theo@test.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe:'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    // On attend que l'erreur s'affiche
    await waitFor(() => {
      expect(screen.getByText('Cet email est déjà utilisé')).toBeInTheDocument();
    });
    
    // On vérifie qu'on est bien resté sur la page
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});