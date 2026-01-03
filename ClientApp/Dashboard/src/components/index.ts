// Global Components Export

// Layout Components
export { MainLayout } from './layout/MainLayout';
export { Header } from './layout/Header';
export { Sidebar } from './layout/Sidebar';
export { SearchPalette } from './layout/SearchPalette';
export { NotificationDropdown } from './layout/NotificationDropdown';
export { UserMenu } from './layout/UserMenu';
export { ThemeToggle } from './layout/ThemeToggle';
export { LanguageSwitcher } from './layout/LanguageSwitcher';

// Authentication Components
export { LoginForm } from './auth/LoginForm';
export { ProtectedRoute } from './auth/ProtectedRoute';

// Chart Components (Reusable)
export { LineChart } from './charts/LineChart';
export { BarChart } from './charts/BarChart';
export { PieChart } from './charts/PieChart';
export { AreaChart } from './charts/AreaChart';

// UI Components
export * from './ui';

// Utility Components
export { ErrorBoundary } from './ErrorBoundary';

// Debug Components (Development only)
export { AuthDebug } from './debug/AuthDebug';