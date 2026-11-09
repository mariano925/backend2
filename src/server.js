
import app from './app.js';
import { config } from './config/config.js';
import { connectDB } from './config/database.js';

// Conecta MongoDB antes de iniciar el servidor.
async function startServer() {
  try {
    await connectDB(config.mongoUrl);

    app.listen(config.port, () => {
      console.log(`Servidor escuchando en el puerto ${config.port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
