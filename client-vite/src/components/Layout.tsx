import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation(); // Para saber en qué página estamos y resaltarla

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Forzamos recarga para limpiar memoria y volver al Login
  };

  // Recuperamos el nombre del usuario para el Navbar
  const userRaw = localStorage.getItem('user');
  const user = userRaw ? JSON.parse(userRaw) : { name: 'Usuario' };

  const navItems = [
    { path: '/', label: '📊 Rendimiento del Servidor' },
    { path: '/tasks', label: '✅ Gestión de Tareas' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui' }}>
      
      {/* SIDEBAR (Menú Lateral) */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#38bdf8' }}>Nodelandia</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Ecosistema Full Stack</p>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  textDecoration: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  backgroundColor: isActive ? '#3b82f6' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* NAVBAR (Barra Superior) */}
        <header style={{ height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
          <h3 style={{ margin: 0, color: '#334155', fontWeight: '500' }}>
            {navItems.find(item => item.path === location.pathname)?.label || 'Panel de Control'}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Hola, <strong>{user.name}</strong></span>
            <button 
              onClick={handleLogout}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* CONTENIDO DINÁMICO (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Outlet /> {/* Aquí React Router inyectará las Tareas o las Gráficas */}
          </div>
        </div>
        
      </main>
    </div>
  );
}