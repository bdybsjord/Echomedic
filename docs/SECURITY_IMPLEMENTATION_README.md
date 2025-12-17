# Echomedic Risk Portal - Security Implementation Guide

**Security Audit & Implementation by Magan**  
**Project:** Echomedic Risk Management Portal

---

## 📋 Executive Summary

This document provides a complete security implementation for the Echomedic Risk Portal. The current system has several critical security gaps that have been identified and addressed.

### Critical Issues Identified:
1. **No Role-Based Access Control** - All authenticated users can modify/delete data
2. **Exposed Firebase API Keys** - Keys shared publicly in documentation
3. **No Input Sanitization** - Vulnerable to XSS attacks
4. **No Audit Logging** - No way to track who changed what
5. **Weak Firestore Rules** - Too permissive access controls

### Solutions Provided:
1. Complete RBAC implementation (Admin/Read-only roles)
2. Input sanitization and validation
3. Comprehensive audit logging system
4. Hardened Firestore security rules
5. Secret management best practices
6. Password policy enforcement
7. Session timeout implementation

---

##  CRITICAL: Immediate Actions Required

### 1. Rotate Firebase API Keys (URGENT)
The Firebase API keys have been exposed in documentation. Take these steps immediately:

```bash
1. Go to Firebase Console: https://console.firebase.google.com
2. Select Project: echomedic-risk-portal
3. Project Settings > General
4. Under "Your apps" > Web app > Click "Generate new key pair"
5. Update .env.local with new keys
6. Redeploy the application
```

### 2. Restrict API Key Usage
```bash
1. Go to Google Cloud Console: https://console.cloud.google.com
2. Select project: echomedic-risk-portal
3. APIs & Services > Credentials
4. Edit the Web API key
5. Add restrictions:
   - Application restrictions: HTTP referrers
   - Website restrictions: https://echomedic-risk-portal.web.app
   - API restrictions: Only enable Firebase services
```

---

## Package Contents

This security implementation package contains:

```
Security_Implementation_Package/
├── README.md (this file)
├── INSTALLATION_GUIDE.md
├── SECURITY_AUDIT_REPORT.pdf
├── firestore.rules (new security rules)
├── src/
│   ├── utils/
│   │   ├── sanitize.ts
│   │   ├── logger.ts
│   │   ├── roleManager.ts
│   │   └── passwordPolicy.ts
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   └── LogsPage.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx (updated)
│   └── services/
│       └── riskService.ts (updated)
├── .env.local.example
└── TESTING_CHECKLIST.md
```

---

## 🔧 Installation Instructions

### Prerequisites
- Node.js LTS installed
- Pnpm installed globally (`npm install -g pnpm`)
- Access to Firebase Console (Owner/Editor role)
- Git installed

### Step 1: Clone Repository
```bash
git clone https://github.com/bdybsjord/Echomedic.git
cd Echomedic
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Set Up Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your Firebase credentials
# Use the NEW rotated keys (see Critical Actions above)
```

### Step 4: Update Firestore Security Rules

1. Go to Firebase Console: https://console.firebase.google.com
2. Select project: `echomedic-risk-portal`
3. Navigate to: Firestore Database > Rules
4. Copy the content from `firestore.rules` file (provided in this package)
5. Paste into the Firebase console
6. Click "Publish"

**IMPORTANT:** Test the rules in the simulator before publishing!

### Step 5: Copy New Files to Project

Copy all files from the `src/` directory in this package to your project:

```bash
# From the Security_Implementation_Package directory
cp -r src/* /path/to/Echomedic/src/
```

### Step 6: Initialize User Roles

Create initial admin user in Firestore:

1. Go to Firestore Database in Firebase Console
2. Create new collection: `users`
3. Add document with ID matching your Firebase Auth UID:
   ```json
   {
     "uid": "your-firebase-auth-uid",
     "email": "yusufmaagan@gmail.com",
     "role": "admin",
     "createdAt": "2024-12-14T10:00:00Z",
     "lastLogin": "2024-12-14T10:00:00Z"
   }
   ```

To find your UID:
- Go to Firebase Console > Authentication > Users
- Click on your user to see the UID

### Step 7: Run Locally
```bash
pnpm dev
```

The app should run on: http://localhost:5173

### Step 8: Test Implementation

Follow the testing checklist in `TESTING_CHECKLIST.md`

---

## Security Features Implemented

### 1. Role-Based Access Control (RBAC)

**Roles:**
- `admin` - Full access (create, read, update, delete)
- `read-only` - View-only access

**Implementation:**
- User roles stored in Firestore `users` collection
- Role checks enforced at Firestore rules level
- Frontend route protection based on roles
- Middleware for role verification

**Files Modified/Created:**
- `src/utils/roleManager.ts` - Role management utilities
- `src/components/ProtectedRoute.tsx` - Route protection
- `firestore.rules` - Server-side enforcement

### 2. Input Sanitization & Validation

**Protection Against:**
- Cross-Site Scripting (XSS)
- HTML injection
- Script injection
- Invalid data types

**Implementation:**
- DOMPurify for HTML sanitization
- Field length validation (title: 3-200 chars, description: max 1000 chars)
- Type validation for numbers (likelihood/consequence: 1-5)
- Whitelist validation for enums (status, level, category)

**Files Created:**
- `src/utils/sanitize.ts` - Sanitization functions

### 3. Audit Logging System

**What's Logged:**
- User login/logout
- Risk creation
- Risk updates
- Risk deletion
- Policy changes
- Admin actions

**Log Contents:**
- Timestamp
- User ID and email
- Action performed
- Target resource
- IP address (if available)
- User agent

**Files Created:**
- `src/utils/logger.ts` - Logging utilities
- `src/pages/LogsPage.tsx` - Admin log viewer
- `src/services/riskService.ts` - Updated with logging

### 4. Hardened Firestore Security Rules

**Key Improvements:**
- Role-based access control enforced server-side
- Field-level validation (size limits, types, allowed values)
- Immutable logs (can't be modified or deleted)
- Admin-only access to logs
- Validated risk score calculation
- Prevent timestamp manipulation

**File:**
- `firestore.rules` - Complete rewrite

### 5. Password Policy

**Requirements:**
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

**File:**
- `src/utils/passwordPolicy.ts`

### 6. Session Management

**Features:**
- Auto-logout after 30 minutes of inactivity
- Activity tracking (mouse, keyboard, scroll)
- Session timeout warning
- Secure session storage

**File:**
- `src/contexts/AuthContext.tsx` (updated)

---

## Compliance Mapping

### ISO 27001 Controls Addressed:

| Control | Title | Implementation |
|---------|-------|----------------|
| A.9.2.1 | User registration and de-registration | User collection with role management |
| A.9.2.2 | User access provisioning | Role-based access control |
| A.9.2.3 | Management of privileged access rights | Admin role with restricted access |
| A.9.2.4 | Management of secret authentication | Password policy enforcement |
| A.9.4.1 | Information access restriction | Firestore rules enforce access control |
| A.9.4.3 | Password management system | bcrypt hashing, secure storage |
| A.12.4.1 | Event logging | Comprehensive audit logging |
| A.12.4.3 | Administrator and operator logs | Admin action logging |
| A.14.2.1 | Secure development policy | Input validation, sanitization |
| A.18.1.5 | Regulation of cryptographic controls | Firebase Auth encryption, TLS |

### Normen Requirements Addressed:

| Requirement | Implementation |
|-------------|----------------|
| § 7 Access Control | RBAC with admin/read-only roles |
| § 8 Logging | Audit trail for all actions |
| § 9 Incident Handling | Log system for incident detection |
| § 10 Confidentiality | Firestore rules prevent unauthorized access |
| § 12 Secure Development | Input validation, XSS prevention |

### GDPR Compliance:

| Article | Requirement | Implementation |
|---------|-------------|----------------|
| Art. 5 | Data processing principles | Audit logs for accountability |
| Art. 25 | Data protection by design | Security built into architecture |
| Art. 32 | Security of processing | Encryption, access control, logging |
| Art. 33 | Breach notification | Log system enables breach detection |

---

## Testing Guidelines

### Manual Testing Checklist

#### Authentication Tests:
- [ ] Cannot access app without login
- [ ] Invalid credentials rejected
- [ ] Session expires after 30 minutes inactivity
- [ ] Password must meet policy requirements
- [ ] Logout works correctly

#### Authorization Tests:
- [ ] Admin can create risks
- [ ] Admin can edit risks
- [ ] Admin can delete risks
- [ ] Admin can view logs
- [ ] Read-only user can view risks
- [ ] Read-only user CANNOT create risks
- [ ] Read-only user CANNOT edit risks
- [ ] Read-only user CANNOT delete risks
- [ ] Read-only user CANNOT view logs

#### Input Validation Tests:
- [ ] Title with `<script>alert('xss')</script>` is sanitized
- [ ] Title < 3 characters rejected
- [ ] Title > 200 characters rejected
- [ ] Description > 1000 characters rejected
- [ ] Likelihood must be 1-5
- [ ] Consequence must be 1-5
- [ ] Status must be Open/InProgress/Closed
- [ ] Level must be Low/Medium/High

#### Firestore Rules Tests:
Use Firebase Console > Firestore > Rules > Playground

Test 1: Unauthenticated user reads risks
```javascript
// Should FAIL
get /databases/(default)/documents/risks/test-risk
// Auth: Unauthenticated
```

Test 2: Read-only user creates risk
```javascript
// Should FAIL
create /databases/(default)/documents/risks/new-risk
// Auth: Custom (uid with role: read-only)
```

Test 3: Admin creates risk
```javascript
// Should SUCCEED
create /databases/(default)/documents/risks/new-risk
// Auth: Custom (uid with role: admin)
```

Test 4: Regular user reads logs
```javascript
// Should FAIL
get /databases/(default)/documents/logs/test-log
// Auth: Custom (uid with role: read-only)
```

#### Logging Tests:
- [ ] Risk creation logged
- [ ] Risk update logged
- [ ] Risk deletion logged
- [ ] Login attempt logged
- [ ] Logs contain: timestamp, user, action, target
- [ ] Logs visible only to admins

---

## Troubleshooting

### Issue: "Permission denied" error in console

**Cause:** Firestore rules not updated or user role not set

**Solution:**
1. Verify Firestore rules are published
2. Check user has role in `users` collection
3. Clear browser cache and reload

### Issue: "Missing environment variables" error

**Cause:** .env.local not configured

**Solution:**
1. Copy `.env.local.example` to `.env.local`
2. Fill in all Firebase credentials
3. Restart dev server (`pnpm dev`)

### Issue: Cannot login with test credentials

**Cause:** User might not exist in Firebase Auth

**Solution:**
1. Go to Firebase Console > Authentication
2. Add user manually: yusufmaagan@gmail.com
3. Set password: Test123
4. Create corresponding document in `users` collection

### Issue: Session timeout not working

**Cause:** Browser might not be detecting activity

**Solution:**
1. Check browser console for errors
2. Verify AuthContext is properly imported
3. Try in different browser

### Issue: Logs page shows empty

**Cause:** No logs generated yet or user is not admin

**Solution:**
1. Perform some actions (create/edit risk)
2. Verify current user has `role: "admin"` in Firestore
3. Check Firestore rules allow admin to read logs

---

## File Documentation

### firestore.rules
Complete Firestore security rules with:
- Role-based access control
- Input validation
- Immutable logs
- Admin-only log access

### src/utils/sanitize.ts
Functions for input sanitization and validation:
- `sanitizeInput()` - Remove all HTML
- `validateRiskTitle()` - Validate title length
- `validateRiskDescription()` - Validate description length

### src/utils/logger.ts
Audit logging system:
- `logAction()` - Log any user action
- Stores: who, what, when, where

### src/utils/roleManager.ts
Role management utilities:
- `getUserRole()` - Get user's role
- `isAdmin()` - Check if user is admin

### src/utils/passwordPolicy.ts
Password validation:
- `validatePassword()` - Enforce password requirements

### src/components/ProtectedRoute.tsx
Route protection component:
- Checks authentication
- Checks authorization (admin requirement)
- Redirects unauthorized users

### src/pages/LogsPage.tsx
Admin-only page to view audit logs:
- Shows last 100 log entries
- Displays: timestamp, user, action, target, details

### src/contexts/AuthContext.tsx
Updated authentication context:
- Session timeout (30 minutes)
- Activity tracking
- User role caching

### src/services/riskService.ts
Risk CRUD operations with logging:
- `createRisk()` - Create and log
- `updateRisk()` - Update and log
- `deleteRisk()` - Delete and log

---

## Deployment to Production

### Step 1: Build for Production
```bash
pnpm build
```

### Step 2: Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### Step 3: Verify Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Step 4: Production Checklist
- [ ] All secrets in .env.local (not in code)
- [ ] Firebase API keys restricted to production domain
- [ ] Admin users created with correct roles
- [ ] Firestore rules tested and deployed
- [ ] Firebase App Check enabled (recommended)
- [ ] HTTPS enforced
- [ ] Content Security Policy headers set

---

## Support & Maintenance

### Regular Security Tasks

**Weekly:**
- Review audit logs for suspicious activity
- Check for failed login attempts
- Monitor user access patterns

**Monthly:**
- Review user roles and permissions
- Update dependencies (`pnpm update`)
- Check Firebase security recommendations

**Quarterly:**
- Rotate Firebase API keys
- Security audit and penetration testing
- Review and update security policies

### Future Enhancements

**Recommended for Next Phase:**
1. **Two-Factor Authentication (2FA)**
   - Firebase supports phone/TOTP 2FA
   - Reduces account compromise risk

2. **Firebase App Check**
   - Prevents unauthorized backend access
   - Requires valid app attestation

3. **Rate Limiting**
   - Prevent brute force attacks
   - Limit API calls per user

4. **IP Whitelisting**
   - Restrict admin access to specific IPs
   - Enhanced security for sensitive operations

5. **Backup & Recovery**
   - Automated Firestore backups
   - Disaster recovery plan

6. **Advanced Monitoring**
   - Firebase Analytics
   - Security event alerting
   - Real-time threat detection

---

## Compliance Documentation

All security implementations have been documented to support:
- ISO 27001 certification
- Normen compliance
- GDPR Article 32 requirements

See `SECURITY_AUDIT_REPORT.pdf` for detailed compliance mapping.

---

## Implementation Checklist

Use this checklist to verify complete implementation:

### Immediate (Week 1):
- [ ] Rotate Firebase API keys
- [ ] Restrict API key usage in Google Cloud Console
- [ ] Update Firestore security rules
- [ ] Create admin user in Firestore `users` collection
- [ ] Copy all new files to project
- [ ] Test authentication and authorization
- [ ] Verify input sanitization working

### Short-term (Week 2-3):
- [ ] Deploy to production with new rules
- [ ] Train users on new role system
- [ ] Review audit logs regularly
- [ ] Document any customizations
- [ ] Update any other documentation

### Ongoing:
- [ ] Monitor security logs weekly
- [ ] Update dependencies monthly
- [ ] Conduct security reviews quarterly
- [ ] Plan for 2FA implementation
- [ ] Enable Firebase App Check

---

## Contact

**Security Implementation by:** Magan  
**Email:** yusufmaagan@gmail.com  
**Date:** December 2024  


For questions or issues with this implementation:
1. Check Troubleshooting section above
2. Review TESTING_CHECKLIST.md
3. Contact via email with specific error messages

---

