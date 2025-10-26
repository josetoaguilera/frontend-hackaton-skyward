# 🎯 Flujo Completo de la Aplicación: Guía del Usuario

## 🚀 Descripción General

Esta aplicación está diseñada para que el usuario complete su información personal de manera gradual y **amigable**, con **guardado automático** en cada paso y un **dashboard con secciones extensibles** que muestra toda su información de forma organizada.

---

## 📋 Flujo de Usuario

### 1️⃣ **Registro / Login**
- **Ruta**: `/login` o `/register`
- **Qué pasa**: El usuario se registra o inicia sesión
- **Comportamiento inteligente**:
  - Si es **usuario nuevo** (sin datos) → Redirige a `/onboarding`
  - Si es **usuario con datos** → Redirige a `/dashboard`

### 2️⃣ **Onboarding (Primera vez)**
- **Ruta**: `/onboarding`
- **Descripción**: Wizard de 6 pasos para completar información
- **Características**:
  - ✅ **Barra de progreso visual** con indicadores de completado
  - ✅ **Guardado automático** al hacer "Siguiente"
  - ✅ **Persistencia**: Si cierra la página, al volver continúa donde quedó
  - ✅ **Pasos opcionales**: Puede saltar pasos y completarlos después
  - ✅ **Validación en tiempo real**

#### Pasos del Onboarding:

1. **Información Personal** ⭐ (Obligatorio)
   - Nombre, apellido, teléfono, RUT
   - Se guarda en el perfil del usuario

2. **Direcciones** 📍
   - Agregar múltiples direcciones (Casa, Trabajo, etc.)
   - Marcar dirección principal
   - Campos: Calle, Ciudad, Región, País, Código Postal

3. **Contactos de Emergencia** 📞
   - Agregar múltiples contactos
   - Campos: Nombre, teléfono, relación, email
   - Marcar contacto principal

4. **Información Médica** ❤️
   - Tipo de sangre
   - Alergias (múltiples)
   - Medicamentos actuales
   - Condiciones médicas
   - Notas adicionales

5. **Seguro de Salud** 🛡️
   - Proveedor, número de póliza
   - Tipo de cobertura
   - Fechas de vigencia

6. **Cuenta Bancaria** 💳
   - Banco, número de cuenta
   - Tipo de cuenta (corriente/ahorro)
   - Titular de la cuenta

### 3️⃣ **Dashboard (Vista Principal)**
- **Ruta**: `/dashboard`
- **Descripción**: Resumen completo con componentes extensibles/colapsables

#### Características del Dashboard:

**🔸 Secciones Colapsables**
Cada categoría es un componente que se puede:
- ✅ **Expandir/Colapsar** (click en la tarjeta)
- ✅ **Ver resumen** en el encabezado (badge con cantidad)
- ✅ **Editar datos** (botón que lleva a `/profile`)
- ✅ **Agregar nuevos items**

**🔸 Secciones Disponibles:**

1. **Información Personal** 👤
   - Nombre completo, email, teléfono, RUT, rol
   - Botón: "Editar perfil"

2. **Mis Direcciones** 📍
   - Lista de todas las direcciones
   - Indica cuál es la principal
   - Muestra: calle, ciudad, región, país
   - Botón: "+ Agregar dirección"

3. **Contactos de Emergencia** 📞
   - Lista de contactos
   - Muestra: nombre, teléfono, relación, email
   - Indica contacto principal
   - Botón: "+ Agregar contacto"

4. **Información Médica** ❤️
   - Tipo de sangre
   - Listas de alergias, medicamentos, condiciones
   - Notas médicas
   - Botón: "Editar información médica"

5. **Seguros de Salud** 🛡️
   - Lista de seguros
   - Muestra: proveedor, póliza, cobertura, fechas
   - Indica seguro principal
   - Botón: "+ Agregar seguro"

6. **Cuentas Bancarias** 💳
   - Lista de cuentas
   - **Números de cuenta enmascarados** (****1234)
   - Muestra: banco, titular, tipo de cuenta
   - Indica cuenta principal
   - Botón: "+ Agregar cuenta"

**🔸 Acciones Rápidas** (Al final):
- 🚨 **Crear Emergencia**
- ✏️ **Editar Perfil**
- ➕ **Agregar Datos** (vuelve al onboarding)

### 4️⃣ **Perfil (Edición Detallada)**
- **Ruta**: `/profile`
- **Descripción**: Interfaz con tabs para editar cada sección
- **Características**:
  - Formularios completos por categoría
  - CRUD completo (Crear, Leer, Actualizar, Eliminar)
  - Validación en tiempo real
  - Guardado manual con botones

---

## 💾 Persistencia de Datos

### ¿Cómo funciona el guardado?

1. **Durante el Onboarding**:
   ```
   Usuario llena formulario → Click "Siguiente" → Se guarda en el backend → Pasa al siguiente paso
   ```

2. **Si cierra la página**:
   ```
   Usuario vuelve → Se carga progreso del backend → Continúa en el primer paso incompleto
   ```

3. **Marcadores de completado**:
   - Verde ✅ = Paso completado
   - Azul 🔵 = Paso actual
   - Gris ⚪ = Paso pendiente

### Verificación de Datos
```typescript
// Al cargar onboarding:
- Obtiene datos del backend
- Marca pasos como completados si tienen datos
- Salta al primer paso incompleto
- Si todo está completo → Redirige al dashboard
```

---

## 🎨 Componentes Extensibles

### CollapsibleSection
Componente reutilizable para secciones del dashboard:

```tsx
<CollapsibleSection
  title="Título"
  icon={<Icon />}
  badge="X items"
  defaultExpanded={false}
>
  {/* Contenido */}
</CollapsibleSection>
```

**Características**:
- Animación suave al expandir/colapsar
- Icono personalizado por categoría
- Badge con información resumida
- Hover effects para mejor UX

### DataCard
Tarjeta para mostrar información individual:

```tsx
<DataCard
  title="Nombre del item"
  subtitle="Descripción"
  isPrimary={true}
  onEdit={() => {}}
  onDelete={() => {}}
>
  <InfoItem label="Campo" value="Valor" />
</DataCard>
```

### EmptySection
Placeholder cuando no hay datos:

```tsx
<EmptySection 
  message="No tienes datos registrados"
  onAdd={() => router.push('/agregar')}
/>
```

---

## 🔄 Flujo de Navegación

```
/login 
  ├─ Usuario nuevo → /onboarding
  │   ├─ Completa datos → /dashboard
  │   └─ Salta pasos → /dashboard (con secciones vacías)
  │
  └─ Usuario con datos → /dashboard
      ├─ Ver resumen (secciones colapsables)
      ├─ Click "Editar" → /profile
      ├─ Click "Agregar" → /onboarding (vuelve a wizard)
      └─ Click "Emergencia" → /emergency-request
```

---

## 📊 Estados de la UI

### Dashboard con datos completos:
```
✅ Todas las secciones tienen contenido
✅ Badges muestran cantidades correctas
✅ Items marcados como "Principal" visibles
✅ Acciones rápidas disponibles
```

### Dashboard con datos parciales:
```
⚠️ Banner: "¡Completa tu perfil!"
⚠️ Secciones vacías muestran EmptySection
⚠️ Botón destacado: "Completar ahora"
```

### Durante Onboarding:
```
🔵 Paso actual resaltado
✅ Pasos completados en verde
⚪ Pasos pendientes en gris
🔄 Barra de progreso animada
```

---

## 🛠️ Tecnologías Usadas

- **Next.js 14** (App Router)
- **TypeScript** (100% type-safe)
- **Tailwind CSS** (Styling responsive)
- **Radix UI** (Componentes accesibles)
- **Firebase Auth** (Autenticación)
- **Backend REST API** (Persistencia de datos)

---

## 📱 Responsive Design

Todos los componentes son **completamente responsive**:
- Mobile: Columna única, botones grandes
- Tablet: 2 columnas cuando es posible
- Desktop: 3 columnas para acciones rápidas

---

## 🎯 Próximos Pasos para el Usuario

### Primera vez:
1. ✅ Registrarse (`/register`)
2. ✅ Completar onboarding (`/onboarding`)
3. ✅ Ver dashboard (`/dashboard`)
4. ✅ Editar detalles si es necesario (`/profile`)

### Usuario existente:
1. ✅ Login (`/login`)
2. ✅ Dashboard (`/dashboard`) - ver resumen
3. ✅ Agregar/editar información según necesidad

---

## 🚀 Cómo Ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir navegador
http://localhost:3000

# 4. Ir a login
http://localhost:3000/login
```

---

## ✨ Mejores Prácticas Implementadas

✅ **UX Amigable**: Wizard paso a paso, no abrumador
✅ **Guardado Automático**: No perder progreso
✅ **Feedback Visual**: Indicadores de estado claros
✅ **Validación**: Errores claros y específicos
✅ **Accesibilidad**: Componentes Radix UI
✅ **Performance**: Lazy loading, code splitting
✅ **Type Safety**: TypeScript en todo el código
✅ **Responsive**: Funciona en todos los dispositivos

---

## 🎨 Paleta de Colores

- **Primario**: Azul/Índigo (información, acciones)
- **Secundario**: Verde (éxito, completado)
- **Peligro**: Rojo (emergencias, eliminar)
- **Advertencia**: Amarillo (pendiente)
- **Categorías**:
  - 👤 Personal: Azul
  - 📍 Direcciones: Verde
  - 📞 Contactos: Rojo
  - ❤️ Médico: Rosa
  - 🛡️ Seguros: Morado
  - 💳 Bancos: Amarillo

---

**¡Todo listo para que el usuario empiece a usar la aplicación!** 🎉
