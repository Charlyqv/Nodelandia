const API_URL = 'http://localhost:3000/api/v1';
// const API_URL = '/api/v1';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // En Next.js, localStorage solo está disponible en el cliente (navegador)
  // por lo que debemos verificar que estamos en el entorno correcto
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      console.warn('Sesión expirada. Redirigiendo al login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; 
    }
    throw new Error('Sesión expirada'); 
  }

  return response;
};