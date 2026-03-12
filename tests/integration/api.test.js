const request = require('supertest');
const app = require('../../backend/server');

let token = '';
let taskId = '';

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password' });
  token = res.body.token;
});

describe('Health Check', () => {
  test('GET /health répond OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});

describe('Auth API', () => {
  test('POST /api/auth/login — succès', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('admin@test.com');
  });

  test('POST /api/auth/login — mauvais mot de passe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'mauvais' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/register — crée un compte', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: '123456' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/register — email déjà utilisé', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin', email: 'admin@test.com', password: '123456' });
    expect(res.status).toBe(400);
  });
});

describe('Tasks API', () => {
  test('GET /api/tasks — sans token, refusé', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  test('POST /api/tasks — crée une tâche', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tâche intégration', priority: 'high' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Tâche intégration');
    taskId = res.body.id;
  });

  test('GET /api/tasks — liste les tâches', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/tasks/:id — récupère une tâche', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
  });

  test('PUT /api/tasks/:id — met à jour le statut', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
  });

  test('DELETE /api/tasks/:id — supprime une tâche', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});

describe('Users API', () => {
  test('GET /api/users — retourne la liste sans mots de passe', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(u => expect(u.password).toBeUndefined());
  });
});
