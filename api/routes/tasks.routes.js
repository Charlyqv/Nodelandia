const { Router } = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const { 
    createTask, 
    getTasks, 
    updateTask, 
    deleteTask 
} = require('../controllers/tasks.controller');

const router = Router();

// Todas las rutas en este archivo requerirán el token
router.use(verifyToken); 

// GET /api/v1/tasks -> Obtiene las tareas
router.get('/', getTasks);
// POST /api/v1/tasks -> Crea una tarea
router.post('/', createTask);

// Rutas con parámetro dinámico (:id)
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// // Nota cómo 'verifyToken' va entre la ruta y el controlador
// router.get('/', verifyToken, (req, res) => {
//   // Si el código llega hasta aquí, significa que el middleware lo permitió
//   res.status(200).json({
//     message: '¡Bienvenido a la zona protegida de tareas!',
//     // Gracias al middleware, ahora sabemos exactamente quién está haciendo la petición
//     usuarioAutenticado: req.user 
//   });
// });

module.exports = router;