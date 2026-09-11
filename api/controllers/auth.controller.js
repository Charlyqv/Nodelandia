const pgPool = require('../db/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// En producción, esto debe venir de process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_desarrollo_123';

// 1. REGISTRO DE USUARIO
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validar si el usuario ya existe
    const userExists = await pgPool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Generar un "salt" y encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar en PostgreSQL
    const newUser = await pgPool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 2. INICIO DE SESIÓN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario
    const result = await pgPool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Comparar la contraseña enviada con el hash guardado
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar el JSON Web Token
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Payload (datos públicos no sensibles)
      JWT_SECRET,                             // Firma
      { expiresIn: '8h' }                     // Tiempo de expiración
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { register, login };