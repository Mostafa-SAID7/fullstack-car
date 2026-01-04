import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { AuthDebug } from './components/debug/AuthDebug';
import { LoginForm } from './components/auth/LoginForm';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DashboardTest } from './pages/DashboardTest';

// Lazy load all page components for better performance
const DashboardOverview = React.lazy(() => import('./pages').then(module => ({ default: module.DashboardOverview })));
const Analytics = React.lazy(() => import('./pages').then(module => ({ default: module.Analytics })));
const Users = React.lazy(() => import('./pages').then(module => ({ default: module.Users })));
const Customers = React.lazy(() => import('./pages').then(module => ({ default: module.Customers })));
const Products = React.lazy(() => import('./pages').then(module => ({ default: module.Products })));
const Content = React.lazy(() => import('./pages').then(module => ({ default: module.Content })));
const System = React.lazy(() => import('./pages').then(module => ({ default: module.System })));
const Settings = React.lazy(() => import('./pages').then(module => ({ default: module.Settings })));
const AIAgentManagement = React.lazy(() => import('./pages').then(module => ({ default: module.AIAgentManagement })));
const Media = React.lazy(() => import('./pages').then(module => ({ default: module.Media })));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
                    <Suspense fallback={<PageLoader />}>
                      <DashboardOverview />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <Analytics />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <Users />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <Customers />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <Products />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/content"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <Content />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/media"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <Media />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/system"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <System />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <Settings />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-agent"
              element={
                <ProtectedRoute requiredRoles={["Admin"]}>
                  <MainLayout>
                    <Suspense fallback={<PageLoader />}>
                      <AIAgentManagement />
                    </Suspense>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App