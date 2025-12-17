# Echomedic Security Implementation - Installation Guide

## What You'll Need

Before starting, ensure you have:
- [ ] Node.js LTS (v18 or higher)
- [ ] pnpm installed globally: `npm install -g pnpm`
- [ ] Git installed
- [ ] Access to Firebase Console (Owner or Editor role)
- [ ] Text editor (VS Code recommended)

---

## Step-by-Step Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/bdybsjord/Echomedic.git
cd Echomedic
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
pnpm install

# Install new security dependencies
pnpm add dompurify
pnpm add -D @types/dompurify
```

### Step 3: Set Up Environment Variables

1. **Create .env.local file:**
```bash
cp .env.local.example .env.local
```

2. **Edit .env.local and add your Firebase credentials:**
```env
VITE_FIREBASE_API_KEY="your-new-api-key-here"
VITE_FIREBASE_AUTH_DOMAIN="echomedic-risk-portal.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="echomedic-risk-portal"
VITE_FIREBASE_STORAGE_BUCKET="echomedic-risk-portal.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="399355250000"
VITE_FIREBASE_APP_ID="1:399355250000:web:dfc37eb011da8513e79855"
```

**IMPORTANT:** You must generate NEW API keys (see Step 4)

### Step 4: Rotate Firebase API Keys (CRITICAL)

The old API keys have been exposed. You MUST rotate them:

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com
   - Select project: `echomedic-risk-portal`

2. **Generate New Web App:**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click "Add app" > Web (</> icon)
   - Register new app: "Echomedic Risk Portal v2"
   - Copy the new configuration

3. **Update .env.local** with the new keys

4. **Restrict the API Key:**
   - Go to Google Cloud Console: https://console.cloud.google.com
   - Select project: `echomedic-risk-portal`
   - Navigate to: APIs & Services > Credentials
   - Find your new Web API key
   - Click Edit
   - Add restrictions:
     - **Application restrictions:** HTTP referrers
     - **Website restrictions:** 
       - `https://echomedic-risk-portal.web.app/*`
       - `https://echomedic-risk-portal.firebaseapp.com/*`
       - `http://localhost:5173/*` (for development)
     - **API restrictions:** 
       - Firebase Authentication API
       - Cloud Firestore API
       - Identity Toolkit API

### Step 5: Update Firestore Security Rules

1. **Go to Firebase Console:**
   - Select project: `echomedic-risk-portal`
   - Navigate to: Firestore Database > Rules

2. **Copy the new rules:**
   - Open the file `firestore.rules` from this package
   - Copy all contents

3. **Paste into Firebase Console:**
   - Delete existing rules
   - Paste new rules
   - Click "Publish"

4. **Test the rules:**
   - Click "Rules playground" tab
   - Test scenarios (see firestore.rules file for test cases)

### Step 6: Copy New Security Files

Copy all files from this package to your project:

```bash
# Assuming you're in the Echomedic directory
# and the security package is in ../Security_Implementation_Package/

# Copy utilities
cp ../Security_Implementation_Package/src/utils/*.ts ./src/utils/

# Copy components (if they don't exist)
mkdir -p ./src/components
cp ../Security_Implementation_Package/src/components/*.tsx ./src/components/

# Copy pages
mkdir -p ./src/pages
cp ../Security_Implementation_Package/src/pages/*.tsx ./src/pages/

# Copy services (if they don't exist)
mkdir -p ./src/services
cp ../Security_Implementation_Package/src/services/*.ts ./src/services/

# Copy contexts (backup original first!)
cp ./src/contexts/AuthContext.tsx ./src/contexts/AuthContext.tsx.backup
cp ../Security_Implementation_Package/src/contexts/AuthContext.tsx ./src/contexts/AuthContext.tsx
```

### Step 7: Initialize User Roles in Firestore

You need to create the `users` collection and add your first admin user:

1. **Go to Firebase Console:**
   - Navigate to: Firestore Database > Data

2. **Create `users` collection:**
   - Click "Start collection"
   - Collection ID: `users`
   - Click "Next"

3. **Add your admin user:**
   - Document ID: Your Firebase Auth UID (see below to find it)
   - Add fields:
     ```
     uid: "your-firebase-auth-uid" (string)
     email: "yusufmaagan@gmail.com" (string)
     role: "admin" (string)
     createdAt: [select timestamp, use "now"]
     lastLogin: [select timestamp, use "now"]
     isActive: true (boolean)
     ```

**To find your Firebase Auth UID:**
1. Go to Firebase Console > Authentication > Users
2. Find your email (yusufmaagan@gmail.com)
3. Click on it to see the UID
4. Copy the UID

Example UID: `AbC123XyZ456...`

### Step 8: Update Import Paths

Make sure your `src/config/firebase.ts` file exists and exports `db` and `auth`:

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Step 9: Update Routes (if needed)

Add the new LogsPage route to your router:

```typescript
// src/App.tsx or wherever your routes are defined
import { LogsPage } from './pages/LogsPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// In your routes:
<Route 
  path="/logs" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <LogsPage />
    </ProtectedRoute>
  } 
/>
```

### Step 10: Run the Application

```bash
pnpm dev
```

The app should start on: http://localhost:5173

### Step 11: Test Everything

Follow the testing checklist:

1. **Test Authentication:**
   - [ ] Can login with: yusufmaagan@gmail.com / Test123
   - [ ] Cannot access app without login
   - [ ] Logout works

2. **Test Authorization:**
   - [ ] Admin can create/edit/delete risks
   - [ ] Admin can view logs at `/logs`
   - [ ] Create a read-only user and test restrictions

3. **Test Input Sanitization:**
   - [ ] Try creating a risk with title: `<script>alert('xss')</script>`
   - [ ] Verify it's sanitized (no script tag in output)

4. **Test Firestore Rules:**
   - [ ] Use Rules Playground in Firebase Console
   - [ ] Test unauthorized access scenarios

5. **Test Logging:**
   - [ ] Create a risk
   - [ ] Go to `/logs` 
   - [ ] Verify the creation was logged

---

## 🔍 Verification Checklist

After installation, verify:

- [ ]  App runs without errors
- [ ]  Can login successfully
- [ ]  New Firebase API keys working
- [ ]  Firestore rules published
- [ ]  User role shows correctly (admin)
- [ ]  Can access all admin features
- [ ]  Logs page accessible
- [ ]  Input sanitization working
- [ ]  No console errors
- [ ]  Session timeout works (wait 30 min)

---

## 🐛 Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Solution:**
- Check .env.local has correct API key
- Verify API key is not restricted to wrong domains
- Restart dev server after changing .env.local

### Issue: "Missing or insufficient permissions"

**Solution:**
- Check Firestore rules are published
- Verify user document exists in `users` collection
- Verify user has correct `role` field

### Issue: "Cannot find module 'dompurify'"

**Solution:**
```bash
pnpm install
# or specifically:
pnpm add dompurify
pnpm add -D @types/dompurify
```

### Issue: "User role is undefined"

**Solution:**
- Go to Firestore Database
- Check `users` collection exists
- Verify document ID matches your Auth UID
- Verify `role` field is set to "admin"

### Issue: "Cannot read property 'uid' of null"

**Solution:**
- User is not logged in
- Clear browser cache and cookies
- Try logging in again

### Issue: Session timeout not working

**Solution:**
- Check AuthContext.tsx is properly updated
- Verify the file was copied correctly
- Check browser console for errors

---

## 📝 Post-Installation Tasks

### 1. Create Additional Users

For each team member:

1. Have them register via the app (or create in Firebase Auth)
2. Get their UID from Firebase Console > Authentication
3. Create document in `users` collection:
   ```
   Document ID: their-uid
   Fields:
     uid: their-uid
     email: their-email@example.com
     role: "read-only" (or "admin")
     createdAt: [timestamp now]
     lastLogin: [timestamp now]
     isActive: true
   ```

### 2. Configure Backup (Recommended)

Set up automated Firestore backups:

1. Go to Firebase Console > Firestore Database
2. Click on "Settings" (gear icon)
3. Go to "Backup" tab
4. Enable automated backups
5. Set schedule (daily recommended)

### 3. Enable Firebase App Check (Recommended)

Protect your backend from abuse:

1. Go to Firebase Console > Build > App Check
2. Click "Get started"
3. Register your web app
4. Select reCAPTCHA v3
5. Get site key from Google reCAPTCHA
6. Add to your app (see code in firestore.rules comments)

### 4. Set Up Monitoring

1. **Firebase Analytics:**
   - Go to Firebase Console > Analytics
   - Enable Google Analytics
   - Track user behavior and errors

2. **Error Tracking:**
   - Consider adding Sentry: `pnpm add @sentry/react`
   - Or use Firebase Crashlytics

### 5. Deploy to Production

When ready to deploy:

```bash
# Build for production
pnpm build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

---

## Security Checklist

Before going to production:

- [ ]  New Firebase API keys generated
- [ ]  API keys restricted in Google Cloud Console
- [ ]  Firestore security rules published and tested
- [ ]  All users have appropriate roles
- [ ]  .env.local not committed to Git
- [ ]  .gitignore includes .env* files
- [ ]  No hardcoded secrets in code
- [ ]  HTTPS enforced (automatic with Firebase Hosting)
- [ ]  Firebase App Check enabled
- [ ]  Monitoring and alerting configured
- [ ]  Backup strategy in place

---


##  Next Steps

After successful installation:

1. Read the full SECURITY_IMPLEMENTATION_README.md
2. Review TESTING_CHECKLIST.md
3. Test all functionality
4. Train team members on new security features
5. Schedule regular security reviews
6. Plan for future enhancements (2FA, etc.)

---

**Installation Complete!** 

Your Echomedic Risk Portal now has enterprise-grade security with:
-  Role-Based Access Control
-  Input Sanitization
-  Comprehensive Audit Logging
-  Hardened Firestore Rules
-  Password Policy Enforcement
-  Session Management