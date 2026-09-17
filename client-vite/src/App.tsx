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

  // Revisa el token al montar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // Función para actualizar el estado desde el Login sin recargar la web
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) return null; 

  return (
    <BrowserRouter>
      <Routes>
        
        {/* RUTA PÚBLICA: Login */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
                <Login onLoginSuccess={handleLoginSuccess} />
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* RUTAS PRIVADAS: Layout y sus vistas anidadas */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<TasksBoard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;