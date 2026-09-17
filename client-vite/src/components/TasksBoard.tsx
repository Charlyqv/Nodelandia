import { useState, useEffect, type FormEvent } from 'react';
import { apiFetch } from '../utils/api';

// Definimos la estructura de la Tarea basándonos en Postgres
interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

export default function TasksBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extraemos el token para reutilizarlo
  const token = localStorage.getItem('token');

  // 1. OBTENER LAS TAREAS (GET)
  const fetchTasks = async () => {
    try {
      // const res = await fetch('http://localhost:3000/api/v1/tasks', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      const res = await apiFetch('/tasks');
      if (!res.ok) throw new Error('Error cargando tareas');
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar tareas al montar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. CREAR TAREA (POST)
  const handleCreateTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      // const res = await fetch('http://localhost:3000/api/v1/tasks', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ 
      //     title: newTaskTitle, 
      //     description: '' // Opcional por ahora
      //   })
      // });
      const res = await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: newTaskTitle, description: '' })
      });

      if (res.ok) {
        const data = await res.json();
        // Actualizamos el estado local agregando la nueva tarea al principio
        setTasks([data.task, ...tasks]);
        setNewTaskTitle(''); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. ACTUALIZAR ESTADO DE LA TAREA (PUT)
  const toggleTaskCompletion = async (taskId: number, currentStatus: boolean) => {
    // Optimistic UI update: actualizamos la vista de inmediato para que se sienta rápido
    setTasks(tasks.map(t => t.id === taskId ? { ...t, is_completed: !currentStatus } : t));

    try {
      // await fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ is_completed: !currentStatus })
      // });
      await apiFetch(`/tasks/${taskId}`, { method: 'PUT' });
    } catch (err) {
      console.error("Falló la actualización en el servidor", err);
      // Si falla, podrías revertir el estado aquí
    }
  };

  // 4. ELIMINAR TAREA (DELETE)
  const handleDeleteTask = async (taskId: number) => {
    // Actualizamos la vista inmediatamente
    setTasks(tasks.filter(t => t.id !== taskId));

    try {
      // await fetch(`http://localhost:3000/api/v1/tasks/${taskId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      await apiFetch(`/tasks/${taskId}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Falló la eliminación", err);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando tareas...</div>;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '2rem' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Mis Tareas</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Formulario de creación rápida */}
      <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="¿Qué necesitas hacer hoy?"
          style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Agregar
        </button>
      </form>

      {/* Lista de tareas */}
      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>No tienes tareas pendientes. ¡Buen trabajo!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '4px', borderLeft: task.is_completed ? '4px solid #10b981' : '4px solid #f59e0b' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="checkbox" 
                  checked={task.is_completed}
                  onChange={() => toggleTaskCompletion(task.id, task.is_completed)}
                  style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                />
                <span style={{ 
                  fontSize: '1.1rem', 
                  color: task.is_completed ? '#94a3b8' : '#334155',
                  textDecoration: task.is_completed ? 'line-through' : 'none',
                  transition: 'all 0.2s'
                }}>
                  {task.title}
                </span>
              </div>

              <button 
                onClick={() => handleDeleteTask(task.id)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem', padding: '0.5rem' }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}