import { apiClient } from '@/lib/firebase-client';

/**
 * API Client Tests - Examples of how to use each endpoint
 * 
 * NOTE: These are example tests. In a real scenario, you would use
 * a proper testing framework like Jest or Vitest.
 * 
 * To run these manually, call them from a React component after authentication.
 */

// ==================== AUTHENTICATION TESTS ====================

export async function testCheckEmail() {
  console.log('Testing check email...');
  const result = await apiClient.checkEmail('test@example.com');
  console.log('Email available:', result.available);
  return result;
}

export async function testVerifyEmail() {
  console.log('Testing verify email...');
  const result = await apiClient.verifyEmail();
  console.log('Verification result:', result);
  return result;
}

// ==================== USER TESTS ====================

export async function testGetProfile() {
  console.log('Testing get profile...');
  const profile = await apiClient.getProfile();
  console.log('Profile:', profile);
  return profile;
}

export async function testUpdateProfile() {
  console.log('Testing update profile...');
  const updated = await apiClient.updateProfile({
    firstName: 'Updated',
    lastName: 'Name'
  });
  console.log('Updated profile:', updated);
  return updated;
}

export async function testGetUserByRut() {
  console.log('Testing get user by RUT...');
  try {
    const user = await apiClient.getUserByRut('12345678-9');
    console.log('User found:', user);
    return user;
  } catch (error) {
    console.log('User not found or error:', error);
    return null;
  }
}

export async function testGetUserByPhone() {
  console.log('Testing get user by phone...');
  try {
    const user = await apiClient.getUserByPhone('+56912345678');
    console.log('User found:', user);
    return user;
  } catch (error) {
    console.log('User not found or error:', error);
    return null;
  }
}

// ==================== ADDRESS TESTS ====================

export async function testAddressesCRUD() {
  console.log('Testing addresses CRUD...');
  
  // Create
  const newAddress = await apiClient.createAddress({
    street: '123 Test Street',
    city: 'Santiago',
    state: 'RM',
    country: 'Chile',
    postalCode: '12345',
    label: 'Test Address'
  });
  console.log('Created address:', newAddress);
  
  // Read all
  const addresses = await apiClient.getAddresses();
  console.log('All addresses:', addresses);
  
  // Read one
  const address = await apiClient.getAddress(newAddress.id);
  console.log('Single address:', address);
  
  // Update
  const updated = await apiClient.updateAddress(newAddress.id, {
    street: '456 Updated Street'
  });
  console.log('Updated address:', updated);
  
  // Set primary
  const primary = await apiClient.setPrimaryAddress(newAddress.id);
  console.log('Primary address:', primary);
  
  // Delete
  await apiClient.deleteAddress(newAddress.id);
  console.log('Address deleted');
  
  return { created: newAddress, updated, primary };
}

// ==================== EMERGENCY CONTACT TESTS ====================

export async function testEmergencyContactsCRUD() {
  console.log('Testing emergency contacts CRUD...');
  
  // Create
  const newContact = await apiClient.createEmergencyContact({
    name: 'Test Contact',
    phone: '+56912345678',
    relationship: 'Friend',
    email: 'test@example.com',
    address: '123 Test St',
    isPrimary: true
  });
  console.log('Created contact:', newContact);
  
  // Read all
  const contacts = await apiClient.getEmergencyContacts();
  console.log('All contacts:', contacts);
  
  // Read one
  const contact = await apiClient.getEmergencyContact(newContact.id);
  console.log('Single contact:', contact);
  
  // Update
  const updated = await apiClient.updateEmergencyContact(newContact.id, {
    phone: '+56987654321'
  });
  console.log('Updated contact:', updated);
  
  // Delete
  await apiClient.deleteEmergencyContact(newContact.id);
  console.log('Contact deleted');
  
  return { created: newContact, updated };
}

// ==================== EMERGENCY EVENT TESTS ====================

export async function testEmergencyEventsCRUD() {
  console.log('Testing emergency events CRUD...');
  
  // Create
  const newEvent = await apiClient.createEmergencyRequest({
    type: 'medical',
    priority: 'high',
    status: 'pending',
    description: 'Test emergency event',
    location: {
      latitude: -33.4489,
      longitude: -70.6693,
      address: 'Santiago, Chile'
    },
    contactInfo: {
      phone: '+56912345678',
      alternativePhone: '+56987654321'
    },
    medicalInfo: {
      allergies: ['Test Allergy'],
      medications: ['Test Medication'],
      conditions: ['Test Condition']
    }
  });
  console.log('Created event:', newEvent);
  
  // Read all (user's events)
  const events = await apiClient.getEmergencyRequests();
  console.log('User events:', events);
  
  // Read one
  const event = await apiClient.getEmergencyRequest(newEvent.id);
  console.log('Single event:', event);
  
  // Update
  const updated = await apiClient.updateEmergencyRequest(newEvent.id, {
    status: 'in_progress'
  });
  console.log('Updated event:', updated);
  
  // Delete
  await apiClient.deleteEmergencyRequest(newEvent.id);
  console.log('Event deleted');
  
  return { created: newEvent, updated };
}

// ==================== RUN ALL TESTS ====================

export async function runAllTests() {
  console.log('🧪 Starting API tests...\n');
  
  try {
    // Authentication
    console.log('\n📝 Authentication Tests:');
    await testCheckEmail();
    await testGetProfile();
    
    // Users
    console.log('\n👤 User Tests:');
    await testUpdateProfile();
    await testGetUserByRut();
    await testGetUserByPhone();
    
    // Addresses
    console.log('\n🏠 Address Tests:');
    await testAddressesCRUD();
    
    // Emergency Contacts
    console.log('\n📞 Emergency Contact Tests:');
    await testEmergencyContactsCRUD();
    
    // Emergency Events
    console.log('\n🚨 Emergency Event Tests:');
    await testEmergencyEventsCRUD();
    
    console.log('\n✅ All tests completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('\n❌ Tests failed:', error);
    return { success: false, error };
  }
}

// ==================== INDIVIDUAL FEATURE TESTS ====================

/**
 * Test the custom hooks
 * Call this from a React component
 */
export function useTestHooks() {
  // This would be called in a component
  console.log('Custom hooks should be tested in a React component');
  console.log('See AddressesExample.tsx and EmergencyContactsExample.tsx for examples');
}

/**
 * Quick integration test
 * Call this after logging in to verify everything works
 */
export async function quickIntegrationTest() {
  console.log('🚀 Running quick integration test...\n');
  
  try {
    // 1. Check profile
    const profile = await apiClient.getProfile();
    console.log('✅ Profile loaded:', profile.email);
    
    // 2. Get addresses
    const addresses = await apiClient.getAddresses();
    console.log('✅ Addresses loaded:', addresses.length);
    
    // 3. Get contacts
    const contacts = await apiClient.getEmergencyContacts();
    console.log('✅ Contacts loaded:', contacts.length);
    
    // 4. Get events
    const events = await apiClient.getEmergencyRequests();
    console.log('✅ Events loaded:', events.length);
    
    console.log('\n✅ Integration test passed!');
    return true;
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return false;
  }
}

export default {
  testCheckEmail,
  testVerifyEmail,
  testGetProfile,
  testUpdateProfile,
  testGetUserByRut,
  testGetUserByPhone,
  testAddressesCRUD,
  testEmergencyContactsCRUD,
  testEmergencyEventsCRUD,
  runAllTests,
  quickIntegrationTest
};
