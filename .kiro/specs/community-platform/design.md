# Design Document: Community Platform Integration (Review-First Approach)

## Overview

This design focuses on reviewing existing community platform implementations, consolidating duplicates, splitting long files, and enhancing existing code rather than recreating it. The approach prioritizes discovery and consolidation over new development.

## Review-First Methodology

### Step 1: Complete Discovery
**Before writing any code:**
1. List ALL existing backend controllers
2. List ALL existing backend services  
3. List ALL existing frontend types (Dashboard & Main App)
4. List ALL existing frontend services (Dashboard & Main App)
5. Measure file sizes (flag >300 for backend, >200 for types, >250 for services)
6. Identify duplicate implementations
7. Document gaps (what's truly missing)

### Step 2: Consolidation Planning
**After discovery:**
1. Map duplicate types across applications
2. Map duplicate services across applications
3. Plan consolidation strategy (which to keep, which to remove)
4. Plan file splitting strategy (how to break large files)
5. Document migration paths for consumers

### Step 3: Implementation
**Only after planning:**
1. Remove duplicates
2. Split large files
3. Enhance existing implementations
4. Create missing implementations (if truly needed)
5. Update all imports and consumers

## Existing Infrastructure Analysis

### Backend Domain Entities (Already Exist - DO NOT RECREATE)

**Posts System:**
- ✅ `Post` - Main post entity
- ✅ `Comment` - Post comments
- ✅ `PostLike` - Post likes
- ✅ `CommentLike` - Comment likes
- ✅ `PostReport` - Content moderation
- ✅ `PostView` - View tracking

**Groups System:**
- ✅ `Group` - Group entity
- ✅ `GroupMember` - Membership management

**QA System:**
- ✅ `Question` - Questions
- ✅ `Answer` - Answers
- ✅ `QAExpert` - Expert users
- ✅ `UserReputation` - Reputation tracking
- ✅ `QATag` - Question tags
- ✅ `QACategory` - Categories
- ✅ `QuestionVote` - Question voting
- ✅ `AnswerVote` - Answer voting
- ✅ `QuestionBookmark` - Bookmarks
- ✅ `QuestionView` - View tracking

**Reviews System:**
- ✅ `Review` - Reviews
- ✅ `CommunityReview` - Community reviews
- ✅ `ReviewComment` - Review comments
- ✅ `ReviewHelpfulness` - Helpfulness votes
- ✅ `ReviewImage` - Review images

**Social System:**
- ✅ `UserProfile` - User profiles
- ✅ `UserFriend` - Friendships
- ✅ `UserConnection` - Connections

**News System:**
- ✅ `Article` - News articles
- ✅ `NewsCategory` - Categories
- ✅ `NewsComment` - Comments
- ✅ `ArticleLike` - Likes
- ✅ `ArticleShare` - Shares
- ✅ `ArticleTag` - Tags
- ✅ `ArticleView` - View tracking

**Pages System:**
- ✅ `Page` - Wiki pages
- ✅ `PageContent` - Page content
- ✅ `PageComment` - Comments
- ✅ `PageRevision` - Version history
- ✅ `PageView` - View tracking

**Maps System:**
- ✅ `Location` - Locations
- ✅ `CheckIn` - Check-ins
- ✅ `PlaceReview` - Place reviews
- ✅ `LocationCategory` - Categories
- ✅ `LocationImage` - Images
- ✅ `LocationHour` - Operating hours

**Guides System:**
- ✅ `Guide` - Guides
- ✅ `GuideStep` - Guide steps
- ✅ `GuideBookmark` - Bookmarks
- ✅ `GuideRating` - Ratings
- ✅ `GuideView` - View tracking

### Controllers to Review/Create

**Action Plan:**
1. Check if controller exists
2. If exists: Review and enhance
3. If missing: Create with <300 lines
4. If large: Split into focused controllers

**Priority Controllers:**
- [ ] **PostsController** - REVIEW FIRST (check if exists)
- [ ] **CommentsController** - REVIEW FIRST (may be part of Posts)
- [ ] **GroupsController** - REVIEW FIRST
- [ ] **QuestionsController** - REVIEW FIRST
- [ ] **AnswersController** - REVIEW FIRST (may be part of QA)
- [ ] **SocialController** - REVIEW FIRST
- [ ] **ReviewsController** - REVIEW FIRST
- [ ] **NewsController** - REVIEW FIRST
- [ ] **PagesController** - REVIEW FIRST
- [ ] **MapsController** - REVIEW FIRST
- [ ] **GuidesController** - REVIEW FIRST

## File Organization Strategy

### Backend Structure (Split if >300 lines)
```
src/WebAPI/Controllers/Community/
├── Posts/
│   ├── PostsController.cs (<300 lines)
│   └── CommentsController.cs (<300 lines)
├── Groups/
│   └── GroupsController.cs (<300 lines)
├── QA/
│   ├── QuestionsController.cs (<300 lines)
│   └── AnswersController.cs (<300 lines)
├── Social/
│   ├── ProfilesController.cs (<300 lines)
│   └── ConnectionsController.cs (<300 lines)
├── Reviews/
│   └── ReviewsController.cs (<300 lines)
├── News/
│   └── NewsController.cs (<300 lines)
├── Pages/
│   └── PagesController.cs (<300 lines)
├── Maps/
│   └── MapsController.cs (<300 lines)
└── Guides/
    └── GuidesController.cs (<300 lines)
```

### Dashboard Structure (Split if types >200, services >250 lines)
```
ClientApp/Dashboard/src/
├── types/community/
│   ├── index.ts (barrel export)
│   ├── posts/
│   │   ├── index.ts
│   │   ├── post.ts (<200 lines)
│   │   ├── comment.ts (<200 lines)
│   │   └── requests.ts (<200 lines)
│   ├── groups/
│   │   ├── index.ts
│   │   └── group.ts (<200 lines)
│   ├── qa/
│   │   ├── index.ts
│   │   ├── question.ts (<200 lines)
│   │   ├── answer.ts (<200 lines)
│   │   └── reputation.ts (<200 lines)
│   └── [other features...]
├── services/community/
│   ├── index.ts (barrel export)
│   ├── posts/
│   │   ├── index.ts
│   │   ├── post.service.ts (<250 lines)
│   │   └── comment.service.ts (<250 lines)
│   ├── groups/
│   │   ├── index.ts
│   │   └── group.service.ts (<250 lines)
│   └── [other features...]
```

### Main App Structure (Split if models >200, services >250 lines)
```
ClientApp/Main/src/app/
├── core/models/community/
│   ├── index.ts (barrel export)
│   ├── posts/
│   │   ├── post.model.ts (<200 lines)
│   │   ├── comment.model.ts (<200 lines)
│   │   └── index.ts
│   ├── groups/
│   │   ├── group.model.ts (<200 lines)
│   │   └── index.ts
│   └── [other features...]
├── core/services/community/
│   ├── posts/
│   │   ├── post.service.ts (<250 lines)
│   │   ├── comment.service.ts (<250 lines)
│   │   └── index.ts
│   ├── groups/
│   │   ├── group.service.ts (<250 lines)
│   │   └── index.ts
│   └── [other features...]
```

## Consolidation Strategy

### Duplicate Removal Process

**Step 1: Identify Duplicates**
```
Dashboard Types          Main App Models          Action
─────────────────────────────────────────────────────────
types/post.ts       ←→   models/post.model.ts    → Consolidate
types/community/    ←→   models/community/       → Review overlap
post.ts                  post.model.ts
```

**Step 2: Choose Source of Truth**
- Keep the file that better matches backend DTOs
- Keep the file with better documentation
- Keep the file with more complete type definitions
- Remove the duplicate

**Step 3: Update Imports**
- Find all files importing the duplicate
- Update imports to use source of truth
- Verify no breaking changes

### File Splitting Process

**Step 1: Identify Large Files**
```bash
# Backend: Find files >300 lines
find src/WebAPI/Controllers -name "*.cs" -exec wc -l {} \; | awk '$1 > 300'

# Dashboard Types: Find files >200 lines
find ClientApp/Dashboard/src/types -name "*.ts" -exec wc -l {} \; | awk '$1 > 200'

# Services: Find files >250 lines
find ClientApp/Dashboard/src/services -name "*.ts" -exec wc -l {} \; | awk '$1 > 250'
```

**Step 2: Plan Split**
- Identify logical boundaries (e.g., Posts vs Comments)
- Ensure each split file has single responsibility
- Plan index file for clean exports

**Step 3: Execute Split**
- Create new focused files
- Move code maintaining functionality
- Create index file with exports
- Update all imports
- Verify no breaking changes

## Implementation Priorities

### Phase 1: Discovery (Week 1)
**Goal: Complete understanding of existing code**
- Review all backend controllers
- Review all backend services
- Review all Dashboard types and services
- Review all Main App models and services
- Document findings
- Create consolidation plan

### Phase 2: Consolidation (Week 2)
**Goal: Remove all duplicates**
- Remove duplicate Dashboard types
- Remove duplicate Main App models
- Remove duplicate Dashboard services
- Remove duplicate Main App services
- Update all imports
- Verify no regressions

### Phase 3: File Splitting (Week 3)
**Goal: All files under size limits**
- Split large backend controllers
- Split large backend services
- Split large Dashboard type files
- Split large Dashboard service files
- Split large Main App model files
- Split large Main App service files
- Create index files
- Update imports

### Phase 4: Enhancement (Week 4-6)
**Goal: Complete missing functionality**
- Enhance existing controllers
- Create missing controllers (if needed)
- Enhance existing services
- Create missing services (if needed)
- Add missing endpoints
- Ensure consistent patterns

### Phase 5: Frontend Integration (Week 7-8)
**Goal: Complete frontend implementations**
- Create/enhance Dashboard types
- Create/enhance Dashboard services
- Create/enhance Main App models
- Create/enhance Main App services
- Ensure consistency across frontends

## Success Criteria

✅ All existing implementations documented
✅ Zero duplicate files between applications
✅ All files under size limits
✅ Clear module boundaries
✅ Consistent naming conventions
✅ Types match backend DTOs exactly
✅ All TypeScript diagnostics pass
✅ No functional regressions

## Anti-Patterns to Avoid

❌ Creating new files without checking if they exist
❌ Duplicating types between Dashboard and Main App
❌ Creating monolithic files >300 lines
❌ Recreating existing functionality
❌ Inconsistent naming across applications
❌ Missing JSDoc comments
❌ Breaking existing consumers during refactoring

## Best Practices

✅ Always review before creating
✅ Consolidate duplicates immediately
✅ Split files proactively when approaching limits
✅ Use barrel exports (index.ts) for clean imports
✅ Match backend DTOs exactly
✅ Add comprehensive JSDoc comments
✅ Maintain backward compatibility
✅ Document all changes
