/**
 * Role Management Utility
 * 
 * Manages user roles and permissions for the Echomedic Risk Portal.
 * Implements Role-Based Access Control (RBAC).
 * 
 * ISO 27001 Controls:
 * - A.9.2.1: User registration and de-registration
 * - A.9.2.2: User access provisioning
 * - A.9.2.3: Management of privileged access rights
 * 
 * Normen: Section 7 - Access control requirements
 */

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * User roles in the system
 */
export enum UserRole {
  ADMIN = 'admin',
  READ_ONLY = 'read-only'
}

/**
 * User document interface
 */
export interface UserDocument {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: any;
  lastLogin: any;
  displayName?: string;
  isActive: boolean;
}

/**
 * Role permissions interface
 */
export interface RolePermissions {
  canViewRisks: boolean;
  canCreateRisks: boolean;
  canUpdateRisks: boolean;
  canDeleteRisks: boolean;
  canViewControls: boolean;
  canModifyControls: boolean;
  canViewPolicies: boolean;
  canModifyPolicies: boolean;
  canViewLogs: boolean;
  canManageUsers: boolean;
}

/**
 * Get permissions for a role
 */
export function getRolePermissions(role: UserRole): RolePermissions {
  switch (role) {
    case UserRole.ADMIN:
      return {
        canViewRisks: true,
        canCreateRisks: true,
        canUpdateRisks: true,
        canDeleteRisks: true,
        canViewControls: true,
        canModifyControls: true,
        canViewPolicies: true,
        canModifyPolicies: true,
        canViewLogs: true,
        canManageUsers: true
      };
    
    case UserRole.READ_ONLY:
      return {
        canViewRisks: true,
        canCreateRisks: false,
        canUpdateRisks: false,
        canDeleteRisks: false,
        canViewControls: true,
        canModifyControls: false,
        canViewPolicies: true,
        canModifyPolicies: false,
        canViewLogs: false,
        canManageUsers: false
      };
    
    default:
      // Default to most restrictive permissions
      return {
        canViewRisks: false,
        canCreateRisks: false,
        canUpdateRisks: false,
        canDeleteRisks: false,
        canViewControls: false,
        canModifyControls: false,
        canViewPolicies: false,
        canModifyPolicies: false,
        canViewLogs: false,
        canManageUsers: false
      };
  }
}

/**
 * Get user's role from Firestore
 * 
 * @param uid - Firebase Auth UID
 * @returns User's role or null if not found
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserDocument;
      return userData.role || UserRole.READ_ONLY; // Default to read-only
    }
    
    // User document doesn't exist - default to read-only for safety
    console.warn(`User document not found for UID: ${uid}. Defaulting to read-only.`);
    return UserRole.READ_ONLY;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

/**
 * Get complete user document
 * 
 * @param uid - Firebase Auth UID
 * @returns User document or null if not found
 */
export async function getUserDocument(uid: string): Promise<UserDocument | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserDocument;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
}

/**
 * Check if user has admin role
 * 
 * @param uid - Firebase Auth UID
 * @returns True if user is admin, false otherwise
 */
export async function isAdmin(uid: string): Promise<boolean> {
  const role = await getUserRole(uid);
  return role === UserRole.ADMIN;
}

/**
 * Check if user has read-only role
 * 
 * @param uid - Firebase Auth UID
 * @returns True if user is read-only, false otherwise
 */
export async function isReadOnly(uid: string): Promise<boolean> {
  const role = await getUserRole(uid);
  return role === UserRole.READ_ONLY;
}

/**
 * Create or update user document in Firestore
 * This should be called when a user registers or first logs in
 * 
 * @param uid - Firebase Auth UID
 * @param email - User's email
 * @param role - Initial role (default: read-only)
 * @param displayName - Optional display name
 */
export async function createUserDocument(
  uid: string,
  email: string,
  role: UserRole = UserRole.READ_ONLY,
  displayName?: string
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Create new user document
      const newUserData: UserDocument = {
        uid,
        email,
        role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        displayName,
        isActive: true
      };
      
      await setDoc(userDocRef, newUserData);
      console.log(`Created user document for ${email} with role ${role}`);
    } else {
      // Update last login
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
      console.log(`Updated last login for ${email}`);
    }
  } catch (error) {
    console.error('Error creating/updating user document:', error);
    throw error;
  }
}

/**
 * Update user's role
 * Only admins should be able to call this
 * 
 * @param uid - Firebase Auth UID of user to update
 * @param newRole - New role to assign
 */
export async function updateUserRole(
  uid: string,
  newRole: UserRole
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      role: newRole,
      updatedAt: serverTimestamp()
    });
    
    console.log(`Updated user ${uid} role to ${newRole}`);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Deactivate user account
 * 
 * @param uid - Firebase Auth UID
 */
export async function deactivateUser(uid: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      isActive: false,
      deactivatedAt: serverTimestamp()
    });
    
    console.log(`Deactivated user ${uid}`);
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
}

/**
 * Reactivate user account
 * 
 * @param uid - Firebase Auth UID
 */
export async function reactivateUser(uid: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      isActive: true,
      reactivatedAt: serverTimestamp()
    });
    
    console.log(`Reactivated user ${uid}`);
  } catch (error) {
    console.error('Error reactivating user:', error);
    throw error;
  }
}

/**
 * Check if user is active
 * 
 * @param uid - Firebase Auth UID
 * @returns True if user is active, false otherwise
 */
export async function isUserActive(uid: string): Promise<boolean> {
  try {
    const userDoc = await getUserDocument(uid);
    return userDoc?.isActive ?? false;
  } catch (error) {
    console.error('Error checking user active status:', error);
    return false;
  }
}

/**
 * Get user permissions
 * 
 * @param uid - Firebase Auth UID
 * @returns RolePermissions object
 */
export async function getUserPermissions(uid: string): Promise<RolePermissions> {
  const role = await getUserRole(uid);
  
  if (!role) {
    // No role found - return most restrictive permissions
    return getRolePermissions(UserRole.READ_ONLY);
  }
  
  return getRolePermissions(role);
}

/**
 * Check if user has specific permission
 * 
 * @param uid - Firebase Auth UID
 * @param permission - Permission key to check
 * @returns True if user has permission, false otherwise
 */
export async function hasPermission(
  uid: string,
  permission: keyof RolePermissions
): Promise<boolean> {
  const permissions = await getUserPermissions(uid);
  return permissions[permission];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrator';
    case UserRole.READ_ONLY:
      return 'Read Only';
    default:
      return 'Unknown';
  }
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'Full access to all features including creating, editing, and deleting risks, controls, and policies. Can view audit logs and manage users.';
    case UserRole.READ_ONLY:
      return 'Can view risks, controls, and policies but cannot make any changes. Cannot access audit logs or user management.';
    default:
      return 'No permissions';
  }
}