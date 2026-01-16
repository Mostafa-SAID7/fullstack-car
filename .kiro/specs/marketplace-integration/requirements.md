# Requirements Document: Marketplace Integration

## Introduction

This specification defines the complete integration of marketplace features (Products and Services) across the backend API and both frontend applications (Dashboard - React and Main - Angular) without creating duplicate code.

## Glossary

- **Backend**: The .NET Core API (src/WebAPI, src/Application, src/Domain, src/Infrastructure)
- **Dashboard**: The React-based admin dashboard (ClientApp/Dashboard)
- **Main_App**: The Angular-based user-facing application (ClientApp/Main)
- **Product**: Physical or digital items sold in the marketplace
- **Service**: Car-related services offered by service providers
- **Service_Provider**: Business entity offering services
- **Marketplace_API**: Backend API endpoints for marketplace operations
- **Shared_Types**: TypeScript interfaces matching backend DTOs
- **API_Service**: Frontend service layer for API communication

## Requirements

### Requirement 1: Backend API Completeness

**User Story:** As a developer, I want complete backend API endpoints for Products and Services, so that both frontend applications can consume them without duplication.

#### Acceptance Criteria

1. THE Backend SHALL provide RESTful endpoints for all Product CRUD operations at `/api/v3/marketplace/products`
2. THE Backend SHALL provide RESTful endpoints for all Service CRUD operations at `/api/v6/marketplace/services`
3. THE Backend SHALL provide filtering, pagination, and search capabilities for both Products and Services
4. THE Backend SHALL provide statistics and analytics endpoints for Products and Services
5. THE Backend SHALL provide consistent response formats across all marketplace endpoints
6. THE Backend SHALL include proper authentication and authorization for all endpoints
7. THE Backend SHALL validate all input data using DTOs and validation rules

### Requirement 2: Shared Type Definitions

**User Story:** As a frontend developer, I want TypeScript interfaces that exactly match backend DTOs, so that I have type safety and consistency across both frontend applications.

#### Acceptance Criteria

1. THE System SHALL define shared TypeScript interfaces for Product entities matching backend DTOs
2. THE System SHALL define shared TypeScript interfaces for Service entities matching backend DTOs
3. THE System SHALL define shared TypeScript interfaces for ServiceProvider entities matching backend DTOs
4. THE System SHALL define shared TypeScript interfaces for all request and response DTOs
5. THE System SHALL define shared TypeScript enums matching backend enums (ProductStatus, ProductCategory, ServiceType, ServiceStatus)
6. THE Shared_Types SHALL be located in a common location accessible to both Dashboard and Main_App
7. THE Shared_Types SHALL include JSDoc comments describing each field

### Requirement 3: Dashboard API Services

**User Story:** As a Dashboard developer, I want API service classes for Products and Services, so that I can easily interact with the backend without duplicating code.

#### Acceptance Criteria

1. THE Dashboard SHALL have a ProductApiService class that wraps all Product API endpoints
2. THE Dashboard SHALL have a ServiceApiService class that wraps all Service API endpoints
3. THE Dashboard SHALL have a ServiceProviderApiService class for service provider operations
4. THE API_Service classes SHALL use the shared BaseApiService for common functionality
5. THE API_Service classes SHALL handle caching using the CacheService
6. THE API_Service classes SHALL handle errors consistently
7. THE API_Service classes SHALL return typed responses using shared type definitions

### Requirement 4: Main App API Services

**User Story:** As a Main App developer, I want Angular services for Products and Services, so that I can display marketplace data to end users.

#### Acceptance Criteria

1. THE Main_App SHALL have a ProductService (Angular) that wraps all Product API endpoints
2. THE Main_App SHALL have a ServiceService (Angular) that wraps all Service API endpoints
3. THE Main_App SHALL have a ServiceProviderService (Angular) for service provider operations
4. THE Angular services SHALL use HttpClient for API communication
5. THE Angular services SHALL use RxJS Observables for async operations
6. THE Angular services SHALL handle errors using Angular error interceptors
7. THE Angular services SHALL use shared TypeScript interfaces for type safety

### Requirement 5: Dashboard Management Pages

**User Story:** As an admin, I want comprehensive management pages for Products and Services in the Dashboard, so that I can manage the marketplace effectively.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a Products management page with list, create, edit, and delete functionality
2. THE Dashboard SHALL provide a Services management page with list, create, edit, and delete functionality
3. THE Dashboard SHALL provide a Service Providers management page
4. THE Dashboard SHALL provide analytics and statistics views for Products and Services
5. THE Dashboard SHALL provide bulk operations for Products and Services
6. THE Dashboard SHALL provide filtering, sorting, and search capabilities
7. THE Dashboard SHALL provide responsive design for mobile and desktop
8. THE Dashboard SHALL use the ResponsiveTable component for data display
9. THE Dashboard SHALL use the ResponsiveTabs component for navigation

### Requirement 6: Main App Display Pages

**User Story:** As an end user, I want to browse and view Products and Services in the Main App, so that I can find what I need.

#### Acceptance Criteria

1. THE Main_App SHALL provide a Products listing page with filtering and search
2. THE Main_App SHALL provide a Product detail page showing full product information
3. THE Main_App SHALL provide a Services listing page with filtering and search
4. THE Main_App SHALL provide a Service detail page showing full service information
5. THE Main_App SHALL provide a Service Providers listing page
6. THE Main_App SHALL provide location-based service search functionality
7. THE Main_App SHALL provide responsive design for mobile and desktop
8. THE Main_App SHALL display product images with lazy loading
9. THE Main_App SHALL display service ratings and reviews

### Requirement 7: No Code Duplication

**User Story:** As a developer, I want to avoid code duplication between Dashboard and Main App, so that maintenance is easier and consistency is maintained.

#### Acceptance Criteria

1. THE System SHALL NOT duplicate TypeScript interface definitions between Dashboard and Main_App
2. THE System SHALL NOT duplicate API endpoint URLs between Dashboard and Main_App
3. THE System SHALL NOT duplicate business logic between Dashboard and Main_App
4. THE System SHALL use shared configuration files for API endpoints
5. THE System SHALL use shared utility functions where applicable
6. THE System SHALL document any intentional differences between Dashboard and Main_App implementations

### Requirement 8: API Integration Consistency

**User Story:** As a developer, I want consistent API integration patterns across both frontend applications, so that the codebase is maintainable.

#### Acceptance Criteria

1. THE Dashboard SHALL use the established service → hook → component pattern
2. THE Main_App SHALL use the established service → component pattern
3. BOTH applications SHALL use the same API endpoint paths
4. BOTH applications SHALL handle API errors consistently
5. BOTH applications SHALL use the same authentication token mechanism
6. BOTH applications SHALL implement request caching where appropriate
7. BOTH applications SHALL implement loading states for async operations

### Requirement 9: Real-time Updates

**User Story:** As an admin, I want real-time updates when marketplace data changes, so that I always see current information.

#### Acceptance Criteria

1. THE Dashboard SHALL subscribe to SignalR events for Product changes
2. THE Dashboard SHALL subscribe to SignalR events for Service changes
3. THE Dashboard SHALL automatically refresh data when receiving real-time updates
4. THE Main_App SHALL subscribe to SignalR events for marketplace updates
5. THE SignalR events SHALL include ProductCreated, ProductUpdated, ProductDeleted
6. THE SignalR events SHALL include ServiceCreated, ServiceUpdated, ServiceDeleted
7. THE System SHALL invalidate cache when receiving real-time updates

### Requirement 10: Performance Optimization

**User Story:** As a user, I want fast loading marketplace pages, so that I have a good user experience.

#### Acceptance Criteria

1. THE Dashboard SHALL implement virtual scrolling for large product/service lists
2. THE Dashboard SHALL implement lazy loading for images
3. THE Dashboard SHALL implement pagination with configurable page sizes
4. THE Main_App SHALL implement lazy loading for product/service images
5. THE Main_App SHALL implement infinite scroll for product/service listings
6. THE System SHALL cache frequently accessed data
7. THE System SHALL prefetch data for likely next actions

### Requirement 11: Search and Filtering

**User Story:** As a user, I want to search and filter Products and Services, so that I can find what I need quickly.

#### Acceptance Criteria

1. THE Dashboard SHALL provide full-text search for Products
2. THE Dashboard SHALL provide full-text search for Services
3. THE Dashboard SHALL provide filtering by category, status, price range, and other attributes
4. THE Main_App SHALL provide full-text search for Products
5. THE Main_App SHALL provide full-text search for Services
6. THE Main_App SHALL provide filtering by category, price range, rating, and location
7. THE Search functionality SHALL return results within 500ms for typical queries

### Requirement 12: Data Validation

**User Story:** As a developer, I want consistent data validation across frontend and backend, so that invalid data is caught early.

#### Acceptance Criteria

1. THE Backend SHALL validate all Product data using FluentValidation
2. THE Backend SHALL validate all Service data using FluentValidation
3. THE Dashboard SHALL validate Product data before submission using Zod schemas
4. THE Dashboard SHALL validate Service data before submission using Zod schemas
5. THE Main_App SHALL validate form inputs using Angular validators
6. THE Validation rules SHALL be consistent between frontend and backend
7. THE System SHALL provide clear validation error messages to users

### Requirement 13: Image Management

**User Story:** As an admin, I want to upload and manage images for Products and Services, so that they are displayed attractively.

#### Acceptance Criteria

1. THE Dashboard SHALL provide image upload functionality for Products
2. THE Dashboard SHALL provide image upload functionality for Services
3. THE Dashboard SHALL support multiple images per Product
4. THE Dashboard SHALL support multiple images per Service
5. THE System SHALL validate image file types and sizes
6. THE System SHALL optimize images for web display
7. THE System SHALL provide image preview before upload

### Requirement 14: Analytics and Reporting

**User Story:** As an admin, I want analytics and reports for Products and Services, so that I can make informed business decisions.

#### Acceptance Criteria

1. THE Dashboard SHALL display total product count, sales, and revenue
2. THE Dashboard SHALL display total service count, bookings, and revenue
3. THE Dashboard SHALL display top-selling products
4. THE Dashboard SHALL display most popular services
5. THE Dashboard SHALL display product inventory alerts
6. THE Dashboard SHALL display service booking trends
7. THE Dashboard SHALL allow exporting analytics data to CSV/Excel

### Requirement 15: Integration Testing

**User Story:** As a developer, I want to verify that marketplace integration works correctly across all systems, so that I can deploy with confidence.

#### Acceptance Criteria

1. THE System SHALL verify that Dashboard can create Products via API
2. THE System SHALL verify that Dashboard can update Products via API
3. THE System SHALL verify that Dashboard can delete Products via API
4. THE System SHALL verify that Main_App can retrieve Products via API
5. THE System SHALL verify that Dashboard can create Services via API
6. THE System SHALL verify that Main_App can retrieve Services via API
7. THE System SHALL verify that real-time updates work for marketplace changes
8. THE System SHALL verify that caching works correctly for marketplace data
9. THE System SHALL verify that search and filtering work correctly
10. THE System SHALL verify that pagination works correctly

## Success Criteria

✅ Backend API provides complete CRUD operations for Products and Services
✅ Shared TypeScript types exist and are used by both frontend applications
✅ Dashboard has complete management pages for Products and Services
✅ Main App has complete display pages for Products and Services
✅ No code duplication between Dashboard and Main App
✅ Real-time updates work via SignalR
✅ Performance is optimized with caching and lazy loading
✅ Search and filtering work correctly
✅ All TypeScript diagnostics pass with no errors
✅ Integration testing confirms all functionality works end-to-end

## Notes

- Focus on implementation and integration, not test files
- Reuse existing components and patterns where possible
- Maintain consistency with existing community features implementation
- Ensure type safety throughout the stack
- Document any API changes or additions needed
