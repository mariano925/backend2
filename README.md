# Plataforma de Eventos e Inscripciones

API REST del proyecto Backend II de Coderhouse, desarrollada con Node.js, Express y MongoDB/Mongoose. La consulta y creación de eventos usan las capas Controller, Service, Repository y DAO. El registro y la autenticación de usuarios utilizan bcrypt, JWT y cookies.

## Tecnologías

- Node.js (20.19.0 o posterior)
- Express
- MongoDB Atlas
- Mongoose
- bcrypt
- JSON Web Token (`jsonwebtoken`)
- JavaScript con módulos ES
- dotenv
- `node --watch` para reinicio automático durante el desarrollo (funcionalidad incorporada en Node.js).
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
JWT_EXPIRES_IN=1h
```

Configurá `MONGO_URL` con la URI de conexión proporcionada por MongoDB Atlas y la base de datos que corresponda. Si la contraseña contiene caracteres reservados para URI, deben estar codificados. No publiques ni incluyas el archivo `.env` en Git.

`JWT_SECRET` se utiliza para firmar y verificar los JWT; configurá un valor secreto en el entorno local y no lo compartas. `JWT_EXPIRES_IN` permite configurar la duración del token. Si no se especifica, el valor predeterminado es `1h`.

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
│   │   ├── auth.middleware.js
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
│   │   ├── event.service.js
│   │   └── sessions.service.js
│   └── utils/
│       ├── hash.js
│       └── jwt.js
├── test/
│   ├── health.test.js
│   └── sessions.test.js
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Endpoints

| Método | Path | Descripción |
|---|---|---|
| GET | `/api/health` | Comprueba que el servidor esté activo. |
| GET | `/api/events` | Obtiene todos los eventos. |
| POST | `/api/events` | Crea un evento. |
| GET | `/api/sessions/` | Recurso pendiente; responde `501 Not Implemented`. |
| POST | `/api/sessions/register` | Registra un usuario con contraseña hasheada. |
| POST | `/api/sessions/login` | Inicia sesión y establece la cookie `currentUser` con un JWT. |
| GET | `/api/sessions/current` | Devuelve los datos del usuario autenticado; requiere la cookie `currentUser`. |
| POST | `/api/sessions/logout` | Elimina la cookie `currentUser`. |

## Estado del servidor

`GET /api/health` no requiere request body.

Respuesta `200 OK`:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

## Eventos

Las operaciones de eventos siguen el recorrido:

```text
Router → Controller → Service → Repository → DAO → Modelo Event → MongoDB
```

### Obtener eventos

`GET /api/events` no requiere request body. Responde `200 OK` con los eventos encontrados en `payload`; si no hay eventos, la lista está vacía:

```json
{
  "status": "success",
  "payload": []
}
```

### Crear un evento

`POST /api/events` recibe JSON. `title`, `date` y `location` son obligatorios; `description` es opcional. El modelo valida que `title` tenga entre 3 y 100 caracteres.

Request:

```json
{
  "title": "Conferencia de tecnología",
  "description": "Encuentro sobre desarrollo de software",
  "date": "2027-05-20T18:00:00.000Z",
  "location": "Auditorio central"
}
```

Respuesta `201 Created` (el identificador y las fechas son generados por MongoDB/Mongoose):

```json
{
  "status": "success",
  "payload": {
    "_id": "65f1a2b3c4d5e6f789012345",
    "title": "Conferencia de tecnología",
    "description": "Encuentro sobre desarrollo de software",
    "date": "2027-05-20T18:00:00.000Z",
    "location": "Auditorio central",
    "createdAt": "2027-01-15T12:00:00.000Z",
    "updatedAt": "2027-01-15T12:00:00.000Z",
    "__v": 0
  }
}
```

Los errores de validación del modelo responden `400 Bad Request`; otros errores no previstos responden `500 Internal Server Error`.

## Sesiones y autenticación

### Registrar un usuario

`POST /api/sessions/register` recibe JSON. Los campos obligatorios son `first_name`, `last_name`, `email` y `password`.

- El email se normaliza con `trim` y minúsculas, y se valida su formato.
- La contraseña debe tener al menos 8 caracteres y se almacena hasheada con bcrypt.
- El rol enviado en el request no se toma en cuenta; el modelo asigna el rol predeterminado `user`.
- La contraseña, tanto en texto plano como hasheada, nunca se incluye en la respuesta.

Request:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana@mail.com",
  "password": "una-clave-segura"
}
```

Respuesta `201 Created`:

```json
{
  "status": "success",
  "payload": {
    "id": "65f1a2b3c4d5e6f789012345",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

Errores:

| HTTP | Situación | Mensaje |
|---|---|---|
| `400 Bad Request` | Faltan campos obligatorios. | `Faltan campos obligatorios` |
| `400 Bad Request` | El email no tiene un formato válido. | `El email no es válido` |
| `400 Bad Request` | La contraseña tiene menos de 8 caracteres. | `La contraseña debe tener al menos 8 caracteres` |
| `409 Conflict` | El email ya está registrado. | `El email ya está registrado` |
| `500 Internal Server Error` | Ocurre un error no previsto. | El handler devuelve el mensaje del error o, si no existe, `Error interno del servidor.` |

### Iniciar sesión

`POST /api/sessions/login` recibe email y contraseña:

```json
{
  "email": "ana@mail.com",
  "password": "una-clave-segura"
}
```

El endpoint valida que ambos campos estén presentes, busca el usuario por email y compara la contraseña con bcrypt. Si las credenciales son correctas, genera un JWT con el payload `{ id, email, role }`, firmado con `JWT_SECRET` y con la duración configurada por `JWT_EXPIRES_IN` (predeterminada: `1h`).

El JWT se establece en la cookie `currentUser`; no se devuelve en el cuerpo de la respuesta. La cookie usa estas opciones:

| Opción | Valor |
|---|---|
| `httpOnly` | `true` |
| `sameSite` | `'lax'` |
| `maxAge` | `3600000` milisegundos (1 hora) |
| `secure` | `true` únicamente cuando `NODE_ENV` es `production` |

Respuesta `200 OK`:

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Error `400 Bad Request` por campos faltantes:

```json
{
  "status": "error",
  "message": "Email y contraseña son obligatorios"
}
```

Error `401 Unauthorized` por credenciales incorrectas:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

El mensaje `Credenciales inválidas` es el mismo tanto si el usuario no existe como si la contraseña es incorrecta. Los errores no previstos se procesan con el handler general.

### Consultar el usuario actual

`GET /api/sessions/current` requiere la cookie `currentUser`. Antes de permitir el acceso al controlador, `auth.middleware.js` lee la cookie y verifica el JWT, incluida su firma y vencimiento.

Respuesta `200 OK`:

```json
{
  "status": "success",
  "payload": {
    "id": "65f1a2b3c4d5e6f789012345",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La respuesta no contiene password.

Respuesta `401 Unauthorized` si falta la cookie o el token es inválido o expiró:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### Cerrar sesión

`POST /api/sessions/logout` elimina la cookie `currentUser`. No requiere middleware de autenticación.

Respuesta `200 OK`:

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

### Ruta de sesiones pendiente

`GET /api/sessions/` todavía no está implementado y responde `501 Not Implemented`:

```json
{
  "status": "error",
  "message": "Recurso de sesiones pendiente de implementación"
}
```

Ejecutá `npm run dev` para iniciar la aplicación y `npm test` para las pruebas automatizadas.
