const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/nodedb';

const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🍃 Conexión a MongoDB establecida de forma persistente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1); // Detiene el servidor si la base de datos principal falla
  }
};

module.exports = connectMongo;