// UI Components Library
// Core Components
export * from './forms/buttons/Button';
export * from './forms/inputs/Input';
export * from './forms/checkboxes/Checkbox';
export * from './forms/selects/Select';
export * from './forms/switches/Switch';
export * from './forms/textareas/Textarea';
export * from './layout/cards/Card';
export * from './layout/modals/Modal';
export * from './layout/containers/Container';
export * from './layout/headers/Header';
export * from './layout/shell';
export * from './data-display/tables/Table';
export * from './data-display/badges/Badge';
export * from './data-display/avatars/Avatar';
export * from './data-display/stats/Stat';
export * from './feedback/loading/Loading';
export { default as FeedbackSkeleton, type SkeletonProps as FeedbackSkeletonProps } from './feedback/skeletons/Skeleton';
export * from './feedback/toasts/Toast';
export * from './feedback/toasts/ToastProvider';
export * from './feedback/progress/Progress';
export * from './feedback/alerts/Alert';
export * from './charts/line/LineChart';
export * from './charts/bar/BarChart';
export * from './charts/pie/PieChart';
export * from './charts/area/AreaChart';
export * from './navigation/breadcrumbs/Breadcrumbs';
export * from './navigation/sidenav/SideNav';
export * from './navigation/mobile-nav/MobileNav';
export * from './special/protected-route/ProtectedRoute';
export * from './special/theme-provider/ThemeProvider';
export * from './auth';

// RTL Layout Components
export * from './RTLLayout';
export * from './RTLUtils';

// Language Switcher Component
export { LanguageSwitcher } from './LanguageSwitcher';
export { default as LanguageSwitcherDefault } from './LanguageSwitcher';

// QA Components
export * from './qa';

// Enhanced Components
export * from './forms/enhanced';
export * from './layout/responsive';
export * from './feedback/loading/LoadingStates';
export * from './feedback/errors/ErrorStates';

// Shared Components (using shared versions to avoid conflicts)
export { 
  SearchAndFilters, 
  EmptyState, 
  Pagination,
  DataTable,
  StatsCards,
  SharedCard,
  ViewToggle,
  UserCards,
  PageHeader,
  EnhancedPageHeader,
  SimplePageHeader,
  ErrorCard,
  ErrorBoundary,
  useErrorBoundary,
  TabNavigation,
  TabContent,
  DynamicModal,
  Skeleton,
  TableSkeleton,
  CardSkeleton,
  PageHeaderSkeleton,
  SearchFiltersSkeleton,
  FormSkeleton,
  ListSkeleton,
  type TabItem,
  type TabNavigationProps,
  type TabContentProps,
  type FilterField,
  type StatusIndicator,
  type FeatureBadge
} from './shared';

// Re-export with default names for convenience
export { default as Button } from './forms/buttons/Button';
export { default as Input } from './forms/inputs/Input';
export { default as Checkbox } from './forms/checkboxes/Checkbox';
export { default as Select } from './forms/selects/Select';
export { default as Switch } from './forms/switches/Switch';
export { default as Textarea } from './forms/textareas/Textarea';
export { Card, MetricCard } from './layout/cards';
export { default as Modal } from './layout/modals/Modal';
export { default as Container } from './layout/containers/Container';
export { default as Header } from './layout/headers/Header';
export { MainLayout, AppHeader, Sidebar } from './layout/shell';
export { default as Table } from './data-display/tables/Table';
export { default as Badge } from './data-display/badges/Badge';
export { default as Avatar, AvatarGroup } from './data-display/avatars/Avatar';
export { default as Stat } from './data-display/stats/Stat';
export { default as Loading } from './feedback/loading/Loading';
export { default as Toast } from './feedback/toasts/Toast';
export { default as ToastProvider } from './feedback/toasts/ToastProvider';
export { default as Progress } from './feedback/progress/Progress';
export { default as Alert } from './feedback/alerts/Alert';
export { default as LineChart } from './charts/line/LineChart';
export { default as BarChart } from './charts/bar/BarChart';
export { default as PieChart } from './charts/pie/PieChart';
export { default as AreaChart } from './charts/area/AreaChart';
export { default as Breadcrumbs, useBreadcrumbs } from './navigation/breadcrumbs/Breadcrumbs';
export { default as SideNav } from './navigation/sidenav/SideNav';
export { default as MobileNav, useMobileNav } from './navigation/mobile-nav/MobileNav';
export { default as ProtectedRoute } from './special/protected-route/ProtectedRoute';
export { default as ThemeProvider, ThemeToggle } from './special/theme-provider/ThemeProvider';

export { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, AuthLayout, AuthDebug } from './auth';

// QA Components
export { 
  QAAnalyticsComponent, 
  ModerationDashboardComponent, 
  UserReputationManagementComponent, 
  QAConfigurationComponent,
  QAAnalytics,
  ModerationDashboard,
  UserReputationManagement,
  QAConfiguration
} from './qa';
