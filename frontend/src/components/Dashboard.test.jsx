import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import * as AuthContext from '../contexts/AuthContext';
import * as TaskContext from '../contexts/TaskContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../contexts/TaskContext', () => ({
  useTask: vi.fn(),
}));
vi.mock('./TaskForm', () => ({
  default: ({ task, onClose }) => (
    <div data-testid="mock-task-form">
      <span>{task ? 'Mode Édition' : 'Mode Création'}</span>
      <button onClick={onClose} data-testid="close-mock-form">Fermer</button>
    </div>
  ),
}));

vi.mock('./TaskList', () => ({
  default: ({ onEditTask }) => (
    <div data-testid="mock-task-list">
      {/* On crée un faux bouton pour simuler le clic sur "Modifier" d'une tâche */}
      <button 
        onClick={() => onEditTask({ id: 1, title: 'Tâche Test' })}
        data-testid="edit-mock-task"
      >
        Modifier une tâche
      </button>
    </div>
  ),
}));

describe('Composant Dashboard', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: { name: 'Alice', email: 'alice@test.com' },
      logout: mockLogout,
    });
    
    vi.mocked(TaskContext.useTask).mockReturnValue({
      tasks: [],
      loading: false,
    });
  });

  it('doit afficher les informations de l\'utilisateur et le bouton de déconnexion', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Gestionnaire de Tâches')).toBeInTheDocument();
    expect(screen.getByText('Bienvenue, Alice')).toBeInTheDocument();
    
    const logoutBtn = screen.getByRole('button', { name: /déconnexion/i });
    expect(logoutBtn).toBeInTheDocument();
    

    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('doit afficher le message de chargement si loading est true', () => {
    vi.mocked(TaskContext.useTask).mockReturnValue({ tasks: [], loading: true });
    
    render(<Dashboard />);
    
    expect(screen.getByText('Chargement des tâches...')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-task-list')).not.toBeInTheDocument();
  });

  it('doit ouvrir le TaskForm en mode création au clic sur "Nouvelle Tâche"', () => {
    render(<Dashboard />);
    
    expect(screen.queryByTestId('mock-task-form')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: /nouvelle tâche/i }));
    
    expect(screen.getByTestId('mock-task-form')).toBeInTheDocument();
    expect(screen.getByText('Mode Création')).toBeInTheDocument();
  });

  it('doit ouvrir le TaskForm en mode édition quand TaskList déclenche onEditTask', () => {
    render(<Dashboard />);
    
    fireEvent.click(screen.getByTestId('edit-mock-task'));
    
    expect(screen.getByTestId('mock-task-form')).toBeInTheDocument();
    expect(screen.getByText('Mode Édition')).toBeInTheDocument();
  });

  it('doit fermer le TaskForm quand la fonction onClose est appelée', () => {
    render(<Dashboard />);
    
    fireEvent.click(screen.getByRole('button', { name: /nouvelle tâche/i }));
    expect(screen.getByTestId('mock-task-form')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('close-mock-form'));

    expect(screen.queryByTestId('mock-task-form')).not.toBeInTheDocument();
  });
});