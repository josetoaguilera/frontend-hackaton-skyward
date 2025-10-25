import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Este middleware es más simple porque Firebase maneja la autenticación del lado del cliente
// Solo necesitamos redirigir rutas básicas

export function middleware(request: NextRequest) {
  // Permitir que todas las rutas pasen
  // La verificación de autenticación se hace del lado del cliente con Firebase
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
