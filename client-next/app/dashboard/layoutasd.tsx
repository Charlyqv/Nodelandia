'use client'; // Necesitamos estado para el menú y lectura de localStorage

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Usuario');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Leemos localStorage de forma segura solo en el cliente
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      setUserName(JSON.parse(userRaw).name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Borramos la cookie que lee el Middleware
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  const navItems = [
    { path: '/', label: '📊 Rendimiento del Servidor' },
    { path: '/tasks', label: '✅ Gestión de Tareas' },
  ];

  if (!isMounted) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f1f5f9' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#38bdf8' }}>Nodelandia</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Ecosistema Full Stack</p>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
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
        
        {/* NAVBAR */}
        <header style={{ height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
          <h3 style={{ margin: 0, color: '#334155', fontWeight: '500' }}>
            {navItems.find(item => item.path === pathname)?.label || 'Panel de Control'}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Hola, <strong>{userName}</strong></span>
            <button 
              onClick={handleLogout}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* AQUÍ SE INYECTA LA VISTA ACTIVA */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            {children} 
          </div>
        </div>
        
      </main>
    </div>
  );
}