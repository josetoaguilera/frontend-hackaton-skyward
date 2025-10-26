# Quick Reference - API Client Methods

## 🔐 Authentication

```typescript
// Check if email is available
await apiClient.checkEmail('user@example.com')

// Sign in with Firebase token
await apiClient.signInWithToken(idToken)

// Login
await apiClient.login({ email, password })

// Register
await apiClient.register(userData)

// Get profile
await apiClient.getProfile()

// Send verification email
await apiClient.verifyEmail()
```

## 👤 Users

```typescript
// Get all users (Admin only)
await apiClient.getAllUsers()

// Update profile
await apiClient.updateProfile({ firstName, lastName })

// Delete account
await apiClient.deleteAccount()

// Get user by ID
await apiClient.getUserById(id)

// Get user by RUT
await apiClient.getUserByRut('12345678-9')

// Get user by phone
await apiClient.getUserByPhone('+56912345678')
```

## 🏠 Addresses

```typescript
// Get all addresses
await apiClient.getAddresses()

// Create address
await apiClient.createAddress({
  street: '123 Main St',
  city: 'Santiago',
  state: 'RM',
  country: 'Chile',
  postalCode: '12345',
  label: 'Home'
})

// Get address by ID
await apiClient.getAddress(id)

// Update address
await apiClient.updateAddress(id, updates)

// Delete address
await apiClient.deleteAddress(id)

// Set primary address
await apiClient.setPrimaryAddress(id)
```

## 📞 Emergency Contacts

```typescript
// Get all contacts
await apiClient.getEmergencyContacts()

// Create contact
await apiClient.createEmergencyContact({
  name: 'Jane Doe',
  phone: '+56912345678',
  relationship: 'Spouse',
  email: 'jane@example.com',
  isPrimary: true
})

// Get contact by ID
await apiClient.getEmergencyContact(id)

// Update contact
await apiClient.updateEmergencyContact(id, updates)

// Delete contact
await apiClient.deleteEmergencyContact(id)
```

## 🚨 Emergency Events

```typescript
// Get user's events
await apiClient.getEmergencyRequests()

// Create event
await apiClient.createEmergencyRequest({
  type: 'medical',
  priority: 'high',
  description: 'Emergency description',
  location: { latitude, longitude, address },
  contactInfo: { phone, alternativePhone }
})

// Get all events (Admin only)
await apiClient.getAllEmergencyEvents()

// Get event by ID
await apiClient.getEmergencyRequest(id)

// Update event
await apiClient.updateEmergencyRequest(id, updates)

// Delete event
await apiClient.deleteEmergencyRequest(id)
```

## 🪝 Custom Hooks

```typescript
// Addresses hook
const {
  addresses,          // Address[]
  isLoading,         // boolean
  error,             // string | null
  fetchAddresses,    // () => Promise<void>
  createAddress,     // (data) => Promise<Address>
  updateAddress,     // (id, data) => Promise<Address>
  deleteAddress,     // (id) => Promise<void>
  setPrimaryAddress  // (id) => Promise<Address>
} = useAddresses()

// Emergency Contacts hook
const {
  contacts,       // EmergencyContactData[]
  isLoading,     // boolean
  error,         // string | null
  fetchContacts, // () => Promise<void>
  createContact, // (data) => Promise<EmergencyContactData>
  updateContact, // (id, data) => Promise<EmergencyContactData>
  deleteContact  // (id) => Promise<void>
} = useEmergencyContacts()
```

## 📦 Example Usage in Components

```typescript
import { useAddresses } from '@/hooks/useAddresses'
import { apiClient } from '@/lib/firebase-client'

function MyComponent() {
  // Option 1: Use custom hook
  const { addresses, createAddress } = useAddresses()
  
  // Option 2: Use API client directly
  useEffect(() => {
    const loadData = async () => {
      const addresses = await apiClient.getAddresses()
      const contacts = await apiClient.getEmergencyContacts()
    }
    loadData()
  }, [])
  
  return <div>...</div>
}
```

## 🔑 Get Firebase Token (for Swagger testing)

```typescript
// In your component
const copyToken = async () => {
  const token = await apiClient.getIdToken()
  navigator.clipboard.writeText(token)
}

// Or use the button in the dashboard
// Click "🔑 Token" → Copy → Use in Swagger with "Bearer <token>"
```

## ⚠️ Error Handling

```typescript
try {
  await apiClient.createAddress(data)
} catch (error) {
  console.error(error.message)
  alert(error.message) // Show to user
}
```

## 🎯 Best Practices

1. **Always use try-catch** for API calls
2. **Use custom hooks** for automatic data management
3. **Handle loading states** for better UX
4. **Show error messages** to users
5. **Use TypeScript types** for type safety
6. **Test with Swagger** before integrating

## 📍 Pages & Routes

- `/profile` - Profile management with tabs
- `/dashboard` - Main dashboard
- `/emergency-request/new` - Create emergency request
- `/login` - Login page
- `/register` - Registration page

## 🎨 Components

- `<AddressesExample />` - Full address management UI
- `<EmergencyContactsExample />` - Full contacts management UI
- `<ProtectedRoute>` - Wrap pages requiring authentication

---

**Quick tip:** Check `INTEGRATION_SUMMARY.md` and `API_INTEGRATION_GUIDE.md` for detailed documentation!
