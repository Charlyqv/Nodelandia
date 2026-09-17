const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/auth.controller');

const router = Router();

// Creamos una regla estricta: Máximo 5 intentos de login/registro cada 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite de 5 peticiones por IP
  message: { error: 'Demasiados intentos. Por favor intenta de nuevo en 15 minutos.' }
});

// Le aplicamos el escudo solo a las rutas de autenticación
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

module.exports = router;