# 🚀 Guía Rápida: Cómo Agregar Tus Datos

## Opción 1: Asistente de Configuración (LA MÁS FÁCIL) ⭐

### Paso 1: Inicia sesión
```bash
npm run dev
```
Ve a `http://localhost:3000/login` e inicia sesión

### Paso 2: Usa el asistente
Ve a: **`http://localhost:3000/setup`**

Verás una página con un botón **"Agregar Datos de Ejemplo"**. Click en ese botón y automáticamente se agregarán:

- ✅ 2 Direcciones (Casa y Trabajo)
- ✅ 2 Contactos de Emergencia
- ✅ Información Médica completa
- ✅ 1 Seguro de Salud
- ✅ 2 Cuentas Bancarias

Una vez terminado, click en **"Ver en Mi Perfil"** para ver todos tus datos.

---

## Opción 2: Agregar Manualmente desde el Perfil

### Ve a tu perfil
`http://localhost:3000/profile`

### Pestaña: Direcciones (📍)
1. Click **"+ Nueva Dirección"**
2. Llena el formulario
3. Click **"Guardar"**
4. Para hacerla principal, click en la estrella ⭐

### Pestaña: Contactos (📞)
1. Click **"+ Nuevo Contacto"**
2. Llena el formulario
3. Marca ☑️ "Establecer como contacto principal" si quieres
4. Click **"Guardar"**

### Pestaña: Médico (❤️)

**Información Médica:**
1. Click **"Editar"**
2. Llena:
   - Tipo de sangre
   - Alergias (escribe y click +)
   - Medicamentos (escribe y click +)
   - Condiciones (escribe y click +)
   - Notas adicionales
3. Click **"Guardar Información"**

**Seguros:**
1. Baja a la sección "Seguros de Salud"
2. Click **"+ Nuevo Seguro"**
3. Llena el formulario
4. Click **"Guardar"**

### Pestaña: Pagos (💳)
1. Click **"+ Nueva Cuenta"**
2. Llena el formulario
3. Click **"Guardar"**

---

## Opción 3: Desde el Código

Crea un archivo o componente con este código:

```typescript
import { apiClient } from '@/lib/firebase-client';

// Agregar dirección
await apiClient.createAddress({
  street: 'Tu calle',
  city: 'Tu ciudad',
  state: 'Tu estado',
  country: 'Chile',
  postalCode: '12345',
  label: 'Casa'
});

// Agregar contacto
await apiClient.createEmergencyContact({
  name: 'Nombre del contacto',
  phone: '+56912345678',
  relationship: 'Madre/Padre/Hermano/etc',
  email: 'email@example.com',
  isPrimary: true
});

// Agregar info médica
await apiClient.upsertMedicalInfo({
  bloodType: 'O+',
  allergies: ['Alergia1', 'Alergia2'],
  medications: ['Medicamento1'],
  conditions: ['Condición1'],
  notes: 'Notas adicionales'
});

// Agregar seguro
await apiClient.createHealthInsurance({
  provider: 'Nombre del seguro',
  policyNumber: 'NUM-123456',
  coverageType: 'Tipo de cobertura',
  startDate: '2024-01-01'
});

// Agregar cuenta bancaria
await apiClient.createBankAccount({
  bankName: 'Nombre del banco',
  accountNumber: '1234567890',
  accountType: 'checking', // o 'savings' o 'other'
  accountHolderName: 'Tu nombre'
});
```

---

## 📱 Rutas Disponibles

- `/login` - Iniciar sesión
- `/register` - Registrarse
- `/dashboard` - Panel principal
- `/profile` - Tu perfil (agregar/editar datos manualmente)
- `/setup` - Asistente de configuración (agregar datos de ejemplo)
- `/emergency-request` - Crear solicitud de emergencia

---

## 🎯 Recomendación

**USA EL ASISTENTE** (`/setup`) para agregar datos de ejemplo rápidamente, luego edítalos desde `/profile` según necesites.

**Flujo recomendado:**
1. Login → `/login`
2. Setup → `/setup` (click en "Agregar Datos de Ejemplo")
3. Perfil → `/profile` (edita los datos según necesites)
4. ¡Listo! 🎉

---

## ❓ Preguntas Frecuentes

**¿Los datos del asistente son reales?**
No, son datos de ejemplo. Puedes editarlos después.

**¿Puedo agregar más de un item?**
Sí, puedes agregar múltiples direcciones, contactos, cuentas, etc.

**¿Qué significa "principal"?**
Es el item por defecto que se usará en emergencias.

**¿Puedo eliminar datos?**
Sí, cada item tiene un botón de eliminar 🗑️

**¿Los cambios se guardan automáticamente?**
Sí, cada vez que guardas un formulario, se guarda en el backend.

---

**¡Empieza ahora visitando `/setup`!** 🚀
