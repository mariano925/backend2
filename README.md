# Plataforma de Eventos e Inscripciones

API REST del proyecto Backend II de Coderhouse, desarrollada con Node.js, Express y MongoDB/Mongoose. La consulta y creación de eventos usan las capas Controller, Service, Repository y DAO.

## Tecnologías

- Node.js (18 o posterior)
- Express
- MongoDB Atlas
- Mongoose
- bcrypt
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

Las pruebas inician la aplicación en puertos locales aleatorios y sustituyen la persistencia del registro; no requieren conectarse a MongoDB Atlas ni modifican datos.

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
│   │   ├── event.dao.js
│   │   └── users.dao.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── repositories/
│   │   ├── event.repository.js
│   │   └── users.repository.js
│   ├── routes/
│   │   ├── events.router.js
│   │   ├── health.router.js
│   │   └── sessions.router.js
│   ├── services/
│       ├── event.service.js
│       └── sessions.service.js
│   └── utils/
│       └── hash.js
├── test/
│   ├── health.test.js
│   └── sessions.test.js
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
| POST | `/api/sessions/register` | Registra un usuario con contraseña hasheada. |

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

### Registrar un usuario

- **Método:** `POST`
- **URL:** `/api/sessions/register`
- **Campos requeridos:** `first_name`, `last_name`, `email` y `password`.
- El email se normaliza con `trim` y minúsculas; la contraseña requiere al menos 8 caracteres y se almacena hasheada. El rol público no se toma del request y el usuario se crea con rol `user`.

Request:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana@mail.com",
  "password": "una-clave-segura"
}
```

Respuestas:

- `201 Created`: usuario registrado; `payload` incluye `id`, `first_name`, `last_name`, `email` y `role`, nunca la contraseña.
- `400 Bad Request`: faltan campos, el email no es válido o la contraseña tiene menos de 8 caracteres.
- `409 Conflict`: el email ya está registrado.
- `500 Internal Server Error`: error inesperado.

Ejecutá `npm run dev` para iniciar la aplicación y `npm test` para las pruebas automatizadas.
