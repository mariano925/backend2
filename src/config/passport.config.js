import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import SessionsService from '../services/sessions.service.js';
import UsersRepository from '../repositories/users.repository.js';
import { config } from './config.js';

function isBusinessError(error) {
  const status = Number(error?.statusCode || error?.status);
  return (
    (Number.isInteger(status) && status >= 400 && status < 500) ||
    error?.name === 'ValidationError'
  );
}

// Registra las estrategias de autenticación disponibles en Passport.
export function initializePassport() {
  // El servicio centraliza la lógica de registro.
  passport.use(
    'register',
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const user = await SessionsService.register(req.body);
          return done(null, user);
        } catch (error) {
          if (!isBusinessError(error)) return done(error);
          return done(null, false, {
            message: error.message,
            statusCode: error.statusCode || error.status || 400,
          });
        }
      }
    )
  );

  // El servicio autentica las credenciales y devuelve el usuario.
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await SessionsService.login({ email, password });
          return done(null, user);
        } catch (error) {
          if (!isBusinessError(error)) return done(error);
          return done(null, false, {
            message: error.message,
            statusCode: error.statusCode || error.status || 401,
          });
        }
      }
    )
  );

  // Extrae el JWT de la cookie de sesión actual.
  const cookieExtractor = (req) => req?.cookies?.currentUser ?? null;

  passport.use(
    'current',
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.jwtSecret,
      },
      async (jwtPayload, done) => {
        try {
          const user = await UsersRepository.findById(jwtPayload.id);
          if (!user) {
            return done(null, false, {
              message: 'Usuario no encontrado',
              statusCode: 401,
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
