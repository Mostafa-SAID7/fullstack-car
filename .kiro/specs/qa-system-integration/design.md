# QA System Integration - Design Specification

## Overview

The QA System Integration provides a comprehensive Question and Answer platform that seamlessly integrates across the community platform, main frontend application, backend API, and admin dashboard. The system leverages Clean Architecture with CQRS pattern, real-time SignalR communication, and advanced search capabilities to deliver a robust knowledge-sharing experience.

## Architecture Overview

The QA system follows a distributed architecture pattern that integrates with existing applications while maintaining clear separation of concerns and scalability.

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  Main Angular App     │  Community Platform │  Admin Dashboard  │
│  - QA Components      │  - Integrated QA    │  - QA Management   │
│  - Search Interface   │  - Expert Profiles  │  - Analytics       │
│  - Real-time Updates  │  - Notifications    │  - Moderation      │
│  - Mobile Responsive  │  - Social Features  │  - Reporting       │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  ASP.NET Core Web API │  SignalR Hubs       │  Authentication    │
│  - QA Controllers     │  - Real-time QA     │  - JWT Tokens      │
│  - Search API         │  - Live Updates     │  - Role-based Auth │
│  - Moderation API     │  - Notifications    │  - Expert Badges   │
│  - Analytics API      │  - Typing Indicators│  - Reputation      │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                       Application Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  CQRS + MediatR       │  Domain Services    │  Event Handlers    │
│  - Command Handlers   │  - Reputation Calc  │  - Domain Events   │
│  - Query Handlers     │  - Expert Detection │  - Notifications   │
│  - DTOs & Mapping     │  - Content Quality  │  - Search Indexing │
│  - Validation         │  - Vote Processing  │  - Analytics       │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                       Infrastructure Layer                      │
├─────────────────────────────────────────────────────────────────┤
│  Entity Framework    │  External Services   │  Caching & Storage │
│  - SQL Server        │  - Elasticsearch     │  - Redis Cache     │
│  - Repository Pattern│  - Content Moderator │  - Blob Storage    │
│  - Unit of Work      │  - Push Notifications│  - Search Index    │
│  - Migrations        │  - Email Service     │  - File Storage    │
└─────────────────────────────────────────────────────────────────┘
```

## Database Design

### QA System Schema

#### Questions Table
```sql
CREATE TABLE Questions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(300) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    Tags NVARCHAR(500), -- JSON array
    ViewCount INT DEFAULT 0,
    VoteScore INT DEFAULT 0,
    AnswerCount INT DEFAULT 0,
    AcceptedAnswerId UNIQUEIDENTIFIER,
    IsClosed BIT DEFAULT 0,
    ClosedReason NVARCHAR(200),
    IsScheduled BIT DEFAULT 0,
    ScheduledAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (AcceptedAnswerId) REFERENCES Answers(Id)
);

-- Performance indexes
CREATE INDEX IX_Questions_Category_CreatedAt ON Questions(Category, CreatedAt DESC);
CREATE INDEX IX_Questions_UserId_CreatedAt ON Questions(UserId, CreatedAt DESC);
CREATE INDEX IX_Questions_VoteScore_CreatedAt ON Questions(VoteScore DESC, CreatedAt DESC);
CREATE INDEX IX_Questions_Tags ON Questions(Tags);
CREATE FULLTEXT INDEX FTI_Questions_Content ON Questions(Title, Content);
```

#### Answers Table
```sql
CREATE TABLE Answers (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    QuestionId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    VoteScore INT DEFAULT 0,
    IsAccepted BIT DEFAULT 0,
    AcceptedAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    IsDeleted BIT DEFAULT 0,
    DeletedAt DATETIME2,
    FOREIGN KEY (QuestionId) REFERENCES Questions(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Performance indexes
CREATE INDEX IX_Answers_QuestionId_VoteScore ON Answers(QuestionId, VoteScore DESC);
CREATE INDEX IX_Answers_UserId_CreatedAt ON Answers(UserId, CreatedAt DESC);
CREATE INDEX IX_Answers_IsAccepted ON Answers(IsAccepted) WHERE IsAccepted = 1;
CREATE FULLTEXT INDEX FTI_Answers_Content ON Answers(Content);
```

#### QA Votes Table
```sql
CREATE TABLE QAVotes (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ContentId UNIQUEIDENTIFIER NOT NULL,
    ContentType NVARCHAR(20) NOT NULL, -- 'Question', 'Answer'
    VoteType NVARCHAR(10) NOT NULL, -- 'Up', 'Down'
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    UNIQUE(UserId, ContentId, ContentType)
);

-- Performance indexes
CREATE INDEX IX_QAVotes_ContentId_Type ON QAVotes(ContentId, ContentType);
CREATE INDEX IX_QAVotes_UserId_CreatedAt ON QAVotes(UserId, CreatedAt DESC);
```

#### User Reputation Table
```sql
CREATE TABLE UserReputation (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ReputationScore INT DEFAULT 0,
    QuestionsAsked INT DEFAULT 0,
    AnswersGiven INT DEFAULT 0,
    AcceptedAnswers INT DEFAULT 0,
    UpvotesReceived INT DEFAULT 0,
    DownvotesReceived INT DEFAULT 0,
    BadgesEarned NVARCHAR(MAX), -- JSON array
    ExpertiseAreas NVARCHAR(MAX), -- JSON array
    LastUpdated DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    UNIQUE(UserId)
);

-- Performance indexes
CREATE INDEX IX_UserReputation_Score ON UserReputation(ReputationScore DESC);
CREATE INDEX IX_UserReputation_ExpertiseAreas ON UserReputation(ExpertiseAreas);
```

#### QA Categories and Tags
```sql
CREATE TABLE QACategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500),
    IconUrl NVARCHAR(2048),
    Color NVARCHAR(7), -- Hex color code
    QuestionCount INT DEFAULT 0,
    ExpertCount INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE QATags (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(200),
    UsageCount INT DEFAULT 0,
    CategoryId UNIQUEIDENTIFIER,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (CategoryId) REFERENCES QACategories(Id)
);

CREATE TABLE QuestionTags (
    QuestionId UNIQUEIDENTIFIER NOT NULL,
    TagId UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (QuestionId, TagId),
    FOREIGN KEY (QuestionId) REFERENCES Questions(Id),
    FOREIGN KEY (TagId) REFERENCES QATags(Id)
);
```

#### Expert System Tables
```sql
CREATE TABLE QAExperts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    CategoryId UNIQUEIDENTIFIER NOT NULL,
    ExpertiseLevel NVARCHAR(20) DEFAULT 'Beginner', -- 'Beginner', 'Intermediate', 'Expert', 'Master'
    AnswerCount INT DEFAULT 0,
    AcceptedAnswerCount INT DEFAULT 0,
    AverageRating DECIMAL(3,2) DEFAULT 0,
    ResponseRate DECIMAL(5,2) DEFAULT 0, -- Percentage
    NotificationEnabled BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (CategoryId) REFERENCES QACategories(Id),
    UNIQUE(UserId, CategoryId)
);

-- Performance indexes
CREATE INDEX IX_QAExperts_Category_Level ON QAExperts(CategoryId, ExpertiseLevel);
CREATE INDEX IX_QAExperts_UserId ON QAExperts(UserId);
```

#### QA Analytics Tables
```sql
CREATE TABLE QAAnalytics (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Date DATE NOT NULL,
    QuestionsAsked INT DEFAULT 0,
    QuestionsAnswered INT DEFAULT 0,
    AnswersAccepted INT DEFAULT 0,
    TotalVotes INT DEFAULT 0,
    UniqueUsers INT DEFAULT 0,
    AverageResponseTime INT DEFAULT 0, -- in minutes
    TopCategory NVARCHAR(100),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UNIQUE(Date)
);

CREATE TABLE QAUserActivity (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    ActivityType NVARCHAR(50) NOT NULL, -- 'QuestionAsked', 'AnswerGiven', 'VoteCast', 'AnswerAccepted'
    ContentId UNIQUEIDENTIFIER NOT NULL,
    Category NVARCHAR(100),
    ReputationChange INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Performance indexes
CREATE INDEX IX_QAUserActivity_UserId_Date ON QAUserActivity(UserId, CreatedAt DESC);
CREATE INDEX IX_QAUserActivity_Type_Date ON QAUserActivity(ActivityType, CreatedAt DESC);
```

## API Design

### QA Controllers

#### Questions Controller
```csharp
[ApiController]
[Route("api/v7/qa/questions")]
[Authorize]
public class QuestionsController : ControllerBase
{
    private readonly IMediator _mediator;

    // GET api/v7/qa/questions
    [HttpGet]
    public async Task<ActionResult<PagedResult<QuestionDto>>> GetQuestions(
        [FromQuery] GetQuestionsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET api/v7/qa/questions/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionDetailDto>> GetQuestion(Guid id)
    {
        var query = new GetQuestionDetailQuery { QuestionId = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // POST api/v7/qa/questions
    [HttpPost]
    public async Task<ActionResult<QuestionDto>> CreateQuestion(
        [FromBody] CreateQuestionCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetQuestion), new { id = result.Id }, result);
    }

    // PUT api/v7/qa/questions/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<QuestionDto>> UpdateQuestion(
        Guid id, [FromBody] UpdateQuestionCommand command)
    {
        command.QuestionId = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // DELETE api/v7/qa/questions/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteQuestion(Guid id)
    {
        var command = new DeleteQuestionCommand { QuestionId = id };
        await _mediator.Send(command);
        return NoContent();
    }

    // POST api/v7/qa/questions/{id}/close
    [HttpPost("{id}/close")]
    public async Task<ActionResult> CloseQuestion(
        Guid id, [FromBody] CloseQuestionCommand command)
    {
        command.QuestionId = id;
        await _mediator.Send(command);
        return NoContent();
    }

    // GET api/v7/qa/questions/search
    [HttpGet("search")]
    public async Task<ActionResult<PagedResult<QuestionDto>>> SearchQuestions(
        [FromQuery] SearchQuestionsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET api/v7/qa/questions/similar/{id}
    [HttpGet("similar/{id}")]
    public async Task<ActionResult<List<QuestionDto>>> GetSimilarQuestions(Guid id)
    {
        var query = new GetSimilarQuestionsQuery { QuestionId = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
```

#### Answers Controller
```csharp
[ApiController]
[Route("api/v7/qa/answers")]
[Authorize]
public class AnswersController : ControllerBase
{
    private readonly IMediator _mediator;

    // GET api/v7/qa/answers/question/{questionId}
    [HttpGet("question/{questionId}")]
    public async Task<ActionResult<PagedResult<AnswerDto>>> GetAnswersByQuestion(
        Guid questionId, [FromQuery] GetAnswersByQuestionQuery query)
    {
        query.QuestionId = questionId;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // POST api/v7/qa/answers
    [HttpPost]
    public async Task<ActionResult<AnswerDto>> CreateAnswer(
        [FromBody] CreateAnswerCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetAnswer), new { id = result.Id }, result);
    }

    // GET api/v7/qa/answers/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<AnswerDto>> GetAnswer(Guid id)
    {
        var query = new GetAnswerQuery { AnswerId = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // PUT api/v7/qa/answers/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<AnswerDto>> UpdateAnswer(
        Guid id, [FromBody] UpdateAnswerCommand command)
    {
        command.AnswerId = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // POST api/v7/qa/answers/{id}/accept
    [HttpPost("{id}/accept")]
    public async Task<ActionResult> AcceptAnswer(Guid id)
    {
        var command = new AcceptAnswerCommand { AnswerId = id };
        await _mediator.Send(command);
        return NoContent();
    }

    // DELETE api/v7/qa/answers/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAnswer(Guid id)
    {
        var command = new DeleteAnswerCommand { AnswerId = id };
        await _mediator.Send(command);
        return NoContent();
    }
}
```

#### Voting Controller
```csharp
[ApiController]
[Route("api/v7/qa/votes")]
[Authorize]
public class VotingController : ControllerBase
{
    private readonly IMediator _mediator;

    // POST api/v7/qa/votes
    [HttpPost]
    public async Task<ActionResult> Vote([FromBody] CreateVoteCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }

    // DELETE api/v7/qa/votes
    [HttpDelete]
    public async Task<ActionResult> RemoveVote([FromBody] RemoveVoteCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }

    // GET api/v7/qa/votes/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<PagedResult<VoteDto>>> GetUserVotes(
        Guid userId, [FromQuery] GetUserVotesQuery query)
    {
        query.UserId = userId;
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
```

#### Reputation Controller
```csharp
[ApiController]
[Route("api/v7/qa/reputation")]
[Authorize]
public class ReputationController : ControllerBase
{
    private readonly IMediator _mediator;

    // GET api/v7/qa/reputation/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<UserReputationDto>> GetUserReputation(Guid userId)
    {
        var query = new GetUserReputationQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET api/v7/qa/reputation/leaderboard
    [HttpGet("leaderboard")]
    public async Task<ActionResult<PagedResult<UserReputationDto>>> GetReputationLeaderboard(
        [FromQuery] GetReputationLeaderboardQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET api/v7/qa/reputation/history/{userId}
    [HttpGet("history/{userId}")]
    public async Task<ActionResult<PagedResult<ReputationHistoryDto>>> GetReputationHistory(
        Guid userId, [FromQuery] GetReputationHistoryQuery query)
    {
        query.UserId = userId;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // POST api/v7/qa/reputation/expertise
    [HttpPost("expertise")]
    public async Task<ActionResult> UpdateExpertiseAreas(
        [FromBody] UpdateExpertiseAreasCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }
}
```

#### Categories and Tags Controller
```csharp
[ApiController]
[Route("api/v7/qa/categories")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    // GET api/v7/qa/categories
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        var query = new GetCategoriesQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET api/v7/qa/categories/{id}/experts
    [HttpGet("{id}/experts")]
    public async Task<ActionResult<PagedResult<ExpertDto>>> GetCategoryExperts(
        Guid id, [FromQuery] GetCategoryExpertsQuery query)
    {
        query.CategoryId = id;
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET api/v7/qa/tags
    [HttpGet("tags")]
    public async Task<ActionResult<PagedResult<TagDto>>> GetTags(
        [FromQuery] GetTagsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET api/v7/qa/tags/popular
    [HttpGet("tags/popular")]
    public async Task<ActionResult<List<TagDto>>> GetPopularTags()
    {
        var query = new GetPopularTagsQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
```

### SignalR Hub Implementation

#### QA Hub
```csharp
[Authorize]
public class QAHub : Hub
{
    private readonly IMediator _mediator;
    private readonly ILogger<QAHub> _logger;

    public QAHub(IMediator mediator, ILogger<QAHub> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    // Join question room for real-time updates
    public async Task JoinQuestion(string questionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"question_{questionId}");
        _logger.LogInformation($"User {Context.UserIdentifier} joined question {questionId}");
    }

    // Leave question room
    public async Task LeaveQuestion(string questionId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"question_{questionId}");
        _logger.LogInformation($"User {Context.UserIdentifier} left question {questionId}");
    }

    // Join category for expert notifications
    public async Task JoinCategory(string category)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"category_{category}");
        _logger.LogInformation($"User {Context.UserIdentifier} joined category {category}");
    }

    // Leave category
    public async Task LeaveCategory(string category)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"category_{category}");
    }

    // Join user notifications
    public async Task JoinUserNotifications()
    {
        var userId = Context.UserIdentifier;
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
    }

    // Typing indicator for answers
    public async Task StartTypingAnswer(string questionId)
    {
        await Clients.Group($"question_{questionId}")
            .SendAsync("UserTypingAnswer", Context.UserIdentifier, questionId);
    }

    public async Task StopTypingAnswer(string questionId)
    {
        await Clients.Group($"question_{questionId}")
            .SendAsync("UserStoppedTypingAnswer", Context.UserIdentifier, questionId);
    }

    // Real-time vote updates
    public async Task SendVoteUpdate(string contentId, string contentType, int newScore)
    {
        await Clients.Group($"question_{contentId}")
            .SendAsync("VoteUpdated", contentId, contentType, newScore);
    }

    // New answer notification
    public async Task SendNewAnswer(string questionId, object answerData)
    {
        await Clients.Group($"question_{questionId}")
            .SendAsync("NewAnswer", answerData);
    }

    // Answer accepted notification
    public async Task SendAnswerAccepted(string questionId, string answerId)
    {
        await Clients.Group($"question_{questionId}")
            .SendAsync("AnswerAccepted", answerId);
    }

    // Expert notification for new questions
    public async Task SendExpertNotification(string category, object questionData)
    {
        await Clients.Group($"category_{category}")
            .SendAsync("NewQuestionForExperts", questionData);
    }

    // Reputation update notification
    public async Task SendReputationUpdate(string userId, int newReputation, string reason)
    {
        await Clients.Group($"user_{userId}")
            .SendAsync("ReputationUpdated", newReputation, reason);
    }

    public override async Task OnConnectedAsync()
    {
        await JoinUserNotifications();
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        _logger.LogInformation($"User {Context.UserIdentifier} disconnected from QA Hub");
        await base.OnDisconnectedAsync(exception);
    }
}
```

## CQRS Implementation

### Command Examples

#### Create Question Command
```csharp
public class CreateQuestionCommand : IRequest<QuestionDto>
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string Category { get; set; }
    public List<string> Tags { get; set; } = new();
    public DateTime? ScheduledAt { get; set; }
}

public class CreateQuestionCommandValidator : AbstractValidator<CreateQuestionCommand>
{
    public CreateQuestionCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(300).WithMessage("Title cannot exceed 300 characters");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required")
            .MinimumLength(20).WithMessage("Content must be at least 20 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required");

        RuleFor(x => x.Tags)
            .Must(tags => tags.Count <= 5).WithMessage("Maximum 5 tags allowed");
    }
}

public class CreateQuestionCommandHandler : IRequestHandler<CreateQuestionCommand, QuestionDto>
{
    private readonly IRepository<Question> _questionRepository;
    private readonly IRepository<QACategory> _categoryRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;
    private readonly IQASearchService _searchService;

    public async Task<QuestionDto> Handle(CreateQuestionCommand request, CancellationToken cancellationToken)
    {
        // Validate category exists
        var category = await _categoryRepository.Query()
            .FirstOrDefaultAsync(c => c.Name == request.Category, cancellationToken);
        
        if (category == null)
            throw new NotFoundException($"Category '{request.Category}' not found");

        // Check for similar questions
        var similarQuestions = await _searchService.FindSimilarQuestionsAsync(request.Title, request.Content);
        
        var question = new Question
        {
            UserId = _currentUserService.UserId,
            Title = request.Title,
            Content = request.Content,
            Category = request.Category,
            Tags = JsonSerializer.Serialize(request.Tags),
            ScheduledAt = request.ScheduledAt,
            CreatedAt = DateTime.UtcNow
        };

        await _questionRepository.AddAsync(question);
        await _questionRepository.SaveChangesAsync();

        // Add to search index
        await _searchService.IndexQuestionAsync(question);

        // Publish domain event
        await _mediator.Publish(new QuestionCreatedEvent(
            question.Id, 
            question.UserId, 
            question.Category,
            similarQuestions.Any()));

        return _mapper.Map<QuestionDto>(question);
    }
}
```

#### Create Answer Command
```csharp
public class CreateAnswerCommand : IRequest<AnswerDto>
{
    public Guid QuestionId { get; set; }
    public string Content { get; set; }
}

public class CreateAnswerCommandValidator : AbstractValidator<CreateAnswerCommand>
{
    public CreateAnswerCommandValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty().WithMessage("Question ID is required");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Answer content is required")
            .MinimumLength(10).WithMessage("Answer must be at least 10 characters");
    }
}

public class CreateAnswerCommandHandler : IRequestHandler<CreateAnswerCommand, AnswerDto>
{
    private readonly IRepository<Answer> _answerRepository;
    private readonly IRepository<Question> _questionRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;
    private readonly IContentQualityService _contentQualityService;

    public async Task<AnswerDto> Handle(CreateAnswerCommand request, CancellationToken cancellationToken)
    {
        // Validate question exists and is not closed
        var question = await _questionRepository.GetByIdAsync(request.QuestionId);
        if (question == null)
            throw new NotFoundException("Question not found");
        
        if (question.IsClosed)
            throw new BusinessRuleValidationException("Cannot answer a closed question");

        // Check content quality
        var qualityScore = await _contentQualityService.EvaluateAnswerQualityAsync(request.Content);
        if (qualityScore < 0.5) // Minimum quality threshold
            throw new BusinessRuleValidationException("Answer quality is too low");

        var answer = new Answer
        {
            QuestionId = request.QuestionId,
            UserId = _currentUserService.UserId,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };

        await _answerRepository.AddAsync(answer);
        await _answerRepository.SaveChangesAsync();

        // Update question answer count
        question.AnswerCount++;
        await _questionRepository.SaveChangesAsync();

        // Publish domain event
        await _mediator.Publish(new AnswerCreatedEvent(
            answer.Id, 
            answer.QuestionId, 
            answer.UserId, 
            question.UserId));

        return _mapper.Map<AnswerDto>(answer);
    }
}
```

#### Vote Command
```csharp
public class CreateVoteCommand : IRequest<Unit>
{
    public Guid ContentId { get; set; }
    public string ContentType { get; set; } // "Question" or "Answer"
    public string VoteType { get; set; } // "Up" or "Down"
}

public class CreateVoteCommandHandler : IRequestHandler<CreateVoteCommand, Unit>
{
    private readonly IRepository<QAVote> _voteRepository;
    private readonly IRepository<Question> _questionRepository;
    private readonly IRepository<Answer> _answerRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediator _mediator;
    private readonly IReputationService _reputationService;

    public async Task<Unit> Handle(CreateVoteCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;

        // Check if user already voted
        var existingVote = await _voteRepository.Query()
            .FirstOrDefaultAsync(v => v.UserId == userId && 
                                     v.ContentId == request.ContentId && 
                                     v.ContentType == request.ContentType);

        if (existingVote != null)
        {
            // Update existing vote if different
            if (existingVote.VoteType != request.VoteType)
            {
                existingVote.VoteType = request.VoteType;
                existingVote.UpdatedAt = DateTime.UtcNow;
                await _voteRepository.SaveChangesAsync();
            }
            else
            {
                throw new BusinessRuleValidationException("You have already cast this vote");
            }
        }
        else
        {
            // Create new vote
            var vote = new QAVote
            {
                UserId = userId,
                ContentId = request.ContentId,
                ContentType = request.ContentType,
                VoteType = request.VoteType,
                CreatedAt = DateTime.UtcNow
            };

            await _voteRepository.AddAsync(vote);
            await _voteRepository.SaveChangesAsync();
        }

        // Update vote score and reputation
        await UpdateVoteScoreAndReputation(request);

        // Publish domain event
        await _mediator.Publish(new VoteCreatedEvent(
            request.ContentId, 
            request.ContentType, 
            userId, 
            request.VoteType));

        return Unit.Value;
    }

    private async Task UpdateVoteScoreAndReputation(CreateVoteCommand request)
    {
        var voteValue = request.VoteType == "Up" ? 1 : -1;
        Guid contentAuthorId;

        if (request.ContentType == "Question")
        {
            var question = await _questionRepository.GetByIdAsync(request.ContentId);
            question.VoteScore += voteValue;
            contentAuthorId = question.UserId;
            await _questionRepository.SaveChangesAsync();
        }
        else
        {
            var answer = await _answerRepository.GetByIdAsync(request.ContentId);
            answer.VoteScore += voteValue;
            contentAuthorId = answer.UserId;
            await _answerRepository.SaveChangesAsync();
        }

        // Update author's reputation
        var reputationChange = request.VoteType == "Up" ? 10 : -2;
        await _reputationService.UpdateReputationAsync(contentAuthorId, reputationChange, 
            $"Vote on {request.ContentType.ToLower()}");
    }
}
```

### Query Examples

#### Get Questions Query
```csharp
public class GetQuestionsQuery : IRequest<PagedResult<QuestionDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string Category { get; set; }
    public List<string> Tags { get; set; } = new();
    public string SortBy { get; set; } = "Recent"; // "Recent", "Popular", "Unanswered"
    public string SearchTerm { get; set; }
}

public class GetQuestionsQueryHandler : IRequestHandler<GetQuestionsQuery, PagedResult<QuestionDto>>
{
    private readonly IRepository<Question> _questionRepository;
    private readonly IMapper _mapper;
    private readonly IQASearchService _searchService;

    public async Task<PagedResult<QuestionDto>> Handle(GetQuestionsQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Question> query = _questionRepository.Query()
            .Where(q => !q.IsDeleted)
            .Include(q => q.User);

        // Apply filters
        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(q => q.Category == request.Category);
        }

        if (request.Tags.Any())
        {
            foreach (var tag in request.Tags)
            {
                query = query.Where(q => q.Tags.Contains(tag));
            }
        }

        // Apply search
        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            // Use full-text search if available, otherwise LIKE
            query = query.Where(q => q.Title.Contains(request.SearchTerm) || 
                                    q.Content.Contains(request.SearchTerm));
        }

        // Apply sorting
        query = request.SortBy switch
        {
            "Popular" => query.OrderByDescending(q => q.VoteScore).ThenByDescending(q => q.ViewCount),
            "Unanswered" => query.Where(q => q.AnswerCount == 0).OrderByDescending(q => q.CreatedAt),
            _ => query.OrderByDescending(q => q.CreatedAt)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        
        var questions = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<QuestionDto>
        {
            Items = _mapper.Map<List<QuestionDto>>(questions),
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
```

## Domain Services

### Reputation Service
```csharp
public interface IReputationService
{
    Task<int> UpdateReputationAsync(Guid userId, int change, string reason);
    Task<UserReputationDto> GetUserReputationAsync(Guid userId);
    Task<List<string>> CheckForNewBadgesAsync(Guid userId);
    Task UpdateExpertiseAreasAsync(Guid userId, List<string> areas);
}

public class ReputationService : IReputationService
{
    private readonly IRepository<UserReputation> _reputationRepository;
    private readonly IRepository<QAUserActivity> _activityRepository;
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public async Task<int> UpdateReputationAsync(Guid userId, int change, string reason)
    {
        var reputation = await _reputationRepository.Query()
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (reputation == null)
        {
            reputation = new UserReputation
            {
                UserId = userId,
                ReputationScore = Math.Max(0, change),
                LastUpdated = DateTime.UtcNow
            };
            await _reputationRepository.AddAsync(reputation);
        }
        else
        {
            reputation.ReputationScore = Math.Max(0, reputation.ReputationScore + change);
            reputation.LastUpdated = DateTime.UtcNow;
        }

        await _reputationRepository.SaveChangesAsync();

        // Log activity
        await _activityRepository.AddAsync(new QAUserActivity
        {
            UserId = userId,
            ActivityType = "ReputationChange",
            ReputationChange = change,
            CreatedAt = DateTime.UtcNow
        });

        // Check for new badges
        var newBadges = await CheckForNewBadgesAsync(userId);
        if (newBadges.Any())
        {
            await _mediator.Publish(new BadgesEarnedEvent(userId, newBadges));
        }

        return reputation.ReputationScore;
    }

    public async Task<List<string>> CheckForNewBadgesAsync(Guid userId)
    {
        var reputation = await _reputationRepository.Query()
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (reputation == null) return new List<string>();

        var currentBadges = JsonSerializer.Deserialize<List<string>>(reputation.BadgesEarned ?? "[]");
        var newBadges = new List<string>();

        // Check reputation milestones
        if (reputation.ReputationScore >= 100 && !currentBadges.Contains("Contributor"))
        {
            newBadges.Add("Contributor");
        }
        if (reputation.ReputationScore >= 500 && !currentBadges.Contains("Knowledgeable"))
        {
            newBadges.Add("Knowledgeable");
        }
        if (reputation.ReputationScore >= 1000 && !currentBadges.Contains("Expert"))
        {
            newBadges.Add("Expert");
        }

        // Check answer acceptance rate
        if (reputation.AcceptedAnswers >= 10 && !currentBadges.Contains("Helpful"))
        {
            newBadges.Add("Helpful");
        }

        // Update badges if new ones earned
        if (newBadges.Any())
        {
            currentBadges.AddRange(newBadges);
            reputation.BadgesEarned = JsonSerializer.Serialize(currentBadges);
            await _reputationRepository.SaveChangesAsync();
        }

        return newBadges;
    }
}
```

### Content Quality Service
```csharp
public interface IContentQualityService
{
    Task<double> EvaluateQuestionQualityAsync(string title, string content);
    Task<double> EvaluateAnswerQualityAsync(string content);
    Task<bool> IsSpamAsync(string content);
    Task<List<string>> DetectInappropriateContentAsync(string content);
}

public class ContentQualityService : IContentQualityService
{
    private readonly IContentModerationService _moderationService;
    private readonly ILogger<ContentQualityService> _logger;

    public async Task<double> EvaluateQuestionQualityAsync(string title, string content)
    {
        double score = 1.0;

        // Length checks
        if (title.Length < 10) score -= 0.2;
        if (content.Length < 50) score -= 0.3;
        if (content.Length > 5000) score -= 0.1;

        // Grammar and spelling (simplified)
        var wordCount = content.Split(' ').Length;
        if (wordCount < 10) score -= 0.2;

        // Check for spam patterns
        if (await IsSpamAsync(content)) score -= 0.5;

        // Check for inappropriate content
        var inappropriateContent = await DetectInappropriateContentAsync(content);
        if (inappropriateContent.Any()) score -= 0.4;

        return Math.Max(0, score);
    }

    public async Task<double> EvaluateAnswerQualityAsync(string content)
    {
        double score = 1.0;

        // Length checks
        if (content.Length < 20) score -= 0.3;
        if (content.Length > 10000) score -= 0.1;

        // Check for code examples (positive indicator)
        if (content.Contains("```") || content.Contains("<code>")) score += 0.1;

        // Check for external links (can be positive or negative)
        var linkCount = System.Text.RegularExpressions.Regex.Matches(content, @"https?://").Count;
        if (linkCount > 0 && linkCount <= 3) score += 0.05;
        if (linkCount > 5) score -= 0.2;

        // Check for spam and inappropriate content
        if (await IsSpamAsync(content)) score -= 0.5;
        var inappropriateContent = await DetectInappropriateContentAsync(content);
        if (inappropriateContent.Any()) score -= 0.4;

        return Math.Max(0, score);
    }

    public async Task<bool> IsSpamAsync(string content)
    {
        // Simple spam detection patterns
        var spamPatterns = new[]
        {
            @"(buy|purchase|order)\s+(now|today|here)",
            @"(click|visit)\s+(here|this\s+link)",
            @"(free|cheap|discount)\s+(offer|deal|price)",
            @"(earn|make)\s+\$?\d+\s+(daily|weekly|monthly)"
        };

        foreach (var pattern in spamPatterns)
        {
            if (System.Text.RegularExpressions.Regex.IsMatch(content, pattern, 
                System.Text.RegularExpressions.RegexOptions.IgnoreCase))
            {
                return true;
            }
        }

        // Check for excessive repetition
        var words = content.ToLower().Split(' ');
        var wordGroups = words.GroupBy(w => w).Where(g => g.Count() > 5);
        if (wordGroups.Any()) return true;

        return false;
    }

    public async Task<List<string>> DetectInappropriateContentAsync(string content)
    {
        try
        {
            // Use external content moderation service
            return await _moderationService.AnalyzeTextAsync(content);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing content for inappropriate material");
            return new List<string>();
        }
    }
}
```

## Frontend Integration

### Angular QA Module Structure
```typescript
// qa.module.ts
@NgModule({
  declarations: [
    QAMainComponent,
    QuestionListComponent,
    QuestionDetailComponent,
    QuestionCardComponent,
    CreateQuestionComponent,
    EditQuestionComponent,
    AnswerListComponent,
    AnswerItemComponent,
    CreateAnswerComponent,
    EditAnswerComponent,
    VotingComponent,
    ReputationDisplayComponent,
    BadgeDisplayComponent,
    ExpertBadgeComponent,
    QASearchComponent,
    CategoryFilterComponent,
    TagCloudComponent,
    SimilarQuestionsComponent,
    QAAnalyticsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    QARoutingModule,
    SharedModule,
    MarkdownModule,
    InfiniteScrollModule
  ],
  providers: [
    QAService,
    QASignalRService,
    ReputationService,
    QASearchService,
    ContentQualityService
  ]
})
export class QAModule { }
```

### QA Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class QAService {
  private readonly baseUrl = '/api/v7/qa';

  constructor(
    private http: HttpClient,
    private signalRService: QASignalRService
  ) {}

  // Questions
  getQuestions(params: GetQuestionsParams): Observable<PagedResult<Question>> {
    return this.http.get<PagedResult<Question>>(`${this.baseUrl}/questions`, { params });
  }

  getQuestion(id: string): Observable<QuestionDetail> {
    return this.http.get<QuestionDetail>(`${this.baseUrl}/questions/${id}`);
  }

  createQuestion(question: CreateQuestionRequest): Observable<Question> {
    return this.http.post<Question>(`${this.baseUrl}/questions`, question);
  }

  updateQuestion(id: string, question: UpdateQuestionRequest): Observable<Question> {
    return this.http.put<Question>(`${this.baseUrl}/questions/${id}`, question);
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/questions/${id}`);
  }

  closeQuestion(id: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/questions/${id}/close`, { reason });
  }

  searchQuestions(searchTerm: string, filters?: SearchFilters): Observable<PagedResult<Question>> {
    const params = { searchTerm, ...filters };
    return this.http.get<PagedResult<Question>>(`${this.baseUrl}/questions/search`, { params });
  }

  getSimilarQuestions(id: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions/similar/${id}`);
  }

  // Answers
  getAnswersByQuestion(questionId: string, params?: GetAnswersParams): Observable<PagedResult<Answer>> {
    return this.http.get<PagedResult<Answer>>(`${this.baseUrl}/answers/question/${questionId}`, { params });
  }

  createAnswer(answer: CreateAnswerRequest): Observable<Answer> {
    return this.http.post<Answer>(`${this.baseUrl}/answers`, answer);
  }

  updateAnswer(id: string, answer: UpdateAnswerRequest): Observable<Answer> {
    return this.http.put<Answer>(`${this.baseUrl}/answers/${id}`, answer);
  }

  acceptAnswer(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/answers/${id}/accept`, {});
  }

  deleteAnswer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/answers/${id}`);
  }

  // Voting
  vote(contentId: string, contentType: 'Question' | 'Answer', voteType: 'Up' | 'Down'): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/votes`, { contentId, contentType, voteType });
  }

  removeVote(contentId: string, contentType: 'Question' | 'Answer'): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/votes`, { 
      body: { contentId, contentType } 
    });
  }

  // Reputation
  getUserReputation(userId: string): Observable<UserReputation> {
    return this.http.get<UserReputation>(`${this.baseUrl}/reputation/user/${userId}`);
  }

  getReputationLeaderboard(params?: LeaderboardParams): Observable<PagedResult<UserReputation>> {
    return this.http.get<PagedResult<UserReputation>>(`${this.baseUrl}/reputation/leaderboard`, { params });
  }

  getReputationHistory(userId: string, params?: HistoryParams): Observable<PagedResult<ReputationHistory>> {
    return this.http.get<PagedResult<ReputationHistory>>(`${this.baseUrl}/reputation/history/${userId}`, { params });
  }

  updateExpertiseAreas(areas: string[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reputation/expertise`, { expertiseAreas: areas });
  }

  // Categories and Tags
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getCategoryExperts(categoryId: string, params?: ExpertsParams): Observable<PagedResult<Expert>> {
    return this.http.get<PagedResult<Expert>>(`${this.baseUrl}/categories/${categoryId}/experts`, { params });
  }

  getTags(params?: TagsParams): Observable<PagedResult<Tag>> {
    return this.http.get<PagedResult<Tag>>(`${this.baseUrl}/categories/tags`, { params });
  }

  getPopularTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/categories/tags/popular`);
  }
}
```

### QA SignalR Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class QASignalRService {
  private hubConnection: HubConnection;
  private connectionState$ = new BehaviorSubject<HubConnectionState>(HubConnectionState.Disconnected);

  // Observables for real-time updates
  public newAnswer$ = new Subject<Answer>();
  public voteUpdate$ = new Subject<VoteUpdate>();
  public answerAccepted$ = new Subject<string>();
  public reputationUpdate$ = new Subject<ReputationUpdate>();
  public expertNotification$ = new Subject<ExpertNotification>();
  public userTyping$ = new Subject<TypingIndicator>();

  constructor(
    private authService: AuthService,
    private logger: LoggerService
  ) {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/hubs/qa', {
        accessTokenFactory: () => this.authService.getToken()
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    this.setupEventHandlers();
    this.startConnection();
  }

  private setupEventHandlers(): void {
    // Connection state changes
    this.hubConnection.onreconnecting(() => {
      this.connectionState$.next(HubConnectionState.Reconnecting);
    });

    this.hubConnection.onreconnected(() => {
      this.connectionState$.next(HubConnectionState.Connected);
      this.logger.info('QA Hub reconnected');
    });

    this.hubConnection.onclose(() => {
      this.connectionState$.next(HubConnectionState.Disconnected);
      this.logger.warn('QA Hub connection closed');
    });

    // QA-specific events
    this.hubConnection.on('NewAnswer', (answer: Answer) => {
      this.newAnswer$.next(answer);
    });

    this.hubConnection.on('VoteUpdated', (contentId: string, contentType: string, newScore: number) => {
      this.voteUpdate$.next({ contentId, contentType, newScore });
    });

    this.hubConnection.on('AnswerAccepted', (answerId: string) => {
      this.answerAccepted$.next(answerId);
    });

    this.hubConnection.on('ReputationUpdated', (newReputation: number, reason: string) => {
      this.reputationUpdate$.next({ newReputation, reason });
    });

    this.hubConnection.on('NewQuestionForExperts', (questionData: ExpertNotification) => {
      this.expertNotification$.next(questionData);
    });

    this.hubConnection.on('UserTypingAnswer', (userId: string, questionId: string) => {
      this.userTyping$.next({ userId, questionId, isTyping: true });
    });

    this.hubConnection.on('UserStoppedTypingAnswer', (userId: string, questionId: string) => {
      this.userTyping$.next({ userId, questionId, isTyping: false });
    });
  }

  private async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      this.connectionState$.next(HubConnectionState.Connected);
      this.logger.info('QA Hub connected successfully');
    } catch (error) {
      this.logger.error('Error starting QA Hub connection:', error);
      this.connectionState$.next(HubConnectionState.Disconnected);
    }
  }

  // Public methods for joining/leaving groups
  async joinQuestion(questionId: string): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('JoinQuestion', questionId);
    }
  }

  async leaveQuestion(questionId: string): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('LeaveQuestion', questionId);
    }
  }

  async joinCategory(category: string): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('JoinCategory', category);
    }
  }

  async leaveCategory(category: string): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('LeaveCategory', category);
    }
  }

  // Typing indicators
  async startTypingAnswer(questionId: string): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('StartTypingAnswer', questionId);
    }
  }

  async stopTypingAnswer(questionId: string): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('StopTypingAnswer', questionId);
    }
  }

  // Connection state
  getConnectionState(): Observable<HubConnectionState> {
    return this.connectionState$.asObservable();
  }

  isConnected(): boolean {
    return this.hubConnection.state === HubConnectionState.Connected;
  }

  async disconnect(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
  }
}
```

Now I need to use the prework tool to analyze the acceptance criteria before writing the correctness properties:

<function_calls>
<invoke name="prework">
<parameter name="featureName">qa-system-integration

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property-Based Testing Overview

Property-based testing (PBT) validates software correctness by testing universal properties across many generated inputs. Each property is a formal specification that should hold for all valid inputs.

### Core Principles

1. **Universal Quantification**: Every property must contain an explicit "for all" statement
2. **Requirements Traceability**: Each property must reference the requirements it validates
3. **Executable Specifications**: Properties must be implementable as automated tests
4. **Comprehensive Coverage**: Properties should cover all testable acceptance criteria

### QA System Properties

#### Question Management Properties

**Property 1: Question Creation Validation**
*For any* question creation request, if required fields (title, content, category) are missing, the system should reject the request with appropriate validation errors
**Validates: Requirements 1.1**

**Property 2: Content Length and Quality Validation**
*For any* question submission, the system should validate content length and appropriateness according to defined rules and reject invalid content
**Validates: Requirements 1.2**

**Property 3: Question Edit Time Window**
*For any* question, editing should be allowed if and only if the question was created within the last 24 hours
**Validates: Requirements 1.3**

**Property 4: Expert Notification on Question Creation**
*For any* question created in a category, all experts registered for that category should receive notifications
**Validates: Requirements 1.4**

**Property 5: Question Scheduling**
*For any* scheduled question, it should only become visible at or after the scheduled publication time
**Validates: Requirements 1.5**

**Property 6: Unanswered Question Visibility Boost**
*For any* question that remains unanswered for 48 hours, its visibility score should be increased
**Validates: Requirements 1.6**

#### Answer Management Properties

**Property 7: Answer Content Validation**
*For any* answer submission, the system should validate content quality and relevance according to defined criteria
**Validates: Requirements 2.1**

**Property 8: Rich Text Format Support**
*For any* answer containing rich text formatting (code blocks, images), the formatting should be preserved and rendered correctly
**Validates: Requirements 2.2**

**Property 9: Answer Notification**
*For any* answer submitted to a question, the question author should receive an immediate notification
**Validates: Requirements 2.3**

**Property 10: Answer Edit History**
*For any* answer that is edited, the system should maintain a complete version history with timestamps
**Validates: Requirements 2.4**

**Property 11: Answer Ranking**
*For any* question with multiple answers, answers should be ranked by vote score first, then by acceptance status
**Validates: Requirements 2.5**

**Property 12: Duplicate Answer Prevention**
*For any* answer that is substantially similar to an existing answer on the same question, the system should detect and prevent the duplicate
**Validates: Requirements 2.6**

#### Voting System Properties

**Property 13: Vote Count Updates**
*For any* vote cast on content, the vote count should be updated immediately and reflected in real-time
**Validates: Requirements 3.1**

**Property 14: Self-Vote Prevention**
*For any* user attempting to vote on their own content, the system should reject the vote
**Validates: Requirements 3.2**

**Property 15: Reputation Adjustment on Voting**
*For any* vote cast, the content author's reputation should be adjusted according to the vote type and value
**Validates: Requirements 3.3**

**Property 16: Vote Change Time Window**
*For any* vote, the user should be able to change it if and only if less than 5 minutes have passed since casting
**Validates: Requirements 3.4**

**Property 17: Automatic Moderation Flagging**
*For any* content that receives a significant number of downvotes (threshold-based), it should be automatically flagged for moderator review
**Validates: Requirements 3.5**

**Property 18: Downvote Reputation Requirement**
*For any* user attempting to downvote, the action should be allowed if and only if the user meets the minimum reputation requirement
**Validates: Requirements 3.6**

#### Reputation System Properties

**Property 19: Upvote Reputation Award**
*For any* answer that receives an upvote, the answerer should receive reputation points according to the defined point system
**Validates: Requirements 4.1**

**Property 20: Answer Acceptance Bonus**
*For any* answer that is accepted, the answerer should receive bonus reputation points
**Validates: Requirements 4.2**

**Property 21: Real-time Reputation Updates**
*For any* action that affects reputation, the user's reputation score should be updated and displayed in real-time
**Validates: Requirements 4.3**

**Property 22: Badge Award on Milestones**
*For any* user reaching a reputation milestone, appropriate badges should be awarded automatically
**Validates: Requirements 4.4**

**Property 23: Privilege Unlocking**
*For any* user, available privileges should correspond exactly to their current reputation level
**Validates: Requirements 4.5**

**Property 24: Reputation History Logging**
*For any* reputation change, a complete history entry should be created with timestamp, amount, and reason
**Validates: Requirements 4.6**

#### Expert System Properties

**Property 25: Expert Identification and Notification**
*For any* question posted in a category, all users designated as experts in that category should be identified and notified
**Validates: Requirements 5.1**

**Property 26: Expertise Area Declaration**
*For any* user, they should be able to declare and update their expertise areas in their profile
**Validates: Requirements 5.2**

**Property 27: Expert Ranking Updates**
*For any* expert who consistently provides quality answers, their expert ranking should increase based on answer acceptance and vote scores
**Validates: Requirements 5.3**

**Property 28: Expert Badge Recognition**
*For any* user who qualifies as a top contributor in a category, they should receive appropriate expert badges
**Validates: Requirements 5.4**

**Property 29: Follow-up Expert Notifications**
*For any* question that remains unanswered after the initial notification period, follow-up notifications should be sent to experts
**Validates: Requirements 5.5**

**Property 30: Expert Notification Preferences**
*For any* expert, notification preferences should be respected when sending category-based notifications
**Validates: Requirements 5.6**

#### Search and Discovery Properties

**Property 31: Search Performance**
*For any* search query, results should be returned within 2 seconds
**Validates: Requirements 6.1**

**Property 32: Full-text Search Coverage**
*For any* search term, the search should find matches across questions, answers, and tags
**Validates: Requirements 6.2**

**Property 33: Similar Question Suggestions**
*For any* new question being created, the system should suggest similar existing questions based on content analysis
**Validates: Requirements 6.3**

**Property 34: Advanced Filtering**
*For any* combination of filters (category, date, votes, status), the results should match all applied filter criteria
**Validates: Requirements 6.4**

**Property 35: Tag-based Discovery**
*For any* tag, users should be able to browse and discover content associated with that tag
**Validates: Requirements 6.5**

**Property 36: Search Term Highlighting**
*For any* search results displayed, matching terms should be highlighted in the content
**Validates: Requirements 6.6**

#### Moderation Properties

**Property 37: Flagged Content Queue Timing**
*For any* content that is flagged, it should appear in the moderator review queue within 1 hour
**Validates: Requirements 7.1**

**Property 38: Automated Spam Detection**
*For any* content submitted, the system should automatically detect and flag spam or low-quality content
**Validates: Requirements 7.2**

**Property 39: Moderation Action Logging**
*For any* moderation action taken, it should be logged with timestamp, moderator ID, and reason
**Validates: Requirements 7.3**

**Property 40: Moderator Content Management**
*For any* content, moderators should be able to edit, hide, or remove it through the moderation interface
**Validates: Requirements 7.4**

**Property 41: Violation Penalty System**
*For any* user who violates community guidelines, appropriate reputation penalties and restrictions should be applied
**Validates: Requirements 7.5**

**Property 42: Moderation Analytics**
*For any* moderation data, analytics and reporting tools should provide accurate insights and metrics
**Validates: Requirements 7.6**

#### Integration Properties

**Property 43: State Synchronization**
*For any* QA action performed, the main application state should be updated immediately to reflect the change
**Validates: Requirements 8.3**

**Property 44: Deep Linking Support**
*For any* question or answer, a direct URL should navigate to the specific content
**Validates: Requirements 8.4**

**Property 45: Notification Integration**
*For any* QA notification, it should be delivered through the main application's notification system
**Validates: Requirements 8.5**

**Property 46: Authentication Sharing**
*For any* user, authentication and user context should be consistent between the QA system and main application
**Validates: Requirements 8.6**

#### Admin Dashboard Properties

**Property 47: Admin Reputation Management**
*For any* reputation or badge operation performed by administrators, the changes should be applied correctly and logged
**Validates: Requirements 9.2**

**Property 48: Bulk Moderation Tools**
*For any* bulk moderation operation, it should be applied to all selected content items consistently
**Validates: Requirements 9.3**

**Property 49: Dashboard Data Display**
*For any* dashboard metric or indicator, it should accurately reflect the current system state
**Validates: Requirements 9.4**

**Property 50: Configuration Management**
*For any* QA system setting changed through the admin dashboard, the change should be applied immediately
**Validates: Requirements 9.5**

**Property 51: Automated Report Generation**
*For any* requested report period, the system should generate accurate performance and usage reports
**Validates: Requirements 9.6**

#### API Properties

**Property 52: RESTful API Compliance**
*For any* QA API endpoint, it should return appropriate HTTP status codes and follow REST conventions
**Validates: Requirements 10.1**

**Property 53: API Input Validation**
*For any* API request with invalid input, the system should return appropriate error messages and status codes
**Validates: Requirements 10.2**

**Property 54: Real-time SignalR Updates**
*For any* QA interaction that should trigger real-time updates, SignalR should broadcast the update to connected clients
**Validates: Requirements 10.3**

**Property 55: API Authentication and Authorization**
*For any* protected QA endpoint, proper authentication and authorization should be enforced
**Validates: Requirements 10.4**

**Property 56: Data Retrieval Features**
*For any* data request, the API should support pagination, filtering, and sorting as specified
**Validates: Requirements 10.5**

#### Real-time Collaboration Properties

**Property 57: Real-time Answer Broadcasting**
*For any* new answer posted, all viewers of the question should receive the update immediately
**Validates: Requirements 11.1**

**Property 58: Live Vote Count Updates**
*For any* vote cast, all viewers should see the updated vote count without page refresh
**Validates: Requirements 11.2**

**Property 59: Typing Indicators**
*For any* user typing an answer, other viewers should see typing indicators
**Validates: Requirements 11.3**

**Property 60: Real-time Answer Notifications**
*For any* new answer, the question author should receive a real-time notification
**Validates: Requirements 11.4**

**Property 61: Question Update Broadcasting**
*For any* question edit or status change, all connected clients should receive the update instantly
**Validates: Requirements 11.5**

**Property 62: Connection Stability**
*For any* connection interruption, the system should automatically attempt reconnection with exponential backoff
**Validates: Requirements 11.6**

#### Analytics Properties

**Property 63: Response Time and Quality Tracking**
*For any* question and answer interaction, response times and quality metrics should be tracked accurately
**Validates: Requirements 12.1**

**Property 64: Engagement Analytics Recording**
*For any* user interaction with QA content, engagement data should be recorded for analytics
**Validates: Requirements 12.2**

**Property 65: Category Performance Reports**
*For any* category, performance reports and trending topics should be generated accurately
**Validates: Requirements 12.3**

**Property 66: Expert Monitoring**
*For any* expert, response rates and contribution patterns should be monitored and reported
**Validates: Requirements 12.4**

**Property 67: Performance Alert System**
*For any* significant system performance change, administrators should be alerted automatically
**Validates: Requirements 12.5**

**Property 68: User Satisfaction Surveys**
*For any* eligible user interaction, satisfaction surveys should be generated and feedback collected appropriately
**Validates: Requirements 12.6**

## Error Handling Strategy

### Error Categories and Responses

#### Validation Errors
- **Input Validation**: Return 400 Bad Request with detailed field-level errors
- **Business Rule Violations**: Return 422 Unprocessable Entity with rule explanation
- **Content Quality Issues**: Return 400 Bad Request with quality feedback

#### Authentication and Authorization Errors
- **Unauthenticated Requests**: Return 401 Unauthorized with authentication guidance
- **Insufficient Permissions**: Return 403 Forbidden with permission requirements
- **Expired Tokens**: Return 401 Unauthorized with token refresh instructions

#### Resource Errors
- **Not Found**: Return 404 Not Found with resource identification
- **Conflict**: Return 409 Conflict with conflict resolution guidance
- **Gone**: Return 410 Gone for deleted content with restoration options

#### System Errors
- **Rate Limiting**: Return 429 Too Many Requests with retry guidance
- **Service Unavailable**: Return 503 Service Unavailable with estimated recovery time
- **Internal Errors**: Return 500 Internal Server Error with correlation ID for support

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Question validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required and must be between 10-300 characters"
      },
      {
        "field": "category",
        "message": "Category must be selected from available options"
      }
    ],
    "correlationId": "abc123-def456-ghi789",
    "timestamp": "2024-01-10T10:30:00Z"
  }
}
```

## Testing Strategy

### Dual Testing Approach

The QA System Integration employs both unit testing and property-based testing to ensure comprehensive coverage and correctness validation.

#### Unit Testing Focus
- **Specific Examples**: Test concrete scenarios with known inputs and expected outputs
- **Edge Cases**: Validate boundary conditions and error scenarios
- **Integration Points**: Test component interactions and API contracts
- **Mock Dependencies**: Isolate units under test from external dependencies

#### Property-Based Testing Focus
- **Universal Properties**: Validate properties that should hold for all valid inputs
- **Input Generation**: Use randomized test data to discover edge cases
- **Invariant Checking**: Ensure system invariants are maintained across operations
- **Comprehensive Coverage**: Test properties across wide input ranges

### Property-Based Testing Configuration

**Testing Framework**: Use appropriate PBT library for each technology stack:
- **Backend (.NET)**: FsCheck or Hedgehog
- **Frontend (TypeScript)**: fast-check
- **Database**: Property-based testing with generated data sets

**Test Configuration**:
- **Minimum Iterations**: 100 iterations per property test
- **Timeout**: 30 seconds per property test
- **Shrinking**: Enable automatic counterexample shrinking
- **Seed Management**: Use deterministic seeds for reproducible failures

**Property Test Tagging**:
Each property-based test must include a comment referencing its design document property:
```csharp
// Feature: qa-system-integration, Property 1: Question Creation Validation
[Property]
public bool QuestionCreationValidation(QuestionCreateRequest request)
{
    // Test implementation
}
```

### Test Data Generation Strategy

#### Smart Generators
- **Question Generator**: Creates questions with varying lengths, categories, and content types
- **Answer Generator**: Generates answers with different quality levels and formatting
- **User Generator**: Creates users with various reputation levels and expertise areas
- **Vote Generator**: Generates voting patterns with realistic distributions
- **Content Generator**: Creates content with spam, quality, and appropriateness variations

#### Constraint-Based Generation
- **Category Constraints**: Ensure generated questions use valid categories
- **Time Constraints**: Generate timestamps within realistic ranges
- **Reputation Constraints**: Generate users with reputation levels that unlock appropriate privileges
- **Content Length Constraints**: Generate content within system limits

### Integration Testing Strategy

#### API Integration Tests
- **End-to-End Workflows**: Test complete user journeys from question creation to answer acceptance
- **Real-time Integration**: Test SignalR connections and real-time updates
- **Authentication Integration**: Test authentication flow across all applications
- **Database Integration**: Test data persistence and retrieval across operations

#### Frontend Integration Tests
- **Component Integration**: Test QA components within main application context
- **State Management**: Test NgRx state updates and synchronization
- **Real-time Updates**: Test SignalR integration and UI updates
- **Navigation Integration**: Test deep linking and routing

### Performance Testing

#### Load Testing Scenarios
- **Concurrent Question Creation**: Test system under high question creation load
- **Vote Storm Testing**: Test voting system under rapid vote casting
- **Search Performance**: Test search response times under various query loads
- **Real-time Connection Load**: Test SignalR hub performance with many concurrent connections

#### Performance Benchmarks
- **API Response Times**: < 300ms for 95% of requests
- **Search Response Times**: < 2 seconds for all queries
- **Real-time Update Latency**: < 3 seconds for notifications
- **Database Query Performance**: < 200ms for complex queries

This comprehensive design specification provides the technical foundation for implementing a robust, scalable, and well-tested QA System Integration that seamlessly connects across all application layers while maintaining high performance and reliability standards.