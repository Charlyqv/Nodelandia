const { Router } = require('express');
const Metric = require('../db/models/Metric');

const router = Router();

// Endpoint para obtener las últimas 15 métricas guardadas
router.get('/history', async (req, res) => {
  try {
    const history = await Metric.find()
      .sort({ createdAt: -1 }) // Ordenamos de más reciente a más antiguo
      .limit(15); // Solo traemos los últimos 15

    // MongoDB los devuelve en orden inverso, así que los volteamos para la gráfica
    res.status(200).json(history.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

module.exports = router;