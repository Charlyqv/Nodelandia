const pgPool = require('../db/postgres');

// 1. CREAR UNA TAREA
const createTask = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.userId; // Viene del JWT decodificado en el middleware

  try {
    const newTask = await pgPool.query(
      'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, description]
    );

    res.status(201).json({
      message: 'Tarea creada con éxito',
      task: newTask.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

// 2. OBTENER LAS TAREAS (Solo las del usuario autenticado)
const getTasks = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Filtramos usando el WHERE con la llave foránea
    const result = await pgPool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

// 3. ACTUALIZAR UNA TAREA (Completarla o editarla)
const updateTask = async (req, res) => {
  // req.params contiene los valores dinámicos de la URL (ej: /api/v1/tasks/:id)
  const taskId = req.params.id; 
  const userId = req.user.userId;
  
  // Extraemos los campos que el cliente quiere actualizar
  const { title, description, is_completed } = req.body;

  try {
    // COALESCE es un truco de SQL: Si el valor que le pasamos es NULL, mantiene el valor que ya tenía la tabla.
    // Así permitimos actualizaciones parciales (ej. solo cambiar is_completed sin borrar el título)
    const result = await pgPool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           is_completed = COALESCE($3, is_completed)
       WHERE id = $4 AND user_id = $5 
       RETURNING *`,
      [title, description, is_completed, taskId, userId]
    );

    // Si no devolvió ninguna fila, significa que la tarea no existe o no es de este usuario
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    }

    res.status(200).json({
      message: 'Tarea actualizada',
      task: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
};

// 4. ELIMINAR UNA TAREA
const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  try {
    // Borramos verificando estrictamente la propiedad
    const result = await pgPool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada o no autorizada' });
    }

    res.status(200).json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask 
};