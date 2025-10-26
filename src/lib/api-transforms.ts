import type { 
  User, 
  UserApiResponse, 
  Address, 
  AddressApiResponse, 
  EmergencyContactData, 
  EmergencyContactApiResponse 
} from '@/types';

/**
 * Converts snake_case keys to camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts camelCase keys to snake_case
 */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Recursively converts object keys from snake_case to camelCase
 */
function keysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = toCamelCase(key);
      result[camelKey] = keysToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

/**
 * Recursively converts object keys from camelCase to snake_case
 */
function keysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = toSnakeCase(key);
      result[snakeKey] = keysToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

/**
 * Transforms API User response (snake_case) to frontend User interface (camelCase)
 */
export function transformUserFromApi(apiUser: UserApiResponse): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    fullName: apiUser.full_name,
    phone: apiUser.phone,
    rut: apiUser.rut,
    phoneNumber: apiUser.phone_number,
    role: apiUser.role,
    isActive: apiUser.is_active,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
}

/**
 * Transforms frontend User data (camelCase) to API format (snake_case)
 */
export function transformUserToApi(user: Partial<User>): any {
  const apiUser: any = {};
  
  if (user.id !== undefined) apiUser.id = user.id;
  if (user.email !== undefined) apiUser.email = user.email;
  if (user.fullName !== undefined) apiUser.full_name = user.fullName;
  if (user.phone !== undefined) apiUser.phone = user.phone;
  if (user.rut !== undefined) apiUser.rut = user.rut;
  if (user.phoneNumber !== undefined) apiUser.phone_number = user.phoneNumber;
  if (user.role !== undefined) apiUser.role = user.role;
  if (user.isActive !== undefined) apiUser.is_active = user.isActive;
  if (user.createdAt !== undefined) apiUser.created_at = user.createdAt;
  if (user.updatedAt !== undefined) apiUser.updated_at = user.updatedAt;
  
  return apiUser;
}

/**
 * Generic function to transform any object keys from snake_case to camelCase
 */
export function transformFromApi<T>(apiData: any): T {
  return keysToCamelCase(apiData);
}

/**
 * Transforms API Address response (snake_case) to frontend Address interface (camelCase)
 */
export function transformAddressFromApi(apiAddress: AddressApiResponse): Address {
  return {
    id: apiAddress.id,
    userId: apiAddress.user_id,
    street: apiAddress.street_address,
    city: apiAddress.city,
    state: apiAddress.region,
    country: apiAddress.country,
    postalCode: apiAddress.postal_code,
    isPrimary: apiAddress.is_primary,
    label: apiAddress.address_type,
    additionalInfo: apiAddress.additional_info,
    createdAt: apiAddress.created_at,
    updatedAt: apiAddress.updated_at,
  };
}

/**
 * Transforms frontend Address data (camelCase) to API format (snake_case)
 */
export function transformAddressToApi(address: any): any {
  const apiAddress: any = {};
  
  if (address.id !== undefined) apiAddress.id = address.id;
  if (address.userId !== undefined) apiAddress.user_id = address.userId;
  if (address.street !== undefined) apiAddress.street_address = address.street;
  if (address.city !== undefined) apiAddress.city = address.city;
  if (address.state !== undefined) apiAddress.region = address.state;
  if (address.country !== undefined) apiAddress.country = address.country;
  if (address.postalCode !== undefined) apiAddress.postal_code = address.postalCode;
  if (address.isPrimary !== undefined) apiAddress.is_primary = address.isPrimary;
  if (address.label !== undefined) apiAddress.address_type = address.label;
  if (address.additionalInfo !== undefined) apiAddress.additional_info = address.additionalInfo;
  if (address.createdAt !== undefined) apiAddress.created_at = address.createdAt;
  if (address.updatedAt !== undefined) apiAddress.updated_at = address.updatedAt;
  
  return apiAddress;
}

/**
 * Transforms API EmergencyContact response (snake_case) to frontend EmergencyContactData interface (camelCase)
 */
export function transformEmergencyContactFromApi(apiContact: EmergencyContactApiResponse): EmergencyContactData {
  return {
    id: apiContact.id,
    userId: apiContact.user_id,
    name: apiContact.contact_name,
    phone: apiContact.phone_number,
    relationship: apiContact.relationship,
    email: apiContact.email,
    createdAt: apiContact.created_at,
    updatedAt: apiContact.updated_at,
  };
}

/**
 * Transforms frontend EmergencyContactData (camelCase) to API format (snake_case)
 */
export function transformEmergencyContactToApi(contact: any): any {
  const apiContact: any = {};
  
  if (contact.id !== undefined) apiContact.id = contact.id;
  if (contact.userId !== undefined) apiContact.user_id = contact.userId;
  if (contact.name !== undefined) apiContact.contact_name = contact.name;
  if (contact.phone !== undefined) apiContact.phone_number = contact.phone;
  if (contact.relationship !== undefined) apiContact.relationship = contact.relationship;
  if (contact.email !== undefined) apiContact.email = contact.email;
  if (contact.createdAt !== undefined) apiContact.created_at = contact.createdAt;
  if (contact.updatedAt !== undefined) apiContact.updated_at = contact.updatedAt;
  
  return apiContact;
}

/**
 * Generic function to transform any object keys from camelCase to snake_case
 */
export function transformToApi(frontendData: any): any {
  return keysToSnakeCase(frontendData);
}