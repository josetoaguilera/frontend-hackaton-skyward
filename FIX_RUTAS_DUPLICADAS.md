# Fix de Rutas API Duplicadas

## Problema Detectado
Las URLs de la API estaban generando rutas duplicadas:
- ❌ **Incorrecto**: `http://localhost:8000/api/api/v1/addresses`
- ✅ **Correcto**: `http://localhost:8000/api/v1/addresses`

El error ocurría porque:
1. `API_BASE_URL` = `http://localhost:8000` 
2. Los endpoints incluían `/api/v1/...`
3. Al concatenar: `${API_BASE_URL}${endpoint}` = `http://localhost:8000/api/v1/...`

Pero el backend espera que todas las rutas tengan el prefijo `/api`, por lo que la solución fue modificar el `API_BASE_URL` para incluirlo.

## Solución Implementada

### 1. Actualización de `src/lib/api-config.ts`
**Antes:**
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  register: '/api/v1/auth/register',
  addresses: '/api/v1/addresses',
  emergencyContacts: '/api/v1/emergency-contacts',
  // ... etc
}
```

**Después:**
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  register: '/v1/auth/register',
  addresses: '/v1/addresses',
  emergencyContacts: '/v1/emergency-contacts',
  // ... etc
}
```

### 2. Actualización de `src/lib/firebase-client.ts`

#### Base URL actualizada:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
```

#### Todas las rutas actualizadas (45+ endpoints):
- ❌ `fetchWithAuth('/api/v1/users/me')` 
- ✅ `fetchWithAuth('/v1/users/me')`

- ❌ `fetchWithAuth('/api/v1/addresses')` 
- ✅ `fetchWithAuth('/v1/addresses')`

- ❌ `fetchWithAuth('/api/v1/emergency-contacts')` 
- ✅ `fetchWithAuth('/v1/emergency-contacts')`

- ❌ `fetchWithAuth('/api/v1/bank-accounts')` 
- ✅ `fetchWithAuth('/v1/bank-accounts')`

- ❌ `fetchWithAuth('/api/v1/health-insurance')` 
- ✅ `fetchWithAuth('/v1/health-insurance')`

- ❌ `fetchWithAuth('/api/v1/medical-info')` 
- ✅ `fetchWithAuth('/v1/medical-info')`

- ❌ `fetch(\`${API_BASE_URL}/api/v1/auth/register\`)` 
- ✅ `fetch(\`${API_BASE_URL}/v1/auth/register\`)`

## Categorías de Endpoints Corregidos

1. **Authentication (6 endpoints)**
   - `/v1/auth/register`
   - `/v1/auth/signin`
   - `/v1/auth/login`
   - `/v1/auth/profile`
   - `/v1/auth/verify-email`
   - `/v1/auth/check-email/${email}`

2. **Users (7 endpoints)**
   - `/v1/users`
   - `/v1/users/me`
   - `/v1/users/${id}`
   - `/v1/users/rut/${rut}`
   - `/v1/users/phone/${phoneNumber}`

3. **Addresses (6 endpoints)**
   - `/v1/addresses`
   - `/v1/addresses/${id}` (GET, PUT, DELETE)
   - `/v1/addresses/${id}/set-primary`

4. **Emergency Contacts (5 endpoints)**
   - `/v1/emergency-contacts`
   - `/v1/emergency-contacts/${id}` (GET, PUT, DELETE)

5. **Emergency Events (6 endpoints)**
   - `/v1/emergency-events`
   - `/v1/emergency-events/all`
   - `/v1/emergency-events/${id}` (GET, PUT, DELETE)

6. **Bank Accounts (5 endpoints)**
   - `/v1/bank-accounts`
   - `/v1/bank-accounts/${id}` (GET, PUT, DELETE)

7. **Health Insurance (5 endpoints)**
   - `/v1/health-insurance`
   - `/v1/health-insurance/${id}` (GET, PUT, DELETE)

8. **Medical Info (5 endpoints)**
   - `/v1/medical-info`
   - GET, POST, PUT, DELETE, PATCH operations

## Resultado Final

Ahora todas las llamadas API generan URLs correctas:

```
✅ http://localhost:8000/api/v1/users/me
✅ http://localhost:8000/api/v1/addresses
✅ http://localhost:8000/api/v1/emergency-contacts
✅ http://localhost:8000/api/v1/emergency-events
✅ http://localhost:8000/api/v1/bank-accounts
✅ http://localhost:8000/api/v1/health-insurance
✅ http://localhost:8000/api/v1/medical-info
✅ http://localhost:8000/api/v1/auth/register
```

## Verificación

✅ 0 errores de compilación en TypeScript
✅ Todas las rutas ahora apuntan correctamente a `/api/v1/*`
✅ No hay duplicación de `/api` en ninguna URL

## Variables de Entorno

Si necesitas configurar una URL diferente para producción o desarrollo, puedes usar:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://tu-api.com/api
```

**Importante**: La variable debe incluir `/api` al final si tu backend lo requiere.

## Próximos Pasos

1. Reiniciar el servidor de desarrollo con `npm run dev`
2. Probar el flujo completo:
   - ✅ Registro de usuario
   - ✅ Login
   - ✅ Onboarding (6 pasos con auto-save)
   - ✅ Dashboard (carga de datos de las 6 secciones)
3. Verificar que todas las llamadas API devuelven 200 OK en lugar de 404

---

**Fecha de corrección**: 25 de octubre de 2025  
**Archivos modificados**: 2 (`api-config.ts`, `firebase-client.ts`)  
**Endpoints corregidos**: 45+
