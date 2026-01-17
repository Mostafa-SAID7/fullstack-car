# Design Document: Community Platform Integration

## Overview

This design focuses on reviewing existing community platform implementations, consolidating duplicates, splitting long files, and ensuring proper integration without creating unnecessary new code.

## Review-First Approach

### Phase 1: Discovery and Analysis
1. **Review Backend**: Identify existing controllers, services, and entities
2. **Review Dashboard**: List all community-related types, services, and components
3. **Review Main App**: List all community-related models, services, and components
4. **Identify Duplicates**: Find duplicate implementations across applications
5. **Identify Long Files**: Find files exceeding 300 lines that need splitting
6. **Document Gaps**: List missing implementations that need creation

### Phase 2: Consolidation Strategy
1. **Remove Duplicates**: Eliminate duplicate type definitions and services
2. **Split Long Files**: Break large files into focused modules
3. **Enhance Existing**: Improve existing implementations rather than recreate
4. **Create Missing**: Only create new files for genuinely missing features
5. **Maintain Compatibility**: Ensure no breaking changes during refactoring

## Existing Community Features (Backend)

### Domain Entities (Already Exist)
- **Posts**: Post, Comment, PostLike, CommentLike, PostReport, PostView
- **Groups**: Group, GroupMember
- **QA**: Question, Answer, QAExpert, UserReputation, QATag, QACategory
- **Reviews**: Review, CommunityReview, ReviewComment, ReviewHelpfulness
- **Social**: UserProfile, UserFriend, UserConnection
- **News**: Article, NewsCategory, NewsComment, ArticleLike
- **Pages**: Page, PageContent, PageComment, PageRevision
- **Maps**: Location, CheckIn, PlaceReview, LocationCategory
- **Guides**: Guide, GuideStep, GuideBookmark, GuideRating

### Controllers to Review/Create
- [ ] PostsController - **NEEDS REVIEW** (check if exists)
- [ ] GroupsController - **NEEDS REVIEW**
- [ ] QAController - **NEEDS REVIEW**
- [ ] ReviewsController - **NEEDS REVIEW**
- [ ] SocialController - **NEEDS REVIEW**
- [ ] NewsController - **NEEDS REVIEW**
- [ ] PagesController - **NEEDS REVIEW**
- [ ] MapsController - **NEEDS REVIEW**
- [ ] GuidesController - **NEEDS REVIEW**

## File Organization Strategy

### Backend Structure
```
src/
├── WebAPI/Controllers/Community/
│   ├── Posts/
│   │   ├── PostsController.cs (<300 lines)
│   │   └── CommentsController.cs (<300 lines)
│   ├── Groups/
│   │   └── GroupsController.cs (<300 lines)
│   ├── QA/
│   │   ├── QuestionsController.cs (<300 lines)
│   │   └── AnswersController.cs (<300 lines)
│   └── [other features]
```

### Dashboard Structure
```
ClientApp/Dashboard/src/
├── types/community/
│   ├── posts/
│   │   ├── index.ts (exports)
│   │   ├── post.ts (<200 lines)
│   │   └── comment.ts (<200 lines)
│   ├── groups/
│   │   └── index.ts (<200 lines)
│   └── [other features]
├── services/community/
│   ├── posts/
│   │   ├── index.ts (exports)
│   │   ├── post.service.ts (<250 lines)
│   │   └── comment.service.ts (<250 lines)
│   └── [other features]
```

### Main App Structure
```
ClientApp/Main/src/app/
├── core/models/community/
│   ├── posts/
│   │   ├── post.model.ts (<200 lines)
│   │   └── comment.model.ts (<200 lines)
│   └── [other features]
├── core/services/community/
│   ├── posts/
│   │   ├── post.service.ts (<250 lines)
│   │   └── comment.service.ts (<250 lines)
│   └── [other features]
```

## Implementation Priorities

### High Priority (Core Features)
1. **Posts & Comments**: Most used community feature
2. **QA System**: Already has extensive backend infrastructure
3. **Social Connections**: User profiles and friendships

### Medium Priority
4. **Groups**: Community organization
5. **Reviews**: User feedback system
6. **News/Articles**: Content management

### Low Priority
7. **Pages**: Wiki-style content
8. **Maps**: Location-based features
9. **Guides**: Step-by-step tutorials

## Success Criteria

✅ All existing implementations documented
✅ No files exceed 300 lines
✅ No duplicate code between applications
✅ Clear module boundaries
✅ Consistent naming conventions
✅ All TypeScript diagnostics pass
