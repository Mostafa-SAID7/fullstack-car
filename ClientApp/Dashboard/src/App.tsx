import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, MainLayout, ErrorBoundary, ToastProvider, LoginForm, AuthDebug } from './components';
import { AuthLayout, RegisterForm, ForgotPasswordForm, ResetPasswordForm } from './components/auth';
import { ThemeProvider } from './contexts';
import { authService } from './services/auth';
import { DebugPage } from './components/debug/DebugPage';

// Lazy load all page components for better performance
const DashboardOverview = React.lazy(() => import('./pages').then(module => ({ default: module.DashboardOverview })));
const Analytics = React.lazy(() => import('./pages').then(module => ({ default: module.Analytics })));
const Users = React.lazy(() => import('./pages').then(module => ({ default: module.Users })));
const Customers = React.lazy(() => import('./pages').then(module => ({ default: module.Customers })));
const Products = React.lazy(() => import('./pages').then(module => ({ default: module.Products })));
const Services = React.lazy(() => import('./pages').then(module => ({ default: module.Services })));
const Content = React.lazy(() => import('./pages').then(module => ({ default: module.Content })));
const System = React.lazy(() => import('./pages').then(module => ({ default: module.System })));
const AuditLogs = React.lazy(() => import('./pages').then(module => ({ default: module.AuditLogs })));
const HealthMonitor = React.lazy(() => import('./pages').then(module => ({ default: module.HealthMonitor })));
const LocalizationManagement = React.lazy(() => import('./pages').then(module => ({ default: module.LocalizationManagement })));
const Settings = React.lazy(() => import('./pages').then(module => ({ default: module.Settings })));
const AIAgentManagement = React.lazy(() => import('./pages').then(module => ({ default: module.AIAgentManagement })));
const ModelTraining = React.lazy(() => import('./pages').then(module => ({ default: module.ModelTraining })));
const Media = React.lazy(() => import('./pages').then(module => ({ default: module.Media })));
const MediaManagement = React.lazy(() => import('./pages').then(module => ({ default: module.MediaManagement })));
const ThemesManagement = React.lazy(() => import('./pages').then(module => ({ default: module.ThemesManagement })));
const QAManagement = React.lazy(() => import('./pages').then(module => ({ default: module.QAManagement })));
const QAAnalytics = React.lazy(() => import('./pages').then(module => ({ default: module.QAAnalytics })));

// Marketing Pages
const MarketingOverview = React.lazy(() => import('./pages').then(module => ({ default: module.MarketingOverview })));
const SocialMedia = React.lazy(() => import('./pages').then(module => ({ default: module.SocialMedia })));
const Campaigns = React.lazy(() => import('./pages').then(module => ({ default: module.Campaigns })));
const MarketingAnalytics = React.lazy(() => import('./pages').then(module => ({ default: module.MarketingAnalytics })));
const ContentPlanning = React.lazy(() => import('./pages').then(module => ({ default: module.ContentPlanning })));

// Marketplace Pages
const MarketplaceOverview = React.lazy(() => import('./pages').then(module => ({ default: module.MarketplaceOverview })));

// Notification Management
const NotificationManagement = React.lazy(() => import('./pages').then(module => ({ default: module.NotificationManagement })));

// Error Pages
const NotFound = React.lazy(() => import('./pages').then(module => ({ default: module.NotFound })));
const Forbidden = React.lazy(() => import('./pages').then(module => ({ default: module.Forbidden })));
const ServerError = React.lazy(() => import('./pages').then(module => ({ default: module.ServerError })));

// Debug Pages
const AuthDebugPage = React.lazy(() => import('./pages/debug/AuthDebugPage'));

import { Skeleton } from './components';

// Loading component for Suspense fallback
const PageLoader = () => <Skeleton width="100%" height="400px" className="rounded-lg" />;

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// ... (imports remain)

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <AuthLayout title="Welcome Back">
            <LoginForm />
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout title="Join Us" subtitle="Create your community account">
            <RegisterForm />
          </AuthLayout>
        } />
        <Route path="/forgot-password" element={
          <AuthLayout title="Reset Password" subtitle="We'll help you get back in">
            <ForgotPasswordForm />
          </AuthLayout>
        } />
        <Route path="/reset-password" element={
          <AuthLayout title="New Password" subtitle="Setup your new secure password">
            <ResetPasswordForm />
          </AuthLayout>
        } />
        <Route path="/debug" element={<AuthDebug />} />
        <Route path="/debug/auth" element={
          <Suspense fallback={<PageLoader />}>
            <AuthDebugPage />
          </Suspense>
        } />
        <Route path="/debug-full" element={<DebugPage />} />
        <Route path="/test" element={<div className="p-8"><h1 className="text-3xl font-bold text-green-600 mb-4">✅ Dashboard is Working!</h1><p className="text-lg text-gray-600 mb-4">If you can see this page, the dashboard is running correctly.</p><div className="bg-green-50 border border-green-200 rounded-lg p-4"><h2 className="text-lg font-semibold text-green-800 mb-2">Server Status</h2><ul className="text-green-700 space-y-1"><li>✅ React application loaded</li><li>✅ Vite development server running</li><li>✅ TypeScript compilation successful</li><li>✅ Tailwind CSS styles applied</li></ul></div><div className="mt-6"><button onClick={() => window.location.href = '/dashboard'} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">Go to Dashboard</button></div></div>} />
        <Route path="/simple" element={<div className="p-8"><h1 className="text-2xl font-bold">Simple Test</h1><p>This is a simple test page without authentication.</p><div className="mt-4"><button onClick={() => console.log('Auth Status:', { isAuthenticated: authService.isAuthenticated(), user: authService.getCurrentUser() })} className="bg-gray-500 text-white px-4 py-2 rounded">Check Auth Status</button></div></div>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
          path="/administration/analytics"
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
          path="/administration/users"
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
          path="/marketplace"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <MarketplaceOverview />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace/customers"
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
          path="/marketplace/products"
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
          path="/marketplace/services"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Services />
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
          path="/content/localization"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <LocalizationManagement />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/content/media"
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
          path="/media"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <MediaManagement />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/content/themes"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <ThemesManagement />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/content/qa"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <QAManagement />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/content/qa/analytics"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <QAAnalytics />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/administration/system"
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
          path="/administration/audit-logs"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <AuditLogs />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/administration/health-monitor"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <HealthMonitor />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/administration/notifications"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <NotificationManagement />
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
        <Route
          path="/ai-agent/model-training"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <ModelTraining />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <MarketingOverview />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing/social-media"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <SocialMedia />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing/campaigns"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Campaigns />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing/analytics"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <MarketingAnalytics />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing/content-planning"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <ContentPlanning />
                </Suspense>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Error Pages */}
        <Route
          path="/error/403"
          element={
            <Suspense fallback={<PageLoader />}>
              <Forbidden />
            </Suspense>
          }
        />
        <Route
          path="/error/500"
          element={
            <Suspense fallback={<PageLoader />}>
              <ServerError />
            </Suspense>
          }
        />
        
        {/* Catch-all route for 404 - Must be last */}
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App