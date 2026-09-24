'use client'; 

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Layout({ children, title }: { children: React.ReactNode, title: string }) {
  const [userName, setUserName] = useState('Usuario');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Para saber en qué página estamos y pintar el menú

  useEffect(() => {
    setIsMounted(true);
    const userRaw = localStorage.getItem('user');
    if (userRaw) setUserName(JSON.parse(userRaw).name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

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
          <Link href="/" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '6px', color: pathname === '/' ? '#ffffff' : '#cbd5e1', backgroundColor: pathname === '/' ? '#3b82f6' : 'transparent', fontWeight: pathname === '/' ? '600' : '400' }}>
            📊 Rendimiento
          </Link>
          <Link href="/tasks" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '6px', color: pathname === '/tasks' ? '#ffffff' : '#cbd5e1', backgroundColor: pathname === '/tasks' ? '#3b82f6' : 'transparent', fontWeight: pathname === '/tasks' ? '600' : '400' }}>
            ✅ Gestión de Tareas
          </Link>
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* NAVBAR */}
        <header style={{ height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
          <h3 style={{ margin: 0, color: '#334155', fontWeight: '500' }}>{title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Hola, <strong>{userName}</strong></span>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer' }}>
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* CONTENIDO INYECTADO */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </div>
        
      </main>
    </div>
  );
}