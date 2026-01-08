# Community Platform - Design Specification

## Architecture Overview

The Community Platform follows a Clean Architecture pattern with CQRS (Command Query Responsibility Segregation) and MediatR for request handling, maintaining consistency with the existing codebase architecture.

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  Angular Main App     │  Dashboard App    │  Mobile Apps        │
│  - Community Module   │  - Admin Panel    │  - iOS/Android      │
│  - Post Components    │  - Analytics      │  - PWA Support      │
│  - Group Management   │  - Moderation     │  - Maps Integration │
│  - QA System          │  - Reviews        │  - News Feed        │
│  - Friends Network    │  - Pages          │  - Guides System    │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  ASP.NET Core Web API │  SignalR Hubs     │  Authentication     │
│  - Community API      │  - Real-time      │  - JWT Tokens       │
│  - Posts API          │  - Notifications  │  - OAuth2           │
│  - Groups API         │  - Live Updates   │  - Role-based Auth  │
│  - QA API             │  - Location       │  - Page Verification│
│  - Reviews API        │  - News Updates   │  - Friend Requests  │
│  - Maps API           │  - Guide Progress │  - Review Moderation│
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                       Application Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  CQRS + MediatR       │  Domain Services  │  Event Handlers     │
│  - Command Handlers   │  - Business Logic │  - Domain Events    │
│  - Query Handlers     │  - Validation     │  - Integration      │
│  - DTOs & Mapping     │  - Authorization  │  - Notifications    │
│  - QA Logic           │  - Review System  │  - Location Services│
│  - Friend Management  │  - Page Mgmt      │  - News Curation    │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                       Infrastructure Layer                      │
├─────────────────────────────────────────────────────────────────┤
│  Entity Framework    │  External Services │  Caching & Storage  │
│  - SQL Server        │  - File Storage    │  - Redis Cache      │
│  - Repository Pattern│  - CDN Integration │  - Blob Storage     │
│  - Unit of Work      │  - Push Services   │  - Search Index     │
│  - Maps Integration  │  - News APIs       │  - Location Cache   │
│  - Review Analytics  │  - Fact Checking   │  - Guide Storage    │
└─────────────────────────────────────────────────────────────────┘
```

## Database Design

### Core Entities Schema

#### Users and Profiles
```sql
-- Extends existing User entity
ALTER TABLE Users ADD COLUMN
    Bio NVARCHAR(500),
    ProfileImageUrl NVARCHAR(2048),
    CoverImageUrl NVARCHAR(2048),
    Location NVARCHAR(100),
    Website NVARCHAR(500),
    DateOfBirth DATE,
    IsPrivateProfile BIT DEFAULT 0,
    LastActiveAt DATETIME2,
    NotificationPreferences NVARCHAR(MAX), -- JSON
    PrivacySettings NVARCHAR(MAX); -- JSON

-- User Connections (Friends/Followers)
CREATE TABLE UserConnections (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    RequesterId UNIQUEIDENTIFIER NOT NULL,
    ReceiverId UNIQUEIDENTIFIER NOT NULL,
    ConnectionType NVARCHAR(20) NOT NULL, -- 'Friend', 'Follow'
    Status NVARCHAR(20) NOT NULL, -- 'Pending', 'Accepted', 'Blocked'
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    AcceptedAt DATETIME2,
    FOREIGN KEY (RequesterId) REFERENCES Users(Id),
    FOREIGN KEY (ReceiverId) REFERENCES Users(Id),
    UNIQUE(RequesterId, ReceiverId)
);
```

#### Posts and Content
```sql
CREATE TABLE Posts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    GroupId UNIQUEIDENTIFIER NULL,
    Title NVARCHAR(200),
    Content NVARCHAR(MAX) NOT NULL,
    ContentType NVARCHAR(20) DEFAULT 'Text', -- 'Text', 'Image', 'Video', 'Link'
    MediaUrls NVARCHAR(MAX), -- JSON array
    LinkPreview NVARCHAR(MAX), -- JSON
    Visibility NVARCHAR(20) DEFAULT 'Public', -- 'Public', 'Friends', 'Group'
    IsScheduled BIT DEFAULT 0,
    ScheduledAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (GroupId) REFERENCES Groups(Id)
);

CREATE TABLE PostInteractions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PostId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    InteractionType NVARCHAR(20) NOT NULL, -- 'Like', 'Love', 'Laugh', 'Angry', 'Sad'
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (PostId) REFERENCES Posts(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    UNIQUE(PostId, UserId, InteractionType)
);

CREATE TABLE Comments (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PostId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    ParentCommentId UNIQUEIDENTIFIER NULL,
    Content NVARCHAR(2000) NOT NULL,
    MediaUrl NVARCHAR(2048),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    IsDeleted BIT DEFAULT 0,
    FOREIGN KEY (PostId) REFERENCES Posts(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (ParentCommentId) REFERENCES Comments(Id)
);
```

#### Groups and Communities
```sql
CREATE TABLE Groups (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(1000),
    CoverImageUrl NVARCHAR(2048),
    Visibility NVARCHAR(20) DEFAULT 'Public', -- 'Public', 'Private', 'Secret'
    JoinApproval NVARCHAR(20) DEFAULT 'Open', -- 'Open', 'Approval', 'Invite'
    Category NVARCHAR(50),
    Tags NVARCHAR(500), -- JSON array
    CreatedById UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    IsActive BIT DEFAULT 1,
    MemberCount INT DEFAULT 0,
    PostCount INT DEFAULT 0,
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

CREATE TABLE GroupMembers (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GroupId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Role NVARCHAR(20) DEFAULT 'Member', -- 'Owner', 'Admin', 'Moderator', 'Member'
    JoinedAt DATETIME2 DEFAULT GETUTCDATE(),
    InvitedById UNIQUEIDENTIFIER,
    Status NVARCHAR(20) DEFAULT 'Active', -- 'Active', 'Pending', 'Banned'
    FOREIGN KEY (GroupId) REFERENCES Groups(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (InvitedById) REFERENCES Users(Id),
    UNIQUE(GroupId, UserId)
);
```

#### Notifications and Messaging
```sql
CREATE TABLE Notifications (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- 'PostLike', 'Comment', 'Mention', 'GroupInvite'
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(500) NOT NULL,
    Data NVARCHAR(MAX), -- JSON payload
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    ReadAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE DirectMessages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SenderId UNIQUEIDENTIFIER NOT NULL,
    ReceiverId UNIQUEIDENTIFIER NOT NULL,
    Content NVARCHAR(2000) NOT NULL,
    MediaUrl NVARCHAR(2048),
    IsEncrypted BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    ReadAt DATETIME2,
    IsDeleted BIT DEFAULT 0,
    FOREIGN KEY (SenderId) REFERENCES Users(Id),
    FOREIGN KEY (ReceiverId) REFERENCES Users(Id)
);
```

#### Content Moderation
```sql
CREATE TABLE ContentReports (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ReporterId UNIQUEIDENTIFIER NOT NULL,
    ContentType NVARCHAR(20) NOT NULL, -- 'Post', 'Comment', 'User', 'Group'
    ContentId UNIQUEIDENTIFIER NOT NULL,
    Reason NVARCHAR(50) NOT NULL, -- 'Spam', 'Harassment', 'Inappropriate'
    Description NVARCHAR(1000),
    Status NVARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Reviewed', 'Resolved'
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    ReviewedAt DATETIME2,
    ReviewedById UNIQUEIDENTIFIER,
    Action NVARCHAR(50), -- 'NoAction', 'Warning', 'ContentRemoved', 'UserBanned'
    FOREIGN KEY (ReporterId) REFERENCES Users(Id),
    FOREIGN KEY (ReviewedById) REFERENCES Users(Id)
);

CREATE TABLE ModerationActions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ModeratorId UNIQUEIDENTIFIER NOT NULL,
    TargetUserId UNIQUEIDENTIFIER,
    TargetContentId UNIQUEIDENTIFIER,
    ContentType NVARCHAR(20), -- 'Post', 'Comment', 'User'
    Action NVARCHAR(50) NOT NULL, -- 'Warning', 'TempBan', 'PermBan', 'ContentRemoval'
    Reason NVARCHAR(500),
    Duration INT, -- In hours for temporary actions
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    ExpiresAt DATETIME2,
    FOREIGN KEY (ModeratorId) REFERENCES Users(Id),
    FOREIGN KEY (TargetUserId) REFERENCES Users(Id)
);
```

#### Question and Answer System
```sql
CREATE TABLE Questions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(300) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(100),
    Tags NVARCHAR(500), -- JSON array
    ViewCount INT DEFAULT 0,
    VoteScore INT DEFAULT 0,
    AnswerCount INT DEFAULT 0,
    AcceptedAnswerId UNIQUEIDENTIFIER,
    IsClosed BIT DEFAULT 0,
    ClosedReason NVARCHAR(200),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Answers (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    QuestionId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    VoteScore INT DEFAULT 0,
    IsAccepted BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (QuestionId) REFERENCES Questions(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE QAVotes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ContentId UNIQUEIDENTIFIER NOT NULL,
    ContentType NVARCHAR(20) NOT NULL, -- 'Question', 'Answer'
    VoteType NVARCHAR(10) NOT NULL, -- 'Up', 'Down'
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    UNIQUE(UserId, ContentId, ContentType)
);

CREATE TABLE UserReputation (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ReputationScore INT DEFAULT 0,
    QuestionsAsked INT DEFAULT 0,
    AnswersGiven INT DEFAULT 0,
    AcceptedAnswers INT DEFAULT 0,
    LastUpdated DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    UNIQUE(UserId)
);
```

#### Review and Rating System
```sql
CREATE TABLE Reviews (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    TargetType NVARCHAR(20) NOT NULL, -- 'Business', 'Service', 'Product', 'Event'
    TargetId UNIQUEIDENTIFIER NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Title NVARCHAR(200),
    Content NVARCHAR(2000),
    IsVerified BIT DEFAULT 0,
    HelpfulVotes INT DEFAULT 0,
    UnhelpfulVotes INT DEFAULT 0,
    Status NVARCHAR(20) DEFAULT 'Published', -- 'Published', 'Hidden', 'Flagged'
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE ReviewImages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ReviewId UNIQUEIDENTIFIER NOT NULL,
    ImageUrl NVARCHAR(2048) NOT NULL,
    Caption NVARCHAR(200),
    Position INT DEFAULT 0,
    FOREIGN KEY (ReviewId) REFERENCES Reviews(Id)
);

CREATE TABLE ReviewHelpfulness (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ReviewId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    IsHelpful BIT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (ReviewId) REFERENCES Reviews(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    UNIQUE(ReviewId, UserId)
);
```

#### Community Pages
```sql
CREATE TABLE CommunityPages (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OwnerId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    Category NVARCHAR(50) NOT NULL, -- 'Business', 'Organization', 'PublicFigure', 'Brand'
    ProfileImageUrl NVARCHAR(2048),
    CoverImageUrl NVARCHAR(2048),
    Website NVARCHAR(500),
    Phone NVARCHAR(20),
    Email NVARCHAR(200),
    Address NVARCHAR(500),
    City NVARCHAR(100),
    State NVARCHAR(100),
    Country NVARCHAR(100),
    PostalCode NVARCHAR(20),
    Latitude DECIMAL(10,8),
    Longitude DECIMAL(11,8),
    IsVerified BIT DEFAULT 0,
    VerifiedAt DATETIME2,
    FollowerCount INT DEFAULT 0,
    PostCount INT DEFAULT 0,
    Rating DECIMAL(3,2) DEFAULT 0,
    ReviewCount INT DEFAULT 0,
    BusinessHours NVARCHAR(MAX), -- JSON
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (OwnerId) REFERENCES Users(Id)
);

CREATE TABLE PageFollowers (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PageId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    FollowedAt DATETIME2 DEFAULT GETUTCDATE(),
    NotificationsEnabled BIT DEFAULT 1,
    FOREIGN KEY (PageId) REFERENCES CommunityPages(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    UNIQUE(PageId, UserId)
);
```

#### News and Content Curation
```sql
CREATE TABLE NewsArticles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(300) NOT NULL,
    Summary NVARCHAR(1000),
    Content NVARCHAR(MAX),
    SourceName NVARCHAR(200),
    SourceUrl NVARCHAR(2048),
    AuthorName NVARCHAR(200),
    ImageUrl NVARCHAR(2048),
    Category NVARCHAR(100),
    Tags NVARCHAR(500), -- JSON array
    PublishedAt DATETIME2,
    ViewCount INT DEFAULT 0,
    ShareCount INT DEFAULT 0,
    IsFactChecked BIT DEFAULT 0,
    FactCheckStatus NVARCHAR(20), -- 'Verified', 'Disputed', 'False'
    CredibilityScore DECIMAL(3,2),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2
);

CREATE TABLE UserNewsPreferences (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Categories NVARCHAR(MAX), -- JSON array
    Sources NVARCHAR(MAX), -- JSON array
    Keywords NVARCHAR(MAX), -- JSON array
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    UNIQUE(UserId)
);
```

#### Maps and Location Features
```sql
CREATE TABLE Locations (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    Address NVARCHAR(500),
    City NVARCHAR(100),
    State NVARCHAR(100),
    Country NVARCHAR(100),
    PostalCode NVARCHAR(20),
    Latitude DECIMAL(10,8) NOT NULL,
    Longitude DECIMAL(11,8) NOT NULL,
    Category NVARCHAR(100),
    PlaceType NVARCHAR(50), -- 'Business', 'Landmark', 'Event', 'UserDefined'
    CreatedById UNIQUEIDENTIFIER,
    IsVerified BIT DEFAULT 0,
    CheckinCount INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (CreatedById) REFERENCES Users(Id)
);

CREATE TABLE UserCheckins (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    LocationId UNIQUEIDENTIFIER NOT NULL,
    Message NVARCHAR(500),
    ImageUrl NVARCHAR(2048),
    Visibility NVARCHAR(20) DEFAULT 'Friends', -- 'Public', 'Friends', 'Private'
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (LocationId) REFERENCES Locations(Id)
);

CREATE TABLE LocationPosts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    PostId UNIQUEIDENTIFIER NOT NULL,
    LocationId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (PostId) REFERENCES Posts(Id),
    FOREIGN KEY (LocationId) REFERENCES Locations(Id),
    UNIQUE(PostId, LocationId)
);
```

#### Guides and Tutorial System
```sql
CREATE TABLE Guides (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CreatorId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(300) NOT NULL,
    Description NVARCHAR(1000),
    Category NVARCHAR(100),
    DifficultyLevel NVARCHAR(20), -- 'Beginner', 'Intermediate', 'Advanced'
    EstimatedDuration INT, -- in minutes
    CoverImageUrl NVARCHAR(2048),
    Tags NVARCHAR(500), -- JSON array
    ViewCount INT DEFAULT 0,
    CompletionCount INT DEFAULT 0,
    Rating DECIMAL(3,2) DEFAULT 0,
    ReviewCount INT DEFAULT 0,
    IsPublished BIT DEFAULT 0,
    PublishedAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (CreatorId) REFERENCES Users(Id)
);

CREATE TABLE GuideSteps (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GuideId UNIQUEIDENTIFIER NOT NULL,
    StepNumber INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    MediaUrl NVARCHAR(2048),
    MediaType NVARCHAR(20), -- 'Image', 'Video', 'Audio'
    EstimatedDuration INT, -- in minutes
    IsOptional BIT DEFAULT 0,
    FOREIGN KEY (GuideId) REFERENCES Guides(Id),
    UNIQUE(GuideId, StepNumber)
);

CREATE TABLE UserGuideProgress (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    GuideId UNIQUEIDENTIFIER NOT NULL,
    CurrentStep INT DEFAULT 1,
    CompletedSteps NVARCHAR(MAX), -- JSON array of completed step numbers
    IsCompleted BIT DEFAULT 0,
    CompletedAt DATETIME2,
    StartedAt DATETIME2 DEFAULT GETUTCDATE(),
    LastAccessedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (GuideId) REFERENCES Guides(Id),
    UNIQUE(UserId, GuideId)
);

CREATE TABLE GuideCollaborators (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    GuideId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Role NVARCHAR(20) DEFAULT 'Contributor', -- 'Owner', 'Editor', 'Contributor'
    InvitedAt DATETIME2 DEFAULT GETUTCDATE(),
    AcceptedAt DATETIME2,
    FOREIGN KEY (GuideId) REFERENCES Guides(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    UNIQUE(GuideId, UserId)
);
```

## API Design

### RESTful Endpoints

#### Posts API
```csharp
[ApiController]
[Route("api/v7/community/posts")]
public class PostsController : ControllerBase
{
    // GET api/v7/community/posts/feed
    [HttpGet("feed")]
    public async Task<ActionResult<PagedResult<PostDto>>> GetFeed(
        [FromQuery] GetFeedQuery query)

    // POST api/v7/community/posts
    [HttpPost]
    public async Task<ActionResult<PostDto>> CreatePost(
        [FromBody] CreatePostCommand command)

    // PUT api/v7/community/posts/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<PostDto>> UpdatePost(
        Guid id, [FromBody] UpdatePostCommand command)

    // DELETE api/v7/community/posts/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePost(Guid id)

    // POST api/v7/community/posts/{id}/interactions
    [HttpPost("{id}/interactions")]
    public async Task<ActionResult> InteractWithPost(
        Guid id, [FromBody] CreatePostInteractionCommand command)

    // GET api/v7/community/posts/{id}/comments
    [HttpGet("{id}/comments")]
    public async Task<ActionResult<PagedResult<CommentDto>>> GetComments(
        Guid id, [FromQuery] GetCommentsQuery query)
}
```

#### Groups API
```csharp
[ApiController]
[Route("api/v7/community/groups")]
public class GroupsController : ControllerBase
{
    // GET api/v7/community/groups
    [HttpGet]
    public async Task<ActionResult<PagedResult<GroupDto>>> GetGroups(
        [FromQuery] GetGroupsQuery query)

    // POST api/v7/community/groups
    [HttpPost]
    public async Task<ActionResult<GroupDto>> CreateGroup(
        [FromBody] CreateGroupCommand command)

    // POST api/v7/community/groups/{id}/join
    [HttpPost("{id}/join")]
    public async Task<ActionResult> JoinGroup(Guid id)

    // POST api/v7/community/groups/{id}/members/{userId}/role
    [HttpPost("{id}/members/{userId}/role")]
    public async Task<ActionResult> UpdateMemberRole(
        Guid id, Guid userId, [FromBody] UpdateMemberRoleCommand command)

    // GET api/v7/community/groups/{id}/posts
    [HttpGet("{id}/posts")]
    public async Task<ActionResult<PagedResult<PostDto>>> GetGroupPosts(
        Guid id, [FromQuery] GetGroupPostsQuery query)
}
```

#### User Profiles API
```csharp
[ApiController]
[Route("api/v7/community/users")]
public class UserProfilesController : ControllerBase
{
    // GET api/v7/community/users/{id}/profile
    [HttpGet("{id}/profile")]
    public async Task<ActionResult<UserProfileDto>> GetProfile(Guid id)

    // PUT api/v7/community/users/profile
    [HttpPut("profile")]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile(
        [FromBody] UpdateProfileCommand command)

    // POST api/v7/community/users/{id}/connect
    [HttpPost("{id}/connect")]
    public async Task<ActionResult> SendConnectionRequest(
        Guid id, [FromBody] CreateConnectionCommand command)

    // GET api/v7/community/users/connections
    [HttpGet("connections")]
    public async Task<ActionResult<PagedResult<UserConnectionDto>>> GetConnections(
        [FromQuery] GetConnectionsQuery query)
}
```

### SignalR Hubs

#### Community Hub
```csharp
[Authorize]
public class CommunityHub : Hub
{
    public async Task JoinGroup(string groupId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"group_{groupId}");
    }

    public async Task LeaveGroup(string groupId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"group_{groupId}");
    }

    public async Task JoinUserNotifications(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
    }

    // Real-time post updates
    public async Task SendPostUpdate(string groupId, object postData)
    {
        await Clients.Group($"group_{groupId}").SendAsync("PostUpdated", postData);
    }

    // Real-time notifications
    public async Task SendNotification(string userId, object notification)
    {
        await Clients.Group($"user_{userId}").SendAsync("NotificationReceived", notification);
    }

    // Typing indicators for comments
    public async Task StartTyping(string postId)
    {
        await Clients.Others.SendAsync("UserTyping", Context.UserIdentifier, postId);
    }

    public async Task StopTyping(string postId)
    {
        await Clients.Others.SendAsync("UserStoppedTyping", Context.UserIdentifier, postId);
    }
}
```

## CQRS Implementation

### Command Examples

#### Create Post Command
```csharp
public class CreatePostCommand : IRequest<PostDto>
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string ContentType { get; set; } = "Text";
    public List<string> MediaUrls { get; set; } = new();
    public Guid? GroupId { get; set; }
    public string Visibility { get; set; } = "Public";
    public DateTime? ScheduledAt { get; set; }
}

public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, PostDto>
{
    private readonly IRepository<Post> _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public async Task<PostDto> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        var post = new Post
        {
            UserId = _currentUserService.UserId,
            Title = request.Title,
            Content = request.Content,
            ContentType = request.ContentType,
            MediaUrls = JsonSerializer.Serialize(request.MediaUrls),
            GroupId = request.GroupId,
            Visibility = request.Visibility,
            ScheduledAt = request.ScheduledAt,
            CreatedAt = DateTime.UtcNow
        };

        await _postRepository.AddAsync(post);
        await _postRepository.SaveChangesAsync();

        // Publish domain event
        await _mediator.Publish(new PostCreatedEvent(post.Id, post.UserId, post.GroupId));

        return _mapper.Map<PostDto>(post);
    }
}
```

### Query Examples

#### Get Feed Query
```csharp
public class GetFeedQuery : IRequest<PagedResult<PostDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string FeedType { get; set; } = "Following"; // "Following", "Trending", "Recent"
    public List<string> ContentTypes { get; set; } = new();
}

public class GetFeedQueryHandler : IRequestHandler<GetFeedQuery, PagedResult<PostDto>>
{
    private readonly IRepository<Post> _postRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IFeedAlgorithmService _feedAlgorithmService;

    public async Task<PagedResult<PostDto>> Handle(GetFeedQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        
        var query = _postRepository.Query()
            .Where(p => !p.IsDeleted)
            .Where(p => p.ScheduledAt == null || p.ScheduledAt <= DateTime.UtcNow);

        // Apply feed algorithm
        query = await _feedAlgorithmService.ApplyFeedLogic(query, userId, request.FeedType);

        // Apply content type filter
        if (request.ContentTypes.Any())
        {
            query = query.Where(p => request.ContentTypes.Contains(p.ContentType));
        }

        var posts = await query
            .Include(p => p.User)
            .Include(p => p.Group)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var totalCount = await query.CountAsync();

        return new PagedResult<PostDto>
        {
            Items = _mapper.Map<List<PostDto>>(posts),
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
```

## Domain Events

### Event Definitions
```csharp
public class PostCreatedEvent : DomainEvent
{
    public Guid PostId { get; }
    public Guid UserId { get; }
    public Guid? GroupId { get; }

    public PostCreatedEvent(Guid postId, Guid userId, Guid? groupId)
    {
        PostId = postId;
        UserId = userId;
        GroupId = groupId;
    }
}

public class PostInteractionEvent : DomainEvent
{
    public Guid PostId { get; }
    public Guid UserId { get; }
    public string InteractionType { get; }

    public PostInteractionEvent(Guid postId, Guid userId, string interactionType)
    {
        PostId = postId;
        UserId = userId;
        InteractionType = interactionType;
    }
}
```

### Event Handlers
```csharp
public class PostCreatedEventHandler : INotificationHandler<PostCreatedEvent>
{
    private readonly INotificationService _notificationService;
    private readonly IRepository<UserConnection> _connectionRepository;
    private readonly ICommunityHubService _hubService;

    public async Task Handle(PostCreatedEvent notification, CancellationToken cancellationToken)
    {
        // Notify followers
        var followers = await _connectionRepository.Query()
            .Where(c => c.ReceiverId == notification.UserId && c.Status == "Accepted")
            .Select(c => c.RequesterId)
            .ToListAsync();

        foreach (var followerId in followers)
        {
            await _notificationService.SendNotificationAsync(new NotificationDto
            {
                UserId = followerId,
                Type = "NewPost",
                Title = "New Post",
                Message = "Someone you follow posted something new",
                Data = JsonSerializer.Serialize(new { PostId = notification.PostId })
            });
        }

        // Notify group members if it's a group post
        if (notification.GroupId.HasValue)
        {
            await _hubService.NotifyGroupMembers(notification.GroupId.Value, "NewGroupPost", new
            {
                PostId = notification.PostId,
                UserId = notification.UserId
            });
        }
    }
}
```

## Frontend Architecture

### Angular Module Structure
```typescript
// community.module.ts
@NgModule({
  declarations: [
    CommunityMainComponent,
    PostListComponent,
    PostItemComponent,
    CreatePostComponent,
    GroupListComponent,
    GroupCardComponent,
    UserProfileComponent,
    CommentThreadComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CommunityRoutingModule,
    SharedModule
  ],
  providers: [
    PostService,
    GroupService,
    UserProfileService,
    NotificationService,
    CommunitySignalRService
  ]
})
export class CommunityModule { }
```

### State Management with NgRx
```typescript
// community.state.ts
export interface CommunityState {
  posts: {
    feed: Post[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;
  };
  groups: {
    myGroups: Group[];
    suggestedGroups: Group[];
    loading: boolean;
  };
  notifications: {
    unreadCount: number;
    items: Notification[];
  };
  currentUser: UserProfile | null;
}

// community.actions.ts
export const CommunityActions = createActionGroup({
  source: 'Community',
  events: {
    'Load Feed': props<{ page?: number; refresh?: boolean }>(),
    'Load Feed Success': props<{ posts: Post[]; hasMore: boolean }>(),
    'Load Feed Failure': props<{ error: string }>(),
    'Create Post': props<{ post: CreatePostRequest }>(),
    'Create Post Success': props<{ post: Post }>(),
    'Like Post': props<{ postId: string }>(),
    'Join Group': props<{ groupId: string }>(),
    'Real Time Post Update': props<{ post: Post }>(),
    'Real Time Notification': props<{ notification: Notification }>()
  }
});
```

### SignalR Integration
```typescript
// community-signalr.service.ts
@Injectable()
export class CommunitySignalRService {
  private hubConnection: HubConnection;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/hubs/community', {
        accessTokenFactory: () => this.authService.getToken()
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(() => {
      this.registerEventHandlers();
      this.joinUserNotifications();
    });
  }

  private registerEventHandlers(): void {
    this.hubConnection.on('PostUpdated', (post: Post) => {
      this.store.dispatch(CommunityActions.realTimePostUpdate({ post }));
    });

    this.hubConnection.on('NotificationReceived', (notification: Notification) => {
      this.store.dispatch(CommunityActions.realTimeNotification({ notification }));
    });

    this.hubConnection.on('UserTyping', (userId: string, postId: string) => {
      // Handle typing indicators
    });
  }

  public joinGroup(groupId: string): void {
    this.hubConnection.invoke('JoinGroup', groupId);
  }

  public leaveGroup(groupId: string): void {
    this.hubConnection.invoke('LeaveGroup', groupId);
  }
}
```

## Security Implementation

### Authorization Policies
```csharp
// Startup.cs or Program.cs
services.AddAuthorization(options =>
{
    options.AddPolicy("CanCreatePost", policy =>
        policy.RequireAuthenticatedUser()
              .RequireClaim("permission", "posts:create"));

    options.AddPolicy("CanModerateGroup", policy =>
        policy.RequireAuthenticatedUser()
              .AddRequirements(new GroupModeratorRequirement()));

    options.AddPolicy("CanAccessPrivateProfile", policy =>
        policy.RequireAuthenticatedUser()
              .AddRequirements(new ProfileAccessRequirement()));
});
```

### Custom Authorization Requirements
```csharp
public class GroupModeratorRequirement : IAuthorizationRequirement { }

public class GroupModeratorHandler : AuthorizationHandler<GroupModeratorRequirement>
{
    private readonly IRepository<GroupMember> _groupMemberRepository;

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        GroupModeratorRequirement requirement)
    {
        var userId = context.User.GetUserId();
        var groupId = context.Resource as Guid?;

        if (groupId.HasValue)
        {
            var member = await _groupMemberRepository.Query()
                .FirstOrDefaultAsync(m => m.UserId == userId && 
                                         m.GroupId == groupId.Value &&
                                         (m.Role == "Owner" || m.Role == "Admin" || m.Role == "Moderator"));

            if (member != null)
            {
                context.Succeed(requirement);
            }
        }
    }
}
```

## Performance Optimization

### Caching Strategy
```csharp
public class CachedPostService : IPostService
{
    private readonly IPostService _postService;
    private readonly ICacheService _cacheService;
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(15);

    public async Task<PagedResult<PostDto>> GetFeedAsync(GetFeedQuery query)
    {
        var cacheKey = $"feed:{query.UserId}:{query.Page}:{query.FeedType}";
        
        var cachedResult = await _cacheService.GetAsync<PagedResult<PostDto>>(cacheKey);
        if (cachedResult != null)
        {
            return cachedResult;
        }

        var result = await _postService.GetFeedAsync(query);
        await _cacheService.SetAsync(cacheKey, result, _cacheDuration);
        
        return result;
    }
}
```

### Database Indexing
```sql
-- Performance indexes
CREATE INDEX IX_Posts_UserId_CreatedAt ON Posts(UserId, CreatedAt DESC);
CREATE INDEX IX_Posts_GroupId_CreatedAt ON Posts(GroupId, CreatedAt DESC) WHERE GroupId IS NOT NULL;
CREATE INDEX IX_PostInteractions_PostId_Type ON PostInteractions(PostId, InteractionType);
CREATE INDEX IX_Comments_PostId_CreatedAt ON Comments(PostId, CreatedAt);
CREATE INDEX IX_UserConnections_ReceiverId_Status ON UserConnections(ReceiverId, Status);
CREATE INDEX IX_Notifications_UserId_IsRead_CreatedAt ON Notifications(UserId, IsRead, CreatedAt DESC);
```

## Integration Points

### File Upload Service
```csharp
public interface IMediaUploadService
{
    Task<string> UploadImageAsync(IFormFile file, string folder = "posts");
    Task<string> UploadVideoAsync(IFormFile file, string folder = "posts");
    Task<MediaProcessingResult> ProcessMediaAsync(string url);
    Task DeleteMediaAsync(string url);
}

public class MediaUploadService : IMediaUploadService
{
    private readonly IBlobStorageService _blobStorage;
    private readonly IImageProcessingService _imageProcessing;
    private readonly IVideoProcessingService _videoProcessing;

    public async Task<string> UploadImageAsync(IFormFile file, string folder = "posts")
    {
        // Validate file type and size
        if (!IsValidImageFile(file))
            throw new InvalidOperationException("Invalid image file");

        // Process and optimize image
        var processedImage = await _imageProcessing.OptimizeAsync(file.OpenReadStream());
        
        // Upload to blob storage
        var fileName = $"{folder}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var url = await _blobStorage.UploadAsync(fileName, processedImage, file.ContentType);
        
        return url;
    }
}
```

### Push Notification Service
```csharp
public interface IPushNotificationService
{
    Task SendToUserAsync(Guid userId, PushNotificationDto notification);
    Task SendToGroupAsync(Guid groupId, PushNotificationDto notification);
    Task RegisterDeviceAsync(Guid userId, DeviceRegistrationDto device);
}

public class PushNotificationService : IPushNotificationService
{
    private readonly IFirebaseService _firebase;
    private readonly IApnsService _apns;
    private readonly IRepository<UserDevice> _deviceRepository;

    public async Task SendToUserAsync(Guid userId, PushNotificationDto notification)
    {
        var devices = await _deviceRepository.Query()
            .Where(d => d.UserId == userId && d.IsActive)
            .ToListAsync();

        var tasks = devices.Select(device => SendToDeviceAsync(device, notification));
        await Task.WhenAll(tasks);
    }

    private async Task SendToDeviceAsync(UserDevice device, PushNotificationDto notification)
    {
        try
        {
            switch (device.Platform)
            {
                case "iOS":
                    await _apns.SendAsync(device.Token, notification);
                    break;
                case "Android":
                    await _firebase.SendAsync(device.Token, notification);
                    break;
            }
        }
        catch (Exception ex)
        {
            // Log error and potentially deactivate device token
        }
    }
}
```

## Monitoring and Analytics

### Application Insights Integration
```csharp
public class CommunityTelemetryService
{
    private readonly TelemetryClient _telemetryClient;

    public void TrackPostCreated(Guid userId, string contentType, Guid? groupId)
    {
        _telemetryClient.TrackEvent("PostCreated", new Dictionary<string, string>
        {
            ["UserId"] = userId.ToString(),
            ["ContentType"] = contentType,
            ["GroupId"] = groupId?.ToString(),
            ["Timestamp"] = DateTime.UtcNow.ToString("O")
        });
    }

    public void TrackUserEngagement(Guid userId, string action, string target)
    {
        _telemetryClient.TrackEvent("UserEngagement", new Dictionary<string, string>
        {
            ["UserId"] = userId.ToString(),
            ["Action"] = action,
            ["Target"] = target,
            ["Timestamp"] = DateTime.UtcNow.ToString("O")
        });
    }
}
```

#### Question and Answer API
```csharp
[ApiController]
[Route("api/v7/community/qa")]
public class QAController : ControllerBase
{
    // GET api/v7/community/qa/questions
    [HttpGet("questions")]
    public async Task<ActionResult<PagedResult<QuestionDto>>> GetQuestions(
        [FromQuery] GetQuestionsQuery query)

    // POST api/v7/community/qa/questions
    [HttpPost("questions")]
    public async Task<ActionResult<QuestionDto>> CreateQuestion(
        [FromBody] CreateQuestionCommand command)

    // GET api/v7/community/qa/questions/{id}
    [HttpGet("questions/{id}")]
    public async Task<ActionResult<QuestionDetailDto>> GetQuestion(Guid id)

    // POST api/v7/community/qa/questions/{id}/answers
    [HttpPost("questions/{id}/answers")]
    public async Task<ActionResult<AnswerDto>> CreateAnswer(
        Guid id, [FromBody] CreateAnswerCommand command)

    // POST api/v7/community/qa/answers/{id}/accept
    [HttpPost("answers/{id}/accept")]
    public async Task<ActionResult> AcceptAnswer(Guid id)

    // POST api/v7/community/qa/vote
    [HttpPost("vote")]
    public async Task<ActionResult> Vote([FromBody] CreateVoteCommand command)

    // GET api/v7/community/qa/users/{id}/reputation
    [HttpGet("users/{id}/reputation")]
    public async Task<ActionResult<UserReputationDto>> GetUserReputation(Guid id)
}
```

#### Reviews API
```csharp
[ApiController]
[Route("api/v7/community/reviews")]
public class ReviewsController : ControllerBase
{
    // GET api/v7/community/reviews
    [HttpGet]
    public async Task<ActionResult<PagedResult<ReviewDto>>> GetReviews(
        [FromQuery] GetReviewsQuery query)

    // POST api/v7/community/reviews
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview(
        [FromBody] CreateReviewCommand command)

    // PUT api/v7/community/reviews/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<ReviewDto>> UpdateReview(
        Guid id, [FromBody] UpdateReviewCommand command)

    // POST api/v7/community/reviews/{id}/helpful
    [HttpPost("{id}/helpful")]
    public async Task<ActionResult> MarkReviewHelpful(
        Guid id, [FromBody] MarkReviewHelpfulCommand command)

    // GET api/v7/community/reviews/target/{targetType}/{targetId}
    [HttpGet("target/{targetType}/{targetId}")]
    public async Task<ActionResult<ReviewSummaryDto>> GetTargetReviews(
        string targetType, Guid targetId)

    // POST api/v7/community/reviews/{id}/images
    [HttpPost("{id}/images")]
    public async Task<ActionResult> UploadReviewImages(
        Guid id, [FromForm] List<IFormFile> images)
}
```

#### Friends Network API
```csharp
[ApiController]
[Route("api/v7/community/friends")]
public class FriendsController : ControllerBase
{
    // GET api/v7/community/friends
    [HttpGet]
    public async Task<ActionResult<PagedResult<FriendDto>>> GetFriends(
        [FromQuery] GetFriendsQuery query)

    // POST api/v7/community/friends/request
    [HttpPost("request")]
    public async Task<ActionResult> SendFriendRequest(
        [FromBody] SendFriendRequestCommand command)

    // POST api/v7/community/friends/accept/{requestId}
    [HttpPost("accept/{requestId}")]
    public async Task<ActionResult> AcceptFriendRequest(Guid requestId)

    // POST api/v7/community/friends/decline/{requestId}
    [HttpPost("decline/{requestId}")]
    public async Task<ActionResult> DeclineFriendRequest(Guid requestId)

    // DELETE api/v7/community/friends/{friendId}
    [HttpDelete("{friendId}")]
    public async Task<ActionResult> RemoveFriend(Guid friendId)

    // GET api/v7/community/friends/suggestions
    [HttpGet("suggestions")]
    public async Task<ActionResult<List<UserSuggestionDto>>> GetFriendSuggestions()

    // GET api/v7/community/friends/requests
    [HttpGet("requests")]
    public async Task<ActionResult<PagedResult<FriendRequestDto>>> GetFriendRequests(
        [FromQuery] GetFriendRequestsQuery query)

    // POST api/v7/community/friends/{friendId}/lists
    [HttpPost("{friendId}/lists")]
    public async Task<ActionResult> AddFriendToList(
        Guid friendId, [FromBody] AddFriendToListCommand command)
}
```

#### Community Pages API
```csharp
[ApiController]
[Route("api/v7/community/pages")]
public class CommunityPagesController : ControllerBase
{
    // GET api/v7/community/pages
    [HttpGet]
    public async Task<ActionResult<PagedResult<CommunityPageDto>>> GetPages(
        [FromQuery] GetPagesQuery query)

    // POST api/v7/community/pages
    [HttpPost]
    public async Task<ActionResult<CommunityPageDto>> CreatePage(
        [FromBody] CreatePageCommand command)

    // GET api/v7/community/pages/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<CommunityPageDetailDto>> GetPage(Guid id)

    // PUT api/v7/community/pages/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<CommunityPageDto>> UpdatePage(
        Guid id, [FromBody] UpdatePageCommand command)

    // POST api/v7/community/pages/{id}/follow
    [HttpPost("{id}/follow")]
    public async Task<ActionResult> FollowPage(Guid id)

    // DELETE api/v7/community/pages/{id}/follow
    [HttpDelete("{id}/follow")]
    public async Task<ActionResult> UnfollowPage(Guid id)

    // POST api/v7/community/pages/{id}/verify
    [HttpPost("{id}/verify")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> VerifyPage(Guid id)

    // GET api/v7/community/pages/{id}/analytics
    [HttpGet("{id}/analytics")]
    public async Task<ActionResult<PageAnalyticsDto>> GetPageAnalytics(Guid id)

    // POST api/v7/community/pages/{id}/posts
    [HttpPost("{id}/posts")]
    public async Task<ActionResult<PostDto>> CreatePagePost(
        Guid id, [FromBody] CreatePagePostCommand command)
}
```

#### News Feed API
```csharp
[ApiController]
[Route("api/v7/community/news")]
public class NewsController : ControllerBase
{
    // GET api/v7/community/news
    [HttpGet]
    public async Task<ActionResult<PagedResult<NewsArticleDto>>> GetNews(
        [FromQuery] GetNewsQuery query)

    // GET api/v7/community/news/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<NewsArticleDetailDto>> GetNewsArticle(Guid id)

    // POST api/v7/community/news/{id}/view
    [HttpPost("{id}/view")]
    public async Task<ActionResult> TrackNewsView(Guid id)

    // POST api/v7/community/news/{id}/share
    [HttpPost("{id}/share")]
    public async Task<ActionResult> ShareNewsArticle(Guid id)

    // GET api/v7/community/news/categories
    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetNewsCategories()

    // GET api/v7/community/news/sources
    [HttpGet("sources")]
    public async Task<ActionResult<List<NewsSourceDto>>> GetNewsSources()

    // PUT api/v7/community/news/preferences
    [HttpPut("preferences")]
    public async Task<ActionResult> UpdateNewsPreferences(
        [FromBody] UpdateNewsPreferencesCommand command)

    // GET api/v7/community/news/preferences
    [HttpGet("preferences")]
    public async Task<ActionResult<UserNewsPreferencesDto>> GetNewsPreferences()
}
```

#### Maps and Location API
```csharp
[ApiController]
[Route("api/v7/community/maps")]
public class MapsController : ControllerBase
{
    // GET api/v7/community/maps/locations
    [HttpGet("locations")]
    public async Task<ActionResult<PagedResult<LocationDto>>> GetLocations(
        [FromQuery] GetLocationsQuery query)

    // POST api/v7/community/maps/locations
    [HttpPost("locations")]
    public async Task<ActionResult<LocationDto>> CreateLocation(
        [FromBody] CreateLocationCommand command)

    // GET api/v7/community/maps/locations/{id}
    [HttpGet("locations/{id}")]
    public async Task<ActionResult<LocationDetailDto>> GetLocation(Guid id)

    // POST api/v7/community/maps/checkin
    [HttpPost("checkin")]
    public async Task<ActionResult<CheckinDto>> CreateCheckin(
        [FromBody] CreateCheckinCommand command)

    // GET api/v7/community/maps/checkins/nearby
    [HttpGet("checkins/nearby")]
    public async Task<ActionResult<List<CheckinDto>>> GetNearbyCheckins(
        [FromQuery] GetNearbyCheckinsQuery query)

    // GET api/v7/community/maps/posts/nearby
    [HttpGet("posts/nearby")]
    public async Task<ActionResult<PagedResult<PostDto>>> GetNearbyPosts(
        [FromQuery] GetNearbyPostsQuery query)

    // POST api/v7/community/maps/locations/{id}/verify
    [HttpPost("locations/{id}/verify")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult> VerifyLocation(Guid id)

    // GET api/v7/community/maps/search
    [HttpGet("search")]
    public async Task<ActionResult<List<LocationDto>>> SearchLocations(
        [FromQuery] SearchLocationsQuery query)
}
```

#### Guides System API
```csharp
[ApiController]
[Route("api/v7/community/guides")]
public class GuidesController : ControllerBase
{
    // GET api/v7/community/guides
    [HttpGet]
    public async Task<ActionResult<PagedResult<GuideDto>>> GetGuides(
        [FromQuery] GetGuidesQuery query)

    // POST api/v7/community/guides
    [HttpPost]
    public async Task<ActionResult<GuideDto>> CreateGuide(
        [FromBody] CreateGuideCommand command)

    // GET api/v7/community/guides/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<GuideDetailDto>> GetGuide(Guid id)

    // PUT api/v7/community/guides/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<GuideDto>> UpdateGuide(
        Guid id, [FromBody] UpdateGuideCommand command)

    // POST api/v7/community/guides/{id}/steps
    [HttpPost("{id}/steps")]
    public async Task<ActionResult<GuideStepDto>> CreateGuideStep(
        Guid id, [FromBody] CreateGuideStepCommand command)

    // PUT api/v7/community/guides/{id}/steps/{stepId}
    [HttpPut("{id}/steps/{stepId}")]
    public async Task<ActionResult<GuideStepDto>> UpdateGuideStep(
        Guid id, Guid stepId, [FromBody] UpdateGuideStepCommand command)

    // POST api/v7/community/guides/{id}/start
    [HttpPost("{id}/start")]
    public async Task<ActionResult<UserGuideProgressDto>> StartGuide(Guid id)

    // POST api/v7/community/guides/{id}/complete-step
    [HttpPost("{id}/complete-step")]
    public async Task<ActionResult<UserGuideProgressDto>> CompleteStep(
        Guid id, [FromBody] CompleteStepCommand command)

    // GET api/v7/community/guides/{id}/progress
    [HttpGet("{id}/progress")]
    public async Task<ActionResult<UserGuideProgressDto>> GetGuideProgress(Guid id)

    // POST api/v7/community/guides/{id}/collaborators
    [HttpPost("{id}/collaborators")]
    public async Task<ActionResult> InviteCollaborator(
        Guid id, [FromBody] InviteCollaboratorCommand command)

    // GET api/v7/community/guides/my-progress
    [HttpGet("my-progress")]
    public async Task<ActionResult<PagedResult<UserGuideProgressDto>>> GetMyGuideProgress()
}
```

### Enhanced SignalR Hubs

#### Extended Community Hub
```csharp
[Authorize]
public class CommunityHub : Hub
{
    // Existing methods...
    public async Task JoinGroup(string groupId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"group_{groupId}");
    }

    public async Task LeaveGroup(string groupId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"group_{groupId}");
    }

    // New methods for additional features
    public async Task JoinLocationArea(double latitude, double longitude, double radiusKm)
    {
        var areaId = $"location_{latitude:F2}_{longitude:F2}_{radiusKm}";
        await Groups.AddToGroupAsync(Context.ConnectionId, areaId);
    }

    public async Task LeaveLocationArea(double latitude, double longitude, double radiusKm)
    {
        var areaId = $"location_{latitude:F2}_{longitude:F2}_{radiusKm}";
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, areaId);
    }

    public async Task JoinQACategory(string category)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"qa_{category}");
    }

    public async Task JoinGuideSession(string guideId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"guide_{guideId}");
    }

    // Real-time updates for new features
    public async Task SendQAUpdate(string category, object qaData)
    {
        await Clients.Group($"qa_{category}").SendAsync("QAUpdated", qaData);
    }

    public async Task SendLocationUpdate(double latitude, double longitude, double radiusKm, object locationData)
    {
        var areaId = $"location_{latitude:F2}_{longitude:F2}_{radiusKm}";
        await Clients.Group(areaId).SendAsync("LocationUpdated", locationData);
    }

    public async Task SendGuideProgress(string guideId, object progressData)
    {
        await Clients.Group($"guide_{guideId}").SendAsync("GuideProgressUpdated", progressData);
    }

    public async Task SendFriendRequest(string userId, object friendRequestData)
    {
        await Clients.Group($"user_{userId}").SendAsync("FriendRequestReceived", friendRequestData);
    }

    public async Task SendReviewUpdate(string targetType, string targetId, object reviewData)
    {
        await Clients.Group($"reviews_{targetType}_{targetId}").SendAsync("ReviewUpdated", reviewData);
    }
}
```

## Enhanced CQRS Implementation

### QA System Commands and Queries

#### Create Question Command
```csharp
public class CreateQuestionCommand : IRequest<QuestionDto>
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string Category { get; set; }
    public List<string> Tags { get; set; } = new();
}

public class CreateQuestionCommandHandler : IRequestHandler<CreateQuestionCommand, QuestionDto>
{
    private readonly IRepository<Question> _questionRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public async Task<QuestionDto> Handle(CreateQuestionCommand request, CancellationToken cancellationToken)
    {
        var question = new Question
        {
            UserId = _currentUserService.UserId,
            Title = request.Title,
            Content = request.Content,
            Category = request.Category,
            Tags = JsonSerializer.Serialize(request.Tags),
            CreatedAt = DateTime.UtcNow
        };

        await _questionRepository.AddAsync(question);
        await _questionRepository.SaveChangesAsync();

        // Publish domain event for notifications
        await _mediator.Publish(new QuestionCreatedEvent(question.Id, question.UserId, question.Category));

        return _mapper.Map<QuestionDto>(question);
    }
}
```

### Review System Commands

#### Create Review Command
```csharp
public class CreateReviewCommand : IRequest<ReviewDto>
{
    public string TargetType { get; set; }
    public Guid TargetId { get; set; }
    public int Rating { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}

public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, ReviewDto>
{
    private readonly IRepository<Review> _reviewRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public async Task<ReviewDto> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        // Validate user can review this target
        await ValidateReviewEligibility(request.TargetType, request.TargetId);

        var review = new Review
        {
            UserId = _currentUserService.UserId,
            TargetType = request.TargetType,
            TargetId = request.TargetId,
            Rating = request.Rating,
            Title = request.Title,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };

        await _reviewRepository.AddAsync(review);
        await _reviewRepository.SaveChangesAsync();

        // Add review images
        foreach (var imageUrl in request.ImageUrls)
        {
            await AddReviewImage(review.Id, imageUrl);
        }

        // Publish domain event
        await _mediator.Publish(new ReviewCreatedEvent(review.Id, review.TargetType, review.TargetId));

        return _mapper.Map<ReviewDto>(review);
    }
}
```

### Friends Network Commands

#### Send Friend Request Command
```csharp
public class SendFriendRequestCommand : IRequest<Unit>
{
    public Guid ReceiverId { get; set; }
    public string Message { get; set; }
}

public class SendFriendRequestCommandHandler : IRequestHandler<SendFriendRequestCommand, Unit>
{
    private readonly IRepository<UserConnection> _connectionRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediator _mediator;

    public async Task<Unit> Handle(SendFriendRequestCommand request, CancellationToken cancellationToken)
    {
        var requesterId = _currentUserService.UserId;

        // Check if connection already exists
        var existingConnection = await _connectionRepository.Query()
            .FirstOrDefaultAsync(c => 
                (c.RequesterId == requesterId && c.ReceiverId == request.ReceiverId) ||
                (c.RequesterId == request.ReceiverId && c.ReceiverId == requesterId));

        if (existingConnection != null)
        {
            throw new BusinessRuleValidationException("Connection already exists or is pending");
        }

        var connection = new UserConnection
        {
            RequesterId = requesterId,
            ReceiverId = request.ReceiverId,
            ConnectionType = "Friend",
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        await _connectionRepository.AddAsync(connection);
        await _connectionRepository.SaveChangesAsync();

        // Publish domain event for notification
        await _mediator.Publish(new FriendRequestSentEvent(connection.Id, requesterId, request.ReceiverId));

        return Unit.Value;
    }
}
```

## Enhanced Domain Events

### New Domain Events for Additional Features
```csharp
public class QuestionCreatedEvent : DomainEvent
{
    public Guid QuestionId { get; }
    public Guid UserId { get; }
    public string Category { get; }

    public QuestionCreatedEvent(Guid questionId, Guid userId, string category)
    {
        QuestionId = questionId;
        UserId = userId;
        Category = category;
    }
}

public class AnswerAcceptedEvent : DomainEvent
{
    public Guid AnswerId { get; }
    public Guid QuestionId { get; }
    public Guid AnswererId { get; }
    public Guid QuestionerId { get; }

    public AnswerAcceptedEvent(Guid answerId, Guid questionId, Guid answererId, Guid questionerId)
    {
        AnswerId = answerId;
        QuestionId = questionId;
        AnswererId = answererId;
        QuestionerId = questionerId;
    }
}

public class ReviewCreatedEvent : DomainEvent
{
    public Guid ReviewId { get; }
    public string TargetType { get; }
    public Guid TargetId { get; }

    public ReviewCreatedEvent(Guid reviewId, string targetType, Guid targetId)
    {
        ReviewId = reviewId;
        TargetType = targetType;
        TargetId = targetId;
    }
}

public class FriendRequestSentEvent : DomainEvent
{
    public Guid ConnectionId { get; }
    public Guid RequesterId { get; }
    public Guid ReceiverId { get; }

    public FriendRequestSentEvent(Guid connectionId, Guid requesterId, Guid receiverId)
    {
        ConnectionId = connectionId;
        RequesterId = requesterId;
        ReceiverId = receiverId;
    }
}

public class CheckinCreatedEvent : DomainEvent
{
    public Guid CheckinId { get; }
    public Guid UserId { get; }
    public Guid LocationId { get; }
    public double Latitude { get; }
    public double Longitude { get; }

    public CheckinCreatedEvent(Guid checkinId, Guid userId, Guid locationId, double latitude, double longitude)
    {
        CheckinId = checkinId;
        UserId = userId;
        LocationId = locationId;
        Latitude = latitude;
        Longitude = longitude;
    }
}

public class GuideStepCompletedEvent : DomainEvent
{
    public Guid GuideId { get; }
    public Guid UserId { get; }
    public int StepNumber { get; }
    public bool IsGuideCompleted { get; }

    public GuideStepCompletedEvent(Guid guideId, Guid userId, int stepNumber, bool isGuideCompleted)
    {
        GuideId = guideId;
        UserId = userId;
        StepNumber = stepNumber;
        IsGuideCompleted = isGuideCompleted;
    }
}
```

### Enhanced Event Handlers
```csharp
public class QuestionCreatedEventHandler : INotificationHandler<QuestionCreatedEvent>
{
    private readonly INotificationService _notificationService;
    private readonly IRepository<User> _userRepository;
    private readonly ICommunityHubService _hubService;

    public async Task Handle(QuestionCreatedEvent notification, CancellationToken cancellationToken)
    {
        // Notify experts in the category
        var experts = await GetCategoryExperts(notification.Category);
        
        foreach (var expert in experts)
        {
            await _notificationService.SendNotificationAsync(new NotificationDto
            {
                UserId = expert.Id,
                Type = "NewQuestion",
                Title = "New Question in Your Expertise Area",
                Message = $"A new question was posted in {notification.Category}",
                Data = JsonSerializer.Serialize(new { QuestionId = notification.QuestionId })
            });
        }

        // Broadcast to category subscribers
        await _hubService.SendQAUpdate(notification.Category, new
        {
            QuestionId = notification.QuestionId,
            UserId = notification.UserId,
            Type = "NewQuestion"
        });
    }
}

public class FriendRequestSentEventHandler : INotificationHandler<FriendRequestSentEvent>
{
    private readonly INotificationService _notificationService;
    private readonly ICommunityHubService _hubService;

    public async Task Handle(FriendRequestSentEvent notification, CancellationToken cancellationToken)
    {
        // Send notification to receiver
        await _notificationService.SendNotificationAsync(new NotificationDto
        {
            UserId = notification.ReceiverId,
            Type = "FriendRequest",
            Title = "New Friend Request",
            Message = "You have received a new friend request",
            Data = JsonSerializer.Serialize(new { ConnectionId = notification.ConnectionId })
        });

        // Send real-time update
        await _hubService.SendFriendRequest(notification.ReceiverId.ToString(), new
        {
            ConnectionId = notification.ConnectionId,
            RequesterId = notification.RequesterId
        });
    }
}
```

## Enhanced Frontend Architecture

### Extended Angular Module Structure
```typescript
// Enhanced community.module.ts
@NgModule({
  declarations: [
    // Existing components...
    CommunityMainComponent,
    PostListComponent,
    PostItemComponent,
    CreatePostComponent,
    GroupListComponent,
    GroupCardComponent,
    UserProfileComponent,
    CommentThreadComponent,
    
    // New QA components
    QAMainComponent,
    QuestionListComponent,
    QuestionDetailComponent,
    CreateQuestionComponent,
    AnswerListComponent,
    CreateAnswerComponent,
    ReputationDisplayComponent,
    
    // New Review components
    ReviewListComponent,
    ReviewItemComponent,
    CreateReviewComponent,
    ReviewSummaryComponent,
    ReviewImagesComponent,
    
    // New Friends components
    FriendsListComponent,
    FriendRequestsComponent,
    FriendSuggestionsComponent,
    FriendListsComponent,
    
    // New Pages components
    CommunityPagesListComponent,
    PageDetailComponent,
    CreatePageComponent,
    PageAnalyticsComponent,
    PageFollowersComponent,
    
    // New News components
    NewsListComponent,
    NewsArticleComponent,
    NewsPreferencesComponent,
    NewsCategoriesComponent,
    
    // New Maps components
    MapViewComponent,
    LocationListComponent,
    CheckinComponent,
    NearbyContentComponent,
    LocationDetailComponent,
    
    // New Guides components
    GuidesListComponent,
    GuideDetailComponent,
    CreateGuideComponent,
    GuideStepComponent,
    GuideProgressComponent,
    GuideCollaboratorsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CommunityRoutingModule,
    SharedModule,
    // New feature modules
    QAModule,
    ReviewsModule,
    FriendsModule,
    PagesModule,
    NewsModule,
    MapsModule,
    GuidesModule
  ],
  providers: [
    // Existing services...
    PostService,
    GroupService,
    UserProfileService,
    NotificationService,
    CommunitySignalRService,
    
    // New services
    QAService,
    ReviewService,
    FriendsService,
    CommunityPagesService,
    NewsService,
    MapsService,
    GuidesService,
    LocationService,
    ReputationService
  ]
})
export class CommunityModule { }
```

### Enhanced State Management
```typescript
// Enhanced community.state.ts
export interface CommunityState {
  // Existing state...
  posts: {
    feed: Post[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;
  };
  groups: {
    myGroups: Group[];
    suggestedGroups: Group[];
    loading: boolean;
  };
  notifications: {
    unreadCount: number;
    items: Notification[];
  };
  currentUser: UserProfile | null;
  
  // New state for additional features
  qa: {
    questions: Question[];
    myQuestions: Question[];
    answers: Answer[];
    reputation: UserReputation | null;
    loading: boolean;
  };
  reviews: {
    myReviews: Review[];
    targetReviews: { [key: string]: Review[] };
    loading: boolean;
  };
  friends: {
    friendsList: Friend[];
    friendRequests: FriendRequest[];
    suggestions: UserSuggestion[];
    loading: boolean;
  };
  pages: {
    myPages: CommunityPage[];
    followedPages: CommunityPage[];
    suggestedPages: CommunityPage[];
    loading: boolean;
  };
  news: {
    articles: NewsArticle[];
    preferences: NewsPreferences | null;
    categories: string[];
    loading: boolean;
  };
  maps: {
    locations: Location[];
    checkins: Checkin[];
    nearbyContent: any[];
    currentLocation: GeolocationPosition | null;
    loading: boolean;
  };
  guides: {
    availableGuides: Guide[];
    myGuides: Guide[];
    inProgressGuides: UserGuideProgress[];
    completedGuides: UserGuideProgress[];
    loading: boolean;
  };
}
```

This comprehensive design specification provides a complete technical foundation for the enhanced Community Platform with all 7 additional features (QA, reviews, friends, pages, news, maps, and guides), maintaining consistency with the existing codebase architecture while introducing the necessary components for a full-featured social community system with advanced capabilities.