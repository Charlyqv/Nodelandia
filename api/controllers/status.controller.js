const pgPool = require('../db/postgres');

// Controlador para verificar el estado del sistema
const checkStatus = async (req, res) => {
  try {
    const result = await pgPool.query('SELECT NOW() as database_time');
    
    res.status(200).json({
      status: 'success',
      message: '¡Arquitectura MVC funcionando perfectamente! 🚀',
      postgresTime: result.rows[0].database_time
    });
  } catch (error) {
    console.error('Error en checkStatus:', error);
    // Siempre devuelve un status code apropiado
    res.status(500).json({ error: 'Fallo al conectar con la base de datos' });
  }
};

module.exports = {
  checkStatus
};