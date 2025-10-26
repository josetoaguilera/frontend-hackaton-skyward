# API Endpoints - Frontend Integration

This document describes all the backend API endpoints that have been integrated into the frontend application.

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Addresses](#addresses)
4. [Emergency Contacts](#emergency-contacts)
5. [Emergency Events](#emergency-events)
6. [Usage Examples](#usage-examples)

---

## Authentication

### POST `/api/v1/auth/register`
Register a new user with email and password.

**Usage:**
```typescript
await apiClient.register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  address: '123 Main St',
  bloodType: 'O+',
  allergies: 'None',
  medicalConditions: 'None',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+1234567891',
    relationship: 'Spouse'
  }
});
```

### GET `/api/v1/auth/check-email/{email}`
Check if an email is available for registration.

**Usage:**
```typescript
const result = await apiClient.checkEmail('user@example.com');
console.log(result.available); // true or false
```

### POST `/api/v1/auth/signin`
Sign in with Firebase ID token.

**Usage:**
```typescript
const idToken = await firebaseUser.getIdToken();
const user = await apiClient.signInWithToken(idToken);
```

### POST `/api/v1/auth/login`
Login with email and password.

**Usage:**
```typescript
await apiClient.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### GET `/api/v1/auth/profile`
Get authenticated user profile.

**Usage:**
```typescript
const profile = await apiClient.getProfile();
```

### POST `/api/v1/auth/verify-email`
Generate email verification link.

**Usage:**
```typescript
const result = await apiClient.verifyEmail();
console.log(result.message);
```

---

## Users

### GET `/api/v1/users`
Get all users (Admin only).

**Usage:**
```typescript
const users = await apiClient.getAllUsers();
```

### GET `/api/v1/users/me`
Get current user profile.

**Usage:**
```typescript
const profile = await apiClient.getProfile();
```

### PUT `/api/v1/users/me`
Update current user profile.

**Usage:**
```typescript
const updatedProfile = await apiClient.updateProfile({
  firstName: 'John',
  lastName: 'Smith',
  phone: '+1234567890'
});
```

### DELETE `/api/v1/users/me`
Delete current user account.

**Usage:**
```typescript
await apiClient.deleteAccount();
```

### GET `/api/v1/users/{id}`
Get user by ID.

**Usage:**
```typescript
const user = await apiClient.getUserById('user-id-123');
```

### GET `/api/v1/users/rut/{rut}`
Get user by RUT (Chilean national ID).

**Usage:**
```typescript
const user = await apiClient.getUserByRut('12345678-9');
```

### GET `/api/v1/users/phone/{phoneNumber}`
Get user by phone number.

**Usage:**
```typescript
const user = await apiClient.getUserByPhone('+56912345678');
```

---

## Addresses

### GET `/api/v1/addresses`
Get all addresses for the authenticated user.

**Usage:**
```typescript
const addresses = await apiClient.getAddresses();
```

### POST `/api/v1/addresses`
Create a new address.

**Usage:**
```typescript
const newAddress = await apiClient.createAddress({
  street: '123 Main St',
  city: 'Santiago',
  state: 'RM',
  country: 'Chile',
  postalCode: '12345',
  label: 'Home',
  additionalInfo: 'Apt 4B'
});
```

### GET `/api/v1/addresses/{id}`
Get a specific address by ID.

**Usage:**
```typescript
const address = await apiClient.getAddress('address-id-123');
```

### PUT `/api/v1/addresses/{id}`
Update an address.

**Usage:**
```typescript
const updatedAddress = await apiClient.updateAddress('address-id-123', {
  street: '456 New St',
  city: 'Valparaiso'
});
```

### DELETE `/api/v1/addresses/{id}`
Delete an address.

**Usage:**
```typescript
await apiClient.deleteAddress('address-id-123');
```

### PATCH `/api/v1/addresses/{id}/set-primary`
Set an address as the primary address.

**Usage:**
```typescript
const primaryAddress = await apiClient.setPrimaryAddress('address-id-123');
```

---

## Emergency Contacts

### GET `/api/emergency-contacts`
Get all emergency contacts for the authenticated user.

**Usage:**
```typescript
const contacts = await apiClient.getEmergencyContacts();
```

### POST `/api/emergency-contacts`
Create a new emergency contact.

**Usage:**
```typescript
const newContact = await apiClient.createEmergencyContact({
  name: 'Jane Doe',
  phone: '+56912345678',
  relationship: 'Spouse',
  email: 'jane@example.com',
  address: '123 Main St',
  isPrimary: true
});
```

### GET `/api/emergency-contacts/{id}`
Get a specific emergency contact by ID.

**Usage:**
```typescript
const contact = await apiClient.getEmergencyContact('contact-id-123');
```

### PUT `/api/emergency-contacts/{id}`
Update an emergency contact.

**Usage:**
```typescript
const updatedContact = await apiClient.updateEmergencyContact('contact-id-123', {
  phone: '+56987654321',
  email: 'newemail@example.com'
});
```

### DELETE `/api/emergency-contacts/{id}`
Delete an emergency contact.

**Usage:**
```typescript
await apiClient.deleteEmergencyContact('contact-id-123');
```

---

## Emergency Events

### GET `/api/v1/emergency-events`
Get current user's emergency events.

**Usage:**
```typescript
const events = await apiClient.getEmergencyRequests();
```

### POST `/api/v1/emergency-events`
Create a new emergency event.

**Usage:**
```typescript
const newEvent = await apiClient.createEmergencyRequest({
  type: 'medical',
  priority: 'high',
  description: 'Medical emergency at home',
  location: {
    latitude: -33.4489,
    longitude: -70.6693,
    address: '123 Main St, Santiago'
  },
  contactInfo: {
    phone: '+56912345678',
    alternativePhone: '+56987654321'
  },
  medicalInfo: {
    allergies: ['Penicillin'],
    medications: ['Aspirin'],
    conditions: ['Diabetes'],
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+56912345678',
      relationship: 'Spouse'
    }
  }
});
```

### GET `/api/v1/emergency-events/all`
Get all emergency events (Admin only).

**Usage:**
```typescript
const allEvents = await apiClient.getAllEmergencyEvents();
```

### GET `/api/v1/emergency-events/{id}`
Get emergency event by ID.

**Usage:**
```typescript
const event = await apiClient.getEmergencyRequest('event-id-123');
```

### PUT `/api/v1/emergency-events/{id}`
Update emergency event.

**Usage:**
```typescript
const updatedEvent = await apiClient.updateEmergencyRequest('event-id-123', {
  status: 'in_progress',
  assignedAgentId: 'agent-id-456'
});
```

### DELETE `/api/v1/emergency-events/{id}`
Delete emergency event.

**Usage:**
```typescript
await apiClient.deleteEmergencyRequest('event-id-123');
```

---

## Usage Examples

### Using Custom Hooks

We've created custom React hooks to make it easier to work with addresses and emergency contacts:

#### Addresses Hook

```typescript
import { useAddresses } from '@/hooks/useAddresses';

function MyComponent() {
  const {
    addresses,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress
  } = useAddresses();

  // Use the addresses data and methods
  return (
    <div>
      {addresses.map(address => (
        <div key={address.id}>
          {address.street}, {address.city}
        </div>
      ))}
    </div>
  );
}
```

#### Emergency Contacts Hook

```typescript
import { useEmergencyContacts } from '@/hooks/useEmergencyContacts';

function MyComponent() {
  const {
    contacts,
    isLoading,
    error,
    createContact,
    updateContact,
    deleteContact
  } = useEmergencyContacts();

  // Use the contacts data and methods
  return (
    <div>
      {contacts.map(contact => (
        <div key={contact.id}>
          {contact.name} - {contact.phone}
        </div>
      ))}
    </div>
  );
}
```

### Example Components

Check out these example components for full implementations:

- **AddressesExample** (`/src/components/AddressesExample.tsx`): Complete address management
- **EmergencyContactsExample** (`/src/components/EmergencyContactsExample.tsx`): Complete emergency contacts management
- **Profile Page** (`/src/app/profile/page.tsx`): Full profile page with tabs for all user data

### Direct API Client Usage

You can also use the API client directly:

```typescript
import { apiClient } from '@/lib/firebase-client';

// In an async function
const addresses = await apiClient.getAddresses();
const contacts = await apiClient.getEmergencyContacts();
const profile = await apiClient.getProfile();
```

---

## Type Definitions

All TypeScript types are available in `/src/types/index.ts`:

- `User` - User profile data
- `Address` - Address data
- `CreateAddressData` - Data for creating an address
- `UpdateAddressData` - Data for updating an address
- `EmergencyContactData` - Emergency contact data
- `CreateEmergencyContactData` - Data for creating an emergency contact
- `UpdateEmergencyContactData` - Data for updating an emergency contact
- `EmergencyEvent` - Emergency event data
- `CreateEmergencyEventData` - Data for creating an emergency event
- `UpdateEmergencyEventData` - Data for updating an emergency event

---

## Error Handling

All API methods throw errors that can be caught with try-catch:

```typescript
try {
  await apiClient.createAddress(addressData);
} catch (error) {
  console.error('Error creating address:', error);
  alert(error.message);
}
```

---

## Testing with Swagger

To test these endpoints with Swagger:

1. Click the "🔑 Token" button in the dashboard header
2. Copy the Firebase token to your clipboard
3. Open Swagger UI
4. Click "Authorize"
5. Enter: `Bearer <paste-your-token>`
6. Click "Authorize"

Now you can test all authenticated endpoints!
