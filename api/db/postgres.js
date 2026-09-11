const { Pool } = require('pg');

// El Pool mantiene conexiones abiertas y las reutiliza eficientemente
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'adminpassword',
  database: process.env.DB_NAME || 'nodedb'
});

pool.on('connect', () => {
  console.log('📦 Conexión a PostgreSQL establecida en el Pool');
});

module.exports = pool;