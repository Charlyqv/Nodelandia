const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  memoryUsage: { type: Number, required: true },
  cpuUsage: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now } // Mongoose lo autogenera
});

// Creamos un índice para que borrar datos antiguos después sea rápido
MetricSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Metric', MetricSchema);