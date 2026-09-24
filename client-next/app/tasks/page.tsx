'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../utils/api';

interface Task {
  id: number;
  title: string;
  is_completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await apiFetch('/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: newTaskTitle, description: '' }),
      });
      setNewTaskTitle('');
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleTask = async (id: number, currentStatus: boolean) => {
    try {
      await apiFetch(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_completed: !currentStatus }),
      });
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Layout title="✅ Gestión de Tareas">
      <div style={{ width: '100%' }}>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="¿Qué nueva funcionalidad construiremos hoy?"
            style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
          />
          <button type="submit" style={{ padding: '0 2rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Guardar
          </button>
        </form>

        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            No tienes tareas pendientes. ¡Tu servidor está bajo control!
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.map((task) => (
              <li key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: task.is_completed ? '4px solid #10b981' : '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="checkbox" 
                    checked={task.is_completed}
                    onChange={() => handleToggleTask(task.id, task.is_completed)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1.1rem', color: task.is_completed ? '#94a3b8' : '#334155', textDecoration: task.is_completed ? 'line-through' : 'none', fontWeight: task.is_completed ? 'normal' : '500' }}>
                    {task.title}
                  </span>
                </div>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}