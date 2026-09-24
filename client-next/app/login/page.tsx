'use client'; // ¡Obligatorio en Next.js para interactividad!

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter(); // El enrutador de Next.js

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
    // const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // 1. Guardamos para nuestra utilidad apiFetch (como en Vite)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 2. NUEVO: Guardamos en una Cookie para el Servidor de Next.js
      document.cookie = `token=${data.token}; path=/; max-age=28800; samesite=strict`;

      // 3. Redirigimos al inicio
      router.push('/');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e293b' }}>Iniciar Sesión</h2>
        
        {error && <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '4px', border: '1px solid #f87171' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              placeholder="admin@test.com"
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}