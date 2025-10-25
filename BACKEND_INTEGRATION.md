# Integración con Backend

Este documento explica cómo debe estar configurado tu backend para funcionar con este frontend.

## 🏗️ Arquitectura

```
Frontend (Next.js)
      ↓
Firebase Auth (genera token JWT)
      ↓
Backend API (valida token + procesa datos)
      ↓
Tu Base de Datos
```

## 🔥 Configuración de Firebase Admin SDK en tu Backend

### 1. Instalar Firebase Admin SDK

**Node.js:**
```bash
npm install firebase-admin
```

**Python:**
```bash
pip install firebase-admin
```

### 2. Obtener Service Account Key

1. Ve a [Firebase Console](https://console.firebase.google.com/project/hackaton-911/settings/serviceaccounts/adminsdk)
2. Haz clic en "Generate new private key"
3. Guarda el archivo JSON en tu proyecto (NO lo subas a Git)

### 3. Inicializar Firebase Admin

**Node.js:**
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

**Python:**
```python
import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
```

## 🔐 Middleware de Autenticación

### Node.js/Express

```javascript
const admin = require('firebase-admin');

// Middleware para validar token
async function authenticateUser(req, res, next) {
  try {
    // Extraer token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verificar token con Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Agregar información del usuario al request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ 
      message: 'Invalid or expired token' 
    });
  }
}

module.exports = { authenticateUser };
```

### Python/Flask

```python
from firebase_admin import auth
from flask import request, jsonify
from functools import wraps

def authenticate_user(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Extraer token del header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        
        try:
            # Verificar token con Firebase Admin SDK
            decoded_token = auth.verify_id_token(token)
            
            # Agregar información del usuario al request
            request.user = {
                'uid': decoded_token['uid'],
                'email': decoded_token.get('email')
            }
            
            return f(*args, **kwargs)
        except Exception as e:
            print(f'Error verifying token: {e}')
            return jsonify({'message': 'Invalid or expired token'}), 401
    
    return decorated_function
```

## 📋 Endpoints Requeridos

### 1. Crear Perfil de Usuario

**POST** `/api/users/profile`

**Headers:**
```
Authorization: Bearer <firebase-token>
Content-Type: application/json
```

**Body:**
```json
{
  "uid": "firebase-user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "bloodType": "O+",
  "allergies": "None",
  "medicalConditions": "None",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567891",
    "relationship": "Spouse"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile created successfully"
}
```

**Ejemplo Node.js:**
```javascript
app.post('/api/users/profile', authenticateUser, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const userData = req.body;
    
    // Validar que el UID del body coincida con el del token
    if (userData.uid !== uid) {
      return res.status(403).json({ 
        message: 'UID mismatch' 
      });
    }
    
    // Guardar en tu base de datos
    await db.users.create({
      uid,
      email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      address: userData.address,
      bloodType: userData.bloodType,
      allergies: userData.allergies,
      medicalConditions: userData.medicalConditions,
      emergencyContact: userData.emergencyContact,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Profile created successfully' 
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ 
      message: 'Error creating profile' 
    });
  }
});
```

### 2. Obtener Perfil de Usuario

**GET** `/api/users/profile`

**Headers:**
```
Authorization: Bearer <firebase-token>
```

**Response:**
```json
{
  "uid": "firebase-user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "bloodType": "O+",
  "allergies": "None",
  "medicalConditions": "None",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567891",
    "relationship": "Spouse"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Ejemplo Node.js:**
```javascript
app.get('/api/users/profile', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    
    // Buscar usuario en tu base de datos
    const user = await db.users.findOne({ uid });
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Error fetching profile' 
    });
  }
});
```

### 3. Listar Solicitudes de Emergencia

**GET** `/api/emergency-requests`

**Headers:**
```
Authorization: Bearer <firebase-token>
```

**Response:**
```json
[
  {
    "id": "request-id-1",
    "userId": "firebase-user-id",
    "type": "medical",
    "priority": "high",
    "status": "pending",
    "description": "Emergency description",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060,
      "address": "123 Emergency St"
    },
    "contactInfo": {
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### 4. Crear Solicitud de Emergencia

**POST** `/api/emergency-requests`

**Headers:**
```
Authorization: Bearer <firebase-token>
Content-Type: application/json
```

**Body:**
```json
{
  "type": "medical",
  "priority": "high",
  "status": "pending",
  "description": "Emergency description",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Emergency St"
  },
  "contactInfo": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "id": "request-id-1",
  "userId": "firebase-user-id",
  "type": "medical",
  "priority": "high",
  "status": "pending",
  "description": "Emergency description",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Emergency St"
  },
  "contactInfo": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 5. Obtener Solicitud Específica

**GET** `/api/emergency-requests/:id`

**Headers:**
```
Authorization: Bearer <firebase-token>
```

**Response:**
```json
{
  "id": "request-id-1",
  "userId": "firebase-user-id",
  "type": "medical",
  "priority": "high",
  "status": "pending",
  "description": "Emergency description",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Emergency St"
  },
  "contactInfo": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 6. Actualizar Solicitud

**PUT** `/api/emergency-requests/:id`

**Headers:**
```
Authorization: Bearer <firebase-token>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "in_progress",
  "priority": "critical"
}
```

**Response:**
```json
{
  "id": "request-id-1",
  "userId": "firebase-user-id",
  "type": "medical",
  "priority": "critical",
  "status": "in_progress",
  "description": "Emergency description",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Emergency St"
  },
  "contactInfo": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

### 7. Eliminar Solicitud

**DELETE** `/api/emergency-requests/:id`

**Headers:**
```
Authorization: Bearer <firebase-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

## 🛡️ Seguridad

### Validaciones Importantes

1. **Validar Token en Cada Request**: Usa el middleware en todas las rutas protegidas
2. **Validar Propiedad**: Verifica que el usuario solo pueda acceder a sus propios datos
3. **Validar Datos de Entrada**: Sanitiza y valida todos los inputs
4. **Rate Limiting**: Implementa límites de peticiones por usuario
5. **CORS**: Configura CORS correctamente para tu dominio

### Ejemplo de Validación de Propiedad

```javascript
app.put('/api/emergency-requests/:id', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    
    // Buscar solicitud
    const request = await db.emergencyRequests.findOne({ id });
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Verificar que el usuario sea el dueño
    if (request.userId !== uid) {
      return res.status(403).json({ 
        message: 'You do not have permission to update this request' 
      });
    }
    
    // Actualizar solicitud
    const updates = req.body;
    await db.emergencyRequests.update({ id }, {
      ...updates,
      updatedAt: new Date()
    });
    
    const updatedRequest = await db.emergencyRequests.findOne({ id });
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Error updating request' });
  }
});
```

## 🔄 CORS Configuration

**Node.js/Express:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## 📝 Variables de Entorno del Backend

```env
# Puerto del servidor
PORT=8000

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:3000

# Ruta al Service Account Key de Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Base de datos
DATABASE_URL=postgresql://...
```

## ✅ Testing

### Probar Token con cURL

```bash
# Obtener token desde el frontend (console.log)
TOKEN="eyJhbGciOiJSUzI1NiIsImtpZCI6..."

# Probar endpoint
curl -X GET http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Probar con Postman

1. Crea una nueva request
2. Agrega header: `Authorization: Bearer <tu-token>`
3. Envía la request

## 🚨 Errores Comunes

### Error: "Invalid or expired token"
- El token expiró (los tokens de Firebase expiran después de 1 hora)
- El token es inválido
- El Service Account Key no es correcto

### Error: "No token provided"
- El header `Authorization` no está presente
- El formato del header es incorrecto (debe ser `Bearer <token>`)

### Error: "UID mismatch"
- El `uid` en el body no coincide con el del token
- Alguien está intentando modificar datos de otro usuario

## 📚 Recursos

- [Firebase Admin SDK - Node.js](https://firebase.google.com/docs/admin/setup)
- [Firebase Admin SDK - Python](https://firebase.google.com/docs/admin/setup#python)
- [Verificar ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
