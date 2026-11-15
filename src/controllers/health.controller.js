
// Atiende la solicitud de salud y devuelve el estado del servidor al router.
export function getHealth(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor activo',
  });
}
