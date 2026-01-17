# Implementation Plan: Community Platform Integration

## Overview

Implementation tasks for reviewing, consolidating, and enhancing the community platform. **CRITICAL: Complete Phase 1 (Discovery) before any other work.** This ensures we review all existing code before making changes.

## Tasks

### Phase 1: Discovery and Documentation (MUST COMPLETE FIRST)

- [x] 1. Review Backend Community Controllers
  - List all controllers in `src/WebAPI/Controllers/Community/`
  - List all controllers in `src/WebAPI/Controllers/` that handle community features
  - Document which features have controllers
  - Document which features need controllers
  - Measure file sizes (flag if >300 lines)
  - Document existing endpoint patterns
  - _Requirements: 1.1, 1.8_

- [x] 2. Review Backend Community Services
  - List all services in `src/Application/Features/Community/`
  - Measure file sizes (flag if >300 lines)
  - Document service responsibilities
  - Identify services that need splitting
  - Identify missing services
  - Document existing patterns
  - _Requirements: 1.2, 1.8, 2.2_

- [x] 3. Review Backend Community Entities
  - List all entities in `src/Domain/Entities/Community/`
  - Document entity relationships
  - Verify entities match requirements
  - Identify any missing entities
  - _Requirements: 1.3, 1.8_

- [x] 4. Review Dashboard Community Types
  - List all types in `ClientApp/Dashboard/src/types/community/`
  - List all types in `ClientApp/Dashboard/src/types/` related to community
  - Measure file sizes (flag if >200 lines)
  - Identify duplicate type definitions
  - Document type organization
  - Compare with backend DTOs
  - _Requirements: 1.4, 1.9, 2.3, 3.1_

- [x] 5. Review Dashboard Community Services
  - List all services in `ClientApp/Dashboard/src/services/` related to community
  - Check `services/qa/`, `services/community/`, etc.
  - Measure file sizes (flag if >250 lines)
  - Identify duplicate service implementations
  - Document service patterns
  - _Requirements: 1.5, 1.9, 2.4, 3.2_

- [x] 6. Review Main App Community Models
  - List all models in `ClientApp/Main/src/app/core/models/` related to community
  - Check `features/community/` for additional models
  - Measure file sizes (flag if >200 lines)
  - Identify duplicate model definitions
  - Compare with backend DTOs
  - _Requirements: 1.6, 1.9, 2.3, 3.1_

- [x] 7. Review Main App Community Services
  - List all services in `ClientApp/Main/src/app/core/services/` related to community
  - Check `features/community/` for additional services
  - Measure file sizes (flag if >250 lines)
  - Identify duplicate service implementations
  - Document service patterns
  - _Requirements: 1.7, 1.9, 2.4, 3.2_

- [x] 8. Create Discovery Report
  - Compile all findings from tasks 1-7
  - List all files exceeding size limits
  - List all duplicate implementations
  - List all missing implementations
  - Create consolidation plan
  - Create file splitting plan
  - _Requirements: 1.8, 1.9, 1.10_

### Phase 2: Duplicate Elimination

- [x] 9. Remove Duplicate Dashboard Types
  - Identify exact duplicate type definitions
  - Choose source of truth for each duplicate
  - Remove duplicate files
  - Update all imports to use source of truth
  - Verify TypeScript diagnostics pass
  - _Requirements: 3.1, 3.2, 3.6, 3.8_

- [x] 10. Remove Duplicate Main App Models
  - Identify exact duplicate model definitions
  - Choose source of truth for each duplicate
  - Remove duplicate files
  - Update all imports to use source of truth
  - Verify TypeScript diagnostics pass
  - _Requirements: 3.1, 3.2, 3.6, 3.8_

- [x] 11. Remove Duplicate Dashboard Services
  - Identify duplicate service implementations
  - Consolidate into single service per feature
  - Remove duplicate files
  - Update service consumers
  - Verify no functional regressions
  - _Requirements: 3.2, 3.4, 3.6, 3.9_

- [x] 12. Remove Duplicate Main App Services
  - Identify duplicate service implementations
  - Consolidate into single service per feature
  - Remove duplicate files
  - Update service consumers
  - Verify no functional regressions
  - _Requirements: 3.2, 3.4, 3.6, 3.9_

- [x] 13. Document Removed Duplicates
  - List all removed duplicate files
  - Document consolidation decisions
  - Update migration guide
  - _Requirements: 3.8, 3.10_

### Phase 3: File Splitting

- [x] 14. Split QuestionsController (404 lines → <300 lines)
  - [x] 14.1 Analyze QuestionsController responsibilities
    - Identify logical boundaries (CRUD vs Search vs Analytics)
    - Plan split strategy
    - _Requirements: 2.1, 2.5_
  - [x] 14.2 Create QuestionsManagementController
    - Move CRUD operations (Create, Read, Update, Delete)
    - Ensure <300 lines
    - _Requirements: 2.1, 2.6_
  - [x] 14.3 Keep QuestionsController for queries
    - Keep listing, filtering, pagination
    - Ensure <300 lines
    - _Requirements: 2.1, 2.6_
  - [x] 14.4 Update dependency injection and routing
    - Register new controller
    - Update route configurations
    - _Requirements: 2.6, 2.10_
  - [x] 14.5 Verify all endpoints work
    - Test all CRUD operations
    - Test all query operations
    - _Requirements: 2.9, 2.10_

- [x] 15. Split VotingController (335 lines → <300 lines)
  - [x] 15.1 Analyze VotingController responsibilities
    - Identify logical boundaries (Question votes vs Answer votes)
    - Plan split strategy
    - _Requirements: 2.1, 2.5_
  - [x] 15.2 Create QuestionVotingController
    - Move question voting operations
    - Ensure <300 lines
    - _Requirements: 2.1, 2.6_
  - [x] 15.3 Create AnswerVotingController
    - Move answer voting operations
    - Ensure <300 lines
    - _Requirements: 2.1, 2.6_
  - [x] 15.4 Update dependency injection and routing
    - Register new controllers
    - Update route configurations
    - _Requirements: 2.6, 2.10_
  - [x] 15.5 Verify all endpoints work
    - Test question voting
    - Test answer voting
    - _Requirements: 2.9, 2.10_

- [x] 16. Split SearchController (308 lines → <300 lines)
  - [x] 16.1 Analyze SearchController responsibilities
    - Identify logical boundaries (Questions vs Answers vs Users)
    - Plan split strategy
    - _Requirements: 2.1, 2.5_
  - [x] 16.2 Refactor SearchController
    - Extract common search logic to service
    - Simplify controller to <300 lines
    - Keep unified search endpoint
    - _Requirements: 2.1, 2.6, 2.7_
  - [x] 16.3 Update dependency injection
    - Register refactored services
    - Update configurations
    - _Requirements: 2.6, 2.10_
  - [x] 16.4 Verify all endpoints work
    - Test all search operations
    - Verify performance maintained
    - _Requirements: 2.9, 2.10_

- [x] 17. Split ExpertsController (482 lines → <300 lines)
  - [x] 17.1 Analyze ExpertsController responsibilities
    - Identify logical boundaries (Expert management vs Analytics vs Verification)
    - Plan split strategy
    - _Requirements: 2.1, 2.5_
  - [x] 17.2 Create ExpertManagementController
    - Move CRUD operations for experts
    - Ensure <300 lines
    - _Requirements: 2.1, 2.6_
  - [x] 17.3 Create ExpertAnalyticsController
    - Move analytics and reporting
    - Ensure <300 lines
    - _Requirements: 2.1, 2.6_
  - [x] 17.4 Keep ExpertsController for queries
    - Keep listing, filtering, search
    - Ensure <300 lines
    - _Requirements: 2.1, 2.6_
  - [x] 17.5 Update dependency injection and routing
    - Register new controllers
    - Update route configurations
    - _Requirements: 2.6, 2.10_
  - [x] 17.6 Verify all endpoints work
    - Test all expert operations
    - Test analytics endpoints
    - _Requirements: 2.9, 2.10_

- [x] 18. Checkpoint - Verify Backend Controller Splits
  - Ensure all 4 controllers now <300 lines
  - Verify no broken endpoints
  - Run integration tests
  - Ask user if questions arise
  - _Requirements: 2.1, 2.9, 2.10_

- [x] 19. Split Large Backend Services
  - Identify services >300 lines (from Task 2 findings)
  - Plan split into focused services
  - Execute split maintaining functionality
  - Update dependency injection
  - Verify all methods work
  - _Requirements: 2.2, 2.5, 2.6, 2.9_

- [x] 20. Split Large Dashboard Type Files
  - Identify type files >200 lines (from Task 4 findings)
  - Plan split into feature modules
  - Execute split with index exports
  - Update all imports
  - Verify TypeScript diagnostics pass
  - _Requirements: 2.3, 2.5, 2.7, 2.9_

- [x] 21. Split Large Dashboard Service Files
  - Identify service files >250 lines (from Task 5 findings)
  - Plan split into focused services
  - Execute split with index exports
  - Update service consumers
  - Verify no functional regressions
  - _Requirements: 2.4, 2.5, 2.7, 2.9_

- [x] 22. Split Large Main App Model Files
  - Identify model files >200 lines (from Task 6 findings)
  - Plan split into feature modules
  - Execute split with barrel exports
  - Update all imports
  - Verify TypeScript diagnostics pass
  - _Requirements: 2.3, 2.5, 2.7, 2.9_

- [x] 23. Split Large Main App Service Files
  - Identify service files >250 lines (from Task 7 findings)
  - Plan split into focused services
  - Execute split with barrel exports
  - Update service consumers
  - Verify no functional regressions
  - _Requirements: 2.4, 2.5, 2.7, 2.9_

- [x] 24. Checkpoint - Verify All File Splits Complete
  - Ensure all backend files <300 lines
  - Ensure all type files <200 lines
  - Ensure all service files <250 lines
  - Run full TypeScript diagnostics
  - Ask user if questions arise
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.9_

- [x] 25. Document File Splits
  - List all split files
  - Document new file organization
  - Update architecture documentation
  - _Requirements: 2.8, 2.10_

### Phase 4: Backend API Enhancement - Posts Feature

- [x] 26. Enhance PostsController (Already exists - 188 lines)
  - [x] 26.1 Review existing endpoints
    - Document current functionality
    - Identify missing endpoints
    - _Requirements: 4.1, 4.2, 7.2_
  - [x] 26.2 Add missing endpoints if needed
    - Implement any missing CRUD operations
    - Add sharing functionality
    - Ensure proper authorization
    - _Requirements: 4.2, 4.8, 7.10_
  - [x] 26.3 Verify PostsController remains <300 lines
    - Check line count after enhancements
    - Split if approaching limit
    - _Requirements: 2.1, 7.3_

- [x] 27. Review CachedPostsController (Already exists - 54 lines)
  - Review caching strategy
  - Ensure consistency with PostsController
  - Document caching patterns
  - _Requirements: 4.1, 4.8_

- [x] 28. Create CommentsController (Check if needed)
  - [x] 28.1 Check if comments are in PostsController
    - Review PostsController for comment endpoints
    - Decide if separate controller needed
    - _Requirements: 4.1, 7.2_
  - [x] 28.2 Create CommentsController if needed
    - Implement comment CRUD endpoints
    - Ensure <300 lines
    - Add proper authorization
    - _Requirements: 4.3, 4.8, 7.3_

- [ ] 29. Create Dashboard Posts Types
  - [ ] 29.1 Review existing posts types
    - Check ClientApp/Dashboard/src/types for post types
    - Identify what exists vs what's missing
    - _Requirements: 5.1, 7.4_
  - [ ] 29.2 Create missing types matching backend DTOs
    - Create Post, Comment, PostLike types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 7.5_
  - [ ] 29.3 Create request/response types
    - CreatePostRequest, UpdatePostRequest
    - PostResponse, PostListResponse
    - Ensure <200 lines per file
    - _Requirements: 5.3, 5.4, 7.5_

- [ ] 30. Create Main App Posts Models
  - [ ] 30.1 Review existing posts models
    - Check ClientApp/Main/src/app/core/models for post models
    - Identify what exists vs what's missing
    - _Requirements: 5.1, 7.6_
  - [ ] 30.2 Create missing models matching backend DTOs
    - Create Post, Comment, PostLike models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 7.7_

- [ ] 31. Create/Enhance Dashboard Posts Service
  - [ ] 31.1 Review existing posts service
    - Check ClientApp/Dashboard/src/services for posts service
    - Document existing methods
    - _Requirements: 6.1, 7.8_
  - [ ] 31.2 Create or enhance posts service
    - Implement all CRUD operations
    - Add like, comment, share methods
    - Use httpClient
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 7.9_

- [ ] 32. Create/Enhance Main App Posts Service
  - [ ] 32.1 Review existing posts service
    - Check ClientApp/Main/src/app/core/services for posts service
    - Document existing methods
    - _Requirements: 6.1, 7.8_
  - [ ] 32.2 Create or enhance posts service
    - Implement all CRUD operations
    - Add like, comment, share methods
    - Use HttpClient (Angular)
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 7.9_

- [ ] 33. Checkpoint - Posts Feature Complete
  - Verify all posts endpoints work
  - Verify frontend types match backend DTOs
  - Run TypeScript diagnostics
  - Test posts CRUD operations
  - Ask user if questions arise
  - _Requirements: 7.1-7.10_

### Phase 5: Backend API Enhancement - Groups Feature

- [ ] 34. Enhance GroupsController (Already exists - 170 lines)
  - [ ] 34.1 Review existing endpoints
    - Document current functionality
    - Identify missing endpoints
    - _Requirements: 4.1, 4.2, 8.2_
  - [ ] 34.2 Add missing endpoints if needed
    - Implement any missing group management operations
    - Add member management endpoints
    - Ensure proper authorization
    - _Requirements: 4.2, 4.8, 8.10_
  - [ ] 34.3 Verify GroupsController remains <300 lines
    - Check line count after enhancements
    - Split if approaching limit
    - _Requirements: 2.1, 8.3_

- [ ] 35. Create Dashboard Groups Types
  - [ ] 35.1 Review existing groups types
    - Check for existing group type definitions
    - Identify what's missing
    - _Requirements: 5.1, 8.4_
  - [ ] 35.2 Create missing types matching backend DTOs
    - Create Group, GroupMember types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 8.5_

- [ ] 36. Create Main App Groups Models
  - [ ] 36.1 Review existing groups models
    - Check for existing group models
    - Identify what's missing
    - _Requirements: 5.1, 8.6_
  - [ ] 36.2 Create missing models matching backend DTOs
    - Create Group, GroupMember models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 8.7_

- [ ] 37. Create/Enhance Dashboard Groups Service
  - [ ] 37.1 Review existing groups service
    - Check for existing service
    - Document existing methods
    - _Requirements: 6.1, 8.8_
  - [ ] 37.2 Create or enhance groups service
    - Implement group management operations
    - Add member management methods
    - Use httpClient
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 8.9_

- [ ] 38. Create/Enhance Main App Groups Service
  - [ ] 38.1 Review existing groups service
    - Check for existing service
    - Document existing methods
    - _Requirements: 6.1, 8.8_
  - [ ] 38.2 Create or enhance groups service
    - Implement group management operations
    - Add member management methods
    - Use HttpClient (Angular)
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 8.9_

- [ ] 39. Checkpoint - Groups Feature Complete
  - Verify all groups endpoints work
  - Verify frontend types match backend DTOs
  - Run TypeScript diagnostics
  - Test group management operations
  - Ask user if questions arise
  - _Requirements: 8.1-8.10_

### Phase 6: Backend API Enhancement - QA Feature

- [ ] 40. Enhance QuestionsController (After split from Task 14)
  - [ ] 40.1 Review split controllers
    - Verify QuestionsController <300 lines
    - Verify QuestionsManagementController <300 lines
    - _Requirements: 4.1, 4.2, 9.2_
  - [ ] 40.2 Add missing endpoints if needed
    - Implement any missing question operations
    - Add bookmarking functionality
    - Ensure proper authorization
    - _Requirements: 4.2, 4.8, 9.10_

- [ ] 41. Enhance AnswersController (Already exists - 259 lines)
  - [ ] 41.1 Review existing endpoints
    - Document current functionality
    - Identify missing endpoints
    - _Requirements: 4.1, 4.2, 9.2_
  - [ ] 41.2 Add missing endpoints if needed
    - Implement any missing answer operations
    - Add acceptance functionality
    - Ensure proper authorization
    - _Requirements: 4.2, 4.8, 9.10_
  - [ ] 41.3 Verify AnswersController remains <300 lines
    - Check line count after enhancements
    - _Requirements: 2.1, 9.3_

- [ ] 42. Enhance Voting Controllers (After split from Task 15)
  - [ ] 42.1 Review split controllers
    - Verify QuestionVotingController <300 lines
    - Verify AnswerVotingController <300 lines
    - _Requirements: 4.1, 4.2, 9.2_
  - [ ] 42.2 Ensure voting endpoints complete
    - Verify upvote/downvote functionality
    - Add vote removal if missing
    - _Requirements: 4.2, 9.10_

- [ ] 43. Review Supporting QA Controllers
  - Review CategoriesController (136 lines)
  - Review TagsController (193 lines)
  - Review ReputationController (271 lines)
  - Review AnalyticsController (69 lines)
  - Document existing functionality
  - _Requirements: 4.1, 4.8_

- [ ] 44. Create Dashboard QA Types
  - [ ] 44.1 Review existing QA types
    - Check for existing question/answer types
    - Identify what's missing
    - _Requirements: 5.1, 9.4_
  - [ ] 44.2 Create Question types
    - Create Question, QuestionVote, QuestionBookmark types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 9.5_
  - [ ] 44.3 Create Answer types
    - Create Answer, AnswerVote types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 9.5_
  - [ ] 44.4 Create Reputation types
    - Create UserReputation, ReputationHistory types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 9.5_

- [ ] 45. Create Main App QA Models
  - [ ] 45.1 Review existing QA models
    - Check for existing question/answer models
    - Identify what's missing
    - _Requirements: 5.1, 9.6_
  - [ ] 45.2 Create Question models
    - Create Question, QuestionVote, QuestionBookmark models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 9.7_
  - [ ] 45.3 Create Answer models
    - Create Answer, AnswerVote models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 9.7_
  - [ ] 45.4 Create Reputation models
    - Create UserReputation, ReputationHistory models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 9.7_

- [ ] 46. Create/Enhance Dashboard QA Service
  - [ ] 46.1 Review existing QA service
    - Check for existing service
    - Document existing methods
    - _Requirements: 6.1, 9.8_
  - [ ] 46.2 Create QuestionsService
    - Implement question CRUD operations
    - Add voting, bookmarking methods
    - Use httpClient
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 9.9_
  - [ ] 46.3 Create AnswersService
    - Implement answer CRUD operations
    - Add voting, acceptance methods
    - Use httpClient
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 9.9_

- [ ] 47. Create/Enhance Main App QA Service
  - [ ] 47.1 Review existing QA service
    - Check for existing service
    - Document existing methods
    - _Requirements: 6.1, 9.8_
  - [ ] 47.2 Create QuestionsService
    - Implement question CRUD operations
    - Add voting, bookmarking methods
    - Use HttpClient (Angular)
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 9.9_
  - [ ] 47.3 Create AnswersService
    - Implement answer CRUD operations
    - Add voting, acceptance methods
    - Use HttpClient (Angular)
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 9.9_

- [ ] 48. Checkpoint - QA Feature Complete
  - Verify all QA endpoints work
  - Verify frontend types match backend DTOs
  - Run TypeScript diagnostics
  - Test questions, answers, voting, reputation
  - Ask user if questions arise
  - _Requirements: 9.1-9.10_

### Phase 7: Backend API Enhancement - Social Feature

- [ ] 49. Enhance FriendsController (Already exists - 107 lines)
  - [ ] 49.1 Review existing endpoints
    - Document current functionality
    - Identify missing endpoints
    - _Requirements: 4.1, 4.2, 10.2_
  - [ ] 49.2 Add missing endpoints if needed
    - Implement any missing friend operations
    - Add friend request management
    - Ensure proper authorization
    - _Requirements: 4.2, 4.8, 10.10_
  - [ ] 49.3 Verify FriendsController remains <300 lines
    - Check line count after enhancements
    - _Requirements: 2.1, 10.3_

- [ ] 50. Create ProfilesController (Missing)
  - [ ] 50.1 Create ProfilesController
    - Implement profile CRUD endpoints
    - Add profile viewing, updating
    - Ensure <300 lines
    - Add proper authorization
    - _Requirements: 4.1, 4.3, 10.2, 10.3_

- [ ] 51. Create ConnectionsController (Missing)
  - [ ] 51.1 Create ConnectionsController
    - Implement connection management endpoints
    - Add follow/unfollow functionality
    - Ensure <300 lines
    - Add proper authorization
    - _Requirements: 4.1, 4.3, 10.2, 10.3_

- [ ] 52. Create Dashboard Social Types
  - [ ] 52.1 Review existing social types
    - Check for existing social type definitions
    - Identify what's missing
    - _Requirements: 5.1, 10.4_
  - [ ] 52.2 Create UserProfile types
    - Create UserProfile, ProfileSettings types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 10.5_
  - [ ] 52.3 Create Friend/Connection types
    - Create UserFriend, UserConnection types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 10.5_

- [ ] 53. Create Main App Social Models
  - [ ] 53.1 Review existing social models
    - Check for existing social models
    - Identify what's missing
    - _Requirements: 5.1, 10.6_
  - [ ] 53.2 Create UserProfile models
    - Create UserProfile, ProfileSettings models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 10.7_
  - [ ] 53.3 Create Friend/Connection models
    - Create UserFriend, UserConnection models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 10.7_

- [ ] 54. Create/Enhance Dashboard Social Service
  - [ ] 54.1 Review existing social service
    - Check for existing service
    - Document existing methods
    - _Requirements: 6.1, 10.8_
  - [ ] 54.2 Create ProfileService
    - Implement profile operations
    - Use httpClient
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 10.9_
  - [ ] 54.3 Create FriendsService
    - Implement friend management operations
    - Use httpClient
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 10.9_
  - [ ] 54.4 Create ConnectionsService
    - Implement connection operations
    - Use httpClient
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 10.9_

- [ ] 55. Create/Enhance Main App Social Service
  - [ ] 55.1 Review existing social service
    - Check for existing service
    - Document existing methods
    - _Requirements: 6.1, 10.8_
  - [ ] 55.2 Create ProfileService
    - Implement profile operations
    - Use HttpClient (Angular)
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 10.9_
  - [ ] 55.3 Create FriendsService
    - Implement friend management operations
    - Use HttpClient (Angular)
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 10.9_
  - [ ] 55.4 Create ConnectionsService
    - Implement connection operations
    - Use HttpClient (Angular)
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 10.9_

- [ ] 56. Checkpoint - Social Feature Complete
  - Verify all social endpoints work
  - Verify frontend types match backend DTOs
  - Run TypeScript diagnostics
  - Test profiles, friends, connections
  - Ask user if questions arise
  - _Requirements: 10.1-10.10_

### Phase 8: Backend API Enhancement - Reviews Feature

- [ ] 57. Enhance ReviewsController (Already exists - 120 lines)
  - [ ] 57.1 Review existing endpoints
    - Document current functionality
    - Identify missing endpoints
    - _Requirements: 4.1, 4.2, 11.2_
  - [ ] 57.2 Add missing endpoints if needed
    - Implement any missing review operations
    - Add helpfulness voting
    - Ensure proper authorization
    - _Requirements: 4.2, 4.8, 11.10_
  - [ ] 57.3 Verify ReviewsController remains <300 lines
    - Check line count after enhancements
    - _Requirements: 2.1, 11.3_

- [ ] 58. Create Dashboard Reviews Types
  - [ ] 58.1 Review existing reviews types
    - Check for existing review type definitions
    - Identify what's missing
    - _Requirements: 5.1, 11.4_
  - [ ] 58.2 Create missing types matching backend DTOs
    - Create Review, CommunityReview, ReviewComment types
    - Create ReviewHelpfulness, ReviewImage types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 11.5_

- [ ] 59. Create Main App Reviews Models
  - [ ] 59.1 Review existing reviews models
    - Check for existing review models
    - Identify what's missing
    - _Requirements: 5.1, 11.6_
  - [ ] 59.2 Create missing models matching backend DTOs
    - Create Review, CommunityReview, ReviewComment models
    - Create ReviewHelpfulness, ReviewImage models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 11.7_

- [ ] 60. Create/Enhance Dashboard Reviews Service
  - [ ] 60.1 Review existing reviews service
    - Check for existing service
    - Document existing methods
    - _Requirements: 6.1, 11.8_
  - [ ] 60.2 Create or enhance reviews service
    - Implement review CRUD operations
    - Add helpfulness voting methods
    - Use httpClient
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 11.9_

- [ ] 61. Create/Enhance Main App Reviews Service
  - [ ] 61.1 Review existing reviews service
    - Check for existing service
    - Document existing methods
    - _Requirements: 6.1, 11.8_
  - [ ] 61.2 Create or enhance reviews service
    - Implement review CRUD operations
    - Add helpfulness voting methods
    - Use HttpClient (Angular)
    - Ensure <250 lines
    - _Requirements: 6.3, 6.4, 6.5, 11.9_

- [ ] 62. Checkpoint - Reviews Feature Complete
  - Verify all reviews endpoints work
  - Verify frontend types match backend DTOs
  - Run TypeScript diagnostics
  - Test reviews, ratings, helpfulness
  - Ask user if questions arise
  - _Requirements: 11.1-11.10_

### Phase 9: Additional Features (Lower Priority)

- [ ] 63. News Feature Implementation
  - [ ] 63.1 Create NewsController (Missing)
    - Implement article CRUD endpoints
    - Add category management
    - Ensure <300 lines
    - Add proper authorization
    - _Requirements: 4.1, 4.3, 12.2, 12.3_
  - [ ] 63.2 Create Dashboard news types
    - Create Article, NewsCategory, NewsComment types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 12.4, 12.5_
  - [ ] 63.3 Create Main App news models
    - Create Article, NewsCategory, NewsComment models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 12.6, 12.7_
  - [ ] 63.4 Create/enhance news services
    - Implement Dashboard news service
    - Implement Main App news service
    - Ensure <250 lines per service
    - _Requirements: 6.3, 6.4, 6.5, 12.8, 12.9_
  - [ ] 63.5 Checkpoint - News Feature Complete
    - Verify all news endpoints work
    - Test article operations
    - Ask user if questions arise
    - _Requirements: 12.1-12.10_

- [ ] 64. Pages Feature Implementation
  - [ ] 64.1 Create PagesController (Missing)
    - Implement page CRUD endpoints
    - Add revision management
    - Ensure <300 lines
    - Add proper authorization
    - _Requirements: 4.1, 4.3, 13.2, 13.3_
  - [ ] 64.2 Create Dashboard pages types
    - Create Page, PageContent, PageRevision types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 13.4, 13.5_
  - [ ] 64.3 Create Main App pages models
    - Create Page, PageContent, PageRevision models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 13.6, 13.7_
  - [ ] 64.4 Create/enhance pages services
    - Implement Dashboard pages service
    - Implement Main App pages service
    - Ensure <250 lines per service
    - _Requirements: 6.3, 6.4, 6.5, 13.8, 13.9_
  - [ ] 64.5 Checkpoint - Pages Feature Complete
    - Verify all pages endpoints work
    - Test page operations
    - Ask user if questions arise
    - _Requirements: 13.1-13.10_

- [ ] 65. Maps Feature Implementation
  - [ ] 65.1 Create MapsController (Missing)
    - Implement location CRUD endpoints
    - Add check-in functionality
    - Ensure <300 lines
    - Add proper authorization
    - _Requirements: 4.1, 4.3, 14.2, 14.3_
  - [ ] 65.2 Create Dashboard maps types
    - Create Location, CheckIn, PlaceReview types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 14.4, 14.5_
  - [ ] 65.3 Create Main App maps models
    - Create Location, CheckIn, PlaceReview models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 14.6, 14.7_
  - [ ] 65.4 Create/enhance maps services
    - Implement Dashboard maps service
    - Implement Main App maps service
    - Ensure <250 lines per service
    - _Requirements: 6.3, 6.4, 6.5, 14.8, 14.9_
  - [ ] 65.5 Checkpoint - Maps Feature Complete
    - Verify all maps endpoints work
    - Test location operations
    - Ask user if questions arise
    - _Requirements: 14.1-14.10_

- [ ] 66. Guides Feature Implementation
  - [ ] 66.1 Enhance GuidesController (Already exists - 138 lines)
    - Review existing endpoints
    - Add missing functionality
    - Verify remains <300 lines
    - _Requirements: 4.1, 4.2, 15.2, 15.3_
  - [ ] 66.2 Create Dashboard guides types
    - Create Guide, GuideStep, GuideBookmark types
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 15.4, 15.5_
  - [ ] 66.3 Create Main App guides models
    - Create Guide, GuideStep, GuideBookmark models
    - Ensure <200 lines per file
    - Add JSDoc comments
    - _Requirements: 5.3, 5.4, 5.6, 15.6, 15.7_
  - [ ] 66.4 Create/enhance guides services
    - Implement Dashboard guides service
    - Implement Main App guides service
    - Ensure <250 lines per service
    - _Requirements: 6.3, 6.4, 6.5, 15.8, 15.9_
  - [ ] 66.5 Checkpoint - Guides Feature Complete
    - Verify all guides endpoints work
    - Test guide operations
    - Ask user if questions arise
    - _Requirements: 15.1-15.10_

### Phase 10: Verification and Documentation

- [ ] 67. Verify No Duplicates Remain
  - [ ] 67.1 Search for duplicate types across applications
    - Compare Dashboard types with Main App models
    - Document any remaining duplicates
    - _Requirements: 3.5, 3.7_
  - [ ] 67.2 Search for duplicate services
    - Compare Dashboard services with Main App services
    - Document any remaining duplicates
    - _Requirements: 3.5, 3.7_
  - [ ] 67.3 Search for duplicate utilities
    - Check for duplicate helper functions
    - Document any remaining duplicates with justification
    - _Requirements: 3.5, 3.10_

- [ ] 68. Verify File Sizes
  - [ ] 68.1 Check all backend files <300 lines
    - Run line count on all controllers
    - Run line count on all services
    - Document any exceptions with justification
    - _Requirements: 2.1, 2.2_
  - [ ] 68.2 Check all type files <200 lines
    - Run line count on Dashboard types
    - Run line count on Main App models
    - Document any exceptions with justification
    - _Requirements: 2.3_
  - [ ] 68.3 Check all service files <250 lines
    - Run line count on Dashboard services
    - Run line count on Main App services
    - Document any exceptions with justification
    - _Requirements: 2.4_

- [ ] 69. Verify TypeScript Diagnostics
  - [ ] 69.1 Run diagnostics on all Dashboard files
    - Check for TypeScript errors
    - Check for linting issues
    - Fix any errors found
    - _Requirements: 5.9_
  - [ ] 69.2 Run diagnostics on all Main App files
    - Check for TypeScript errors
    - Check for linting issues
    - Fix any errors found
    - _Requirements: 6.9_
  - [ ] 69.3 Ensure 0 errors across all files
    - Verify clean build
    - Document any warnings
    - _Requirements: 5.9, 6.9_

- [ ] 70. Create Final Documentation
  - [ ] 70.1 Document all files reviewed
    - List all controllers reviewed
    - List all services reviewed
    - List all types/models reviewed
    - _Requirements: 4.10, 5.10, 6.10_
  - [ ] 70.2 Document all files split
    - List all split controllers
    - List all split services
    - List all split types/models
    - Document split rationale
    - _Requirements: 2.8, 2.10_
  - [ ] 70.3 Document all duplicates removed
    - List all removed duplicate files
    - Document consolidation decisions
    - _Requirements: 3.8, 3.10_
  - [ ] 70.4 Document all new files created
    - List all new controllers
    - List all new types/models
    - List all new services
    - _Requirements: 4.10, 5.10, 6.10_
  - [ ] 70.5 Create migration guide
    - Document breaking changes
    - Provide migration steps
    - Include code examples
    - _Requirements: 2.10, 3.10_
  - [ ] 70.6 Update architecture documentation
    - Update system architecture diagrams
    - Document new file organization
    - Update API documentation
    - _Requirements: 2.8, 4.10_

- [ ] 71. Final Checkpoint - Project Complete
  - Review all success criteria
  - Verify all requirements met
  - Run full test suite
  - Ask user for final approval
  - _Requirements: All_

## Implementation Status

**COMPLETED: 1 of 71 tasks (1.4%)**
**PENDING: 70 of 71 tasks (98.6%)**

### 🎯 Implementation Phases
- **Phase 1**: Discovery (8 tasks) - **1/8 COMPLETE** - MUST COMPLETE BEFORE OTHER PHASES
- **Phase 2**: Duplicate Elimination (5 tasks) - 0/5 complete
- **Phase 3**: File Splitting (12 tasks with sub-tasks) - 0/12 complete
- **Phase 4**: Posts Feature (8 tasks with sub-tasks) - 0/8 complete
- **Phase 5**: Groups Feature (6 tasks with sub-tasks) - 0/6 complete
- **Phase 6**: QA Feature (9 tasks with sub-tasks) - 0/9 complete
- **Phase 7**: Social Feature (8 tasks with sub-tasks) - 0/8 complete
- **Phase 8**: Reviews Feature (6 tasks with sub-tasks) - 0/6 complete
- **Phase 9**: Additional Features (4 tasks with sub-tasks) - 0/4 complete
- **Phase 10**: Verification (5 tasks with sub-tasks) - 0/5 complete

### 📋 Priority Order
1. **CRITICAL**: Phase 1 (Discovery) - Complete Tasks 2-8 before anything else
2. **HIGH**: Phase 3 (File Splitting) - Split 4 oversized controllers immediately after discovery
3. **HIGH**: Phase 2 (Duplicate Elimination) - Remove duplicates found during discovery
4. **MEDIUM**: Phase 4-8 (Core Features) - Posts, Groups, QA, Social, Reviews
5. **LOW**: Phase 9 (Additional Features) - News, Pages, Maps, Guides
6. **LOW**: Phase 10 (Verification) - Final checks and documentation

### 🔍 Discovery Findings (Task 1 Complete)
**Controllers Found**: 20 total
- ✅ 16 controllers under 300 lines
- ⚠️ 4 controllers exceeding limits (need splitting in Phase 3):
  - QuestionsController.cs (404 lines)
  - VotingController.cs (335 lines)
  - SearchController.cs (308 lines)
  - ExpertsController.cs (482 lines)

**Missing Controllers**: 5 need creation
- NewsController
- ArticlesController
- PagesController
- MapsController
- LocationsController

**Existing Controllers**: Many already exist and just need enhancement
- PostsController ✅ (188 lines)
- GroupsController ✅ (170 lines)
- ReviewsController ✅ (120 lines)
- GuidesController ✅ (138 lines)
- FriendsController ✅ (107 lines)

### 📊 Task Breakdown
- **Total Tasks**: 71 (up from 55)
- **Tasks with Sub-tasks**: 45 tasks broken into granular steps
- **Checkpoint Tasks**: 10 validation checkpoints added
- **File Splitting Tasks**: 4 specific controller splits detailed

## Success Criteria

✅ All existing implementations reviewed and documented
✅ No duplicate code between Dashboard and Main App
✅ All files under size limits (Backend: 300, Types: 200, Services: 250)
✅ Clear separation of concerns in all modules
✅ Consistent API patterns across all endpoints
✅ Types match backend DTOs exactly
✅ All TypeScript diagnostics pass with no errors
✅ No functional regressions after consolidation

## Critical Rules

⚠️ **NEVER create a file without checking if it exists first**
⚠️ **NEVER exceed file size limits (split immediately)**
⚠️ **NEVER duplicate code between applications**
⚠️ **ALWAYS enhance existing code rather than recreate**
⚠️ **ALWAYS document changes for traceability**
⚠️ **ALWAYS complete Phase 1 before other phases**
