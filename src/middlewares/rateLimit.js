const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por IP
  message: {
    status: 429,
    message: 'Demasiadas solicitudes desde esta IP, por favor inténtelo más tarde.',
  },
});

module.exports = limiter;
