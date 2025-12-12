// src/routes/AppRoutes.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";

import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

import Login from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";

// RISKS
import { RisksPage } from "../pages/RisksPage";
import { NewRiskPage } from "../pages/NewRiskPage";
import { RiskDetailPage } from "../pages/RiskDetailPage";
import RiskEditPage from "../pages/RiskEditPage";

// CONTROLS
import ControlsPage from "../pages/ControlsPage";
import NewControlPage from "../pages/NewControlPage";
import ControlEditPage from "../pages/ControlEditPage";

// POLICIES
import PoliciesPage from "../pages/PoliciesPage";
import PolicyDetailPage from "../pages/PoliciesDetailPage";
import NewPolicyPage from "../pages/NewPolicyPage";
import PolicyEditPage from "../pages/PolicyEditPage";

// ADMIN
import { AdminAuditLogPage } from "../pages/AdminAuditLogPage";

import AppShell from "../layout/AppShell";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* --- RISKS --- */}
            <Route path="risks" element={<RisksPage />} />
            <Route path="risks/new" element={<NewRiskPage />} />
            <Route path="risks/:id" element={<RiskDetailPage />} />
            <Route path="risks/:id/edit" element={<RiskEditPage />} />

            {/* --- CONTROLS --- */}
            <Route path="controls" element={<ControlsPage />} />
            <Route path="controls/new" element={<NewControlPage />} />
            <Route path="controls/:id/edit" element={<ControlEditPage />} />

            {/* --- POLICIES --- */}
            <Route path="policies" element={<PoliciesPage />} />
            <Route path="policies/new" element={<NewPolicyPage />} />
            <Route path="policies/:id" element={<PolicyDetailPage />} />
            <Route path="policies/:id/edit" element={<PolicyEditPage />} />

            {/* --- ADMIN ONLY --- */}
            <Route
              path="admin/audit-log"
              element={
                <AdminProtectedRoute>
                  <AdminAuditLogPage />
                </AdminProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
