import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskForm from './TaskForm';
import * as TaskContext from '../contexts/TaskContext';

vi.mock('../contexts/TaskContext', () => ({
  useTask: vi.fn(),
}));

describe('Composant TaskForm', () => {
  let mockCreateTask, mockUpdateTask, mockOnClose;
  
  const mockUsers = [
    { id: '1', name: 'Alice', email: 'alice@test.com' },
    { id: '2', name: 'Bob', email: 'bob@test.com' }
  ];

  beforeEach(() => {
    mockCreateTask = vi.fn();
    mockUpdateTask = vi.fn();
    mockOnClose = vi.fn();
  
    vi.mocked(TaskContext.useTask).mockReturnValue({
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      users: mockUsers
    });
  });

  it('doit afficher le formulaire de création vide si aucune tâche n\'est passée', () => {
    render(<TaskForm onClose={mockOnClose} />);

    expect(screen.getByRole('heading', { name: 'Nouvelle tâche' })).toBeInTheDocument();
    expect(screen.getByLabelText(/titre\*/i).value).toBe('');
    expect(screen.getByLabelText(/priorité/i).value).toBe('medium');
    expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument();
  });

  it('doit pré-remplir le formulaire si une tâche existante est passée (mode édition)', () => {
    const existingTask = {
      id: 'task123',
      title: 'Faire les tests',
      description: 'Tests avec Vitest',
      priority: 'high',
      assignedTo: '1'
    };

    render(<TaskForm task={existingTask} onClose={mockOnClose} />);

    expect(screen.getByRole('heading', { name: 'Modifier la tâche' })).toBeInTheDocument();
    expect(screen.getByLabelText(/titre\*/i).value).toBe('Faire les tests');
    expect(screen.getByLabelText(/description/i).value).toBe('Tests avec Vitest');
    expect(screen.getByLabelText(/priorité/i).value).toBe('high');
    expect(screen.getByLabelText(/assigné à/i).value).toBe('1');
    expect(screen.getByRole('button', { name: 'Modifier' })).toBeInTheDocument();
  });

  it('doit appeler createTask et fermer le modal à la soumission d\'une nouvelle tâche', async () => {
    mockCreateTask.mockResolvedValue({ success: true });

    render(<TaskForm onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/titre\*/i), { target: { value: 'Nouvelle Feature' } });
    fireEvent.change(screen.getByLabelText(/priorité/i), { target: { value: 'low' } });
    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

    expect(mockCreateTask).toHaveBeenCalledWith({
      title: 'Nouvelle Feature',
      description: '',
      priority: 'low',
      assignedTo: ''
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('doit appeler updateTask et fermer le modal à la soumission d\'une modification', async () => {
    mockUpdateTask.mockResolvedValue({ success: true });
    const existingTask = { id: 'task123', title: 'Old Title', description: '', priority: 'medium', assignedTo: '' };

    render(<TaskForm task={existingTask} onClose={mockOnClose} />);

    // L'utilisateur change le titre
    fireEvent.change(screen.getByLabelText(/titre\*/i), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));

    expect(mockUpdateTask).toHaveBeenCalledWith('task123', {
      title: 'Updated Title',
      description: '',
      priority: 'medium',
      assignedTo: ''
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('doit afficher une erreur si la création échoue', async () => {
    mockCreateTask.mockResolvedValue({ success: false, error: 'Erreur de serveur' });

    render(<TaskForm onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText(/titre\*/i), { target: { value: 'Buggy Task' } });
    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

    await waitFor(() => {
      expect(screen.getByText('Erreur de serveur')).toBeInTheDocument();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('doit appeler onClose quand on clique sur le bouton Annuler ou la croix', () => {
    render(<TaskForm onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });
});