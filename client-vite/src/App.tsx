import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard'; 
import TasksBoard from './components/TasksBoard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Revisa el token solo al cargar la app por primera vez
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // 2. Función que pasaremos al Login para actualizar este estado sin recargar la página
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) return null; 

  return (
    // Ahora el BrowserRouter envuelve TODO, incluyendo el Login
    <BrowserRouter>
      <Routes>
        
        {/* RUTA PÚBLICA: Si no está autenticado muestra Login, si lo está, redirige al inicio */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
                {/* Le pasamos la función al componente Login a través de una prop */}
                <Login onLoginSuccess={handleLoginSuccess} />
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* RUTAS PRIVADAS: Si está autenticado inyecta el Layout, si no, lo manda a /login */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
        >
          {/* Rutas anidadas dentro del Layout */}
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<TasksBoard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;