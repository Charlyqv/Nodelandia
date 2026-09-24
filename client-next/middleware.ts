import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Intentamos leer la cookie que creamos en el Login
  const token = request.cookies.get('token')?.value;
  
  // Obtenemos la URL a la que el usuario quiere entrar
  const { pathname } = request.nextUrl;

  // 1. Si NO hay token y no está en la página de login, lo pateamos al login
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Si SÍ hay token e intenta ir al login, lo mandamos al panel principal
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si todo está bien, dejamos que la petición continúe
  return NextResponse.next();
}

// Le decimos a Next.js en qué rutas debe ejecutar este escudo protector
export const config = {
  // Ejecutar en todas las rutas EXCEPTO archivos internos de Next (.next) y la API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};