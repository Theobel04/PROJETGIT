import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskList from './TaskList';


vi.mock('./TaskCard', () => {
  return {
    default: ({ task }) => (
      <div data-testid={`mock-task-${task.id}`}>
        {task.title}
      </div>
    )
  };
});

describe('Composant TaskList', () => {
  const mockEditTask = vi.fn();

  it('doit afficher les 3 colonnes avec les compteurs à 0 si la liste est vide', () => {

    render(<TaskList tasks={[]} onEditTask={mockEditTask} />);

    expect(screen.getByRole('heading', { name: 'À faire' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'En cours' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Terminé' })).toBeInTheDocument();

    const counts = screen.getAllByText('0');
    expect(counts).toHaveLength(3);

    expect(screen.getByText('Aucune tâche à faire')).toBeInTheDocument();
    expect(screen.getByText('Aucune tâche en cours')).toBeInTheDocument();
    expect(screen.getByText('Aucune tâche terminé')).toBeInTheDocument(); 
  });

  it('doit répartir les tâches dans les bonnes colonnes selon leur statut', () => {
    const mockTasks = [
      { id: 1, title: 'Faire le design', status: 'todo' },
      { id: 2, title: 'Créer la BDD', status: 'todo' },
      { id: 3, title: 'Coder le back', status: 'progress' },
    ];

    render(<TaskList tasks={mockTasks} onEditTask={mockEditTask} />);

    expect(screen.getByText('Faire le design')).toBeInTheDocument();
    expect(screen.getByText('Créer la BDD')).toBeInTheDocument();
    expect(screen.getByText('Coder le back')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();

    expect(screen.getByText('Aucune tâche terminé')).toBeInTheDocument();
    
    expect(screen.queryByText('Aucune tâche à faire')).not.toBeInTheDocument();
    expect(screen.queryByText('Aucune tâche en cours')).not.toBeInTheDocument();
  });
});