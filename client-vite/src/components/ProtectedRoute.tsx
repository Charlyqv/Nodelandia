import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  // Si no hay token, lo mandamos a la ruta /login y reemplazamos el historial
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, permitimos que el enrutador siga su camino normal
  return <Outlet />;
}