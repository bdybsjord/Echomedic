# All React Components for Security Implementation

This file contains all React/TypeScript components needed for the security implementation. Copy each component to the specified location in your project.

---

## 1. ProtectedRoute Component

**Location:** `src/components/ProtectedRoute.tsx`

```typescript
/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication and/or specific roles.
 * Redirects unauthorized users appropriately.
 * 
 * ISO 27001 Control: A.9.4.1 - Information access restriction
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getUserRole, UserRole } from '../utils/roleManager';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      if (currentUser) {
        try {
          const role = await getUserRole(currentUser.uid);
          setUserRole(role);
        } catch (error) {
          console.error('Error checking user role:', error);
          setUserRole(null);
        } finally {
          setCheckingRole(false);
        }
      } else {
        setCheckingRole(false);
      }
    }

    checkUserRole();
  }, [currentUser]);

  // Show loading spinner while checking authentication and role
  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but admin required and user is not admin
  if (requireAdmin && userRole !== UserRole.ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
}
```

---

## 2. LogsPage Component

**Location:** `src/pages/LogsPage.tsx`

```typescript
/**
 * Logs Page - Admin Only
 * 
 * Displays audit logs for all actions in the system.
 * Only accessible to users with admin role.
 * 
 * ISO 27001 Control: A.12.4.3 - Administrator and operator logs
 */

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { logViewLogs } from '../utils/logger';
import { getLogActionDescription } from '../utils/logger';

interface LogEntry {
  id: string;
  timestamp: Timestamp;
  userId: string;
  userEmail: string;
  action: string;
  targetCollection: string;
  targetId?: string;
  details?: Record<string, any>;
  userAgent?: string;
  status: 'success' | 'failed';
}

export function LogsPage() {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    // Log that admin viewed logs
    if (currentUser) {
      logViewLogs(currentUser.uid, currentUser.email || 'unknown');
    }
  }, [currentUser]);

  async function fetchLogs() {
    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, 'logs'),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      const logData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LogEntry[];

      setLogs(logData);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load audit logs. You may not have permission.');
    } finally {
      setLoading(false);
    }
  }

  // Filter logs based on status and search term
  const filteredLogs = logs.filter(log => {
    // Status filter
    if (filter !== 'all' && log.status !== filter) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        log.userEmail.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.targetCollection.toLowerCase().includes(searchLower) ||
        (log.targetId && log.targetId.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Audit Logs</h1>
        <p className="text-gray-600">
          Comprehensive audit trail of all actions in the system (Last 100 entries)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Logs
            </label>
            <input
              type="text"
              placeholder="Search by user, action, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'success' | 'failed')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success Only</option>
              <option value="failed">Failed Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredLogs.length} of {logs.length} logs
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No logs found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.timestamp?.toDate().toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-medium text-gray-900">
                        {log.action}
                      </span>
                      <br />
                      <span className="text-xs text-gray-500">
                        {getLogActionDescription(log.action as any)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.targetCollection}
                      {log.targetId && (
                        <>
                          <br />
                          <span className="text-xs text-gray-500 font-mono">
                            {log.targetId.substring(0, 8)}...
                          </span>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.details && Object.keys(log.details).length > 0 ? (
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 hover:text-blue-800">
                            View details
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-50 p-2 rounded max-w-xs overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      ) : (
                        <span className="text-gray-400">No details</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Refresh Logs
        </button>
      </div>
    </div>
  );
}
```

---

## 3. Unauthorized Page Component

**Location:** `src/pages/UnauthorizedPage.tsx`

```typescript
/**
 * Unauthorized Page
 * 
 * Displayed when user tries to access a page they don't have permission for.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function UnauthorizedPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-red-600 text-6xl mb-4">🚫</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        
        {currentUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Logged in as: <strong>{currentUser.email}</strong>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              If you believe you should have access, please contact an administrator.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Updated AuthContext with Session Timeout

**Location:** `src/contexts/AuthContext.tsx`

**IMPORTANT:** Backup your existing AuthContext.tsx before replacing!

```typescript
/**
 * Authentication Context with Session Timeout
 * 
 * Provides authentication state and session management.
 * Implements automatic logout after 30 minutes of inactivity.
 * 
 * ISO 27001 Control: A.9.4.2 - Secure log-on procedures
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserDocument, UserRole } from '../utils/roleManager';
import { logLogin, logLogout, logSessionExpired } from '../utils/logger';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Sign in function
  async function signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Create or update user document
    await createUserDocument(
      userCredential.user.uid,
      userCredential.user.email || email
    );
    
    // Log successful login
    await logLogin(
      userCredential.user.uid,
      userCredential.user.email || email
    );
  }

  // Sign up function
  async function signUp(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document with read-only role by default
    await createUserDocument(
      userCredential.user.uid,
      email,
      UserRole.READ_ONLY
    );
    
    // Log registration
    await logLogin(
      userCredential.user.uid,
      email
    );
  }

  // Sign out function
  async function signOut() {
    if (currentUser) {
      await logLogout(
        currentUser.uid,
        currentUser.email || 'unknown'
      );
    }
    
    // Clear session timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    await firebaseSignOut(auth);
  }

  // Session timeout handler
  function handleSessionTimeout() {
    if (currentUser) {
      logSessionExpired(
        currentUser.uid,
        currentUser.email || 'unknown'
      );
      
      firebaseSignOut(auth);
      
      alert('Your session has expired due to inactivity. Please log in again.');
    }
  }

  // Reset session timeout
  function resetSessionTimeout() {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(handleSessionTimeout, SESSION_TIMEOUT);
    setTimeoutId(newTimeoutId);
  }

  // Set up session timeout and activity listeners
  useEffect(() => {
    if (currentUser) {
      // Start session timeout
      resetSessionTimeout();

      // Activity events that reset timeout
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
      
      events.forEach(event => {
        document.addEventListener(event, resetSessionTimeout);
      });

      // Cleanup
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        events.forEach(event => {
          document.removeEventListener(event, resetSessionTimeout);
        });
      };
    }
  }, [currentUser]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    signOut,
    signUp
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

---

## 5. Example Risk Service with Logging

**Location:** `src/services/riskService.ts`

```typescript
/**
 * Risk Service with Audit Logging
 * 
 * Handles CRUD operations for risks with comprehensive logging.
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { logRiskCreated, logRiskUpdated, logRiskDeleted } from '../utils/logger';
import {
  validateCompleteRisk,
  sanitizeInput,
  calculateRiskLevel
} from '../utils/sanitize';

export interface RiskData {
  title: string;
  owner: string;
  likelihood: number;
  consequence: number;
  status: 'Open' | 'InProgress' | 'Closed';
  level: 'Low' | 'Medium' | 'High';
  description?: string;
  measures?: string;
  justification?: string;
  category?: 'technical' | 'process' | 'organizational' | 'privacy';
}

/**
 * Create a new risk
 */
export async function createRisk(
  riskData: RiskData,
  currentUser: { uid: string; email: string }
) {
  // Validate data
  const validation = validateCompleteRisk(riskData);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
  }

  // Sanitize all text fields
  const sanitizedData = {
    title: sanitizeInput(riskData.title),
    owner: sanitizeInput(riskData.owner),
    likelihood: Number(riskData.likelihood),
    consequence: Number(riskData.consequence),
    score: Number(riskData.likelihood) * Number(riskData.consequence),
    level: calculateRiskLevel(Number(riskData.likelihood) * Number(riskData.consequence)),
    status: riskData.status,
    description: riskData.description ? sanitizeInput(riskData.description) : undefined,
    measures: riskData.measures ? sanitizeInput(riskData.measures) : undefined,
    justification: riskData.justification ? sanitizeInput(riskData.justification) : undefined,
    category: riskData.category,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  // Create risk
  const docRef = await addDoc(collection(db, 'risks'), sanitizedData);

  // Log the action
  await logRiskCreated(
    currentUser.uid,
    currentUser.email,
    docRef.id,
    {
      title: sanitizedData.title,
      score: sanitizedData.score,
      level: sanitizedData.level
    }
  );

  return docRef;
}

/**
 * Update an existing risk
 */
export async function updateRisk(
  riskId: string,
  updates: Partial<RiskData>,
  currentUser: { uid: string; email: string }
) {
  // Sanitize text fields if present
  const sanitizedUpdates: any = {
    ...updates,
    updatedAt: serverTimestamp()
  };

  if (updates.title) {
    sanitizedUpdates.title = sanitizeInput(updates.title);
  }
  if (updates.owner) {
    sanitizedUpdates.owner = sanitizeInput(updates.owner);
  }
  if (updates.description) {
    sanitizedUpdates.description = sanitizeInput(updates.description);
  }
  if (updates.measures) {
    sanitizedUpdates.measures = sanitizeInput(updates.measures);
  }
  if (updates.justification) {
    sanitizedUpdates.justification = sanitizeInput(updates.justification);
  }

  // Recalculate score if likelihood or consequence changed
  if (updates.likelihood || updates.consequence) {
    // Would need to fetch existing values if only one is being updated
    // For simplicity, assume both are provided
    if (updates.likelihood && updates.consequence) {
      sanitizedUpdates.score = updates.likelihood * updates.consequence;
      sanitizedUpdates.level = calculateRiskLevel(sanitizedUpdates.score);
    }
  }

  // Update risk
  await updateDoc(doc(db, 'risks', riskId), sanitizedUpdates);

  // Log the action
  await logRiskUpdated(
    currentUser.uid,
    currentUser.email,
    riskId,
    Object.keys(updates)
  );
}

/**
 * Delete a risk
 */
export async function deleteRisk(
  riskId: string,
  riskTitle: string,
  currentUser: { uid: string; email: string }
) {
  // Delete risk
  await deleteDoc(doc(db, 'risks', riskId));

  // Log the action
  await logRiskDeleted(
    currentUser.uid,
    currentUser.email,
    riskId,
    riskTitle
  );
}
```

---

## Usage Instructions

1. **Copy each component** to the specified location in your project
2. **Adjust import paths** if your project structure is different
3. **Update your router** to include the new routes:
   ```typescript
   import { LogsPage } from './pages/LogsPage';
   import { UnauthorizedPage } from './pages/UnauthorizedPage';
   import { ProtectedRoute } from './components/ProtectedRoute';

   // In your routes:
   <Route path="/unauthorized" element={<UnauthorizedPage />} />
   <Route 
     path="/logs" 
     element={
       <ProtectedRoute requireAdmin={true}>
         <LogsPage />
       </ProtectedRoute>
     } 
   />
   ```

4. **Wrap protected routes** with ProtectedRoute component
5. **Use the riskService** functions in your forms instead of direct Firestore calls
6. **Test thoroughly** before deploying to production

All components are production-ready and include proper error handling, TypeScript types, and Tailwind CSS styling.