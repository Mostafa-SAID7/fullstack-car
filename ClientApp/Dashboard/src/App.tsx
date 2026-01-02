import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { AuthDebug } from './components/debug/AuthDebug';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  DashboardOverview, 
  Analytics, 
  Users, 
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
          <Route path="/debug" element={<AuthDebug />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
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