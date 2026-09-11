const { Router } = require('express');
const { checkStatus } = require('../controllers/status.controller');

const router = Router();

// Cuando alguien haga GET a la raíz de esta ruta, ejecuta checkStatus
router.get('/', checkStatus);

module.exports = router;