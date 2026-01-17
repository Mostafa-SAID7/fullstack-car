# Requirements Document: Community Platform Integration

## Introduction

This specification defines the integration and consolidation of the community platform features across backend API and both frontend applications (Dashboard - React and Main - Angular). The goal is to review existing implementations, eliminate duplicates, split long files into manageable modules, and ensure proper integration without creating new duplicate code.

## Glossary

- **Backend**: The .NET Core API (src/WebAPI, src/Application, src/Domain, src/Infrastructure)
- **Dashboard**: The React-based admin dashboard (ClientApp/Dashboard)
- **Main_App**: The Angular-based user-facing application (ClientApp/Main)
- **Community_Features**: Posts, Groups, QA, Reviews, Social, News, Pages, Maps, Guides
- **File_Splitting**: Breaking large files (>300 lines) into smaller, focused modules
- **No_Duplication**: Ensuring single source of truth for each feature

## Requirements

### Requirement 1: Backend API Review and Consolidation

**User Story:** As a developer, I want to review existing backend community controllers and services to identify what exists, what's missing, and what needs consolidation.

#### Acceptance Criteria

1. THE System SHALL review all existing community entities in Domain layer
2. THE System SHALL identify missing controllers for community features
3. THE System SHALL identify long service files (>300 lines) that need splitting
4. THE System SHALL create controllers only for features without existing implementations
5. THE System SHALL split large service files into focused, single-responsibility modules
6. THE System SHALL ensure consistent API patterns across all community endpoints
7. THE System SHALL document existing vs new implementations

### Requirement 2: Frontend Type Consolidation

**User Story:** As a frontend developer, I want consolidated TypeScript types for community features that match backend DTOs exactly.

#### Acceptance Criteria

1. THE System SHALL review existing community types in both frontends
2. THE System SHALL identify duplicate type definitions
3. THE System SHALL consolidate types into single files per feature area
4. THE System SHALL ensure types match backend DTOs exactly
5. THE System SHALL split large type files (>200 lines) into feature-specific modules
6. THE System SHALL use consistent naming conventions
7. THE System SHALL add JSDoc comments for all types

### Requirement 3: Service Layer Review

**User Story:** As a developer, I want to review existing service implementations to avoid creating duplicates.

#### Acceptance Criteria

1. THE System SHALL list all existing Dashboard services for community features
2. THE System SHALL list all existing Main App services for community features
3. THE System SHALL identify duplicate service logic across applications
4. THE System SHALL identify services that need enhancement vs creation
5. THE System SHALL split large service files into feature-specific modules
6. THE System SHALL ensure services follow single responsibility principle
7. THE System SHALL document which services exist and which need creation

### Requirement 4: File Size Management

**User Story:** As a developer, I want manageable file sizes to improve code maintainability and readability.

#### Acceptance Criteria

1. THE System SHALL identify files exceeding 300 lines
2. THE System SHALL split large files into logical modules
3. THE System SHALL maintain clear separation of concerns
4. THE System SHALL use index files for clean exports
5. THE System SHALL ensure split files have focused responsibilities
6. THE System SHALL maintain backward compatibility during splits
7. THE System SHALL document file organization structure

### Requirement 5: No Code Duplication

**User Story:** As a developer, I want to ensure no duplicate implementations exist across the codebase.

#### Acceptance Criteria

1. THE System SHALL identify duplicate type definitions
2. THE System SHALL identify duplicate service implementations
3. THE System SHALL identify duplicate utility functions
4. THE System SHALL consolidate duplicates into shared modules
5. THE System SHALL ensure single source of truth for each feature
6. THE System SHALL document removed duplicates
7. THE System SHALL verify no functional regressions after consolidation

## Success Criteria

✅ All existing community implementations reviewed and documented
✅ No duplicate code between Dashboard and Main App
✅ All files under 300 lines (split if necessary)
✅ Clear separation of concerns in all modules
✅ Consistent API patterns across all endpoints
✅ Type safety maintained throughout
✅ All TypeScript diagnostics pass with no errors

## Notes

- **Review First**: Always check existing implementations before creating new files
- **Split Long Files**: Break files >300 lines into focused modules
- **No Duplicates**: Consolidate any duplicate code found
- **Enhance Existing**: Prefer enhancing existing code over creating new files
- **Document Changes**: Track what was reviewed, split, or consolidated
