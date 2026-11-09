# Plataforma de Eventos e Inscripciones

API REST del proyecto Backend II de Coderhouse, desarrollada con Node.js, Express y MongoDB/Mongoose. La consulta y creación de eventos usan las capas Controller, Service, Repository y DAO.

## Tecnologías

- Node.js (18 o posterior)
- Express
- MongoDB Atlas
- Mongoose
- JavaScript con módulos ES
- dotenv
- Nodemon para desarrollo
- `node:test` para pruebas automatizadas (módulo nativo de Node.js)

## Instalación

```bash
git clone https://github.com/mariano925/backend2.git
cd backend2
npm install
```

## Variables de entorno y MongoDB Atlas

Creá un archivo `.env` en la raíz del proyecto usando `.env.example` como referencia:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=
```

Configurá `MONGO_URL` con la URI de conexión proporcionada por MongoDB Atlas y la base de datos que corresponda. Si la contraseña contiene caracteres reservados para URI, deben estar codificados. No publiques ni incluyas el archivo `.env` en Git. `JWT_SECRET` está reservado para etapas posteriores y no se utiliza en las funcionalidades actuales.

La aplicación establece la conexión a MongoDB antes de empezar a escuchar solicitudes. Si la conexión falla, el servidor no inicia.

## Ejecución y pruebas

Iniciar en modo desarrollo:

```bash
npm run dev
```

Iniciar con Node.js:

```bash
npm start
```

Ejecutar las pruebas automatizadas:

```bash
npm test
```

La prueba de salud inicia la aplicación en un puerto local aleatorio y no requiere conectarse a MongoDB Atlas.

## Estructura del proyecto

```text
backend2/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── health.controller.js
│   │   └── sessions.controller.js
│   ├── dao/
│   │   └── event.dao.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── repositories/
│   │   └── event.repository.js
│   ├── routes/
│   │   ├── events.router.js
│   │   ├── health.router.js
│   │   └── sessions.router.js
│   └── services/
│       └── event.service.js
├── test/
│   └── health.test.js
├── .env.example
├── package.json
└── README.md
```

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/health` | Comprueba que el servidor esté activo. |
| GET | `/api/events` | Obtiene todos los eventos. |
| POST | `/api/events` | Crea un evento. Responde `201 Created` si se crea correctamente. |
| GET | `/api/sessions` | Recurso pendiente; responde `501 Not Implemented`. |

### Crear un evento

`POST /api/events` recibe JSON. `title`, `date` y `location` son obligatorios; `description` es opcional. Se aplican las validaciones definidas en el modelo `Event`. Los errores de validación responden con HTTP `400`.

```json
{
  "title": "Conferencia de tecnología",
  "description": "Encuentro sobre desarrollo de software",
  "date": "2027-05-20T18:00:00.000Z",
  "location": "Auditorio central"
}
```

Las operaciones de eventos siguen el recorrido:

```text
Router → Controller → Service → Repository → DAO → Modelo Event → MongoDB
```
