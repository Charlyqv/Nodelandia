const pgPool = require('../postgres');

const createTables = async () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pgPool.query(usersTable);
    console.log('✅ Tabla "users" verificada/creada en PostgreSQL');
  } catch (error) {
    console.error('❌ Error creando tablas:', error);
  }
};

module.exports = createTables;