
 // Controla la respuesta del estado del servidor.
export function getHealth(req, res) {
  // Devuelve una respuesta exitosa.
  res.status(200).json({
    status: 'ok',
    message: 'Servidor activo',
  });
}
