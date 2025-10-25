# 🔑 Cómo Obtener el Token de Firebase para Swagger

## 🎯 Método Rápido: Botón en el Dashboard (RECOMENDADO)

### Paso 1: Inicia Sesión
1. Ve a `http://localhost:3000/login`
2. Inicia sesión con tu usuario

### Paso 2: Copia el Token
1. Ve al dashboard `http://localhost:3000/dashboard`
2. En el header verás un botón **"🔑 Token"**
3. Haz click → El token se copiará automáticamente al clipboard

### Paso 3: Úsalo en Swagger
1. Ve a tu Swagger UI (ej: `http://localhost:8000/docs` o `/swagger`)
2. Click en el botón **"Authorize"** (candado) arriba a la derecha
3. En el campo de texto, escribe:
   ```
   Bearer <pega-tu-token-aquí>
   ```
4. Click en **"Authorize"**
5. ✅ Ahora todos tus endpoints usarán el token

---

## 🛠️ Método Alternativo 1: Consola del Navegador

### Si no puedes ver el dashboard

1. Inicia sesión en `http://localhost:3000/login`
2. Abre DevTools (F12 o Cmd+Option+I)
3. Ve a la pestaña **Console**
4. Pega y ejecuta este código:

```javascript
// Obtener y copiar el token
firebase.auth().currentUser.getIdToken().then(token => {
  console.log('TOKEN:', token);
  navigator.clipboard.writeText(token);
  console.log('✅ Token copiado al clipboard!');
});
```

5. El token se copiará automáticamente
6. Pégalo en Swagger como: `Bearer <token>`

---

## 🛠️ Método Alternativo 2: LocalStorage

1. Inicia sesión en el frontend
2. Abre DevTools → Pestaña **Application** (o Storage)
3. Busca en **Local Storage** → `http://localhost:3000`
4. Busca una key que empiece con `firebase:authUser`
5. Copia el valor del campo `stsTokenManager.accessToken`
6. Úsalo en Swagger: `Bearer <token>`

---

## 🛠️ Método Alternativo 3: Network Tab

1. Inicia sesión en el frontend
2. Abre DevTools → Pestaña **Network**
3. Recarga la página del dashboard
4. Busca una petición a `http://localhost:8000/api/...`
5. Click en la petición → Pestaña **Headers**
6. Busca `Authorization: Bearer <token>`
7. Copia el token (sin el "Bearer ")
8. Úsalo en Swagger: `Bearer <token>`

---

## 📝 Formato del Token en Swagger

El token debe tener este formato en Swagger:

```
Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZmNzI1NDEwMWY1N2...
```

⚠️ **Importante:**
- Incluye la palabra `Bearer` seguida de un espacio
- Luego el token completo (es muy largo, ~800+ caracteres)
- NO incluyas comillas

---

## 🔄 El Token Expira

Los tokens de Firebase **expiran después de 1 hora**.

### Síntomas de token expirado:
- 401 Unauthorized en Swagger
- Error: "Token expired"

### Solución:
1. Simplemente obtén un nuevo token (repite el Paso 2)
2. Actualiza en Swagger con el nuevo token

---

## 🧪 Ejemplo de Uso en Swagger

### Ejemplo 1: Obtener Perfil
```
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZm...
```

### Ejemplo 2: Crear Emergencia
```
POST /api/emergency-requests
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZm...
Content-Type: application/json

{
  "type": "medical",
  "priority": "high",
  "status": "pending",
  "description": "Emergencia médica",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St"
  },
  "contactInfo": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  }
}
```

---

## 🔍 Verificar que el Token Funciona

### Decodificar el Token (opcional)

Puedes decodificar el token en [jwt.io](https://jwt.io) para ver su contenido:

```json
{
  "iss": "https://securetoken.google.com/hackaton-911",
  "aud": "hackaton-911",
  "auth_time": 1234567890,
  "user_id": "abc123xyz",
  "sub": "abc123xyz",
  "iat": 1234567890,
  "exp": 1234571490,
  "email": "user@example.com",
  "email_verified": true,
  "firebase": {
    "identities": {
      "email": ["user@example.com"]
    },
    "sign_in_provider": "password"
  }
}
```

### Campos importantes:
- `user_id` / `sub`: ID único del usuario en Firebase
- `email`: Email del usuario
- `exp`: Timestamp de expiración (Unix timestamp)
- `iat`: Timestamp de emisión

---

## 🚨 Errores Comunes

### Error: "Token must start with 'Bearer '"
**Causa:** No pusiste "Bearer " antes del token  
**Solución:** Asegúrate de escribir `Bearer <token>` (con espacio)

### Error: "Invalid token"
**Causa:** Token mal copiado o corrupto  
**Solución:** Copia el token completo, sin espacios extras ni saltos de línea

### Error: "Token expired"
**Causa:** El token expiró (dura 1 hora)  
**Solución:** Obtén un nuevo token

### Error: "No authorization header"
**Causa:** No configuraste el token en Swagger  
**Solución:** Click en "Authorize" y pega el token

---

## 💡 Tips

1. **Guarda el token temporalmente**: Cópialo a un archivo de texto mientras pruebas
2. **Un token por sesión**: Mientras no cierres sesión o pase 1 hora, usa el mismo token
3. **Token diferente por usuario**: Cada usuario tiene su propio token
4. **Usa el botón del dashboard**: Es la forma más rápida de obtenerlo

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- NO compartas tu token con nadie
- NO subas el token a Git
- NO lo pongas en el código fuente
- Los tokens expiran automáticamente (1 hora)

---

## ✅ Checklist Rápido

1. [ ] Iniciar sesión en el frontend
2. [ ] Click en botón "🔑 Token" en el dashboard
3. [ ] Ir a Swagger
4. [ ] Click en "Authorize"
5. [ ] Pegar: `Bearer <token>`
6. [ ] Click "Authorize"
7. [ ] Probar endpoints ✅

---

## 📚 Recursos

- [Firebase ID Tokens](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [JWT.io - Decodificador de tokens](https://jwt.io)
- [Swagger UI - Authorization](https://swagger.io/docs/specification/authentication/)
