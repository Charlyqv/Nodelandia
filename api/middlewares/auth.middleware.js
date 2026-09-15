const jwt = require('jsonwebtoken');

// Debe ser EXACTAMENTE el mismo secreto que usaste en auth.controller.js
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_desarrollo_123';

const verifyToken = (req, res, next) => {
  // 1. Buscamos el token en las cabeceras (headers) de la petición
  const authHeader = req.headers.authorization;

  // El estándar es enviar "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  // 2. Extraemos solo el token (quitamos la palabra "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 3. jwt.verify lanza un error si la firma no coincide o si expiró
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 4. Si es válido, inyectamos los datos del usuario en la petición (req)
    req.user = decoded;
    
    // 5. Permitimos que la petición continúe hacia el controlador
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Acceso denegado. Token inválido o expirado.' });
  }
};

module.exports = { verifyToken };