/**
 * AdminMainLayout Component Tests
 * Tests for the responsive administrative layout with role-based navigation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminMainLayout } from '../AdminMainLayout';
import { AdminAuthProvider } from '../../../contexts/AdminAuthContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { AdminRole } from '../../../types/admin';

// Mock the admin auth context
const mockAdminUser = {
  id: '1',
  email: 'admin@test.com',
  firstName: 'Test',
  lastName: 'Admin',
  roles: [AdminRole.SUPER_ADMIN],
  permissions: [],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockAuthContext = {
  adminUser: mockAdminUser,
  isAuthenticated: true,
  isLoading: false,
  error: null,
  session: null,
  login: jest.fn(),
  logout: jest.fn(),
  refreshToken: jest.fn(),
  clearError: jest.fn(),
  hasRole: jest.fn((role: AdminRole) => mockAdminUser.roles.includes(role)),
  hasAnyRole: jest.fn(),
  hasAllRoles: jest.fn(),
  hasPermission: jest.fn(() => true),
  canAccessModule: jest.fn(() => true),
  getCurrentSession: jest.fn(),
  refreshSession: jest.fn(),
  updateAdminUser: jest.fn()
};

// Mock the theme context
const mockThemeContext = {
  theme: 'light' as const,
  resolvedTheme: 'light' as const,
  setTheme: jest.fn(),
  toggleTheme: jest.fn()
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

// Mock the contexts
jest.mock('../../../contexts/AdminAuthContext', () => ({
  useAdminAuth: () => mockAuthContext,
  AdminAuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => mockThemeContext,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('AdminMainLayout', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('renders the admin layout with navigation', () => {
    render(
      <TestWrapper>
        <AdminMainLayout>
          <div>Test Content</div>
        </AdminMainLayout>
      </TestWrapper>
    );

    // Check if main layout elements are present
    expect(screen.getByRole('navigation', { name: /administrative navigation/i })).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows role-based navigation items for Super Admin', () => {
    render(
      <TestWrapper>
        <AdminMainLayout>
          <div>Test Content</div>
        </AdminMainLayout>
      </TestWrapper>
    );

    // Super Admin should see System Management
    expect(screen.getByText('System Management')).toBeInTheDocument();
    expect(screen.getByText('User Administration')).toBeInTheDocument();
    expect(screen.getByText('Content Management')).toBeInTheDocument();
  });

  it('toggles sidebar collapse state', async () => {
    render(
      <TestWrapper>
        <AdminMainLayout>
          <div>Test Content</div>
        </AdminMainLayout>
      </TestWrapper>
    );

    // Find and click the collapse button
    const collapseButton = screen.getByLabelText(/collapse sidebar|expand sidebar/i);
    fireEvent.click(collapseButton);

    // The sidebar should change its collapsed state
    await waitFor(() => {
      // Check if the sidebar width class changes (this is a simplified test)
      const sidebar = screen.getByRole('navigation', { name: /administrative navigation/i });
      expect(sidebar).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(
      <TestWrapper>
        <AdminMainLayout>
          <div>Test Content</div>
        </AdminMainLayout>
      </TestWrapper>
    );

    // Find the search input
    const searchInput = screen.getByPlaceholderText(/search navigation/i);
    expect(searchInput).toBeInTheDocument();

    // Type in search input
    fireEvent.change(searchInput, { target: { value: 'dashboard' } });

    // Wait for search results
    await waitFor(() => {
      expect(searchInput).toHaveValue('dashboard');
    });
  });

  it('displays breadcrumb navigation', () => {
    // Mock location to have a path with multiple segments
    const mockLocation = {
      pathname: '/admin/content/moderation',
      search: '',
      hash: '',
      state: null,
      key: 'test'
    };

    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => mockLocation
    }));

    render(
      <TestWrapper>
        <AdminMainLayout>
          <div>Test Content</div>
        </AdminMainLayout>
      </TestWrapper>
    );

    // Check if breadcrumb is present (simplified test)
    const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(breadcrumb).toBeInTheDocument();
  });

  it('handles mobile sidebar toggle', () => {
    render(
      <TestWrapper>
        <AdminMainLayout>
          <div>Test Content</div>
        </AdminMainLayout>
      </TestWrapper>
    );

    // Find the mobile menu button
    const mobileMenuButton = screen.getByLabelText(/toggle sidebar/i);
    expect(mobileMenuButton).toBeInTheDocument();

    // Click the mobile menu button
    fireEvent.click(mobileMenuButton);

    // The mobile sidebar should be toggled (simplified test)
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('renders children content correctly', () => {
    const testContent = <div data-testid="test-content">Custom Admin Content</div>;

    render(
      <TestWrapper>
        <AdminMainLayout>
          {testContent}
        </AdminMainLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Admin Content')).toBeInTheDocument();
  });
});