# Frontend Integration Guide

## Backend Identity API Integration

This guide explains how to integrate the backend identity system with both frontend applications.

## 🚀 Backend API Endpoints

### Authentication (v1/auth)
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/confirm-email` - Confirm email address
- `POST /api/v1/auth/resend-email-confirmation` - Resend confirmation email
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/revoke-token` - Revoke specific token

### OAuth (v1/oauth)
- `POST /api/v1/oauth/google` - Google OAuth login
- `POST /api/v1/oauth/github` - GitHub OAuth login
- `POST /api/v1/oauth/facebook` - Facebook OAuth login
- `POST /api/v1/oauth/callback` - External login callback
- `POST /api/v1/oauth/link/{provider}` - Link external account
- `DELETE /api/v1/oauth/unlink/{provider}` - Unlink external account
- `GET /api/v1/oauth/external-logins` - Get linked external accounts

### Password Management (v1/password)
- `POST /api/v1/password/forgot` - Forgot password
- `POST /api/v1/password/reset` - Reset password
- `POST /api/v1/password/change` - Change password

### Profile Management (v1/profile)
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile` - Update user profile
- `POST /api/v1/profile/avatar` - Upload avatar
- `DELETE /api/v1/profile/avatar` - Remove avatar
- `POST /api/v1/profile/deactivate` - Deactivate account
- `POST /api/v1/profile/delete` - Delete account

### Security (v1/security)
- `POST /api/v1/security/2fa/enable` - Enable 2FA
- `POST /api/v1/security/2fa/disable` - Disable 2FA
- `GET /api/v1/security/2fa/status` - Get 2FA status
- `POST /api/v1/security/2fa/recovery-codes` - Generate recovery codes
- `POST /api/v1/security/2fa/verify` - Verify 2FA token
- `GET /api/v1/security/sessions` - Get active sessions
- `DELETE /api/v1/security/sessions/{id}` - Revoke session
- `DELETE /api/v1/security/sessions` - Revoke all sessions
- `GET /api/v1/security/logs` - Get security logs

## 📱 Angular Main App Integration

### Services Created
- `AuthService` - Authentication management
- `OAuthService` - OAuth provider integration
- `ProfileService` - User profile management
- `SecurityService` - Security features (2FA, sessions)

### Guards Created
- `AuthGuard` - Protect authenticated routes
- `GuestGuard` - Redirect authenticated users
- `RoleGuard` - Role-based access control

### Interceptors
- `AuthInterceptor` - Automatic token handling and refresh

### Usage Example
```typescript
// In component
constructor(private authService: AuthService) {}

async login() {
  try {
    await this.authService.login({
      email: 'user@example.com',
      password: 'password'
    }).toPromise();
    this.router.navigate(['/dashboard']);
  } catch (error) {
    console.error('Login failed:', error);
  }
}
```

### Route Protection
```typescript
// In routing module
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [AuthGuard]
},
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [RoleGuard] // Requires Admin/Moderator role
}
```

## ⚛️ React Dashboard Integration

### Services Created
- `ApiClient` - HTTP client with automatic token handling
- `AuthService` - Authentication management (singleton)

### Hooks Created
- `useAuth` - Authentication state management

### Components Created
- `LoginForm` - Login component
- `ProtectedRoute` - Route protection wrapper

### Usage Example
```tsx
// In component
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleLogin = async (formData) => {
    try {
      await login(formData);
      // Redirect handled automatically
    } catch (error) {
      // Error handled by hook
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

### Route Protection
```tsx
// In App.tsx
function App() {
  return (
    <ProtectedRoute requiredRoles={['Admin', 'Moderator']}>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

## 🔧 Configuration

### Environment Variables
Both apps are configured to use:
- API Base URL: `http://localhost:5000/api`
- Hub URL: `http://localhost:5000/hubs` (for SignalR)

### Token Storage
- Tokens stored in localStorage
- Automatic refresh on 401 responses
- Automatic cleanup on logout

### CORS Configuration
Backend is configured to accept requests from both frontend applications.

## 🚦 Getting Started

### 1. Start Backend
```bash
cd src/WebAPI
dotnet run
```
Backend will be available at `http://localhost:5000`

### 2. Start Angular Main App
```bash
cd ClientApp/Main
npm install
npm start
```
Main app will be available at `http://localhost:4200`

### 3. Start React Dashboard
```bash
cd ClientApp/Dashboard
npm install
npm run dev
```
Dashboard will be available at `http://localhost:5173`

## 🔐 Authentication Flow

1. User enters credentials
2. Frontend sends login request to backend
3. Backend validates and returns JWT + refresh token
4. Frontend stores tokens and user info
5. Subsequent requests include JWT in Authorization header
6. On token expiry, automatic refresh using refresh token
7. On refresh failure, redirect to login

## 🛡️ Security Features

- JWT with refresh tokens
- Automatic token refresh
- Role-based access control
- OAuth integration (Google, GitHub, Facebook)
- Two-factor authentication
- Session management
- Security logging

## 📝 Next Steps

1. Implement remaining auth components (register, forgot password, etc.)
2. Add OAuth provider configurations
3. Implement 2FA UI components
4. Add profile management pages
5. Create admin user management interfaces
6. Add localization support
7. Implement real-time notifications via SignalR

## 🐛 Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend CORS is configured for frontend URLs
2. **Token refresh loops**: Check token expiry handling
3. **Role access denied**: Verify user roles in JWT payload
4. **OAuth redirect issues**: Configure correct redirect URLs

### Debug Tips
- Check browser network tab for API calls
- Verify JWT token content at jwt.io
- Check browser localStorage for stored tokens
- Monitor backend logs for authentication errors