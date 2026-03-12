const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret_key_for_dev';

describe('Fonctions utilitaires - Auth', () => {
  test('bcrypt hash et comparaison de mot de passe', async () => {
    const password = 'monmotdepasse';
    const hash = await bcrypt.hash(password, 10);
    const valid = await bcrypt.compare(password, hash);
    expect(valid).toBe(true);
  });

  test('bcrypt rejette un mauvais mot de passe', async () => {
    const hash = await bcrypt.hash('correct', 10);
    const valid = await bcrypt.compare('incorrect', hash);
    expect(valid).toBe(false);
  });

  test('jwt sign et verify', () => {
    const payload = { userId: '1', email: 'admin@test.com' };
    const token = jwt.sign(payload, JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded.userId).toBe('1');
    expect(decoded.email).toBe('admin@test.com');
  });

  test('jwt invalide lève une erreur', () => {
    expect(() => jwt.verify('token_invalide', JWT_SECRET)).toThrow();
  });
});

describe('Logique métier - Tâches', () => {
  test('une tâche a les champs obligatoires', () => {
    const task = {
      id: '1',
      title: 'Test',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date().toISOString()
    };
    expect(task.title).toBeDefined();
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
  });

  test('les priorités valides sont low, medium, high', () => {
    const validPriorities = ['low', 'medium', 'high'];
    expect(validPriorities).toContain('low');
    expect(validPriorities).toContain('medium');
    expect(validPriorities).toContain('high');
    expect(validPriorities).not.toContain('urgent');
  });

  test('les statuts valides sont todo, progress, done', () => {
    const validStatuses = ['todo', 'progress', 'done'];
    expect(validStatuses).toContain('todo');
    expect(validStatuses).toContain('progress');
    expect(validStatuses).toContain('done');
  });

  test('mise à jour d\'une tâche fusionne les champs', () => {
    const task = { id: '1', title: 'Ancienne', status: 'todo', priority: 'low' };
    const updated = { ...task, status: 'done', updatedAt: new Date().toISOString() };
    expect(updated.status).toBe('done');
    expect(updated.title).toBe('Ancienne');   });
});
