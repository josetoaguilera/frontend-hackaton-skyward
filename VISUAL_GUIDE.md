# 🎨 Visual Guide - Profile Page Features

## 📱 Profile Page Layout

Visit: **`http://localhost:3000/profile`**

```
┌─────────────────────────────────────────────────────────────────┐
│  Mi Perfil                                                      │
│  Gestiona tu información personal y configuración              │
└─────────────────────────────────────────────────────────────────┘

┌───┬───────────┬──────────┬────────┬────────┬─────────┐
│ 👤 │ 📍        │ 📞       │ ❤️     │ 💳     │ ⚙️      │
│ Perfil│Direcciones│Contactos│Médico │Pagos   │Config   │
└───┴───────────┴──────────┴────────┴────────┴─────────┘
```

---

## 1️⃣ Perfil Tab (👤)

**Basic user information and account settings**

```
┌─────────────────────────────────────────┐
│ Información Personal                    │
├─────────────────────────────────────────┤
│                                         │
│ Endpoints disponibles:                  │
│ • GET /api/v1/users/me                 │
│ • PUT /api/v1/users/me                 │
│ • DELETE /api/v1/users/me              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 2️⃣ Direcciones Tab (📍)

**Manage multiple addresses with primary designation**

```
┌─────────────────────────────────────────────────┐
│ Mis Direcciones                [+ Nueva Dirección]│
├─────────────────────────────────────────────────┤
│                                                  │
│ ┌──────────────────┐  ┌──────────────────┐    │
│ │ 🏠 Casa          │  │ 🏢 Trabajo       │    │
│ │ ⭐ Principal     │  │                  │    │
│ │                  │  │                  │    │
│ │ 123 Main St      │  │ 456 Office Blvd  │    │
│ │ Santiago, RM     │  │ Valparaíso, V    │    │
│ │ Chile - 12345    │  │ Chile - 67890    │    │
│ │                  │  │                  │    │
│ │      [⭐] [🗑️]   │  │      [⭐] [🗑️]   │    │
│ └──────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────┘

Features:
✅ Create, edit, delete addresses
✅ Set primary address
✅ Multiple addresses support
✅ Labels (Home, Work, etc.)
```

---

## 3️⃣ Contactos Tab (📞)

**Emergency contacts for critical situations**

```
┌──────────────────────────────────────────────────┐
│ Contactos de Emergencia    [+ Nuevo Contacto]    │
├──────────────────────────────────────────────────┤
│                                                   │
│ ┌──────────────┐ ┌──────────────┐ ┌────────────┐│
│ │ Jane Doe     │ │ John Smith   │ │ Maria G.   ││
│ │ Spouse       │ │ Brother      │ │ Friend     ││
│ │ ⭐ Principal │ │              │ │            ││
│ │              │ │              │ │            ││
│ │ 📞 +569...   │ │ 📞 +569...   │ │ 📞 +569... ││
│ │ ✉️ jane@...  │ │ ✉️ john@...  │ │            ││
│ │              │ │              │ │            ││
│ │        [🗑️]  │ │        [🗑️]  │ │      [🗑️]  ││
│ └──────────────┘ └──────────────┘ └────────────┘│
└──────────────────────────────────────────────────┘

Features:
✅ Multiple emergency contacts
✅ Phone, email, address
✅ Relationship designation
✅ Primary contact marking
✅ Quick call/email links
```

---

## 4️⃣ Médico Tab (❤️)

**Medical information and health insurance**

```
┌─────────────────────────────────────────────────┐
│ ❤️ Información Médica              [Editar]     │
├─────────────────────────────────────────────────┤
│                                                  │
│ Tipo de Sangre: [O+]                            │
│                                                  │
│ Alergias:                                       │
│ [Penicillin] [Peanuts] [Dust]                  │
│                                                  │
│ Medicamentos:                                   │
│ [Aspirin] [Insulin]                             │
│                                                  │
│ Condiciones:                                    │
│ [Diabetes] [Hypertension]                       │
│                                                  │
│ Notas: Additional medical information...        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 🛡️ Seguros de Salud            [+ Nuevo Seguro] │
├─────────────────────────────────────────────────┤
│                                                  │
│ ┌──────────────────┐  ┌──────────────────┐    │
│ │ Isapre           │  │ Fonasa           │    │
│ │ Cruz Blanca      │  │ Público          │    │
│ │ [Principal]      │  │                  │    │
│ │                  │  │                  │    │
│ │ Póliza: ABC123   │  │ Póliza: XYZ789   │    │
│ │ Grupo: GRP001    │  │                  │    │
│ │ 📅 2024-01-01 →  │  │ 📅 2024-01-01 →  │    │
│ │                  │  │                  │    │
│ │           [🗑️]   │  │           [🗑️]   │    │
│ └──────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────┘

Features:
✅ Blood type tracking
✅ Allergies management (badges)
✅ Medications list
✅ Medical conditions
✅ Additional notes
✅ Multiple insurance policies
✅ Coverage dates
✅ Primary insurance designation
```

---

## 5️⃣ Pagos Tab (💳)

**Bank accounts for emergency payments**

```
┌─────────────────────────────────────────────────┐
│ Cuentas Bancarias              [+ Nueva Cuenta]  │
├─────────────────────────────────────────────────┤
│                                                  │
│ ┌──────────────────┐  ┌──────────────────┐    │
│ │ 💳 Banco de Chile│  │ 💳 Santander     │    │
│ │ John Doe         │  │ John Doe         │    │
│ │ ⭐ Principal     │  │                  │    │
│ │                  │  │                  │    │
│ │ Número: ****7890 │  │ Número: ****4321 │    │
│ │ Tipo: Corriente  │  │ Tipo: Ahorro     │    │
│ │ Ruta: 12345      │  │ Ruta: 67890      │    │
│ │ SWIFT: BCHIXXX   │  │ SWIFT: SANXXX    │    │
│ │                  │  │                  │    │
│ │           [🗑️]   │  │           [🗑️]   │    │
│ └──────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────┘

Features:
✅ Multiple bank accounts
✅ Account number masking (****1234)
✅ Account types (Checking, Savings, Other)
✅ Routing and SWIFT codes
✅ Primary account designation
✅ Secure display
```

---

## 6️⃣ Config Tab (⚙️)

**Account settings and preferences**

```
┌─────────────────────────────────────────────────┐
│ Configuración de la Cuenta                      │
├─────────────────────────────────────────────────┤
│                                                  │
│ • Notificaciones por email                      │
│ • Configuración de privacidad                   │
│ • Preferencias de idioma                        │
│ • Seguridad y autenticación                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Design Features

### Color Scheme
```
Primary:   Red (#DC2626) - Emergency theme
Secondary: Gray (#6B7280) - Neutral elements
Success:   Green (#10B981) - Confirmations
Info:      Blue (#3B82F6) - Insurance/Banking
Warning:   Yellow (#F59E0B) - Alerts
```

### Icons Used
```
User:      👤 (Profile)
Location:  📍 (Addresses)
Phone:     📞 (Contacts)
Heart:     ❤️ (Medical)
Card:      💳 (Banking)
Settings:  ⚙️ (Config)
Plus:      ➕ (Add new)
Star:      ⭐ (Primary)
Trash:     🗑️ (Delete)
Edit:      ✏️ (Edit)
Shield:    🛡️ (Insurance)
Calendar:  📅 (Dates)
```

### Responsive Breakpoints
```
Mobile:    < 640px  - Single column, stacked tabs
Tablet:    640-1024px - 2 columns for cards
Desktop:   > 1024px - Full layout, 3 columns for cards
```

---

## 🚀 User Flow Examples

### Adding a Bank Account
```
1. Click "Pagos" tab
2. Click "+ Nueva Cuenta"
3. Fill form:
   - Banco: Banco de Chile
   - Titular: John Doe
   - Número: 1234567890
   - Tipo: Cuenta Corriente
4. Click "Guardar"
5. ✅ Account appears in list
```

### Managing Medical Info
```
1. Click "Médico" tab
2. Click "Editar" in Medical Information
3. Add information:
   - Blood Type: O+
   - Allergies: Type and click +
   - Medications: Type and click +
4. Click "Guardar Información"
5. ✅ Information saved and displayed
```

### Adding Emergency Contact
```
1. Click "Contactos" tab
2. Click "+ Nuevo Contacto"
3. Fill form:
   - Nombre: Jane Doe
   - Teléfono: +56912345678
   - Relación: Spouse
   - Email: jane@example.com
   - ☑️ Contact principal
4. Click "Guardar"
5. ✅ Contact appears with ⭐ badge
```

---

## 📊 Data Display Examples

### Address Card
```
┌────────────────────────┐
│ 🏠 Casa    ⭐ Principal │
│                        │
│ 123 Main Street        │
│ Apt 4B                 │
│ Santiago, RM           │
│ Chile - 12345          │
│                        │
│           [⭐] [🗑️]    │
└────────────────────────┘
```

### Bank Account Card
```
┌────────────────────────┐
│ 💳 Banco de Chile      │
│ John Doe               │
│ ⭐ Principal           │
│                        │
│ Número:    ****7890    │
│ Tipo:      Corriente   │
│ Ruta:      12345       │
│ SWIFT:     BCHIXXX     │
│                        │
│              [🗑️]      │
└────────────────────────┘
```

### Insurance Card
```
┌────────────────────────┐
│ Isapre Cruz Blanca     │
│ Cobertura Completa     │
│ [Principal]            │
│                        │
│ Póliza:    ABC123      │
│ Grupo:     GRP001      │
│ 📅 2024-01-01 →        │
│                        │
│              [🗑️]      │
└────────────────────────┘
```

---

## ✨ Interactive Features

- **Hover effects** on all clickable elements
- **Loading spinners** during API calls
- **Success animations** after saves
- **Error toasts** for failed operations
- **Confirmation dialogs** before deletions
- **Form validation** with real-time feedback
- **Keyboard navigation** support
- **Screen reader** compatibility

---

**Navigate to `/profile` to experience all these features!** 🎉
