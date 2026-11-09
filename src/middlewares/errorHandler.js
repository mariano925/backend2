function errorHandler(err, req, res, next) {
  console.error('Error en la solicitud:', err.message);

  const isDuplicateKeyError = err.code === 11000;
  const statusCode = isDuplicateKeyError
    ? 409
    : err.name === 'ValidationError'
      ? 400
      : err.status || 500;

  res.status(statusCode).json({
    status: 'error',
    message: isDuplicateKeyError
      ? 'El email ya está registrado'
      : err.message || 'Error interno del servidor.',
  });
}

export default errorHandler;
