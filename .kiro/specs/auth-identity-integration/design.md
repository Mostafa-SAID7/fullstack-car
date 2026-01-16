# Design Document: Authentication & Identity Integration

## Overview

This design provides a comprehensive architecture for integrating and enhancing authentication and identity features across the backend API and both frontend applications (Dashboard and Main App) without code duplication. The design follows security best practices, ensures type safety, and maintains consistency across all layers.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Backend API                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Domain     │  │ Application  │  │    WebAPI    │     │
│  │  Identity    │→ │  Auth CQRS   │→ │ Auth         │     │
│  │  Entities    │  │  Commands    │  │ Controllers  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │   REST API + JWT     │
                    └─────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
┌──────────────────┐                      ┌──────────────────┐
│   Dashboard      │                      │    Main App      │
│   (React)        │                      │   (Angular)      │
│                  │                      │                  │
│  ┌────────────┐  │                      │  ┌────────────┐  │
│  │  Services  │  │                      │  │  Services  │  │
│  └────────────┘  │                      │  └────────────┘  │
│  ┌────────────┐  │                      │  ┌────────────┐  │
│  │  Context   │  │                      │  │   Guards   │  │
│  └────────────┘  │                      │  └────────────┘  │
│  ┌────────────┐  │                      │  ┌────────────┐  │
│  │ Components │  │                      │  │ Components │  │
│  └────────────┘  │                      │  └────────────┘  │
└──────────────────┘                      └──────────────────┘
```

### Layer Responsibilities

**Backend Layers:**
- **Domain**: User entities, roles, sessions, security logs
- **Application**: CQRS commands/queries, DTOs, auth business logic
- **Infrastructure**: Identity framework, JWT generation, OAuth providers
- **WebAPI**: Auth controllers, JWT middleware, OAuth endpoints

**Frontend Layers:**
- **Services**: API communication, token management
- **Context/State**: Authentication state management
- **Guards/Routes**: Route protection and authorization
- **Components**: Login, registration, profile forms

## Components and Interfaces

### Backend Components

#### 1. Domain Entities (Already Exist)

**ApplicationUser** (`src/Domain/Entities/Identity/ApplicationUser.cs`):
```csharp
public class ApplicationUser : BaseAuditableEntity
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public bool IsActive { get; set; }
    public bool IsEmailConfirmed { get; set; }
    public UserStatus Status { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? PhoneNumber { get; set; }
    public string? PreferredLanguage { get; set; }
    public DateTime? LastLoginAt { get; set; }
    
    // Navigation properties
    public ICollection<UserRole> UserRoles { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; }
    public ICollection<UserSession> Sessions { get; set; }
    public ICollection<SecurityLog> SecurityLogs { get; set; }
}
```

**RefreshToken** (`src/Domain/Entities/Identity/RefreshToken.cs`):
```csharp
public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }
    public string Token { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedByIp { get; set; }
    public DateTime? RevokedAt { get; set; }
    public string? RevokedByIp { get; set; }
    public string? ReplacedByToken { get; set; }
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt != null;
    public bool IsActive => !IsRevoked && !IsExpired;
    
    public ApplicationUser User { get; set; }
}
```

**UserSession** (`src/Domain/Entities/Identity/UserSession.cs`):
```csharp
public class UserSession : BaseEntity
{
    public Guid UserId { get; set; }
    public string DeviceName { get; set; }
    public string IpAddress { get; set; }
    public string UserAgent { get; set; }
    public bool IsActive { get; set; }
    public DateTime LastActivity { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public ApplicationUser User { get; set; }
}
```

**SecurityLog** (`src/Domain/Entities/Identity/SecurityLog.cs`):
```csharp
public class SecurityLog : BaseEntity
{
    public Guid UserId { get; set; }
    public string Action { get; set; }
    public string IpAddress { get; set; }
    public string UserAgent { get; set; }
    public DateTime Timestamp { get; set; }
    public bool Success { get; set; }
    public string? Details { get; set; }
    
    public ApplicationUser User { get; set; }
}
```

#### 2. Application Layer (CQRS)

**Commands:**
- `LoginCommand` - User login with credentials
- `RegisterCommand` - New user registration
- `LogoutCommand` - User logout
- `RefreshTokenCommand` - Refresh access token
- `ForgotPasswordCommand` - Request password reset
- `ResetPasswordCommand` - Reset password with token
- `ChangePasswordCommand` - Change password when authenticated
- `UpdateProfileCommand` - Update user profile
- `UploadProfileImageCommand` - Upload profile image
- `TerminateSessionCommand` - Terminate specific session
- `EnableMFACommand` - Enable multi-factor authentication
- `VerifyMFACommand` - Verify MFA code
- `OAuthLoginCommand` - Login with OAuth provider

**Queries:**
- `GetCurrentUserQuery` - Get current authenticated user
- `GetUserProfileQuery` - Get user profile details
- `GetUserSessionsQuery` - Get all user sessions
- `GetSecurityLogsQuery` - Get user security logs
- `GetMFAStatusQuery` - Get MFA configuration status

**DTOs:**
- `LoginRequest` - Login credentials
- `LoginResponse` - Login result with tokens
- `RegisterRequest` - Registration data
- `UserDto` - User information
- `ProfileDto` - User profile details
- `SessionDto` - Session information
- `SecurityLogDto` - Security log entry
- `TokenResponse` - JWT token response

#### 3. API Controllers (Already Exist)

**AuthenticationController** (`src/WebAPI/Controllers/Identity/Auth/AuthenticationController.cs`):
- POST `/api/v1/auth/login` - User login
- POST `/api/v1/auth/register` - User registration
- POST `/api/v1/auth/logout` - User logout
- POST `/api/v1/auth/refresh` - Refresh access token
- GET `/api/v1/auth/me` - Get current user

**PasswordController** (`src/WebAPI/Controllers/Identity/Password/PasswordController.cs`):
- POST `/api/v1/password/forgot` - Request password reset
- POST `/api/v1/password/reset` - Reset password
- POST `/api/v1/password/change` - Change password

**ProfileController** (`src/WebAPI/Controllers/Identity/Profile/ProfileController.cs`):
- GET `/api/v1/profile` - Get user profile
- PUT `/api/v1/profile` - Update user profile
- POST `/api/v1/profile/image` - Upload profile image

**SecurityController** (`src/WebAPI/Controllers/Identity/Security/SecurityController.cs`):
- GET `/api/v1/security/sessions` - Get active sessions
- DELETE `/api/v1/security/sessions/{id}` - Terminate session
- GET `/api/v1/security/logs` - Get security logs
- POST `/api/v1/security/mfa/enable` - Enable MFA
- POST `/api/v1/security/mfa/verify` - Verify MFA code

**OAuthController** (`src/WebAPI/Controllers/Identity/Auth/OAuthController.cs`):
- GET `/api/v1/oauth/{provider}` - Initiate OAuth flow
- GET `/api/v1/oauth/{provider}/callback` - OAuth callback
- POST `/api/v1/oauth/link` - Link OAuth account
- DELETE `/api/v1/oauth/{provider}` - Unlink OAuth account

### Shared Type Definitions

Location: Create a shared types package or document types for both frontends

**auth.types.ts** (Shared between Dashboard and Main):
```typescript
// User Status Enum
export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
  Pending = 'Pending'
}

// User Role Enum
export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Moderator = 'Moderator',
  ServiceProvider = 'ServiceProvider'
}

// User DTO
export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  isActive: boolean;
  isEmailConfirmed: boolean;
  status: UserStatus;
  profileImageUrl?: string;
  phoneNumber?: string;
  preferredLanguage?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Login Response
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserDto;
  expiresAt: string;
}

// Register Request
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

// Profile Update Request
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  preferredLanguage?: string;
}

// Password Change Request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Password Reset Request
export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Session DTO
export interface SessionDto {
  id: string;
  userId: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
}

// Security Log DTO
export interface SecurityLogDto {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  details?: string;
}

// OAuth Provider
export type OAuthProvider = 'google' | 'facebook' | 'microsoft' | 'github';

// OAuth Link Request
export interface OAuthLinkRequest {
  provider: OAuthProvider;
  code: string;
}

// MFA Setup Response
export interface MFASetupResponse {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

// MFA Verify Request
export interface MFAVerifyRequest {
  code: string;
}
```

### Dashboard Frontend Components

#### 1. Authentication Service

**AuthService** (Enhanced `ClientApp/Dashboard/src/services/auth/core.ts`):
```typescript
import { BaseApiService } from '../api/base-api.service';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserDto
} from '../../types/auth';

export class AuthService extends BaseApiService {
  private readonly endpoint = '/v1/auth';

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>(`${this.endpoint}/login`, request);
    
    // Store tokens
    this.storeTokens(response.token, response.refreshToken);
    
    return response;
  }

  async register(request: RegisterRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>(`${this.endpoint}/register`, request);
  }

  async logout(): Promise<void> {
    await this.post<void>(`${this.endpoint}/logout`, {});
    this.clearTokens();
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    return this.post<LoginResponse>(`${this.endpoint}/refresh`, { refreshToken });
  }

  async getCurrentUser(): Promise<UserDto> {
    return this.get<UserDto>(`${this.endpoint}/me`);
  }

  private storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export const authService = new AuthService();
```

**ProfileService** (`ClientApp/Dashboard/src/services/auth/profile.ts`):
```typescript
export class ProfileService extends BaseApiService {
  private readonly endpoint = '/v1/profile';

  async getProfile(): Promise<ProfileDto> {
    return this.get<ProfileDto>(this.endpoint);
  }

  async updateProfile(request: UpdateProfileRequest): Promise<ProfileDto> {
    return this.put<ProfileDto>(this.endpoint, request);
  }

  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.post<{ imageUrl: string }>(`${this.endpoint}/image`, formData);
  }
}

export const profileService = new ProfileService();
```

**SecurityService** (`ClientApp/Dashboard/src/services/auth/security.ts`):
```typescript
export class SecurityService extends BaseApiService {
  private readonly endpoint = '/v1/security';

  async getSessions(): Promise<SessionDto[]> {
    return this.get<SessionDto[]>(`${this.endpoint}/sessions`);
  }

  async terminateSession(sessionId: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/sessions/${sessionId}`);
  }

  async getSecurityLogs(page: number = 1, pageSize: number = 20): Promise<PagedResult<SecurityLogDto>> {
    return this.get<PagedResult<SecurityLogDto>>(`${this.endpoint}/logs`, {
      params: { page, pageSize }
    });
  }

  async enableMFA(): Promise<MFASetupResponse> {
    return this.post<MFASetupResponse>(`${this.endpoint}/mfa/enable`, {});
  }

  async verifyMFA(request: MFAVerifyRequest): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`${this.endpoint}/mfa/verify`, request);
  }
}

export const securityService = new SecurityService();
```

#### 2. Authentication Context

**AuthContext** (Enhanced `ClientApp/Dashboard/src/contexts/auth/index.tsx`):
```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../../services/auth';
import type { UserDto, LoginRequest, LoginResponse } from '../../types/auth';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (user: Partial<UserDto>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          await logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await authService.login(credentials);
    setUser(response.user);
    setToken(response.token);
    return response;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();
      setToken(response.token);
      return true;
    } catch (error) {
      await logout();
      return false;
    }
  }, [logout]);

  const updateUser = useCallback((updatedUser: Partial<UserDto>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshToken,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### 3. Protected Route Component

**ProtectedRoute** (`ClientApp/Dashboard/src/components/auth/ProtectedRoute.tsx`):
```typescript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && user) {
    const hasRequiredRole = requiredRoles.some(role => 
      user.roles.includes(role as any)
    );
    
    if (!hasRequiredRole) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <>{children}</>;
};
```

### Main App (Angular) Components

#### 1. Authentication Service

**AuthService** (`ClientApp/Main/src/app/core/services/auth.service.ts`):
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type { LoginRequest, LoginResponse, UserDto } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/v1/auth`;
  private userSubject = new BehaviorSubject<UserDto | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public user$ = this.userSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  get user(): UserDto | null {
    return this.userSubject.value;
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.user && !!this.token;
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.tokenSubject.next(token);
      this.getCurrentUser().subscribe();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.storeTokens(response.token, response.refreshToken);
        this.userSubject.next(response.user);
        this.tokenSubject.next(response.token);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearTokens();
        this.userSubject.next(null);
        this.tokenSubject.next(null);
      })
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(response => {
        this.storeTokens(response.token, response.refreshToken);
        this.tokenSubject.next(response.token);
      })
    );
  }

  getCurrentUser(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/me`).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  private storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}
```

#### 2. Auth Guard

**AuthGuard** (`ClientApp/Main/src/app/core/guards/auth.guard.ts`):
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    // Check for required roles
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles) {
      const user = authService.user;
      const hasRole = requiredRoles.some(role => user?.roles.includes(role as any));
      
      if (!hasRole) {
        router.navigate(['/forbidden']);
        return false;
      }
    }
    
    return true;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
```

## Data Models

### Authentication Flow

```
User → Login Form → AuthService → Backend API → JWT Token
                                                    ↓
                                            Store in localStorage
                                                    ↓
                                            Update Auth Context
                                                    ↓
                                            Redirect to Dashboard
```

### Token Refresh Flow

```
API Request → 401 Error → Interceptor → Refresh Token API
                                              ↓
                                        New Access Token
                                              ↓
                                        Retry Original Request
```

## Error Handling

### Backend Error Responses

```json
{
  "succeeded": false,
  "errors": ["Invalid email or password"],
  "message": "Authentication failed"
}
```

### Frontend Error Handling

**Dashboard:**
```typescript
try {
  await authService.login(credentials);
  navigate('/dashboard');
} catch (error) {
  if (error instanceof ApiError) {
    setError(error.message);
  } else {
    setError('An unexpected error occurred');
  }
}
```

**Main App:**
```typescript
this.authService.login(credentials).pipe(
  catchError(error => {
    this.errorService.handleError(error);
    return throwError(() => error);
  })
).subscribe();
```

## Security Considerations

1. **JWT Security**: Short-lived access tokens (15 min), long-lived refresh tokens (7 days)
2. **Token Storage**: Secure storage in localStorage with httpOnly cookie option for refresh tokens
3. **Password Hashing**: Bcrypt with salt rounds >= 12
4. **Rate Limiting**: Max 5 login attempts per 15 minutes per IP
5. **CSRF Protection**: Anti-forgery tokens for state-changing operations
6. **XSS Protection**: Content Security Policy headers
7. **SQL Injection**: Parameterized queries via EF Core
8. **HTTPS Only**: All authentication endpoints require HTTPS

## Performance Considerations

### Caching Strategy

**User Profile:**
- Cache TTL: 5 minutes
- Invalidate on profile update

**Permissions:**
- Cache TTL: 10 minutes
- Invalidate on role change

### Optimization Techniques

1. **Token Validation**: Cache decoded JWT for request duration
2. **User Lookup**: Cache user data in memory
3. **Session Management**: Use Redis for distributed sessions
4. **OAuth**: Cache provider metadata

## Testing Strategy

### Backend Testing
- Unit tests for auth services
- Integration tests for auth endpoints
- Security tests for vulnerabilities

### Frontend Testing
- Unit tests for auth services
- Component tests for login/register forms
- E2E tests for auth flows

## Deployment Strategy

### Backend Deployment
1. Deploy database migrations
2. Deploy API changes
3. Configure JWT settings
4. Configure OAuth providers
5. Test authentication endpoints

### Frontend Deployment
1. Build Dashboard with auth features
2. Build Main App with auth features
3. Deploy to hosting
4. Verify auth flows
5. Test token refresh

## Monitoring and Logging

### Backend Monitoring
- Login success/failure rates
- Token refresh rates
- Session duration
- Security log events

### Frontend Monitoring
- Auth errors
- Token refresh failures
- Login page load times
- User session duration

## Documentation

### API Documentation
- Swagger/OpenAPI for auth endpoints
- Authentication flow diagrams
- Error code reference

### Frontend Documentation
- Auth service usage examples
- Protected route setup
- Token management guide

## Conclusion

This design provides a comprehensive, secure, and maintainable authentication system that:
- Eliminates code duplication between frontends
- Follows security best practices
- Provides type safety throughout
- Supports modern auth features (OAuth, MFA, sessions)
- Enables easy testing and monitoring
