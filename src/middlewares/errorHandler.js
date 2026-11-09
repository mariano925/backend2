function errorHandler(err, req, res, next) {
  console.error('Error en la solicitud:', err.message);

  const statusCode =
    err.name === 'ValidationError' ? 400 : err.status || 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor.',
  });
}

export default errorHandler;
