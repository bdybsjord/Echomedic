import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";

import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";

// RISKS
import { RisksPage } from "../pages/RISK/RisksPage";
import { NewRiskPage } from "../pages/RISK/NewRiskPage";
import { RiskDetailPage } from "../pages/RISK/RiskDetailPage";
import RiskEditPage from "../pages/RISK/RiskEditPage";

// CONTROLS
import ControlsPage from "../pages/CONTROL/ControlsPage";
import NewControlPage from "../pages/CONTROL/NewControlPage";
import ControlEditPage from "../pages/CONTROL/ControlEditPage";

// POLICIES
import PoliciesPage from "../pages/POLICY/PoliciesPage";
import PolicyDetailPage from "../pages/POLICY/PoliciesDetailPage";
import NewPolicyPage from "../pages/POLICY/NewPolicyPage";
import PolicyEditPage from "../pages/POLICY/PolicyEditPage";

// ADMIN
import { AdminAuditLogPage } from "../pages/AdminAuditLogPage";


import UnauthorizedPage from "../pages/UnauthorizedPage";
import AppShell from "../layout/AppShell";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

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
                <ProtectedRoute requireAdmin>
                  <AdminAuditLogPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* fallback (valgfritt) */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
