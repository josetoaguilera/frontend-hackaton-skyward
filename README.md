# Sistema de Emergencias 911 - Frontend

Frontend para el sistema de emergencias 911 construido con Next.js 14, TypeScript, Tailwind CSS, shadcn/ui y Firebase Authentication.

## 🏗️ Arquitectura

Este proyecto usa una arquitectura híbrida:

- **🔥 Firebase Authentication**: Para login/registro y autenticación de usuarios
- **🚀 Backend REST API**: Para almacenar y gestionar todos los datos (perfiles, emergencias, etc.)

### ¿Por qué esta arquitectura?

- Firebase Auth es excelente para autenticación segura y manejo de tokens
- Tu backend mantiene el control total de los datos de negocio
- El frontend envía el token de Firebase en cada petición al backend
- El backend valida el token con Firebase Admin SDK

## 🔥 Firebase Authentication

### Configuración de Firebase

Las credenciales de Firebase están configuradas en `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBfBB_TlI9kY-cxAlPg5bpuX6aC7OCP0pI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hackaton-911.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hackaton-911
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hackaton-911.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=595224534933
NEXT_PUBLIC_FIREBASE_APP_ID=1:595224534933:web:d60f63f6ad091c8c1aaa3b

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Habilitar Firebase Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/project/hackaton-911/authentication/providers)
2. Habilita el proveedor **Email/Password**
3. No necesitas habilitar Firestore (solo usamos Firebase Auth)

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### Compilación

```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── dashboard/          # Panel principal
│   ├── login/             # Página de inicio de sesión
│   ├── register/          # Página de registro
│   └── emergency-request/ # Gestión de solicitudes de emergencia
├── components/
│   ├── ui/               # Componentes shadcn/ui
│   └── ProtectedRoute.tsx # HOC para rutas protegidas
├── lib/
│   ├── firebase.ts       # Configuración de Firebase
│   ├── firebase-client.ts # Cliente que integra Firebase Auth + Backend API
│   ├── api-config.ts     # Constantes y configuración
│   └── utils.ts          # Utilidades
└── types/
    └── index.ts          # Definiciones de TypeScript
```

## � Flujo de Autenticación

1. **Registro**:
   - Usuario se registra → Firebase Auth crea la cuenta
   - Frontend obtiene el token de Firebase
   - Frontend envía datos del usuario al backend con el token
   - Backend valida el token y guarda el perfil en tu base de datos

2. **Login**:
   - Usuario inicia sesión → Firebase Auth valida credenciales
   - Frontend obtiene el token de Firebase
   - Token se incluye automáticamente en todas las peticiones al backend

3. **Peticiones al Backend**:
   - Todas las peticiones incluyen: `Authorization: Bearer <firebase-token>`
   - Tu backend valida el token con Firebase Admin SDK
   - Backend responde con los datos solicitados

## 🔐 API del Cliente

### Autenticación (Firebase Auth)

```typescript
import { apiClient } from '@/lib/firebase-client';

// Login
await apiClient.login({ email, password });

// Registro (crea usuario en Firebase + perfil en backend)
await apiClient.register({
  email,
  password,
  firstName,
  lastName,
  phone,
  address,
  bloodType,
  allergies,
  medicalConditions,
  emergencyContact: { name, phone, relationship }
});

// Logout
await apiClient.logout();
```

### Datos del Usuario (Backend API)

```typescript
// Obtener perfil (desde tu backend)
const user = await apiClient.getProfile();
// GET /api/users/profile
// Headers: { Authorization: Bearer <firebase-token> }
```

### Solicitudes de Emergencia (Backend API)

```typescript
// Obtener todas las solicitudes
const requests = await apiClient.getEmergencyRequests();
// GET /api/emergency-requests

// Crear solicitud
const request = await apiClient.createEmergencyRequest({
  type: 'medical',
  priority: 'high',
  status: 'pending',
  description: 'Descripción de la emergencia',
  location: { lat, lng, address },
  contactInfo: { name, phone, email }
});
// POST /api/emergency-requests

// Obtener una solicitud específica
const request = await apiClient.getEmergencyRequest(id);
// GET /api/emergency-requests/:id

// Actualizar solicitud
await apiClient.updateEmergencyRequest(id, {
  status: 'in_progress'
});
// PUT /api/emergency-requests/:id

// Eliminar solicitud
await apiClient.deleteEmergencyRequest(id);
// DELETE /api/emergency-requests/:id
```

## 🔧 Endpoints del Backend

Tu backend debe implementar estos endpoints:

### Usuarios
- `POST /api/users/profile` - Crear perfil de usuario (después de registro en Firebase)
- `GET /api/users/profile` - Obtener perfil del usuario autenticado

### Solicitudes de Emergencia
- `GET /api/emergency-requests` - Listar solicitudes del usuario
- `POST /api/emergency-requests` - Crear nueva solicitud
- `GET /api/emergency-requests/:id` - Obtener una solicitud específica
- `PUT /api/emergency-requests/:id` - Actualizar una solicitud
- `DELETE /api/emergency-requests/:id` - Eliminar una solicitud

**Importante**: Todos los endpoints deben:
1. Recibir el token en el header: `Authorization: Bearer <token>`
2. Validar el token con Firebase Admin SDK
3. Extraer el `uid` del usuario del token decodificado
4. Usarlo para filtrar/validar datos

## 🎨 Componentes UI

Este proyecto usa **shadcn/ui** con Tailwind CSS:

- ✅ Button
- ✅ Input
- ✅ Card
- ✅ Badge
- ✅ Alert
- ✅ Select
- ✅ Label
- ✅ Form

## 🔒 Rutas Protegidas

Las rutas que requieren autenticación están envueltas con el componente `ProtectedRoute`:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Contenido protegido */}
    </ProtectedRoute>
  );
}
```

## 🔧 Validación del Token en el Backend

Tu backend debe validar el token de Firebase. Ejemplo en Node.js:

```javascript
const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'hackaton-911',
    // ... otras credenciales del service account
  })
});

// Middleware para validar token
async function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Usar en tus rutas
app.post('/api/users/profile', authenticateUser, async (req, res) => {
  const { uid, email } = req.user;
  const userData = req.body;
  
  // Guardar en tu base de datos
  await db.users.create({ uid, email, ...userData });
  
  res.json({ success: true });
});
```

## 📦 Dependencias Principales

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Firebase** - Autenticación y base de datos
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **Lucide React** - Iconos

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## 🔑 Variables de Entorno

Copia `.env.local.example` a `.env.local` y configura las variables:

```env
# Firebase Configuration (ya configurado)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBfBB_TlI9kY-cxAlPg5bpuX6aC7OCP0pI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hackaton-911.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hackaton-911
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hackaton-911.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=595224534933
NEXT_PUBLIC_FIREBASE_APP_ID=1:595224534933:web:d60f63f6ad091c8c1aaa3b

# Backend API URL (modifica según tu backend)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📱 Características

- ✅ Autenticación con Firebase (Email/Password)
- ✅ Token JWT automático en todas las peticiones
- ✅ Panel de control con estadísticas
- ✅ Gestión de solicitudes de emergencia
- ✅ Búsqueda y filtrado de solicitudes
- ✅ Información médica del usuario
- ✅ Diseño responsive
- ✅ Tema moderno con shadcn/ui
- ✅ Protección de rutas
- ✅ Manejo de errores
- ✅ Integración completa con backend REST

## 🚨 Notas Importantes

1. **Firebase Authentication**: Solo se usa para autenticación (login/registro)
2. **Backend REST API**: Todos los datos (perfiles, emergencias) se guardan en tu backend
3. **Token JWT**: Se envía automáticamente en cada petición al backend
4. **Sin Firestore**: No necesitas habilitar Firestore Database
5. **Validación en Backend**: Tu backend debe validar el token con Firebase Admin SDK

## 📄 Licencia

MIT
