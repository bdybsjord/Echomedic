import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import { RisksPage } from "../pages/RisksPage";
import { NewRiskPage } from "../pages/NewRiskPage";
import { RiskDetailPage } from "../pages/RiskDetailPage";
import ControlsPage from "../pages/ControlsPage";
import PoliciesPage from "../pages/PoliciesPage";
import AppShell from "../layout/AppShell";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="risks" element={<RisksPage />} />
            <Route path="risks/new" element={<NewRiskPage />} />
            <Route path="risks/:id" element={<RiskDetailPage />} />
            <Route path="controls" element={<ControlsPage />} />
            <Route path="policies" element={<PoliciesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
