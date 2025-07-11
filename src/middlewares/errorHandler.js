// middleware/errorHandler.js

module.exports = (err, req, res, next) => {
  // Log del error para depuración
  console.error(err);

  // Determina el código de estado (por defecto 500)
  const statusCode = err.statusCode || 500;

  // Mensaje de error seguro para el cliente
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    ok: false,
    error: message
  });
};
