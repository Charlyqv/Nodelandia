const API_URL = 'http://localhost:3000/api/v1';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  // 1. Inyectamos los headers por defecto y el token si existe
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // 2. Ejecutamos la petición base
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 3. ¡EL INTERCEPTOR! Si el token expiró o es inválido...
  if (response.status === 401) {
    console.warn('Sesión expirada. Redirigiendo al login...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Expulsamos al usuario
    // Detenemos la ejecución lanzando un error
    throw new Error('Sesión expirada'); 
  }

  return response;
};