# Backend ASP.NET Core 9 API - Design Specification

## Architecture Overview

The Backend ASP.NET Core 9 API implements Clean Architecture with SOLID principles, CQRS pattern using MediatR, and modern performance optimizations. The architecture provides a scalable, maintainable, and high-performance foundation for the Community Car platform with clear separation of concerns and proper dependency management.

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        WebAPI Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Controllers          │  Middleware       │  Filters            │
│  - Feature-based      │  - Authentication │  - Validation       │
│  - Versioned APIs     │  - Logging        │  - Exception        │
│  - Swagger Docs       │  - Rate Limiting  │  - Performance      │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  CQRS Handlers        │  Services         │  DTOs               │
│  - Command Handlers   │  - Business Logic │  - Request/Response │
│  - Query Handlers     │  - Orchestration  │  - Validation       │
│  - Behaviors          │  - Integration    │  - Mapping          │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        Domain Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Entities             │  Value Objects    │  Domain Services    │
│  - Business Rules     │  - Immutable      │  - Domain Logic     │
│  - Invariants         │  - Validation     │  - Business Rules   │
│  - Events             │  - Equality       │  - Calculations     │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        Infrastructure Layer                     │
├─────────────────────────────────────────────────────────────────┤
│  Data Access          │  External Services│  Cross-Cutting      │
│  - EF Core            │  - HTTP Clients   │  - Caching          │
│  - Repositories       │  - File Storage   │  - Logging          │
│  - Unit of Work       │  - Message Queue  │  - Monitoring       │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure Reorganization

### Optimized Clean Architecture Structure

```
src/
├── Domain/
│   ├── Base/
│   │   ├── AggregateRoot.cs
│   │   ├── Entity.cs
│   │   ├── ValueObject.cs
│   │   └── DomainEvent.cs
│   ├── Entities/
│   │   ├── Identity/
│   │   │   ├── ApplicationUser.cs
│   │   │   ├── Role.cs
│   │   │   └── UserProfile.cs
│   │   ├── Community/
│   │   │   ├── Post.cs
│   │   │   ├── Comment.cs
│   │   │   ├── Group.cs
│   │   │   ├── Friendship.cs
│   │   │   ├── Review.cs
│   │   │   ├── QAQuestion.cs
│   │   │   ├── QAAnswer.cs
│   │   │   ├── Page.cs
│   │   │   ├── News.cs
│   │   │   ├── MapLocation.cs
│   │   │   └── Guide.cs
│   │   ├── Media/
│   │   │   ├── Video.cs
│   │   │   ├── Podcast.cs
│   │   │   ├── MediaFile.cs
│   │   │   ├── Playlist.cs
│   │   │   └── MediaAnalytics.cs
│   │   ├── Marketplace/
│   │   │   ├── Vendor.cs
│   │   │   ├── Product.cs
│   │   │   ├── Order.cs
│   │   │   ├── Payment.cs
│   │   │   ├── Inventory.cs
│   │   │   └── Booking.cs
│   │   └── Marketing/
│   │       ├── Campaign.cs
│   │       ├── MarketingAnalytics.cs
│   │       └── CustomerSegment.cs
│   ├── ValueObjects/
│   │   ├── Email.cs
│   │   ├── PhoneNumber.cs
│   │   ├── Address.cs
│   │   ├── Money.cs
│   │   └── DateRange.cs
│   ├── Enums/
│   │   ├── Identity/
│   │   ├── Community/
│   │   ├── Media/
│   │   ├── Marketplace/
│   │   └── Marketing/
│   ├── Events/
│   │   ├── Identity/
│   │   ├── Community/
│   │   ├── Media/
│   │   ├── Marketplace/
│   │   └── Marketing/
│   ├── Exceptions/
│   │   ├── DomainException.cs
│   │   ├── BusinessRuleException.cs
│   │   └── ValidationException.cs
│   ├── Interfaces/
│   │   ├── Repositories/
│   │   ├── Services/
│   │   └── Events/
│   └── Services/
│       ├── Identity/
│       ├── Community/
│       ├── Media/
│       ├── Marketplace/
│       └── Marketing/
├── Application/
│   ├── Common/
│   │   ├── Models/
│   │   │   ├── Result.cs
│   │   │   ├── PagedResult.cs
│   │   │   ├── ApiResponse.cs
│   │   │   └── ValidationResult.cs
│   │   ├── Interfaces/
│   │   │   ├── ICurrentUserService.cs
│   │   │   ├── IDateTime.cs
│   │   │   ├── IFileService.cs
│   │   │   └── IEmailService.cs
│   │   ├── Behaviors/
│   │   │   ├── ValidationBehavior.cs
│   │   │   ├── LoggingBehavior.cs
│   │   │   ├── PerformanceBehavior.cs
│   │   │   ├── CachingBehavior.cs
│   │   │   └── ExceptionBehavior.cs
│   │   ├── Mappings/
│   │   │   ├── MappingProfile.cs
│   │   │   └── FeatureMappings/
│   │   └── Extensions/
│   │       ├── ServiceCollectionExtensions.cs
│   │       └── QueryableExtensions.cs
│   ├── Features/
│   │   ├── Identity/
│   │   │   ├── Auth/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── LoginCommand.cs
│   │   │   │   │   ├── RegisterCommand.cs
│   │   │   │   │   ├── RefreshTokenCommand.cs
│   │   │   │   │   └── LogoutCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetCurrentUserQuery.cs
│   │   │   │   │   └── ValidateTokenQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   │   ├── LoginCommandHandler.cs
│   │   │   │   │   ├── RegisterCommandHandler.cs
│   │   │   │   │   ├── RefreshTokenCommandHandler.cs
│   │   │   │   │   ├── LogoutCommandHandler.cs
│   │   │   │   │   ├── GetCurrentUserQueryHandler.cs
│   │   │   │   │   └── ValidateTokenQueryHandler.cs
│   │   │   │   ├── DTOs/
│   │   │   │   │   ├── Requests/
│   │   │   │   │   └── Responses/
│   │   │   │   ├── Validators/
│   │   │   │   │   ├── LoginCommandValidator.cs
│   │   │   │   │   └── RegisterCommandValidator.cs
│   │   │   │   ├── Services/
│   │   │   │   │   ├── IAuthenticationService.cs
│   │   │   │   │   ├── AuthenticationService.cs
│   │   │   │   │   ├── IJwtTokenService.cs
│   │   │   │   │   └── JwtTokenService.cs
│   │   │   │   └── Interfaces/
│   │   │   └── Profile/
│   │   │       ├── Commands/
│   │   │       ├── Queries/
│   │   │       ├── Handlers/
│   │   │       ├── DTOs/
│   │   │       ├── Validators/
│   │   │       └── Services/
│   │   ├── Community/
│   │   │   ├── Posts/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreatePostCommand.cs
│   │   │   │   │   ├── UpdatePostCommand.cs
│   │   │   │   │   ├── DeletePostCommand.cs
│   │   │   │   │   └── LikePostCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetPostsQuery.cs
│   │   │   │   │   ├── GetPostByIdQuery.cs
│   │   │   │   │   └── GetUserPostsQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   ├── DTOs/
│   │   │   │   ├── Validators/
│   │   │   │   └── Services/
│   │   │   ├── Comments/
│   │   │   ├── Groups/
│   │   │   ├── Friends/
│   │   │   ├── Reviews/
│   │   │   ├── QA/
│   │   │   ├── Pages/
│   │   │   ├── News/
│   │   │   ├── Maps/
│   │   │   └── Guides/
│   │   ├── Media/
│   │   │   ├── Videos/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── UploadVideoCommand.cs
│   │   │   │   │   ├── UpdateVideoCommand.cs
│   │   │   │   │   ├── DeleteVideoCommand.cs
│   │   │   │   │   └── ProcessVideoCommand.cs
│   │   │   │   ├── Queries/
│   │   │   │   │   ├── GetVideosQuery.cs
│   │   │   │   │   ├── GetVideoByIdQuery.cs
│   │   │   │   │   ├── SearchVideosQuery.cs
│   │   │   │   │   └── GetVideoAnalyticsQuery.cs
│   │   │   │   ├── Handlers/
│   │   │   │   ├── DTOs/
│   │   │   │   ├── Validators/
│   │   │   │   └── Services/
│   │   │   ├── Podcasts/
│   │   │   ├── Playlists/
│   │   │   ├── Analytics/
│   │   │   └── Upload/
│   │   ├── Marketplace/
│   │   │   ├── Vendors/
│   │   │   ├── Products/
│   │   │   ├── Orders/
│   │   │   ├── Payments/
│   │   │   ├── Inventory/
│   │   │   └── Bookings/
│   │   ├── Marketing/
│   │   │   ├── Campaigns/
│   │   │   ├── Analytics/
│   │   │   └── Segments/
│   │   └── Shared/
│   │       ├── Notifications/
│   │       │   ├── Commands/
│   │       │   ├── Queries/
│   │       │   ├── Handlers/
│   │       │   ├── DTOs/
│   │       │   ├── Services/
│   │       │   └── Interfaces/
│   │       ├── Caching/
│   │       │   ├── Services/
│   │       │   ├── Interfaces/
│   │       │   └── Models/
│   │       ├── Chat/
│   │       ├── Localization/
│   │       └── FileStorage/
│   └── DependencyInjection.cs
├── Infrastructure/
│   ├── Data/
│   │   ├── Context/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   └── DbContextFactory.cs
│   │   ├── Configurations/
│   │   │   ├── Identity/
│   │   │   │   ├── ApplicationUserConfiguration.cs
│   │   │   │   └── RoleConfiguration.cs
│   │   │   ├── Community/
│   │   │   │   ├── PostConfiguration.cs
│   │   │   │   ├── CommentConfiguration.cs
│   │   │   │   └── GroupConfiguration.cs
│   │   │   ├── Media/
│   │   │   │   ├── VideoConfiguration.cs
│   │   │   │   └── PodcastConfiguration.cs
│   │   │   ├── Marketplace/
│   │   │   │   ├── VendorConfiguration.cs
│   │   │   │   └── ProductConfiguration.cs
│   │   │   └── Marketing/
│   │   │       └── CampaignConfiguration.cs
│   │   ├── Repositories/
│   │   │   ├── Base/
│   │   │   │   ├── IRepository.cs
│   │   │   │   ├── Repository.cs
│   │   │   │   ├── IUnitOfWork.cs
│   │   │   │   └── UnitOfWork.cs
│   │   │   ├── Identity/
│   │   │   │   ├── IUserRepository.cs
│   │   │   │   └── UserRepository.cs
│   │   │   ├── Community/
│   │   │   │   ├── IPostRepository.cs
│   │   │   │   ├── PostRepository.cs
│   │   │   │   ├── ICommentRepository.cs
│   │   │   │   └── CommentRepository.cs
│   │   │   ├── Media/
│   │   │   │   ├── IVideoRepository.cs
│   │   │   │   ├── VideoRepository.cs
│   │   │   │   ├── IPodcastRepository.cs
│   │   │   │   └── PodcastRepository.cs
│   │   │   ├── Marketplace/
│   │   │   │   ├── IVendorRepository.cs
│   │   │   │   ├── VendorRepository.cs
│   │   │   │   ├── IProductRepository.cs
│   │   │   │   └── ProductRepository.cs
│   │   │   └── Marketing/
│   │   │       ├── ICampaignRepository.cs
│   │   │       └── CampaignRepository.cs
│   │   ├── Migrations/
│   │   └── Seeds/
│   │       ├── DatabaseSeeder.cs
│   │       ├── IdentitySeeder.cs
│   │       ├── CommunitySeeder.cs
│   │       ├── MediaSeeder.cs
│   │       ├── MarketplaceSeeder.cs
│   │       └── MarketingSeeder.cs
│   ├── Services/
│   │   ├── Identity/
│   │   │   ├── CurrentUserService.cs
│   │   │   ├── JwtTokenService.cs
│   │   │   └── PasswordService.cs
│   │   ├── Notifications/
│   │   │   ├── NotificationService.cs
│   │   │   ├── NotificationHubService.cs
│   │   │   ├── EmailService.cs
│   │   │   └── SmsService.cs
│   │   ├── FileStorage/
│   │   │   ├── IFileStorageService.cs
│   │   │   ├── LocalFileStorageService.cs
│   │   │   ├── AzureBlobStorageService.cs
│   │   │   └── S3FileStorageService.cs
│   │   ├── Caching/
│   │   │   ├── MemoryCacheService.cs
│   │   │   ├── RedisCacheService.cs
│   │   │   └── HybridCacheService.cs
│   │   ├── External/
│   │   │   ├── AIAgentService.cs
│   │   │   ├── PaymentGatewayService.cs
│   │   │   └── SocialMediaService.cs
│   │   └── Background/
│   │       ├── BackgroundTaskService.cs
│   │       ├── EmailQueueService.cs
│   │       └── MediaProcessingService.cs
│   ├── Hubs/
│   │   ├── NotificationHub.cs
│   │   ├── ChatHub.cs
│   │   └── MediaStreamingHub.cs
│   ├── Extensions/
│   │   ├── ServiceCollectionExtensions.cs
│   │   ├── ApplicationBuilderExtensions.cs
│   │   └── ConfigurationExtensions.cs
│   └── DependencyInjection.cs
└── WebAPI/
    ├── Controllers/
    │   ├── Base/
    │   │   ├── BaseController.cs
    │   │   ├── BaseApiController.cs
    │   │   └── BaseCrudController.cs
    │   ├── v1/
    │   │   └── Identity/
    │   │       ├── Auth/
    │   │       │   ├── AuthenticationController.cs
    │   │       │   └── AuthorizationController.cs
    │   │       └── Profile/
    │   │           └── UserProfileController.cs
    │   ├── v2/
    │   │   └── Community/
    │   │       ├── Posts/
    │   │       │   ├── PostsController.cs
    │   │       │   └── PostInteractionController.cs
    │   │       ├── Comments/
    │   │       │   └── CommentsController.cs
    │   │       ├── Groups/
    │   │       │   ├── GroupsController.cs
    │   │       │   └── GroupMembershipController.cs
    │   │       ├── Friends/
    │   │       │   └── FriendsController.cs
    │   │       ├── Reviews/
    │   │       │   └── ReviewsController.cs
    │   │       ├── QA/
    │   │       │   ├── QuestionsController.cs
    │   │       │   └── AnswersController.cs
    │   │       ├── Pages/
    │   │       │   └── PagesController.cs
    │   │       ├── News/
    │   │       │   └── NewsController.cs
    │   │       ├── Maps/
    │   │       │   └── LocationsController.cs
    │   │       └── Guides/
    │   │           └── GuidesController.cs
    │   ├── v3/
    │   │   └── Admin/
    │   │       ├── Users/
    │   │       │   └── AdminUsersController.cs
    │   │       ├── Content/
    │   │       │   └── ContentModerationController.cs
    │   │       ├── Analytics/
    │   │       │   └── AdminAnalyticsController.cs
    │   │       └── System/
    │   │           ├── HealthController.cs
    │   │           └── ConfigurationController.cs
    │   ├── v4/
    │   │   └── Shared/
    │   │       ├── Notifications/
    │   │       │   └── NotificationsController.cs
    │   │       ├── Files/
    │   │       │   └── FileUploadController.cs
    │   │       └── Search/
    │   │           └── SearchController.cs
    │   ├── v6/
    │   │   └── Marketplace/
    │   │       ├── Vendors/
    │   │       │   ├── VendorsController.cs
    │   │       │   └── VendorOnboardingController.cs
    │   │       ├── Products/
    │   │       │   ├── ProductsController.cs
    │   │       │   └── ProductCatalogController.cs
    │   │       ├── Orders/
    │   │       │   ├── OrdersController.cs
    │   │       │   └── OrderManagementController.cs
    │   │       ├── Payments/
    │   │       │   └── PaymentsController.cs
    │   │       ├── Inventory/
    │   │       │   └── InventoryController.cs
    │   │       └── Bookings/
    │   │           └── BookingsController.cs
    │   └── v7/
    │       └── Media/
    │           ├── Videos/
    │           │   ├── VideosController.cs
    │           │   ├── VideoUploadController.cs
    │           │   ├── VideoDiscoveryController.cs
    │           │   └── VideoAnalyticsController.cs
    │           ├── Podcasts/
    │           │   ├── PodcastsController.cs
    │           │   ├── PodcastUploadController.cs
    │           │   ├── PodcastDiscoveryController.cs
    │           │   └── PodcastAnalyticsController.cs
    │           ├── Playlists/
    │           │   └── PlaylistsController.cs
    │           └── Streaming/
    │               └── MediaStreamingController.cs
    ├── Middleware/
    │   ├── ExceptionHandlingMiddleware.cs
    │   ├── RequestLoggingMiddleware.cs
    │   ├── PerformanceMiddleware.cs
    │   ├── RateLimitingMiddleware.cs
    │   ├── SecurityHeadersMiddleware.cs
    │   └── CorsMiddleware.cs
    ├── Filters/
    │   ├── ValidationFilter.cs
    │   ├── AuthorizationFilter.cs
    │   ├── CacheFilter.cs
    │   ├── SanitizeInputFilter.cs
    │   └── ApiVersionFilter.cs
    ├── Extensions/
    │   ├── ServiceCollectionExtensions.cs
    │   ├── ApplicationBuilderExtensions.cs
    │   ├── ControllerExtensions.cs
    │   └── SwaggerExtensions.cs
    ├── Configuration/
    │   ├── ApiVersioningConfiguration.cs
    │   ├── SwaggerConfiguration.cs
    │   ├── CorsConfiguration.cs
    │   ├── AuthenticationConfiguration.cs
    │   └── CachingConfiguration.cs
    ├── Services/
    │   ├── CurrentUserService.cs
    │   ├── RequestContextService.cs
    │   └── ApiResponseService.cs
    ├── Program.cs
    ├── appsettings.json
    ├── appsettings.Development.json
    ├── appsettings.Production.json
    └── GlobalUsings.cs
```

## CQRS Implementation with MediatR

### Command and Query Pattern Implementation

```csharp
// Application/Features/Community/Posts/Commands/CreatePostCommand.cs
using MediatR;
using Application.Common.Models;
using FluentValidation;

namespace Application.Features.Community.Posts.Commands
{
    public record CreatePostCommand : IRequest<Result<PostDto>>
    {
        public string Title { get; init; } = string.Empty;
        public string Content { get; init; } = string.Empty;
        public List<string> Tags { get; init; } = new();
        public string? ImageUrl { get; init; }
        public bool IsPublic { get; init; } = true;
        public Guid? GroupId { get; init; }
    }

    public class CreatePostCommandValidator : AbstractValidator<CreatePostCommand>
    {
        public CreatePostCommandValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Content is required")
                .MaximumLength(5000).WithMessage("Content must not exceed 5000 characters");

            RuleFor(x => x.Tags)
                .Must(tags => tags.Count <= 10).WithMessage("Maximum 10 tags allowed");
        }
    }
}

// Application/Features/Community/Posts/Handlers/CreatePostCommandHandler.cs
using MediatR;
using AutoMapper;
using Domain.Entities.Community;
using Domain.Interfaces.Repositories;
using Application.Common.Interfaces;
using Application.Common.Models;

namespace Application.Features.Community.Posts.Handlers
{
    public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, Result<PostDto>>
    {
        private readonly IPostRepository _postRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;
        private readonly ILogger<CreatePostCommandHandler> _logger;

        public CreatePostCommandHandler(
            IPostRepository postRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserService currentUserService,
            IMapper mapper,
            ILogger<CreatePostCommandHandler> logger)
        {
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
            _currentUserService = currentUserService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PostDto>> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Result<PostDto>.Failure("User not authenticated");
                }

                var post = Post.Create(
                    title: request.Title,
                    content: request.Content,
                    authorId: Guid.Parse(userId),
                    tags: request.Tags,
                    imageUrl: request.ImageUrl,
                    isPublic: request.IsPublic,
                    groupId: request.GroupId
                );

                await _postRepository.AddAsync(post, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var postDto = _mapper.Map<PostDto>(post);
                
                _logger.LogInformation("Post created successfully with ID: {PostId}", post.Id);
                
                return Result<PostDto>.Success(postDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating post");
                return Result<PostDto>.Failure("An error occurred while creating the post");
            }
        }
    }
}

// Application/Features/Community/Posts/Queries/GetPostsQuery.cs
using MediatR;
using Application.Common.Models;

namespace Application.Features.Community.Posts.Queries
{
    public record GetPostsQuery : IRequest<Result<PagedResult<PostDto>>>
    {
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 20;
        public string? SearchTerm { get; init; }
        public List<string>? Tags { get; init; }
        public Guid? GroupId { get; init; }
        public bool? IsPublic { get; init; }
        public string? SortBy { get; init; } = "CreatedAt";
        public bool SortDescending { get; init; } = true;
    }
}

// Application/Features/Community/Posts/Handlers/GetPostsQueryHandler.cs
using MediatR;
using AutoMapper;
using Domain.Interfaces.Repositories;
using Application.Common.Models;
using Application.Common.Extensions;

namespace Application.Features.Community.Posts.Handlers
{
    public class GetPostsQueryHandler : IRequestHandler<GetPostsQuery, Result<PagedResult<PostDto>>>
    {
        private readonly IPostRepository _postRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<GetPostsQueryHandler> _logger;

        public GetPostsQueryHandler(
            IPostRepository postRepository,
            IMapper mapper,
            ILogger<GetPostsQueryHandler> logger)
        {
            _postRepository = postRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PagedResult<PostDto>>> Handle(GetPostsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _postRepository.GetQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(request.SearchTerm))
                {
                    query = query.Where(p => p.Title.Contains(request.SearchTerm) || 
                                           p.Content.Contains(request.SearchTerm));
                }

                if (request.Tags?.Any() == true)
                {
                    query = query.Where(p => p.Tags.Any(t => request.Tags.Contains(t)));
                }

                if (request.GroupId.HasValue)
                {
                    query = query.Where(p => p.GroupId == request.GroupId.Value);
                }

                if (request.IsPublic.HasValue)
                {
                    query = query.Where(p => p.IsPublic == request.IsPublic.Value);
                }

                // Apply sorting
                query = request.SortBy?.ToLower() switch
                {
                    "title" => request.SortDescending ? query.OrderByDescending(p => p.Title) : query.OrderBy(p => p.Title),
                    "likes" => request.SortDescending ? query.OrderByDescending(p => p.LikesCount) : query.OrderBy(p => p.LikesCount),
                    "comments" => request.SortDescending ? query.OrderByDescending(p => p.CommentsCount) : query.OrderBy(p => p.CommentsCount),
                    _ => request.SortDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt)
                };

                var pagedResult = await query.ToPagedResultAsync(request.Page, request.PageSize, cancellationToken);
                var postDtos = _mapper.Map<List<PostDto>>(pagedResult.Items);

                var result = new PagedResult<PostDto>
                {
                    Items = postDtos,
                    TotalCount = pagedResult.TotalCount,
                    Page = pagedResult.Page,
                    PageSize = pagedResult.PageSize,
                    TotalPages = pagedResult.TotalPages
                };

                return Result<PagedResult<PostDto>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving posts");
                return Result<PagedResult<PostDto>>.Failure("An error occurred while retrieving posts");
            }
        }
    }
}
```

### MediatR Pipeline Behaviors

```csharp
// Application/Common/Behaviors/ValidationBehavior.cs
using MediatR;
using FluentValidation;
using Application.Common.Models;

namespace Application.Common.Behaviors
{
    public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
        where TResponse : class
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;
        private readonly ILogger<ValidationBehavior<TRequest, TResponse>> _logger;

        public ValidationBehavior(
            IEnumerable<IValidator<TRequest>> validators,
            ILogger<ValidationBehavior<TRequest, TResponse>> logger)
        {
            _validators = validators;
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            if (!_validators.Any())
            {
                return await next();
            }

            var context = new ValidationContext<TRequest>(request);
            var validationResults = await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));
            var failures = validationResults.SelectMany(r => r.Errors).Where(f => f != null).ToList();

            if (failures.Any())
            {
                var errors = failures.Select(f => f.ErrorMessage).ToList();
                _logger.LogWarning("Validation failed for {RequestType}: {Errors}", typeof(TRequest).Name, string.Join(", ", errors));

                // Handle Result<T> responses
                if (typeof(TResponse).IsGenericType && typeof(TResponse).GetGenericTypeDefinition() == typeof(Result<>))
                {
                    var resultType = typeof(TResponse).GetGenericArguments()[0];
                    var failureMethod = typeof(Result<>).MakeGenericType(resultType).GetMethod("Failure", new[] { typeof(IEnumerable<string>) });
                    return (TResponse)failureMethod!.Invoke(null, new object[] { errors })!;
                }

                // Handle Result responses
                if (typeof(TResponse) == typeof(Result))
                {
                    return (TResponse)(object)Result.Failure(errors);
                }

                throw new ValidationException(failures);
            }

            return await next();
        }
    }
}

// Application/Common/Behaviors/LoggingBehavior.cs
using MediatR;
using System.Diagnostics;

namespace Application.Common.Behaviors
{
    public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;
        private readonly ICurrentUserService _currentUserService;

        public LoggingBehavior(
            ILogger<LoggingBehavior<TRequest, TResponse>> logger,
            ICurrentUserService currentUserService)
        {
            _logger = logger;
            _currentUserService = currentUserService;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var requestName = typeof(TRequest).Name;
            var userId = _currentUserService.UserId ?? "Anonymous";

            _logger.LogInformation("Handling {RequestName} for User {UserId}", requestName, userId);

            var stopwatch = Stopwatch.StartNew();
            var response = await next();
            stopwatch.Stop();

            _logger.LogInformation("Handled {RequestName} for User {UserId} in {ElapsedMilliseconds}ms", 
                requestName, userId, stopwatch.ElapsedMilliseconds);

            return response;
        }
    }
}

// Application/Common/Behaviors/PerformanceBehavior.cs
using MediatR;
using System.Diagnostics;

namespace Application.Common.Behaviors
{
    public class PerformanceBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly ILogger<PerformanceBehavior<TRequest, TResponse>> _logger;
        private readonly ICurrentUserService _currentUserService;

        public PerformanceBehavior(
            ILogger<PerformanceBehavior<TRequest, TResponse>> logger,
            ICurrentUserService currentUserService)
        {
            _logger = logger;
            _currentUserService = currentUserService;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var stopwatch = Stopwatch.StartNew();
            var response = await next();
            stopwatch.Stop();

            var elapsedMilliseconds = stopwatch.ElapsedMilliseconds;

            if (elapsedMilliseconds > 500) // Log slow requests
            {
                var requestName = typeof(TRequest).Name;
                var userId = _currentUserService.UserId ?? "Anonymous";

                _logger.LogWarning("Slow Request: {RequestName} ({ElapsedMilliseconds}ms) for User {UserId}",
                    requestName, elapsedMilliseconds, userId);
            }

            return response;
        }
    }
}

// Application/Common/Behaviors/CachingBehavior.cs
using MediatR;
using Application.Features.Shared.Caching.Interfaces.Services;
using System.Text.Json;

namespace Application.Common.Behaviors
{
    public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
        where TResponse : class
    {
        private readonly ICacheService _cacheService;
        private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

        public CachingBehavior(
            ICacheService cacheService,
            ILogger<CachingBehavior<TRequest, TResponse>> logger)
        {
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            // Only cache queries (read operations)
            if (!typeof(TRequest).Name.EndsWith("Query"))
            {
                return await next();
            }

            var cacheKey = GenerateCacheKey(request);
            var cachedResponse = await _cacheService.GetAsync<TResponse>(cacheKey, cancellationToken);

            if (cachedResponse != null)
            {
                _logger.LogDebug("Cache hit for {RequestName}", typeof(TRequest).Name);
                return cachedResponse;
            }

            _logger.LogDebug("Cache miss for {RequestName}", typeof(TRequest).Name);
            var response = await next();

            // Cache successful responses
            if (IsSuccessfulResponse(response))
            {
                var cacheExpiration = GetCacheExpiration(typeof(TRequest));
                await _cacheService.SetAsync(cacheKey, response, cacheExpiration, cancellationToken);
            }

            return response;
        }

        private string GenerateCacheKey(TRequest request)
        {
            var requestJson = JsonSerializer.Serialize(request);
            var hash = System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(requestJson));
            var hashString = Convert.ToBase64String(hash);
            return $"{typeof(TRequest).Name}:{hashString}";
        }

        private bool IsSuccessfulResponse(TResponse response)
        {
            // Check if response indicates success
            if (response is Result result)
                return result.Succeeded;

            var resultProperty = response.GetType().GetProperty("Succeeded");
            if (resultProperty != null)
                return (bool)resultProperty.GetValue(response)!;

            return true; // Assume success if no clear indication
        }

        private TimeSpan GetCacheExpiration(Type requestType)
        {
            // Different cache durations based on request type
            return requestType.Name switch
            {
                var name when name.Contains("User") => TimeSpan.FromMinutes(5),
                var name when name.Contains("Post") => TimeSpan.FromMinutes(2),
                var name when name.Contains("Analytics") => TimeSpan.FromMinutes(10),
                _ => TimeSpan.FromMinutes(1)
            };
        }
    }
}
```
## Domain Layer Implementation

### Base Classes and Value Objects

```csharp
// Domain/Base/Entity.cs
namespace Domain.Base
{
    public abstract class Entity<TId> : IEquatable<Entity<TId>>
        where TId : IEquatable<TId>
    {
        public TId Id { get; protected set; } = default!;
        public DateTime CreatedAt { get; protected set; }
        public DateTime? UpdatedAt { get; protected set; }
        public string? CreatedBy { get; protected set; }
        public string? UpdatedBy { get; protected set; }

        protected Entity() { }

        protected Entity(TId id)
        {
            Id = id;
            CreatedAt = DateTime.UtcNow;
        }

        public void SetAuditInfo(string? userId = null)
        {
            if (CreatedAt == default)
            {
                CreatedAt = DateTime.UtcNow;
                CreatedBy = userId;
            }
            else
            {
                UpdatedAt = DateTime.UtcNow;
                UpdatedBy = userId;
            }
        }

        public bool Equals(Entity<TId>? other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;
            return Id.Equals(other.Id);
        }

        public override bool Equals(object? obj)
        {
            return obj is Entity<TId> entity && Equals(entity);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

        public static bool operator ==(Entity<TId>? left, Entity<TId>? right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(Entity<TId>? left, Entity<TId>? right)
        {
            return !Equals(left, right);
        }
    }
}

// Domain/Base/AggregateRoot.cs
using Domain.Base;

namespace Domain.Base
{
    public abstract class AggregateRoot<TId> : Entity<TId>
        where TId : IEquatable<TId>
    {
        private readonly List<DomainEvent> _domainEvents = new();

        protected AggregateRoot() { }

        protected AggregateRoot(TId id) : base(id) { }

        public IReadOnlyCollection<DomainEvent> DomainEvents => _domainEvents.AsReadOnly();

        protected void AddDomainEvent(DomainEvent domainEvent)
        {
            _domainEvents.Add(domainEvent);
        }

        public void ClearDomainEvents()
        {
            _domainEvents.Clear();
        }
    }
}

// Domain/Base/ValueObject.cs
namespace Domain.Base
{
    public abstract class ValueObject : IEquatable<ValueObject>
    {
        protected abstract IEnumerable<object?> GetEqualityComponents();

        public bool Equals(ValueObject? other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;
            return GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
        }

        public override bool Equals(object? obj)
        {
            return obj is ValueObject valueObject && Equals(valueObject);
        }

        public override int GetHashCode()
        {
            return GetEqualityComponents()
                .Where(x => x != null)
                .Aggregate(1, (current, obj) => current * 23 + obj!.GetHashCode());
        }

        public static bool operator ==(ValueObject? left, ValueObject? right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(ValueObject? left, ValueObject? right)
        {
            return !Equals(left, right);
        }
    }
}

// Domain/Base/DomainEvent.cs
using MediatR;

namespace Domain.Base
{
    public abstract record DomainEvent : INotification
    {
        public Guid Id { get; } = Guid.NewGuid();
        public DateTime OccurredOn { get; } = DateTime.UtcNow;
    }
}

// Domain/ValueObjects/Email.cs
using Domain.Base;
using System.Text.RegularExpressions;

namespace Domain.ValueObjects
{
    public class Email : ValueObject
    {
        private static readonly Regex EmailRegex = new(
            @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
            RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public string Value { get; private set; }

        private Email(string value)
        {
            Value = value;
        }

        public static Email Create(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            if (!EmailRegex.IsMatch(email))
                throw new ArgumentException("Invalid email format", nameof(email));

            return new Email(email.ToLowerInvariant());
        }

        protected override IEnumerable<object?> GetEqualityComponents()
        {
            yield return Value;
        }

        public static implicit operator string(Email email) => email.Value;
        public override string ToString() => Value;
    }
}

// Domain/ValueObjects/Money.cs
using Domain.Base;

namespace Domain.ValueObjects
{
    public class Money : ValueObject
    {
        public decimal Amount { get; private set; }
        public string Currency { get; private set; }

        private Money(decimal amount, string currency)
        {
            Amount = amount;
            Currency = currency;
        }

        public static Money Create(decimal amount, string currency = "USD")
        {
            if (amount < 0)
                throw new ArgumentException("Amount cannot be negative", nameof(amount));

            if (string.IsNullOrWhiteSpace(currency))
                throw new ArgumentException("Currency cannot be empty", nameof(currency));

            return new Money(amount, currency.ToUpperInvariant());
        }

        public Money Add(Money other)
        {
            if (Currency != other.Currency)
                throw new InvalidOperationException("Cannot add money with different currencies");

            return new Money(Amount + other.Amount, Currency);
        }

        public Money Subtract(Money other)
        {
            if (Currency != other.Currency)
                throw new InvalidOperationException("Cannot subtract money with different currencies");

            if (Amount < other.Amount)
                throw new InvalidOperationException("Insufficient funds");

            return new Money(Amount - other.Amount, Currency);
        }

        public Money Multiply(decimal factor)
        {
            if (factor < 0)
                throw new ArgumentException("Factor cannot be negative", nameof(factor));

            return new Money(Amount * factor, Currency);
        }

        protected override IEnumerable<object?> GetEqualityComponents()
        {
            yield return Amount;
            yield return Currency;
        }

        public override string ToString() => $"{Amount:C} {Currency}";
    }
}
```

### Domain Entities Implementation

```csharp
// Domain/Entities/Community/Post.cs
using Domain.Base;
using Domain.Enums.Community;
using Domain.Events.Community;

namespace Domain.Entities.Community
{
    public class Post : AggregateRoot<Guid>
    {
        public string Title { get; private set; } = string.Empty;
        public string Content { get; private set; } = string.Empty;
        public List<string> Tags { get; private set; } = new();
        public string? ImageUrl { get; private set; }
        public bool IsPublic { get; private set; }
        public PostStatus Status { get; private set; }
        public Guid AuthorId { get; private set; }
        public Guid? GroupId { get; private set; }
        
        // Navigation properties
        public ApplicationUser Author { get; private set; } = null!;
        public Group? Group { get; private set; }
        public List<Comment> Comments { get; private set; } = new();
        public List<PostLike> Likes { get; private set; } = new();
        
        // Computed properties
        public int LikesCount => Likes.Count;
        public int CommentsCount => Comments.Count;

        private Post() { } // EF Core

        private Post(Guid id, string title, string content, Guid authorId, List<string> tags, 
                    string? imageUrl, bool isPublic, Guid? groupId) : base(id)
        {
            Title = title;
            Content = content;
            AuthorId = authorId;
            Tags = tags;
            ImageUrl = imageUrl;
            IsPublic = isPublic;
            GroupId = groupId;
            Status = PostStatus.Published;

            AddDomainEvent(new PostCreatedEvent(Id, AuthorId, Title));
        }

        public static Post Create(string title, string content, Guid authorId, List<string> tags, 
                                string? imageUrl = null, bool isPublic = true, Guid? groupId = null)
        {
            ValidateTitle(title);
            ValidateContent(content);
            ValidateTags(tags);

            return new Post(Guid.NewGuid(), title, content, authorId, tags, imageUrl, isPublic, groupId);
        }

        public void Update(string title, string content, List<string> tags, string? imageUrl, bool isPublic)
        {
            ValidateTitle(title);
            ValidateContent(content);
            ValidateTags(tags);

            Title = title;
            Content = content;
            Tags = tags;
            ImageUrl = imageUrl;
            IsPublic = isPublic;

            AddDomainEvent(new PostUpdatedEvent(Id, AuthorId));
        }

        public void AddLike(Guid userId)
        {
            if (Likes.Any(l => l.UserId == userId))
                return; // Already liked

            var like = PostLike.Create(Id, userId);
            Likes.Add(like);

            AddDomainEvent(new PostLikedEvent(Id, userId));
        }

        public void RemoveLike(Guid userId)
        {
            var like = Likes.FirstOrDefault(l => l.UserId == userId);
            if (like != null)
            {
                Likes.Remove(like);
                AddDomainEvent(new PostUnlikedEvent(Id, userId));
            }
        }

        public void ChangeStatus(PostStatus status)
        {
            if (Status == status) return;

            Status = status;
            AddDomainEvent(new PostStatusChangedEvent(Id, status));
        }

        private static void ValidateTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title cannot be empty", nameof(title));

            if (title.Length > 200)
                throw new ArgumentException("Title cannot exceed 200 characters", nameof(title));
        }

        private static void ValidateContent(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Content cannot be empty", nameof(content));

            if (content.Length > 5000)
                throw new ArgumentException("Content cannot exceed 5000 characters", nameof(content));
        }

        private static void ValidateTags(List<string> tags)
        {
            if (tags.Count > 10)
                throw new ArgumentException("Maximum 10 tags allowed", nameof(tags));

            if (tags.Any(tag => string.IsNullOrWhiteSpace(tag)))
                throw new ArgumentException("Tags cannot be empty", nameof(tags));
        }
    }
}

// Domain/Entities/Community/Comment.cs
using Domain.Base;
using Domain.Events.Community;

namespace Domain.Entities.Community
{
    public class Comment : AggregateRoot<Guid>
    {
        public string Content { get; private set; } = string.Empty;
        public Guid PostId { get; private set; }
        public Guid AuthorId { get; private set; }
        public Guid? ParentCommentId { get; private set; }
        
        // Navigation properties
        public Post Post { get; private set; } = null!;
        public ApplicationUser Author { get; private set; } = null!;
        public Comment? ParentComment { get; private set; }
        public List<Comment> Replies { get; private set; } = new();
        public List<CommentLike> Likes { get; private set; } = new();
        
        // Computed properties
        public int LikesCount => Likes.Count;
        public int RepliesCount => Replies.Count;

        private Comment() { } // EF Core

        private Comment(Guid id, string content, Guid postId, Guid authorId, Guid? parentCommentId) : base(id)
        {
            Content = content;
            PostId = postId;
            AuthorId = authorId;
            ParentCommentId = parentCommentId;

            AddDomainEvent(new CommentCreatedEvent(Id, PostId, AuthorId));
        }

        public static Comment Create(string content, Guid postId, Guid authorId, Guid? parentCommentId = null)
        {
            ValidateContent(content);
            return new Comment(Guid.NewGuid(), content, postId, authorId, parentCommentId);
        }

        public void Update(string content)
        {
            ValidateContent(content);
            Content = content;
            AddDomainEvent(new CommentUpdatedEvent(Id, PostId));
        }

        public void AddLike(Guid userId)
        {
            if (Likes.Any(l => l.UserId == userId))
                return; // Already liked

            var like = CommentLike.Create(Id, userId);
            Likes.Add(like);

            AddDomainEvent(new CommentLikedEvent(Id, userId));
        }

        public void RemoveLike(Guid userId)
        {
            var like = Likes.FirstOrDefault(l => l.UserId == userId);
            if (like != null)
            {
                Likes.Remove(like);
                AddDomainEvent(new CommentUnlikedEvent(Id, userId));
            }
        }

        private static void ValidateContent(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Content cannot be empty", nameof(content));

            if (content.Length > 1000)
                throw new ArgumentException("Content cannot exceed 1000 characters", nameof(content));
        }
    }
}
```

### Domain Events Implementation

```csharp
// Domain/Events/Community/PostCreatedEvent.cs
using Domain.Base;

namespace Domain.Events.Community
{
    public record PostCreatedEvent(Guid PostId, Guid AuthorId, string Title) : DomainEvent;
}

// Domain/Events/Community/PostUpdatedEvent.cs
using Domain.Base;

namespace Domain.Events.Community
{
    public record PostUpdatedEvent(Guid PostId, Guid AuthorId) : DomainEvent;
}

// Domain/Events/Community/PostLikedEvent.cs
using Domain.Base;

namespace Domain.Events.Community
{
    public record PostLikedEvent(Guid PostId, Guid UserId) : DomainEvent;
}

// Domain/Events/Community/CommentCreatedEvent.cs
using Domain.Base;

namespace Domain.Events.Community
{
    public record CommentCreatedEvent(Guid CommentId, Guid PostId, Guid AuthorId) : DomainEvent;
}
```

## Infrastructure Layer Implementation

### Repository Pattern with Unit of Work

```csharp
// Infrastructure/Data/Repositories/Base/IRepository.cs
using Domain.Base;
using System.Linq.Expressions;

namespace Infrastructure.Data.Repositories.Base
{
    public interface IRepository<TEntity, TId> 
        where TEntity : Entity<TId>
        where TId : IEquatable<TId>
    {
        Task<TEntity?> GetByIdAsync(TId id, CancellationToken cancellationToken = default);
        Task<TEntity?> GetByIdAsync(TId id, params Expression<Func<TEntity, object>>[] includes);
        Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<List<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
        Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
        Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken cancellationToken = default);
        
        IQueryable<TEntity> GetQueryable();
        IQueryable<TEntity> GetQueryable(params Expression<Func<TEntity, object>>[] includes);
        
        Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);
        Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default);
        
        void Update(TEntity entity);
        void UpdateRange(IEnumerable<TEntity> entities);
        
        void Remove(TEntity entity);
        void RemoveRange(IEnumerable<TEntity> entities);
        Task RemoveByIdAsync(TId id, CancellationToken cancellationToken = default);
    }
}

// Infrastructure/Data/Repositories/Base/Repository.cs
using Domain.Base;
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Data.Repositories.Base
{
    public class Repository<TEntity, TId> : IRepository<TEntity, TId>
        where TEntity : Entity<TId>
        where TId : IEquatable<TId>
    {
        protected readonly ApplicationDbContext Context;
        protected readonly DbSet<TEntity> DbSet;

        public Repository(ApplicationDbContext context)
        {
            Context = context;
            DbSet = context.Set<TEntity>();
        }

        public virtual async Task<TEntity?> GetByIdAsync(TId id, CancellationToken cancellationToken = default)
        {
            return await DbSet.FindAsync(new object[] { id }, cancellationToken);
        }

        public virtual async Task<TEntity?> GetByIdAsync(TId id, params Expression<Func<TEntity, object>>[] includes)
        {
            IQueryable<TEntity> query = DbSet;
            
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            
            return await query.FirstOrDefaultAsync(e => e.Id.Equals(id));
        }

        public virtual async Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await DbSet.ToListAsync(cancellationToken);
        }

        public virtual async Task<List<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await DbSet.Where(predicate).ToListAsync(cancellationToken);
        }

        public virtual async Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await DbSet.FirstOrDefaultAsync(predicate, cancellationToken);
        }

        public virtual async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            return await DbSet.AnyAsync(predicate, cancellationToken);
        }

        public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken cancellationToken = default)
        {
            return predicate == null 
                ? await DbSet.CountAsync(cancellationToken)
                : await DbSet.CountAsync(predicate, cancellationToken);
        }

        public virtual IQueryable<TEntity> GetQueryable()
        {
            return DbSet.AsQueryable();
        }

        public virtual IQueryable<TEntity> GetQueryable(params Expression<Func<TEntity, object>>[] includes)
        {
            IQueryable<TEntity> query = DbSet;
            
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            
            return query;
        }

        public virtual async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
        {
            await DbSet.AddAsync(entity, cancellationToken);
        }

        public virtual async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default)
        {
            await DbSet.AddRangeAsync(entities, cancellationToken);
        }

        public virtual void Update(TEntity entity)
        {
            DbSet.Update(entity);
        }

        public virtual void UpdateRange(IEnumerable<TEntity> entities)
        {
            DbSet.UpdateRange(entities);
        }

        public virtual void Remove(TEntity entity)
        {
            DbSet.Remove(entity);
        }

        public virtual void RemoveRange(IEnumerable<TEntity> entities)
        {
            DbSet.RemoveRange(entities);
        }

        public virtual async Task RemoveByIdAsync(TId id, CancellationToken cancellationToken = default)
        {
            var entity = await GetByIdAsync(id, cancellationToken);
            if (entity != null)
            {
                Remove(entity);
            }
        }
    }
}

// Infrastructure/Data/Repositories/Base/IUnitOfWork.cs
namespace Infrastructure.Data.Repositories.Base
{
    public interface IUnitOfWork : IDisposable
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        Task BeginTransactionAsync(CancellationToken cancellationToken = default);
        Task CommitTransactionAsync(CancellationToken cancellationToken = default);
        Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    }
}

// Infrastructure/Data/Repositories/Base/UnitOfWork.cs
using Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Data.Repositories.Base
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync(cancellationToken);
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync(cancellationToken);
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
```
### Entity Framework Configuration

```csharp
// Infrastructure/Data/Context/ApplicationDbContext.cs
using Domain.Base;
using Domain.Entities.Community;
using Domain.Entities.Identity;
using Domain.Entities.Media;
using Domain.Entities.Marketplace;
using Domain.Entities.Marketing;
using Infrastructure.Data.Configurations.Community;
using Infrastructure.Data.Configurations.Identity;
using Infrastructure.Data.Configurations.Media;
using Infrastructure.Data.Configurations.Marketplace;
using Infrastructure.Data.Configurations.Marketing;
using MediatR;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUserService;

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options,
            IMediator mediator,
            ICurrentUserService currentUserService) : base(options)
        {
            _mediator = mediator;
            _currentUserService = currentUserService;
        }

        // Community DbSets
        public DbSet<Post> Posts => Set<Post>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Group> Groups => Set<Group>();
        public DbSet<Friendship> Friendships => Set<Friendship>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<QAQuestion> QAQuestions => Set<QAQuestion>();
        public DbSet<QAAnswer> QAAnswers => Set<QAAnswer>();
        public DbSet<Page> Pages => Set<Page>();
        public DbSet<News> News => Set<News>();
        public DbSet<MapLocation> MapLocations => Set<MapLocation>();
        public DbSet<Guide> Guides => Set<Guide>();

        // Media DbSets
        public DbSet<Video> Videos => Set<Video>();
        public DbSet<Podcast> Podcasts => Set<Podcast>();
        public DbSet<MediaFile> MediaFiles => Set<MediaFile>();
        public DbSet<Playlist> Playlists => Set<Playlist>();
        public DbSet<MediaAnalytics> MediaAnalytics => Set<MediaAnalytics>();

        // Marketplace DbSets
        public DbSet<Vendor> Vendors => Set<Vendor>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Inventory> Inventories => Set<Inventory>();
        public DbSet<Booking> Bookings => Set<Booking>();

        // Marketing DbSets
        public DbSet<Campaign> Campaigns => Set<Campaign>();
        public DbSet<MarketingAnalytics> MarketingAnalytics => Set<MarketingAnalytics>();
        public DbSet<CustomerSegment> CustomerSegments => Set<CustomerSegment>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Apply configurations
            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

            // Configure Identity tables
            builder.ApplyConfiguration(new ApplicationUserConfiguration());
            builder.ApplyConfiguration(new ApplicationRoleConfiguration());

            // Configure Community entities
            builder.ApplyConfiguration(new PostConfiguration());
            builder.ApplyConfiguration(new CommentConfiguration());
            builder.ApplyConfiguration(new GroupConfiguration());
            builder.ApplyConfiguration(new FriendshipConfiguration());
            builder.ApplyConfiguration(new ReviewConfiguration());
            builder.ApplyConfiguration(new QAQuestionConfiguration());
            builder.ApplyConfiguration(new QAAnswerConfiguration());
            builder.ApplyConfiguration(new PageConfiguration());
            builder.ApplyConfiguration(new NewsConfiguration());
            builder.ApplyConfiguration(new MapLocationConfiguration());
            builder.ApplyConfiguration(new GuideConfiguration());

            // Configure Media entities
            builder.ApplyConfiguration(new VideoConfiguration());
            builder.ApplyConfiguration(new PodcastConfiguration());
            builder.ApplyConfiguration(new MediaFileConfiguration());
            builder.ApplyConfiguration(new PlaylistConfiguration());
            builder.ApplyConfiguration(new MediaAnalyticsConfiguration());

            // Configure Marketplace entities
            builder.ApplyConfiguration(new VendorConfiguration());
            builder.ApplyConfiguration(new ProductConfiguration());
            builder.ApplyConfiguration(new OrderConfiguration());
            builder.ApplyConfiguration(new PaymentConfiguration());
            builder.ApplyConfiguration(new InventoryConfiguration());
            builder.ApplyConfiguration(new BookingConfiguration());

            // Configure Marketing entities
            builder.ApplyConfiguration(new CampaignConfiguration());
            builder.ApplyConfiguration(new MarketingAnalyticsConfiguration());
            builder.ApplyConfiguration(new CustomerSegmentConfiguration());

            // Configure global query filters for soft delete
            ConfigureGlobalQueryFilters(builder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Set audit information
            SetAuditInformation();

            // Save changes
            var result = await base.SaveChangesAsync(cancellationToken);

            // Dispatch domain events
            await DispatchDomainEventsAsync();

            return result;
        }

        private void SetAuditInformation()
        {
            var userId = _currentUserService.UserId;
            var entries = ChangeTracker.Entries<Entity<Guid>>()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                entry.Entity.SetAuditInfo(userId);
            }
        }

        private async Task DispatchDomainEventsAsync()
        {
            var domainEntities = ChangeTracker.Entries<AggregateRoot<Guid>>()
                .Where(x => x.Entity.DomainEvents.Any())
                .Select(x => x.Entity)
                .ToList();

            var domainEvents = domainEntities
                .SelectMany(x => x.DomainEvents)
                .ToList();

            domainEntities.ForEach(entity => entity.ClearDomainEvents());

            foreach (var domainEvent in domainEvents)
            {
                await _mediator.Publish(domainEvent);
            }
        }

        private void ConfigureGlobalQueryFilters(ModelBuilder builder)
        {
            // Configure soft delete filter for entities that implement ISoftDelete
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
                {
                    var method = typeof(ApplicationDbContext)
                        .GetMethod(nameof(GetSoftDeleteFilter), BindingFlags.NonPublic | BindingFlags.Static)!
                        .MakeGenericMethod(entityType.ClrType);

                    var filter = method.Invoke(null, Array.Empty<object>());
                    entityType.SetQueryFilter((LambdaExpression)filter!);
                }
            }
        }

        private static LambdaExpression GetSoftDeleteFilter<TEntity>()
            where TEntity : class, ISoftDelete
        {
            Expression<Func<TEntity, bool>> filter = x => !x.IsDeleted;
            return filter;
        }
    }
}

// Infrastructure/Data/Configurations/Community/PostConfiguration.cs
using Domain.Entities.Community;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations.Community
{
    public class PostConfiguration : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {
            builder.ToTable("Posts", "Community");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(p => p.Content)
                .IsRequired()
                .HasMaxLength(5000);

            builder.Property(p => p.Tags)
                .HasConversion(
                    tags => string.Join(',', tags),
                    tags => tags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList())
                .HasMaxLength(500);

            builder.Property(p => p.ImageUrl)
                .HasMaxLength(500);

            builder.Property(p => p.IsPublic)
                .IsRequired();

            builder.Property(p => p.Status)
                .IsRequired()
                .HasConversion<string>();

            builder.Property(p => p.CreatedAt)
                .IsRequired();

            builder.Property(p => p.UpdatedAt);

            builder.Property(p => p.CreatedBy)
                .HasMaxLength(450);

            builder.Property(p => p.UpdatedBy)
                .HasMaxLength(450);

            // Relationships
            builder.HasOne(p => p.Author)
                .WithMany()
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Group)
                .WithMany(g => g.Posts)
                .HasForeignKey(p => p.GroupId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(p => p.Comments)
                .WithOne(c => c.Post)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.Likes)
                .WithOne(l => l.Post)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(p => p.AuthorId);
            builder.HasIndex(p => p.GroupId);
            builder.HasIndex(p => p.CreatedAt);
            builder.HasIndex(p => p.Status);
            builder.HasIndex(p => p.IsPublic);

            // Full-text search index (SQL Server specific)
            builder.HasIndex(p => new { p.Title, p.Content })
                .HasDatabaseName("IX_Posts_FullText");
        }
    }
}
```

## WebAPI Layer Implementation

### Enhanced Controllers with Versioning

```csharp
// WebAPI/Controllers/Base/BaseApiController.cs
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.Common.Models;
using Asp.Versioning;

namespace WebAPI.Controllers.Base
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Produces("application/json")]
    public abstract class BaseApiController : ControllerBase
    {
        private ISender? _mediator;
        protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

        protected IActionResult HandleResult<T>(Result<T> result)
        {
            if (result.Succeeded)
            {
                return Ok(new ApiResponse<T>
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Operation completed successfully"
                });
            }

            return BadRequest(new ApiResponse<T>
            {
                Success = false,
                Errors = result.Errors,
                Message = "Operation failed"
            });
        }

        protected IActionResult HandleResult(Result result)
        {
            if (result.Succeeded)
            {
                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Operation completed successfully"
                });
            }

            return BadRequest(new ApiResponse
            {
                Success = false,
                Errors = result.Errors,
                Message = "Operation failed"
            });
        }

        protected IActionResult HandlePagedResult<T>(Result<PagedResult<T>> result)
        {
            if (result.Succeeded)
            {
                return Ok(new PagedApiResponse<T>
                {
                    Success = true,
                    Data = result.Data.Items,
                    TotalCount = result.Data.TotalCount,
                    Page = result.Data.Page,
                    PageSize = result.Data.PageSize,
                    TotalPages = result.Data.TotalPages,
                    Message = "Operation completed successfully"
                });
            }

            return BadRequest(new PagedApiResponse<T>
            {
                Success = false,
                Errors = result.Errors,
                Message = "Operation failed"
            });
        }
    }
}

// WebAPI/Controllers/v2/Community/Posts/PostsController.cs
using Application.Features.Community.Posts.Commands;
using Application.Features.Community.Posts.Queries;
using Application.Features.Community.Posts.DTOs.Requests;
using Application.Features.Community.Posts.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.AspNetCore.RateLimiting;
using Asp.Versioning;
using WebAPI.Controllers.Base;
using WebAPI.Filters;

namespace WebAPI.Controllers.v2.Community.Posts
{
    [ApiVersion("2.0")]
    [Authorize]
    [EnableRateLimiting("DefaultPolicy")]
    public class PostsController : BaseApiController
    {
        /// <summary>
        /// Get paginated list of posts with filtering and sorting
        /// </summary>
        /// <param name="request">Query parameters for filtering and pagination</param>
        /// <returns>Paginated list of posts</returns>
        [HttpGet]
        [AllowAnonymous]
        [OutputCache(PolicyName = "MediumCache", VaryByQueryKeys = new[] { "*" })]
        [ProducesResponseType(typeof(PagedApiResponse<PostDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetPosts([FromQuery] GetPostsRequest request)
        {
            var query = new GetPostsQuery
            {
                Page = request.Page,
                PageSize = request.PageSize,
                SearchTerm = request.SearchTerm,
                Tags = request.Tags,
                GroupId = request.GroupId,
                IsPublic = request.IsPublic,
                SortBy = request.SortBy,
                SortDescending = request.SortDescending
            };

            var result = await Mediator.Send(query);
            return HandlePagedResult(result);
        }

        /// <summary>
        /// Get a specific post by ID
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <returns>Post details</returns>
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        [OutputCache(PolicyName = "ShortCache")]
        [ProducesResponseType(typeof(ApiResponse<PostDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPost(Guid id)
        {
            var query = new GetPostByIdQuery { Id = id };
            var result = await Mediator.Send(query);
            
            if (!result.Succeeded)
                return NotFound(new ApiResponse { Success = false, Message = "Post not found" });

            return HandleResult(result);
        }

        /// <summary>
        /// Create a new post
        /// </summary>
        /// <param name="request">Post creation data</param>
        /// <returns>Created post</returns>
        [HttpPost]
        [ValidateModel]
        [ProducesResponseType(typeof(ApiResponse<PostDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostRequest request)
        {
            var command = new CreatePostCommand
            {
                Title = request.Title,
                Content = request.Content,
                Tags = request.Tags ?? new List<string>(),
                ImageUrl = request.ImageUrl,
                IsPublic = request.IsPublic,
                GroupId = request.GroupId
            };

            var result = await Mediator.Send(command);
            
            if (result.Succeeded)
            {
                return CreatedAtAction(
                    nameof(GetPost), 
                    new { id = result.Data.Id }, 
                    new ApiResponse<PostDto>
                    {
                        Success = true,
                        Data = result.Data,
                        Message = "Post created successfully"
                    });
            }

            return HandleResult(result);
        }

        /// <summary>
        /// Update an existing post
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <param name="request">Post update data</param>
        /// <returns>Updated post</returns>
        [HttpPut("{id:guid}")]
        [ValidateModel]
        [ProducesResponseType(typeof(ApiResponse<PostDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdatePost(Guid id, [FromBody] UpdatePostRequest request)
        {
            var command = new UpdatePostCommand
            {
                Id = id,
                Title = request.Title,
                Content = request.Content,
                Tags = request.Tags ?? new List<string>(),
                ImageUrl = request.ImageUrl,
                IsPublic = request.IsPublic
            };

            var result = await Mediator.Send(command);
            return HandleResult(result);
        }

        /// <summary>
        /// Delete a post
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <returns>Success confirmation</returns>
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            var command = new DeletePostCommand { Id = id };
            var result = await Mediator.Send(command);
            return HandleResult(result);
        }

        /// <summary>
        /// Like a post
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <returns>Success confirmation</returns>
        [HttpPost("{id:guid}/like")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> LikePost(Guid id)
        {
            var command = new LikePostCommand { PostId = id };
            var result = await Mediator.Send(command);
            return HandleResult(result);
        }

        /// <summary>
        /// Unlike a post
        /// </summary>
        /// <param name="id">Post ID</param>
        /// <returns>Success confirmation</returns>
        [HttpDelete("{id:guid}/like")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UnlikePost(Guid id)
        {
            var command = new UnlikePostCommand { PostId = id };
            var result = await Mediator.Send(command);
            return HandleResult(result);
        }

        /// <summary>
        /// Get posts by current user
        /// </summary>
        /// <param name="request">Query parameters</param>
        /// <returns>User's posts</returns>
        [HttpGet("my-posts")]
        [OutputCache(PolicyName = "UserSpecific")]
        [ProducesResponseType(typeof(PagedApiResponse<PostDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetMyPosts([FromQuery] GetUserPostsRequest request)
        {
            var query = new GetUserPostsQuery
            {
                Page = request.Page,
                PageSize = request.PageSize,
                SortBy = request.SortBy,
                SortDescending = request.SortDescending
            };

            var result = await Mediator.Send(query);
            return HandlePagedResult(result);
        }
    }
}
```

### Advanced Middleware Implementation

```csharp
// WebAPI/Middleware/ExceptionHandlingMiddleware.cs
using Application.Common.Models;
using Domain.Exceptions;
using FluentValidation;
using System.Net;
using System.Text.Json;

namespace WebAPI.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IWebHostEnvironment _environment;

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger,
            IWebHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = new ApiResponse
            {
                Success = false,
                Message = "An error occurred while processing your request"
            };

            switch (exception)
            {
                case ValidationException validationEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Message = "Validation failed";
                    response.Errors = validationEx.Errors.Select(e => e.ErrorMessage).ToArray();
                    break;

                case DomainException domainEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Message = domainEx.Message;
                    response.Errors = new[] { domainEx.Message };
                    break;

                case BusinessRuleException businessEx:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Message = businessEx.Message;
                    response.Errors = new[] { businessEx.Message };
                    break;

                case UnauthorizedAccessException:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response.Message = "Unauthorized access";
                    break;

                case KeyNotFoundException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.Message = "Resource not found";
                    break;

                case TimeoutException:
                    context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                    response.Message = "Request timeout";
                    break;

                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response.Message = _environment.IsDevelopment() 
                        ? exception.Message 
                        : "An internal server error occurred";
                    
                    if (_environment.IsDevelopment())
                    {
                        response.Errors = new[] { exception.StackTrace ?? string.Empty };
                    }
                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(jsonResponse);
        }
    }
}

// WebAPI/Middleware/PerformanceMiddleware.cs
using System.Diagnostics;

namespace WebAPI.Middleware
{
    public class PerformanceMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<PerformanceMiddleware> _logger;

        public PerformanceMiddleware(RequestDelegate next, ILogger<PerformanceMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();
            
            // Add correlation ID
            var correlationId = Guid.NewGuid().ToString();
            context.Items["CorrelationId"] = correlationId;
            context.Response.Headers.Add("X-Correlation-ID", correlationId);

            await _next(context);

            stopwatch.Stop();
            var elapsedMilliseconds = stopwatch.ElapsedMilliseconds;

            // Log performance metrics
            _logger.LogInformation(
                "Request {Method} {Path} completed in {ElapsedMilliseconds}ms with status {StatusCode}. CorrelationId: {CorrelationId}",
                context.Request.Method,
                context.Request.Path,
                elapsedMilliseconds,
                context.Response.StatusCode,
                correlationId);

            // Log slow requests
            if (elapsedMilliseconds > 1000)
            {
                _logger.LogWarning(
                    "Slow request detected: {Method} {Path} took {ElapsedMilliseconds}ms. CorrelationId: {CorrelationId}",
                    context.Request.Method,
                    context.Request.Path,
                    elapsedMilliseconds,
                    correlationId);
            }

            // Add performance headers
            context.Response.Headers.Add("X-Response-Time", $"{elapsedMilliseconds}ms");
        }
    }
}

// WebAPI/Middleware/RateLimitingMiddleware.cs
using Microsoft.Extensions.Caching.Memory;
using System.Net;

namespace WebAPI.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache;
        private readonly ILogger<RateLimitingMiddleware> _logger;
        private readonly RateLimitOptions _options;

        public RateLimitingMiddleware(
            RequestDelegate next,
            IMemoryCache cache,
            ILogger<RateLimitingMiddleware> logger,
            IConfiguration configuration)
        {
            _next = next;
            _cache = cache;
            _logger = logger;
            _options = configuration.GetSection("RateLimit").Get<RateLimitOptions>() ?? new RateLimitOptions();
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var clientId = GetClientIdentifier(context);
            var key = $"rate_limit_{clientId}";

            var requestCount = _cache.Get<int>(key);
            
            if (requestCount >= _options.MaxRequests)
            {
                _logger.LogWarning("Rate limit exceeded for client {ClientId}", clientId);
                
                context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                context.Response.Headers.Add("Retry-After", _options.WindowSizeInMinutes.ToString());
                
                await context.Response.WriteAsync("Rate limit exceeded. Please try again later.");
                return;
            }

            // Increment request count
            _cache.Set(key, requestCount + 1, TimeSpan.FromMinutes(_options.WindowSizeInMinutes));

            // Add rate limit headers
            context.Response.Headers.Add("X-RateLimit-Limit", _options.MaxRequests.ToString());
            context.Response.Headers.Add("X-RateLimit-Remaining", (_options.MaxRequests - requestCount - 1).ToString());

            await _next(context);
        }

        private string GetClientIdentifier(HttpContext context)
        {
            // Try to get user ID first
            var userId = context.User?.Identity?.Name;
            if (!string.IsNullOrEmpty(userId))
                return $"user_{userId}";

            // Fall back to IP address
            var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            return $"ip_{ipAddress}";
        }
    }

    public class RateLimitOptions
    {
        public int MaxRequests { get; set; } = 100;
        public int WindowSizeInMinutes { get; set; } = 1;
    }
}
```