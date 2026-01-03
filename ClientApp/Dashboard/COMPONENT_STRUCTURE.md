# Component Organization Structure

This document outlines the organized component structure for the Dashboard application.

## 📁 Global Components (`src/components/`)

These are reusable components that can be used across multiple pages and features.

### 🔐 Authentication (`auth/`)
- `LoginForm.tsx` - Login form component
- `ProtectedRoute.tsx` - Route protection wrapper

### 📊 Charts (`charts/`)
- `AreaChart.tsx` - Reusable area chart component
- `BarChart.tsx` - Reusable bar chart component  
- `LineChart.tsx` - Reusable line chart component
- `PieChart.tsx` - Reusable pie chart component

### 🐛 Debug (`debug/`)
- `AuthDebug.tsx` - Authentication debugging component (development only)
- `StyleTest.tsx` - Style testing component (development only)

### 🎨 Layout (`layout/`)
- `MainLayout.tsx` - Main application layout wrapper
- `Header.tsx` - Application header with navigation
- `Sidebar.tsx` - Application sidebar navigation
- `SearchPalette.tsx` - Global search functionality
- `NotificationDropdown.tsx` - Notification center dropdown
- `UserMenu.tsx` - User account menu
- `ThemeToggle.tsx` - Dark/light theme switcher
- `LanguageSwitcher.tsx` - Language selection component

### 🧩 UI Components (`ui/`)
- `Button.tsx` - Reusable button component with variants
- `Input.tsx` - Reusable input component with validation
- `Card.tsx` - Card components (Card, CardHeader, CardContent, etc.)
- `Modal.tsx` - Modal/dialog component
- `index.ts` - UI components export file

### 🛠️ Utility
- `ErrorBoundary.tsx` - Error boundary for error handling
- `index.ts` - Global components export file

## 📁 Page-Specific Components (`src/pages/*/components/`)

These components are specific to individual pages and are not reused elsewhere.

### 📊 Dashboard (`pages/dashboard/components/`)
- `DashboardHeader.tsx` - Dashboard-specific header with greeting
- `DashboardStats.tsx` - Dashboard statistics cards
- `DashboardCharts.tsx` - Dashboard chart container
- `DashboardAnalytics.tsx` - Dashboard analytics section
- `DashboardActions.tsx` - Dashboard action buttons
- `StatCard.tsx` - Individual stat card component
- `ChartCard.tsx` - Chart wrapper component
- `ModelTraining.tsx` - AI model training component
- `AIAssistant.tsx` - AI assistant widget
- Chart components specific to dashboard:
  - `UserGrowthChart.tsx`
  - `UserRolesChart.tsx`
  - `SystemHealthChart.tsx`
  - `RevenueTrendChart.tsx`
  - `RevenueSourcesChart.tsx`
  - `ContentCreationChart.tsx`
  - `ContentTypesChart.tsx`

### 🤖 AI Agent (`pages/ai-agent/components/`)
- `AIAgentOverview.tsx` - AI agent overview tab
- `AIAgentTraining.tsx` - Training management tab
- `AIAgentModels.tsx` - Model management tab
- `AIAgentMonitoring.tsx` - Monitoring and metrics tab
- `AIAgentDatasets.tsx` - Dataset management tab
- `AIAgentSettings.tsx` - Configuration settings tab

### 📈 Analytics (`pages/analytics/components/`)
- `AnalyticsHeader.tsx` - Analytics page header
- `AnalyticsOverview.tsx` - Analytics overview section
- `AnalyticsMetrics.tsx` - Analytics metrics display

### 📝 Content (`pages/content/components/`)
- `ContentHeader.tsx` - Content page header
- `ContentSections.tsx` - Content sections display
- `ContentStats.tsx` - Content statistics
- `ContentAnalytics.tsx` - Content analytics

## 🎯 Organization Principles

### ✅ Global Components Should Be:
- **Reusable** across multiple pages
- **Generic** and configurable via props
- **Well-documented** with TypeScript interfaces
- **Consistent** in design and behavior

### ✅ Page-Specific Components Should Be:
- **Focused** on a single page's functionality
- **Specific** to that page's requirements
- **Not imported** by other pages
- **Organized** within their page folder

### 🚫 Avoid:
- Duplicating components between global and page-specific folders
- Creating page-specific components in the global folder
- Importing page-specific components from other pages
- Empty component folders

## 📦 Import Patterns

### Global Components
```typescript
// Import from global components
import { Button, Card, Modal } from '../components/ui';
import { LoginForm } from '../components/auth/LoginForm';
import { LineChart } from '../components/charts/LineChart';
```

### Page-Specific Components
```typescript
// Import from same page components folder
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
```

### Cross-Page Imports (Avoid)
```typescript
// ❌ Don't do this - page components should not be shared
import { DashboardHeader } from '../dashboard/components/DashboardHeader';
```

## 🔄 Migration Benefits

1. **Clear Separation** - Global vs page-specific components
2. **Better Maintainability** - Easy to find and modify components
3. **Reduced Duplication** - Shared components in one place
4. **Improved Performance** - Better tree-shaking and code splitting
5. **Enhanced Developer Experience** - Clearer import paths and structure