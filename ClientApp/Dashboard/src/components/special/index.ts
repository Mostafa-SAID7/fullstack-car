// Special Purpose Components
export * from './error-boundary/ErrorBoundary';
export * from './protected-route/ProtectedRoute';
export * from './theme-provider/ThemeProvider';

// Re-exports for convenience
export { default as ErrorBoundary } from './error-boundary/ErrorBoundary';
export { default as ProtectedRoute } from './protected-route/ProtectedRoute';
export { default as ThemeProvider, ThemeToggle } from './theme-provider/ThemeProvider';
