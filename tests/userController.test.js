const request = require('supertest');
const express = require('express');
const userController = require('../src/controllers/user');

// Mock PeopleService
jest.mock('../src/services/peopleService', () => ({
    getAllActive: jest.fn(),
    getById: jest.fn(),
    updateById: jest.fn(),
    deactivateById: jest.fn(),
    create: jest.fn(),
}));
const PeopleService = require('../src/services/peopleService');

const app = express();
app.use(express.json());

// Rutas de prueba
app.get('/api/users', userController.getUsers);
app.get('/api/users/:id', userController.getUserById);
app.put('/api/users/:id', userController.updateUsuario);
app.delete('/api/users/:id', userController.deleteUsuario);
app.post('/api/users', userController.crearUsuario);

describe('User Controller', () => {
    afterEach(() => jest.clearAllMocks());

    test('GET /api/users devuelve lista de usuarios', async () => {
        PeopleService.getAllActive.mockResolvedValue([{ name: 'Test User' }]);
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/users/:id devuelve usuario existente', async () => {
        PeopleService.getById.mockResolvedValue({ _id: '1', name: 'Test User' });
        const res = await request(app).get('/api/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('name', 'Test User');
    });

    test('GET /api/users/:id devuelve 404 si no existe', async () => {
        PeopleService.getById.mockResolvedValue(null);
        const res = await request(app).get('/api/users/2');
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });

    test('POST /api/users crea usuario', async () => {
        PeopleService.create.mockResolvedValue({ _id: '3', name: 'Nuevo' });
        const res = await request(app).post('/api/users').send({ email: 'nuevo@mail.com', name: 'Nuevo' });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    test('POST /api/users devuelve 400 si ya existe', async () => {
        PeopleService.create.mockResolvedValue(null);
        const res = await request(app).post('/api/users').send({ email: 'existe@mail.com' });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('PUT /api/users/:id actualiza usuario', async () => {
        PeopleService.getById.mockResolvedValue({ _id: '1', name: 'Test User' });
        PeopleService.updateById.mockResolvedValue({ _id: '1', name: 'Actualizado' });
        const res = await request(app).put('/api/users/1').send({ name: 'Actualizado' });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user).toHaveProperty('name', 'Actualizado');
    });

    test('DELETE /api/users/:id desactiva usuario', async () => {
        PeopleService.deactivateById.mockResolvedValue({ _id: '1', status: false });
        const res = await request(app).delete('/api/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('DELETE /api/users/:id devuelve 404 si no existe', async () => {
        PeopleService.deactivateById.mockResolvedValue(null);
        const res = await request(app).delete('/api/users/2');
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });
});
