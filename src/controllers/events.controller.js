
 // Controla la consulta de eventos.
export function getEvents(req, res) {
  // Devuelve una lista vacía de eventos.
  res.status(200).json({
    status: 'success',
    payload: [],
  });
}
