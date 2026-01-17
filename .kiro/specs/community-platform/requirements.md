# Community Platform - Requirements Specification (Review-First Approach)

## Introduction

A comprehensive social community platform integration that **reviews existing implementations first**, eliminates duplicates, splits long files into manageable modules, and enhances existing code rather than recreating it. This specification focuses on consolidating community features across backend and both frontend applications.

## Glossary

- **Review_First**: Always check existing implementations before creating new files
- **No_Duplicates**: Single source of truth for each feature across applications
- **File_Splitting**: Breaking files exceeding size limits into focused modules
- **Enhancement_Over_Creation**: Prefer improving existing code over writing new code
- **Size_Limits**: Backend <300 lines, Types <200 lines, Services <250 lines
- **Community_Platform**: Social networking system with posts, groups, QA, reviews, social connections
- **Existing_Infrastructure**: Extensive backend entities already in Domain layer
- **Frontend_Consolidation**: Merging duplicate implementations in Dashboard and Main App

## Requirements

### Requirement 1: Existing Implementation Review

**User Story:** As a developer, I want to review all existing community implementations before making changes, so that I avoid creating duplicate code.

#### Acceptance Criteria

1. THE System SHALL review all existing controllers in `src/WebAPI/Controllers/Community/`
2. THE System SHALL review all existing services in `src/Application/Features/Community/`
3. THE System SHALL review all existing entities in `src/Domain/Entities/Community/`
4. THE System SHALL review Dashboard types in `ClientApp/Dashboard/src/types/community/`
5. THE System SHALL review Dashboard services in `ClientApp/Dashboard/src/services/`
6. THE System SHALL review Main App models in `ClientApp/Main/src/app/core/models/`
7. THE System SHALL review Main App services in `ClientApp/Main/src/app/core/services/`
8. THE System SHALL document what exists vs what needs creation
9. THE System SHALL identify all duplicate implementations
10. THE System SHALL flag all files exceeding size limits

### Requirement 2: File Size Management

**User Story:** As a developer, I want all files to be under size limits, so that code is maintainable and readable.

#### Acceptance Criteria

1. THE System SHALL ensure backend controller files are <300 lines
2. THE System SHALL ensure backend service files are <300 lines
3. THE System SHALL ensure frontend type files are <200 lines
4. THE System SHALL ensure frontend service files are <250 lines
5. THE System SHALL split any file exceeding limits into focused modules
6. THE System SHALL use index files for clean exports after splitting
7. THE System SHALL maintain single responsibility principle in split files
8. THE System SHALL document file organization structure
9. THE System SHALL ensure split files have clear, focused purposes
10. THE System SHALL maintain backward compatibility during splits

### Requirement 3: Duplicate Elimination

**User Story:** As a developer, I want to eliminate all duplicate code, so that maintenance is easier and consistency is maintained.

#### Acceptance Criteria

1. THE System SHALL identify duplicate type definitions across Dashboard and Main App
2. THE System SHALL identify duplicate service implementations
3. THE System SHALL identify duplicate utility functions
4. THE System SHALL consolidate duplicates into single source of truth
5. THE System SHALL remove duplicate files after consolidation
6. THE System SHALL update all imports to use consolidated code
7. THE System SHALL verify no functional regressions after consolidation
8. THE System SHALL document all removed duplicates
9. THE System SHALL ensure types match backend DTOs exactly
10. THE System SHALL maintain consistent naming conventions

### Requirement 4: Backend API Enhancement (Not Recreation)

**User Story:** As a developer, I want to enhance existing backend APIs rather than recreate them, so that I leverage existing infrastructure.

#### Acceptance Criteria

1. THE System SHALL check if controllers exist before creating new ones
2. THE System SHALL enhance existing controllers with missing endpoints
3. THE System SHALL split large controller files into focused controllers
4. THE System SHALL ensure consistent API patterns across endpoints
5. THE System SHALL use existing services where available
6. THE System SHALL enhance existing services with missing methods
7. THE System SHALL split large service files into focused services
8. THE System SHALL maintain existing endpoint contracts
9. THE System SHALL add proper authorization to all endpoints
10. THE System SHALL document enhanced vs newly created endpoints

### Requirement 5: Frontend Type Consolidation

**User Story:** As a frontend developer, I want consolidated types that match backend DTOs exactly, so that I have type safety without duplication.

#### Acceptance Criteria

1. THE System SHALL review existing community types in both frontends
2. THE System SHALL identify and remove duplicate type definitions
3. THE System SHALL ensure types match backend DTOs exactly
4. THE System SHALL split large type files (>200 lines) into modules
5. THE System SHALL use consistent naming conventions
6. THE System SHALL add JSDoc comments to all types
7. THE System SHALL create index files for clean exports
8. THE System SHALL update all imports after consolidation
9. THE System SHALL verify TypeScript diagnostics pass
10. THE System SHALL document type organization structure

### Requirement 6: Frontend Service Consolidation

**User Story:** As a frontend developer, I want consolidated services without duplication, so that API integration is consistent and maintainable.

#### Acceptance Criteria

1. THE System SHALL review existing community services in both frontends
2. THE System SHALL identify and remove duplicate service implementations
3. THE System SHALL enhance existing services with missing methods
4. THE System SHALL split large service files (>250 lines) into modules
5. THE System SHALL use httpClient (Dashboard) or HttpClient (Main App)
6. THE System SHALL maintain consistent error handling patterns
7. THE System SHALL create index files for clean exports
8. THE System SHALL update all service consumers after consolidation
9. THE System SHALL verify no functional regressions
10. THE System SHALL document service organization structure

### Requirement 7: Posts and Comments Feature

**User Story:** As a user, I want to create and interact with posts, so that I can share content and engage with the community.

#### Acceptance Criteria

1. THE System SHALL review existing Post and Comment entities (already exist in Domain)
2. THE System SHALL create PostsController only if it doesn't exist
3. THE System SHALL ensure PostsController is <300 lines (split if needed)
4. THE System SHALL create Dashboard posts types matching backend DTOs
5. THE System SHALL ensure Dashboard posts types are <200 lines per file
6. THE System SHALL create Main App posts models matching backend DTOs
7. THE System SHALL ensure Main App posts models are <200 lines per file
8. THE System SHALL create/enhance posts services in both frontends
9. THE System SHALL ensure posts services are <250 lines per file
10. THE System SHALL support CRUD operations, likes, comments, and sharing

### Requirement 8: Groups Feature

**User Story:** As a user, I want to create and join groups, so that I can engage in focused community discussions.

#### Acceptance Criteria

1. THE System SHALL review existing Group and GroupMember entities (already exist)
2. THE System SHALL create GroupsController only if it doesn't exist
3. THE System SHALL ensure GroupsController is <300 lines (split if needed)
4. THE System SHALL create Dashboard groups types matching backend DTOs
5. THE System SHALL ensure Dashboard groups types are <200 lines per file
6. THE System SHALL create Main App groups models matching backend DTOs
7. THE System SHALL ensure Main App groups models are <200 lines per file
8. THE System SHALL create/enhance groups services in both frontends
9. THE System SHALL ensure groups services are <250 lines per file
10. THE System SHALL support group management, membership, and moderation

### Requirement 9: QA System Feature

**User Story:** As a user, I want to ask questions and provide answers, so that I can share knowledge with the community.

#### Acceptance Criteria

1. THE System SHALL review existing QA entities (Question, Answer, QAExpert, etc. - already exist)
2. THE System SHALL create QAController only if it doesn't exist
3. THE System SHALL ensure QAController is <300 lines (split Questions/Answers if needed)
4. THE System SHALL create Dashboard QA types matching backend DTOs
5. THE System SHALL ensure Dashboard QA types are <200 lines per file
6. THE System SHALL create Main App QA models matching backend DTOs
7. THE System SHALL ensure Main App QA models are <200 lines per file
8. THE System SHALL create/enhance QA services in both frontends
9. THE System SHALL ensure QA services are <250 lines per file
10. THE System SHALL support questions, answers, voting, and reputation

### Requirement 10: Social Connections Feature

**User Story:** As a user, I want to connect with friends and build my network, so that I can stay connected with people I know.

#### Acceptance Criteria

1. THE System SHALL review existing Social entities (UserProfile, UserFriend, UserConnection - already exist)
2. THE System SHALL create SocialController only if it doesn't exist
3. THE System SHALL ensure SocialController is <300 lines (split if needed)
4. THE System SHALL create Dashboard social types matching backend DTOs
5. THE System SHALL ensure Dashboard social types are <200 lines per file
6. THE System SHALL create Main App social models matching backend DTOs
7. THE System SHALL ensure Main App social models are <200 lines per file
8. THE System SHALL create/enhance social services in both frontends
9. THE System SHALL ensure social services are <250 lines per file
10. THE System SHALL support profiles, friendships, and connections

### Requirement 11: Reviews Feature

**User Story:** As a user, I want to review and rate content, so that I can help others make informed decisions.

#### Acceptance Criteria

1. THE System SHALL review existing Review entities (Review, CommunityReview, ReviewComment - already exist)
2. THE System SHALL create ReviewsController only if it doesn't exist
3. THE System SHALL ensure ReviewsController is <300 lines (split if needed)
4. THE System SHALL create Dashboard reviews types matching backend DTOs
5. THE System SHALL ensure Dashboard reviews types are <200 lines per file
6. THE System SHALL create Main App reviews models matching backend DTOs
7. THE System SHALL ensure Main App reviews models are <200 lines per file
8. THE System SHALL create/enhance reviews services in both frontends
9. THE System SHALL ensure reviews services are <250 lines per file
10. THE System SHALL support reviews, ratings, comments, and helpfulness

### Requirement 12: News and Articles Feature

**User Story:** As a user, I want to read and share news articles, so that I can stay informed about topics I care about.

#### Acceptance Criteria

1. THE System SHALL review existing News entities (Article, NewsCategory, NewsComment - already exist)
2. THE System SHALL create NewsController only if it doesn't exist
3. THE System SHALL ensure NewsController is <300 lines (split if needed)
4. THE System SHALL create Dashboard news types matching backend DTOs
5. THE System SHALL ensure Dashboard news types are <200 lines per file
6. THE System SHALL create Main App news models matching backend DTOs
7. THE System SHALL ensure Main App news models are <200 lines per file
8. THE System SHALL create/enhance news services in both frontends
9. THE System SHALL ensure news services are <250 lines per file
10. THE System SHALL support articles, categories, comments, and sharing

### Requirement 13: Pages Feature

**User Story:** As a user, I want to create and edit community pages, so that I can build collaborative knowledge bases.

#### Acceptance Criteria

1. THE System SHALL review existing Page entities (Page, PageContent, PageComment - already exist)
2. THE System SHALL create PagesController only if it doesn't exist
3. THE System SHALL ensure PagesController is <300 lines (split if needed)
4. THE System SHALL create Dashboard pages types matching backend DTOs
5. THE System SHALL ensure Dashboard pages types are <200 lines per file
6. THE System SHALL create Main App pages models matching backend DTOs
7. THE System SHALL ensure Main App pages models are <200 lines per file
8. THE System SHALL create/enhance pages services in both frontends
9. THE System SHALL ensure pages services are <250 lines per file
10. THE System SHALL support page creation, editing, revisions, and comments

### Requirement 14: Maps and Locations Feature

**User Story:** As a user, I want to share and discover location-based content, so that I can connect with my local community.

#### Acceptance Criteria

1. THE System SHALL review existing Maps entities (Location, CheckIn, PlaceReview - already exist)
2. THE System SHALL create MapsController only if it doesn't exist
3. THE System SHALL ensure MapsController is <300 lines (split if needed)
4. THE System SHALL create Dashboard maps types matching backend DTOs
5. THE System SHALL ensure Dashboard maps types are <200 lines per file
6. THE System SHALL create Main App maps models matching backend DTOs
7. THE System SHALL ensure Main App maps models are <200 lines per file
8. THE System SHALL create/enhance maps services in both frontends
9. THE System SHALL ensure maps services are <250 lines per file
10. THE System SHALL support locations, check-ins, reviews, and discovery

### Requirement 15: Guides Feature

**User Story:** As a user, I want to create and follow step-by-step guides, so that I can learn and share knowledge.

#### Acceptance Criteria

1. THE System SHALL review existing Guide entities (Guide, GuideStep, GuideBookmark - already exist)
2. THE System SHALL create GuidesController only if it doesn't exist
3. THE System SHALL ensure GuidesController is <300 lines (split if needed)
4. THE System SHALL create Dashboard guides types matching backend DTOs
5. THE System SHALL ensure Dashboard guides types are <200 lines per file
6. THE System SHALL create Main App guides models matching backend DTOs
7. THE System SHALL ensure Main App guides models are <200 lines per file
8. THE System SHALL create/enhance guides services in both frontends
9. THE System SHALL ensure guides services are <250 lines per file
10. THE System SHALL support guide creation, steps, bookmarks, and ratings

## Implementation Priorities

### Phase 1: Discovery (MUST DO FIRST)
1. Review all existing backend controllers
2. Review all existing backend services
3. Review all existing frontend types
4. Review all existing frontend services
5. Document what exists vs what needs creation
6. Identify all duplicates
7. Identify all files exceeding size limits

### Phase 2: Consolidation (HIGH PRIORITY)
1. Remove duplicate types
2. Remove duplicate services
3. Consolidate similar implementations
4. Update all imports

### Phase 3: File Splitting (HIGH PRIORITY)
1. Split backend files >300 lines
2. Split type files >200 lines
3. Split service files >250 lines
4. Create index files for exports

### Phase 4: Enhancement (MEDIUM PRIORITY)
1. Enhance existing controllers with missing endpoints
2. Enhance existing services with missing methods
3. Create missing controllers (only if truly needed)
4. Create missing services (only if truly needed)

### Phase 5: Frontend Integration (MEDIUM PRIORITY)
1. Create/enhance Dashboard types and services
2. Create/enhance Main App models and services
3. Ensure consistency across both frontends

## Success Criteria

✅ All existing implementations reviewed and documented
✅ No duplicate code between Dashboard and Main App
✅ All files under size limits (Backend: 300, Types: 200, Services: 250)
✅ Clear separation of concerns in all modules
✅ Consistent API patterns across all endpoints
✅ Types match backend DTOs exactly
✅ All TypeScript diagnostics pass with no errors
✅ No functional regressions after consolidation

## Notes

- **CRITICAL**: Always review existing files before creating new ones
- **CRITICAL**: Split files that exceed size limits
- **CRITICAL**: Remove duplicates immediately when found
- **CRITICAL**: Enhance existing code rather than recreate
- **CRITICAL**: Document all changes for traceability
- Focus on consolidation and enhancement, not recreation
- Leverage extensive existing backend infrastructure
- Maintain backward compatibility during refactoring
