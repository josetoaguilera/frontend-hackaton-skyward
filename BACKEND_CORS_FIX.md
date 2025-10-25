# 🔧 Solución al Error de CORS

## El Problema

```
Access to fetch at 'http://localhost:8000/api/users/profile' from origin 'http://localhost:3000' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## La Causa

Tu backend está corriendo pero **no tiene CORS habilitado** para aceptar peticiones desde el frontend (`http://localhost:3000`).

## La Solución por Tecnología

---

### 🟢 Node.js/Express

#### 1. Instalar paquete CORS
```bash
npm install cors
```

#### 2. Configurar en tu servidor
```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Habilitar CORS para el frontend
app.use(cors({
  origin: 'http://localhost:3000',  // URL del frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Resto de tu configuración
app.use(express.json());

// Tus rutas aquí
app.get('/api/users/profile', (req, res) => {
  // ...
});

app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
```

---

### 🐍 Python/Flask

#### 1. Instalar Flask-CORS
```bash
pip install flask-cors
```

#### 2. Configurar en tu aplicación
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Habilitar CORS
CORS(app, origins=['http://localhost:3000'], 
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'])

@app.route('/api/users/profile')
def get_profile():
    # ...
    pass

if __name__ == '__main__':
    app.run(port=8000)
```

---

### 🐍 Python/FastAPI

#### 1. FastAPI ya incluye CORS, solo configúralo
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/users/profile")
async def get_profile():
    # ...
    pass
```

---

### 🦀 Rust/Actix-Web

#### 1. Agregar dependencia en `Cargo.toml`
```toml
[dependencies]
actix-cors = "0.6"
```

#### 2. Configurar CORS
```rust
use actix_web::{web, App, HttpServer};
use actix_cors::Cors;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![
                actix_web::http::header::AUTHORIZATION,
                actix_web::http::header::CONTENT_TYPE,
            ])
            .max_age(3600);

        App::new()
            .wrap(cors)
            .route("/api/users/profile", web::get().to(get_profile))
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await
}
```

---

### ☕ Java/Spring Boot

#### 1. Crear configuración CORS
```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

#### 2. O usar anotaciones en el Controller
```java
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    
    @GetMapping("/users/profile")
    public ResponseEntity<?> getProfile() {
        // ...
    }
}
```

---

### 🔷 Go/Gin

#### 1. Instalar middleware CORS
```bash
go get github.com/gin-contrib/cors
```

#### 2. Configurar en tu aplicación
```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {
    r := gin.Default()
    
    // Configurar CORS
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        AllowCredentials: true,
    }))
    
    r.GET("/api/users/profile", getProfile)
    
    r.Run(":8000")
}
```

---

## 🧪 Verificar que Funciona

### 1. Reinicia tu backend
Después de agregar CORS, reinicia el servidor backend.

### 2. Recarga el frontend
Recarga la página del dashboard en `http://localhost:3000/dashboard`

### 3. Verifica en DevTools
Abre DevTools → Network → Busca peticiones a `localhost:8000`

**Deberías ver:**
- ✅ Status 200 (o 401/404 dependiendo de tu implementación)
- ✅ Headers `Access-Control-Allow-Origin: http://localhost:3000`
- ❌ **NO** más errores de CORS

---

## 🚨 Errores Comunes

### "Origin null is not allowed"
**Causa:** Estás usando `file://` en lugar de `http://localhost`  
**Solución:** Usa `npm run dev` para el frontend

### "Credentials mode not allowed"
**Causa:** `allowCredentials: true` pero `allowOrigins: '*'`  
**Solución:** Especifica el origin exacto: `http://localhost:3000`

### Headers "Authorization" not allowed
**Causa:** Falta el header en `allowedHeaders`  
**Solución:** Agrega `'Authorization'` a los headers permitidos

---

## 📝 Configuración para Producción

En producción, cambia el origin:

```javascript
// Node.js/Express
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://tu-dominio.com',
  credentials: true
}));
```

```python
# Python/FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "https://tu-dominio.com")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## ✅ Checklist

- [ ] CORS habilitado en el backend
- [ ] Origin correcto: `http://localhost:3000`
- [ ] Headers permitidos: `Content-Type`, `Authorization`
- [ ] Métodos permitidos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- [ ] Credentials: `true`
- [ ] Backend reiniciado
- [ ] Frontend recargado
- [ ] Sin errores de CORS en DevTools

---

## 🆘 Siguiente Paso

Una vez que CORS esté configurado, verás un **nuevo error** (esto es bueno ✅):

```
401 Unauthorized
```

O:

```
404 Not Found
```

Esto significa que:
- ✅ CORS está funcionando
- ✅ El frontend se está conectando al backend
- ⏳ Ahora necesitas implementar los endpoints (ver `BACKEND_INTEGRATION.md`)
