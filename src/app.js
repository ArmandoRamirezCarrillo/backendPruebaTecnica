const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('./middlewares/rateLimit');
require('dotenv').config();

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger');

//Servidor de express
const app = express();

// Middleware de seguridad
app.use(helmet());

// Middleware de rate limiting
app.use(rateLimit);

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:4000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

//Rutas
app.get('/', (req,res) => {
    res.json({message: 'API funcionando correctamente'});
})

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//lectura del body
app.use(express.json());

//Rutas de autenticación
app.use('/api/v1/auth', require('./routes/auth'));

//Rutas de usuarios
app.use('/api/v1/users', require('./routes/users'));

// Middleware de manejo de errores
app.use(require('./middlewares/errorHandler'));

//Exportar app.js
module.exports = app;