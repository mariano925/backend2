# Plataforma de Eventos e Inscripciones

API REST desarrollada con Node.js y Express para una plataforma de gestión de eventos e inscripciones.

Este proyecto forma parte del curso Backend II de Coderhouse. Su desarrollo será progresivo, incorporando funcionalidades y mejoras arquitectónicas a lo largo de las distintas entregas.

## Tecnologías

- Node.js
- Express
- MongoDB (preparado para próximas etapas)
- Mongoose
- JavaScript (ES Modules)
- dotenv
- Nodemon (desarrollo)

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/mariano925/backend2.git
```

Ingresar al directorio:

```bash
cd backend2
```

Instalar las dependencias:

```bash
npm install
```

## Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Variables necesarias:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=
```

Completar las variables según la configuración del entorno local.

Las variables `MONGO_URL` y `JWT_SECRET` quedan preparadas para las próximas etapas del proyecto. En esta primera entrega no se requiere una conexión activa con MongoDB.

## Ejecución

Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Iniciar el servidor en modo producción:

```bash
npm start
```

Por defecto, el servidor utiliza el puerto `8080`, que puede modificarse mediante la variable de entorno `PORT`.

## Estructura del proyecto

```text
backend2/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   ├── routes/
│   │   ├── health.router.js
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   │   └── .gitkeep
│   ├── repositories/
│   │   └── .gitkeep
│   ├── dao/
│   │   └── .gitkeep
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/
│   │   └── .gitkeep
│   └── utils/
│       └── .gitkeep
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

La aplicación utiliza una arquitectura por capas para separar responsabilidades y facilitar el mantenimiento y la evolución del proyecto.

Las carpetas que todavía no contienen implementaciones incluyen un archivo `.gitkeep` para conservar su estructura en el repositorio. Estos archivos son auxiliares y no contienen lógica de aplicación.

## Rutas disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servidor esté activo. |
| GET | `/api/events` | Devuelve la lista inicial de eventos. |
| GET | `/api/sessions` | Estructura inicial del recurso de sesiones. Todavía no implementa funcionalidades de autenticación y responde con HTTP 501. |

### Respuestas iniciales

**GET /api/health**

Código HTTP: `200 OK`

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

**GET /api/events**

Código HTTP: `200 OK`

```json
{
  "status": "success",
  "payload": []
}
```

**GET /api/sessions**

Código HTTP: `501 Not Implemented`

```json
{
  "status": "error",
  "message": "Recurso de sesiones pendiente de implementación"
}
```

## Estado del proyecto

Primera entrega: refactor arquitectónico inicial.

La API cuenta con un servidor Express funcional, configuración mediante variables de entorno, separación inicial por capas y estructuras base para los recursos de usuarios, eventos y sesiones.

Las funcionalidades de autenticación, autorización, gestión completa de eventos e inscripciones se incorporarán progresivamente en las próximas entregas de Backend II.