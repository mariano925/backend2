# Plataforma de Eventos e Inscripciones

API REST del proyecto Backend II de Coderhouse, desarrollada con Node.js, Express y MongoDB/Mongoose.

La aplicación permite consultar y crear eventos, registrar usuarios y gestionar sesiones de autenticación. La arquitectura utiliza las capas Controller, Service, Repository y DAO para separar las responsabilidades.

La autenticación está centralizada mediante **Passport.js**, con estrategias Local para registro y login, y JWT para consultar al usuario autenticado. La API conserva JWT y cookies HTTP Only, sin modificar las rutas principales ni el formato de las respuestas exitosas.

## Tecnologías

- Node.js (20.19.0 o posterior).
- Express.
- MongoDB Atlas.
- Mongoose.
- Passport.js.
- `passport-local` para las estrategias de registro y login.
- `passport-jwt` para validar el usuario actual.
- bcrypt para el hash y la comparación de contraseñas.
- JSON Web Token (`jsonwebtoken`) para generar y verificar tokens.
- JavaScript con módulos ES.
- dotenv para las variables de entorno.
- cors para la configuración de CORS.
- cookie-parser para leer las cookies de las solicitudes.
- `node --watch` para reinicio automático durante el desarrollo.
- `node:test` para pruebas automatizadas (módulo nativo de Node.js).

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
git clone https://github.com/mariano925/backend2.git
cd backend2
npm install
```

## Variables de entorno y MongoDB Atlas

Crear un archivo `.env` en la raíz del proyecto usando `.env.example` como referencia:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1h
```

Configurar `MONGO_URL` con la URI de conexión proporcionada por MongoDB Atlas y la base de datos correspondiente. Si la contraseña contiene caracteres reservados para URI, deben estar codificados.

`JWT_SECRET` se utiliza para firmar y verificar los JWT. Se debe configurar un valor secreto en el entorno local y no compartirlo.

`JWT_EXPIRES_IN` permite configurar la duración del token. Si no se especifica, el valor predeterminado es `1h`.

`NODE_ENV` determina el entorno de ejecución. La cookie de autenticación utiliza la opción `secure` cuando el entorno es `production`.

No publicar ni incluir el archivo `.env` en Git. El repositorio contiene `.env.example` como referencia para configurar las variables necesarias.

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

Las pruebas automatizadas levantan la aplicación en puertos locales aleatorios y simulan la persistencia mediante mocks del DAO. No requieren conectarse a MongoDB Atlas ni modifican datos de la base de datos.

## Estructura del proyecto

```text
backend2/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── config.js
│   │   ├── database.js
│   │   └── passport.config.js
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

`passport.config.js` centraliza la configuración de las estrategias de autenticación. El archivo `auth.middleware.js` corresponde al middleware de autenticación anterior; las rutas de sesiones utilizan actualmente las estrategias de Passport.

## Arquitectura de la aplicación

Las operaciones de eventos y usuarios utilizan una arquitectura modular:

```text
Router → Controller → Service → Repository → DAO → Modelo → MongoDB
```

Cada capa tiene una responsabilidad:

- **Router:** define las rutas y conecta los middlewares con los controladores.
- **Controller:** gestiona las solicitudes y respuestas HTTP.
- **Service:** concentra la lógica de negocio y las validaciones.
- **Repository:** abstrae el acceso a los datos.
- **DAO:** realiza las operaciones de persistencia mediante los modelos de Mongoose.

La autenticación incorpora Passport para centralizar la validación de usuarios y credenciales, manteniendo las responsabilidades de las demás capas.

## Inicialización de Passport

Las estrategias se encuentran centralizadas en:

```text
src/config/passport.config.js
```

La aplicación registra estas estrategias mediante `initializePassport()` en `app.js` y utiliza `passport.initialize()` como middleware de Express.

El orden de los middlewares permite que `cookie-parser` procese las cookies antes de que Passport intente extraer el JWT.

Las rutas utilizan `passport.authenticate()` con `session: false`, por lo que la autenticación se realiza mediante JWT y cookies, sin sesiones persistentes de Passport.

## Endpoints

| Método | Path | Descripción |
|---|---|---|
| GET | `/api/health` | Comprueba que el servidor esté activo. |
| GET | `/api/events` | Obtiene todos los eventos. |
| POST | `/api/events` | Crea un evento. |
| GET | `/api/sessions/` | Recurso pendiente; responde `501 Not Implemented`. |
| POST | `/api/sessions/register` | Registra un usuario mediante la estrategia Passport `register`. |
| POST | `/api/sessions/login` | Autentica al usuario mediante `login` y establece la cookie `currentUser`. |
| GET | `/api/sessions/current` | Devuelve los datos del usuario autenticado mediante la estrategia JWT `current`. |
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

`GET /api/events` no requiere request body.

Responde `200 OK` con los eventos encontrados en `payload`. Si no hay eventos, la lista está vacía:

```json
{
  "status": "success",
  "payload": []
}
```

### Crear un evento

`POST /api/events` recibe JSON.

Los campos obligatorios son `title`, `date` y `location`; `description` es opcional. El modelo valida que `title` tenga entre 3 y 100 caracteres.

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

La autenticación de usuarios está organizada mediante tres estrategias de Passport:

| Estrategia | Tipo | Responsabilidad |
|---|---|---|
| `register` | Local | Valida y registra un usuario. |
| `login` | Local | Verifica las credenciales del usuario. |
| `current` | JWT | Valida el token de la cookie y obtiene el usuario autenticado. |

Las estrategias están centralizadas en `src/config/passport.config.js`. Las rutas delegan la autenticación a Passport y los controladores se encargan de construir las respuestas HTTP.

### Registrar un usuario

`POST /api/sessions/register` recibe JSON.

Los campos obligatorios son `first_name`, `last_name`, `email` y `password`.

La ruta utiliza la estrategia Passport `register`, que delega la lógica de negocio a `SessionsService`.

El servicio realiza las siguientes operaciones:

- Valida los campos obligatorios.
- Normaliza el email mediante `trim` y minúsculas.
- Comprueba el formato del email.
- Verifica que la contraseña tenga al menos 8 caracteres.
- Comprueba que el email no esté registrado.
- Aplica bcrypt para almacenar la contraseña hasheada.
- Persiste el usuario mediante Repository y DAO.

El rol enviado en el request no se toma en cuenta. El modelo asigna el rol predeterminado `user`.

El controlador devuelve los datos públicos del usuario. La contraseña, tanto en texto plano como hasheada, nunca se incluye en la respuesta.

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

Errores contemplados por el servicio:

| HTTP | Situación | Mensaje |
|---|---|---|
| `400 Bad Request` | Faltan campos obligatorios. | `Faltan campos obligatorios` |
| `400 Bad Request` | El email no tiene un formato válido. | `El email no es válido` |
| `400 Bad Request` | La contraseña tiene menos de 8 caracteres. | `La contraseña debe tener al menos 8 caracteres` |
| `409 Conflict` | El email ya está registrado. | `El email ya está registrado` |
| `500 Internal Server Error` | Ocurre un error no previsto. | El handler centraliza el error. |

### Iniciar sesión

`POST /api/sessions/login` recibe email y contraseña:

```json
{
  "email": "ana@mail.com",
  "password": "una-clave-segura"
}
```

La ruta utiliza la estrategia Passport `login`, que delega la validación de las credenciales a `SessionsService`.

El servicio busca el usuario por email y compara la contraseña recibida con el hash almacenado mediante bcrypt.

Si las credenciales son correctas, Passport entrega el usuario autenticado al controlador.

**El controlador es el responsable de generar el JWT**, con el payload:

```js
{ id, email, role }
```

El token se firma con `JWT_SECRET` y utiliza la duración configurada por `JWT_EXPIRES_IN` (predeterminada: `1h`).

El JWT no se devuelve en el cuerpo de la respuesta. Se establece en la cookie `currentUser`, con las siguientes opciones:

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

Respuesta `400 Bad Request` por campos faltantes:

```json
{
  "status": "error",
  "message": "Email y contraseña son obligatorios"
}
```

Respuesta `401 Unauthorized` por credenciales incorrectas:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

El mensaje `Credenciales inválidas` es el mismo tanto si el usuario no existe como si la contraseña es incorrecta.

### Consultar el usuario actual

`GET /api/sessions/current` requiere la cookie `currentUser`.

La ruta utiliza la estrategia Passport JWT `current`, que:

1. Extrae el token desde la cookie `currentUser`.
2. Verifica su firma y vencimiento mediante `passport-jwt`.
3. Obtiene el identificador del usuario desde el payload del JWT.
4. Busca al usuario mediante `UsersRepository`.
5. Si la autenticación es correcta, deja el usuario disponible en `req.user`.

El controlador devuelve únicamente los datos públicos del usuario.

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

Si no se proporciona un token válido, el endpoint debe responder `401 Unauthorized`:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### Cerrar sesión

`POST /api/sessions/logout` elimina la cookie `currentUser`.

Esta ruta no requiere pasar por Passport ni tener un usuario autenticado. El controlador se encarga directamente de limpiar la cookie.

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

## Preparación para futuras estrategias de autenticación

La configuración de Passport está centralizada en `src/config/passport.config.js` para facilitar la incorporación de nuevas estrategias.

La estructura permite agregar en el futuro providers externos, como Google o GitHub, sin concentrar su configuración en `app.js`.

La integración de nuevos providers requerirá incorporar sus respectivas estrategias y conectarlas con las rutas y controladores correspondientes.

Las estrategias externas no están implementadas en esta versión.

## Seguridad y consideraciones

- Las contraseñas se almacenan mediante bcrypt.
- El JWT se firma con una variable de entorno secreta.
- La cookie `currentUser` utiliza `httpOnly: true`.
- Las rutas de autenticación utilizan Passport sin sesiones persistentes.
- Las respuestas de registro y usuario actual no exponen contraseñas.
- Los archivos `.env` y las credenciales no deben publicarse en el repositorio.

Para iniciar la aplicación se utiliza `npm run dev`; para ejecutar las pruebas automatizadas, `npm test`.
