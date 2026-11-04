
import app from './app.js';
import { config } from './config/config.js';

// Inicia el servidor en el puerto configurado.
app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});
