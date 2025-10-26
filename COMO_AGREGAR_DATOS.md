# 📝 Cómo Agregar Tus Datos

## 🚀 Método 1: Usando la Interfaz Visual (MÁS FÁCIL)

### Paso 1: Inicia el servidor
```bash
npm run dev
```

### Paso 2: Inicia sesión
1. Ve a `http://localhost:3000/login`
2. Inicia sesión con tu cuenta

### Paso 3: Ve a tu perfil
1. Navega a `http://localhost:3000/profile`
2. Verás 6 pestañas disponibles

---

## 📍 **Agregar Direcciones**

1. Click en la pestaña **"Direcciones"**
2. Click en el botón **"+ Nueva Dirección"**
3. Llena el formulario:
   ```
   Calle: Av. Libertador Bernardo O'Higgins 1234
   Etiqueta: Casa
   Ciudad: Santiago
   Estado: Región Metropolitana
   País: Chile
   Código Postal: 8320000
   Info Adicional: Depto 401
   ☑️ Establecer como dirección principal
   ```
4. Click **"Guardar"**

---

## 📞 **Agregar Contactos de Emergencia**

1. Click en la pestaña **"Contactos"**
2. Click en el botón **"+ Nuevo Contacto"**
3. Llena el formulario:
   ```
   Nombre Completo: María González
   Teléfono: +56912345678
   Relación: Madre
   Email: maria@example.com
   Dirección: Av. Providencia 1234, Santiago
   ☑️ Establecer como contacto principal
   ```
4. Click **"Guardar"**

---

## ❤️ **Agregar Información Médica**

1. Click en la pestaña **"Médico"**
2. En la sección **"Información Médica"**, click **"Editar"**
3. Completa tu información:
   ```
   Tipo de Sangre: O+
   
   Alergias:
   - Escribe "Penicilina" y click +
   - Escribe "Maní" y click +
   
   Medicamentos:
   - Escribe "Aspirina" y click +
   
   Condiciones Médicas:
   - Escribe "Diabetes Tipo 2" y click +
   
   Notas: Alérgico a picaduras de abejas
   ```
4. Click **"Guardar Información"**

---

## 🛡️ **Agregar Seguro de Salud**

1. En la misma pestaña **"Médico"**, baja a la sección **"Seguros de Salud"**
2. Click en **"+ Nuevo Seguro"**
3. Llena el formulario:
   ```
   Proveedor: Isapre Cruz Blanca
   Número de Póliza: POL-123456789
   Número de Grupo: GRP-001
   Tipo de Cobertura: Cobertura Completa
   Fecha de Inicio: 2024-01-01
   Fecha de Fin: 2025-12-31
   ☑️ Establecer como seguro principal
   ```
4. Click **"Guardar"**

---

## 💳 **Agregar Cuenta Bancaria**

1. Click en la pestaña **"Pagos"**
2. Click en **"+ Nueva Cuenta"**
3. Llena el formulario:
   ```
   Banco: Banco de Chile
   Titular de la Cuenta: Juan Pérez
   Número de Cuenta: 1234567890
   Tipo de Cuenta: Cuenta Corriente
   Código de Ruta: 001
   Código SWIFT: BCHXCLRM
   ☑️ Establecer como cuenta principal
   ```
4. Click **"Guardar"**

---

## 💻 Método 2: Usando el Código Directamente

Si prefieres agregar datos desde código, aquí tienes ejemplos:

### Ejemplo en un componente React:

```typescript
'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/firebase-client';

export default function AgregarMisDatos() {
  useEffect(() => {
    const agregarTodosMisDatos = async () => {
      try {
        // 1. Agregar dirección
        const miDireccion = await apiClient.createAddress({
          street: 'Av. Libertador Bernardo O\'Higgins 1234',
          city: 'Santiago',
          state: 'Región Metropolitana',
          country: 'Chile',
          postalCode: '8320000',
          label: 'Casa',
          additionalInfo: 'Depto 401'
        });
        console.log('✅ Dirección agregada:', miDireccion);

        // 2. Agregar contacto de emergencia
        const miContacto = await apiClient.createEmergencyContact({
          name: 'María González',
          phone: '+56912345678',
          relationship: 'Madre',
          email: 'maria@example.com',
          address: 'Av. Providencia 1234, Santiago',
          isPrimary: true
        });
        console.log('✅ Contacto agregado:', miContacto);

        // 3. Agregar información médica
        const miInfoMedica = await apiClient.upsertMedicalInfo({
          bloodType: 'O+',
          allergies: ['Penicilina', 'Maní'],
          medications: ['Aspirina'],
          conditions: ['Diabetes Tipo 2'],
          notes: 'Alérgico a picaduras de abejas'
        });
        console.log('✅ Info médica agregada:', miInfoMedica);

        // 4. Agregar seguro de salud
        const miSeguro = await apiClient.createHealthInsurance({
          provider: 'Isapre Cruz Blanca',
          policyNumber: 'POL-123456789',
          groupNumber: 'GRP-001',
          coverageType: 'Cobertura Completa',
          startDate: '2024-01-01',
          endDate: '2025-12-31',
          isPrimary: true
        });
        console.log('✅ Seguro agregado:', miSeguro);

        // 5. Agregar cuenta bancaria
        const miCuenta = await apiClient.createBankAccount({
          bankName: 'Banco de Chile',
          accountNumber: '1234567890',
          accountType: 'checking',
          accountHolderName: 'Juan Pérez',
          routingNumber: '001',
          swiftCode: 'BCHXCLRM',
          isPrimary: true
        });
        console.log('✅ Cuenta bancaria agregada:', miCuenta);

        alert('✅ Todos tus datos han sido agregados exitosamente!');
      } catch (error) {
        console.error('❌ Error agregando datos:', error);
        alert('Error: ' + error.message);
      }
    };

    agregarTodosMisDatos();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Agregando datos...</h1>
      <p>Revisa la consola para ver el progreso</p>
    </div>
  );
}
```

---

## 🧪 Método 3: Usando Swagger (Para Testing)

1. **Obtén tu token:**
   - Ve al dashboard
   - Click en el botón **"🔑 Token"**
   - Copia el token

2. **Abre Swagger:**
   - Ve a tu backend (ej: `http://localhost:8000/docs`)

3. **Autorízate:**
   - Click en **"Authorize"**
   - Pega: `Bearer TU_TOKEN_AQUI`
   - Click **"Authorize"**

4. **Prueba los endpoints:**

   **Agregar Dirección:**
   ```
   POST /api/v1/addresses
   Body:
   {
     "street": "Av. Libertador Bernardo O'Higgins 1234",
     "city": "Santiago",
     "state": "Región Metropolitana",
     "country": "Chile",
     "postalCode": "8320000",
     "label": "Casa",
     "additionalInfo": "Depto 401"
   }
   ```

   **Agregar Contacto:**
   ```
   POST /api/emergency-contacts
   Body:
   {
     "name": "María González",
     "phone": "+56912345678",
     "relationship": "Madre",
     "email": "maria@example.com",
     "address": "Av. Providencia 1234, Santiago",
     "isPrimary": true
   }
   ```

   **Agregar Info Médica:**
   ```
   PATCH /api/v1/medical-info
   Body:
   {
     "bloodType": "O+",
     "allergies": ["Penicilina", "Maní"],
     "medications": ["Aspirina"],
     "conditions": ["Diabetes Tipo 2"],
     "notes": "Alérgico a picaduras de abejas"
   }
   ```

   **Agregar Seguro:**
   ```
   POST /api/v1/health-insurance
   Body:
   {
     "provider": "Isapre Cruz Blanca",
     "policyNumber": "POL-123456789",
     "groupNumber": "GRP-001",
     "coverageType": "Cobertura Completa",
     "startDate": "2024-01-01",
     "endDate": "2025-12-31",
     "isPrimary": true
   }
   ```

   **Agregar Cuenta Bancaria:**
   ```
   POST /api/v1/bank-accounts
   Body:
   {
     "bankName": "Banco de Chile",
     "accountNumber": "1234567890",
     "accountType": "checking",
     "accountHolderName": "Juan Pérez",
     "routingNumber": "001",
     "swiftCode": "BCHXCLRM",
     "isPrimary": true
   }
   ```

---

## 📱 Método 4: Script de Inicialización

Puedes crear un script para agregar todos tus datos de una vez:

```typescript
// scripts/agregar-mis-datos.ts
import { apiClient } from '@/lib/firebase-client';

async function agregarMisDatos() {
  console.log('🚀 Iniciando agregado de datos...\n');

  try {
    // Direcciones
    console.log('📍 Agregando direcciones...');
    await apiClient.createAddress({
      street: 'Av. Libertador Bernardo O\'Higgins 1234',
      city: 'Santiago',
      state: 'Región Metropolitana',
      country: 'Chile',
      postalCode: '8320000',
      label: 'Casa',
      isPrimary: true
    });

    await apiClient.createAddress({
      street: 'Av. Apoquindo 3000',
      city: 'Santiago',
      state: 'Región Metropolitana',
      country: 'Chile',
      postalCode: '7550000',
      label: 'Trabajo'
    });
    console.log('✅ Direcciones agregadas\n');

    // Contactos de emergencia
    console.log('📞 Agregando contactos...');
    await apiClient.createEmergencyContact({
      name: 'María González',
      phone: '+56912345678',
      relationship: 'Madre',
      email: 'maria@example.com',
      isPrimary: true
    });

    await apiClient.createEmergencyContact({
      name: 'Pedro Pérez',
      phone: '+56987654321',
      relationship: 'Hermano',
      email: 'pedro@example.com'
    });
    console.log('✅ Contactos agregados\n');

    // Información médica
    console.log('❤️ Agregando información médica...');
    await apiClient.upsertMedicalInfo({
      bloodType: 'O+',
      allergies: ['Penicilina', 'Maní', 'Polen'],
      medications: ['Aspirina', 'Omeprazol'],
      conditions: ['Diabetes Tipo 2', 'Hipertensión'],
      notes: 'Revisar niveles de glucosa regularmente'
    });
    console.log('✅ Información médica agregada\n');

    // Seguro de salud
    console.log('🛡️ Agregando seguros...');
    await apiClient.createHealthInsurance({
      provider: 'Isapre Cruz Blanca',
      policyNumber: 'POL-123456789',
      groupNumber: 'GRP-001',
      coverageType: 'Cobertura Completa',
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      isPrimary: true
    });
    console.log('✅ Seguros agregados\n');

    // Cuenta bancaria
    console.log('💳 Agregando cuentas bancarias...');
    await apiClient.createBankAccount({
      bankName: 'Banco de Chile',
      accountNumber: '1234567890',
      accountType: 'checking',
      accountHolderName: 'Juan Pérez',
      routingNumber: '001',
      swiftCode: 'BCHXCLRM',
      isPrimary: true
    });

    await apiClient.createBankAccount({
      bankName: 'Banco Santander',
      accountNumber: '9876543210',
      accountType: 'savings',
      accountHolderName: 'Juan Pérez',
      routingNumber: '002',
      swiftCode: 'SANXCLRM'
    });
    console.log('✅ Cuentas bancarias agregadas\n');

    console.log('🎉 ¡Todos los datos agregados exitosamente!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar
agregarMisDatos();
```

---

## 🎯 Recomendación

**La forma MÁS FÁCIL es usar la interfaz visual:**

1. Inicia sesión
2. Ve a `/profile`
3. Usa los formularios en cada pestaña

**Ventajas:**
- ✅ No necesitas escribir código
- ✅ Validación automática de formularios
- ✅ Feedback visual inmediato
- ✅ Manejo de errores incluido
- ✅ Interfaz intuitiva

---

## 📊 Verificar tus datos

Para verificar que tus datos se guardaron correctamente:

```typescript
// Ver todas tus direcciones
const direcciones = await apiClient.getAddresses();
console.log('Mis direcciones:', direcciones);

// Ver contactos de emergencia
const contactos = await apiClient.getEmergencyContacts();
console.log('Mis contactos:', contactos);

// Ver información médica
const medicalInfo = await apiClient.getMedicalInfo();
console.log('Mi info médica:', medicalInfo);

// Ver seguros
const seguros = await apiClient.getHealthInsurances();
console.log('Mis seguros:', seguros);

// Ver cuentas bancarias
const cuentas = await apiClient.getBankAccounts();
console.log('Mis cuentas:', cuentas);
```

---

## ❓ ¿Preguntas?

- **¿Puedo editar mis datos?** Sí, cada componente tiene botones de edición
- **¿Puedo eliminar datos?** Sí, hay botones de eliminar con confirmación
- **¿Qué pasa si marco algo como "principal"?** Los demás items se desmarcarán automáticamente
- **¿Los datos se guardan en tiempo real?** Sí, cada acción se guarda inmediatamente en el backend

---

**¡Comienza agregando tus datos ahora visitando `/profile`!** 🚀
