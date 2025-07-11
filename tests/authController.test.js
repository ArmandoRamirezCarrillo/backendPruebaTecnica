const request = require('supertest');
const express = require('express');
const authController = require('../src/controllers/auth');

// Mock dependencias
const mockSave = jest.fn();
const mockUsuario = function(data) {
  return { ...data, save: mockSave };
};
jest.mock('../src/models/Usuario', () => {
  return Object.assign(
    jest.fn((data) => mockUsuario(data)),
    {
      findOne: jest.fn()
    }
  );
});
jest.mock('../src/helpers/jwt', () => ({
    generarJWT: jest.fn()
}));
const Usuario = require('../src/models/Usuario');
const { generarJWT } = require('../src/helpers/jwt');

const app = express();
app.use(express.json());

// Rutas de prueba
app.post('/api/auth/register', authController.crearUsuario);
app.post('/api/auth/login', authController.loginUsuario);
app.get('/api/auth/renew', (req, res) => {
    req.uid = 'mockUid';
    req.name = 'mockName';
    return authController.renovarToken(req, res);
});

describe('Auth Controller', () => {
    afterEach(() => jest.clearAllMocks());

    test('POST /api/auth/register crea usuario nuevo', async () => {
        Usuario.findOne.mockResolvedValue(null);
        mockSave.mockResolvedValue();
        generarJWT.mockResolvedValue('mockToken');
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'nuevo@mail.com', password: '123456', name: 'Nuevo' });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('token', 'mockToken');
    });

    test('POST /api/auth/register rechaza usuario existente', async () => {
        Usuario.findOne.mockResolvedValue({ email: 'existe@mail.com' });
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'existe@mail.com', password: '123456', name: 'Existente' });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/login login exitoso', async () => {
        Usuario.findOne.mockResolvedValue({
            email: 'test@mail.com',
            password: require('bcryptjs').hashSync('123456', 10),
            id: 'mockId',
            name: 'Test'
        });
        generarJWT.mockResolvedValue('mockToken');
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@mail.com', password: '123456' });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('token', 'mockToken');
    });

    test('POST /api/auth/login rechaza usuario inexistente', async () => {
        Usuario.findOne.mockResolvedValue(null);
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'noexiste@mail.com', password: '123456' });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('POST /api/auth/login rechaza password incorrecto', async () => {
        Usuario.findOne.mockResolvedValue({
            email: 'test@mail.com',
            password: require('bcryptjs').hashSync('abcdef', 10),
            id: 'mockId',
            name: 'Test'
        });
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@mail.com', password: '123456' });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('GET /api/auth/renew renueva token', async () => {
        generarJWT.mockResolvedValue('mockToken');
        const res = await request(app).get('/api/auth/renew');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('token', 'mockToken');
    });
});
