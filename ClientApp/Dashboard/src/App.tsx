import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { AuthDebug } from './components/debug/AuthDebug';
import { LoginForm } from './components/auth/LoginForm';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DashboardTest } from './pages/DashboardTest';
import {
  DashboardOverview,
  Analytics,
  Users,
  Customers,
  Products,
  Content,
  System,
  Settings,
  AIAgentManagement
} from './pages';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/debug" element={<AuthDebug />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/test" element={<DashboardTest />} />
          <Route path="/simple" element={<div className="p-8"><h1 className="text-2xl font-bold">Simple Test</h1><p>This is a simple test page without authentication.</p></div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRoles={["Admin"]}>
                <MainLayout>
                  <DashboardOverview />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requiredRoles={["Admin"]}>
                <MainLayout>
                  <Analytics />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRoles={["Admin"]}>
                <MainLayout>
                  <Users />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute requiredRoles={["Admin"]}>
                <MainLayout>
                  <Customers />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute requiredRoles={["Admin"]}>
                <MainLayout>
                  <Products />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/content"
            element={
              <ProtectedRoute requiredRoles={["Admin"]}>
                <MainLayout>
                  <Content />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/system"
            element={
              <ProtectedRoute requiredRoles={["Admin"]}>
                <MainLayout>
                  <System />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredRoles={["Admin"]}>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-agent"
            element={
              <ProtectedRoute requiredRoles={["Admin"]}>
                <MainLayout>
                  <AIAgentManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App