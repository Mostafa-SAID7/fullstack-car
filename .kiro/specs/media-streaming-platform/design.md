# Media Streaming Platform - Design Specification

## Architecture Overview

### System Architecture
The media streaming platform follows a microservices architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Admin Panel   │    │   Mobile Apps   │
│   (Angular)     │    │   (React)       │    │   (React Native)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   (ASP.NET)     │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Media Service  │    │  User Service   │    │Analytics Service│
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Data Layer    │
                    │ (SQL Server +   │
                    │  Redis Cache)   │
                    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Dashboard**: React 18 + TypeScript + Tailwind CSS
- **Main App**: Angular 19 + TypeScript + Tailwind CSS
- **State Management**: React Context API / Angular Services
- **UI Components**: Custom components with Tailwind CSS
- **Build Tools**: Vite (React) / Angular CLI

#### Backend
- **API**: ASP.NET Core 9.0 + C#
- **Architecture**: Clean Architecture with CQRS
- **Database**: SQL Server with Entity Framework Core
- **Caching**: Redis for session and data caching
- **File Storage**: Azure Blob Storage / AWS S3
- **Message Queue**: Azure Service Bus / RabbitMQ

#### Infrastructure
- **CDN**: Azure CDN / CloudFlare
- **Monitoring**: Application Insights / Prometheus
- **Logging**: Serilog with structured logging
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger/OpenAPI

## Data Model Design

### Core Entities

#### Media Base Entity
```csharp
public abstract class MediaItem : BaseEntity
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string ThumbnailUrl { get; set; }
    public List<string> Tags { get; set; }
    public string CreatorId { get; set; }
    public MediaStatus Status { get; set; }
    public bool IsPublic { get; set; }
    public bool AllowComments { get; set; }
    public DateTime PublishedAt { get; set; }
    public MediaAnalytics Analytics { get; set; }
}
```

#### Video Entity
```csharp
public class Video : MediaItem
{
    public string VideoUrl { get; set; }
    public string Quality { get; set; }
    public TimeSpan Duration { get; set; }
    public long FileSize { get; set; }
    public string Format { get; set; }
    public int ViewCount { get; set; }
    public List<VideoQuality> Qualities { get; set; }
}
```

#### Podcast Entity
```csharp
public class Podcast : MediaItem
{
    public string AudioUrl { get; set; }
    public TimeSpan Duration { get; set; }
    public long FileSize { get; set; }
    public string Format { get; set; }
    public int PlayCount { get; set; }
    public bool AllowDownload { get; set; }
    public int? EpisodeNumber { get; set; }
    public int? SeasonNumber { get; set; }
    public string SeriesId { get; set; }
    public string Transcript { get; set; }
}
```

### Database Schema

#### Tables Structure
```sql
-- Core media tables
CREATE TABLE Videos (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    VideoUrl NVARCHAR(500),
    ThumbnailUrl NVARCHAR(500),
    Duration TIME,
    FileSize BIGINT,
    Quality NVARCHAR(50),
    ViewCount INT DEFAULT 0,
    CreatorId UNIQUEIDENTIFIER,
    Status INT DEFAULT 0,
    IsPublic BIT DEFAULT 1,
    AllowComments BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    PublishedAt DATETIME2
);

CREATE TABLE Podcasts (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    AudioUrl NVARCHAR(500),
    ThumbnailUrl NVARCHAR(500),
    Duration TIME,
    FileSize BIGINT,
    PlayCount INT DEFAULT 0,
    AllowDownload BIT DEFAULT 0,
    EpisodeNumber INT,
    SeasonNumber INT,
    SeriesId UNIQUEIDENTIFIER,
    Transcript NVARCHAR(MAX),
    CreatorId UNIQUEIDENTIFIER,
    Status INT DEFAULT 0,
    IsPublic BIT DEFAULT 1,
    AllowComments BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    PublishedAt DATETIME2
);

-- Analytics and engagement tables
CREATE TABLE MediaAnalytics (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    MediaId UNIQUEIDENTIFIER,
    MediaType NVARCHAR(50),
    ViewsToday INT DEFAULT 0,
    ViewsWeek INT DEFAULT 0,
    ViewsMonth INT DEFAULT 0,
    ViewsTotal INT DEFAULT 0,
    LikesCount INT DEFAULT 0,
    DislikesCount INT DEFAULT 0,
    CommentsCount INT DEFAULT 0,
    SharesCount INT DEFAULT 0,
    LastUpdated DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE Comments (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    MediaId UNIQUEIDENTIFIER,
    MediaType NVARCHAR(50),
    UserId UNIQUEIDENTIFIER,
    Content NVARCHAR(1000),
    ParentCommentId UNIQUEIDENTIFIER NULL,
    LikesCount INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

## API Design

### RESTful Endpoints Structure

#### Video Endpoints
```
GET    /api/v7.0/media/videos                    # Get videos with filters
POST   /api/v7.0/media/videos                    # Create video
GET    /api/v7.0/media/videos/{id}               # Get video by ID
PUT    /api/v7.0/media/videos/{id}               # Update video
DELETE /api/v7.0/media/videos/{id}               # Delete video
POST   /api/v7.0/media/videos/{id}/publish       # Publish video
POST   /api/v7.0/media/videos/upload             # Upload video file

# Discovery endpoints
GET    /api/v7.0/media/videos/discovery/trending # Get trending videos
GET    /api/v7.0/media/videos/discovery/featured # Get featured videos
GET    /api/v7.0/media/videos/discovery/search   # Search videos
GET    /api/v7.0/media/videos/discovery/categories # Get categories

# Analytics endpoints
GET    /api/v7.0/media/videos/analytics          # Get dashboard analytics
GET    /api/v7.0/media/videos/analytics/{id}     # Get video analytics

# Interaction endpoints
POST   /api/v7.0/media/videos/interactions/{id}/like     # Like video
POST   /api/v7.0/media/videos/interactions/{id}/comments # Add comment
GET    /api/v7.0/media/videos/interactions/{id}/comments # Get comments
```

#### Podcast Endpoints
```
GET    /api/v7.0/media/podcasts                  # Get podcasts with filters
POST   /api/v7.0/media/podcasts                  # Create podcast
GET    /api/v7.0/media/podcasts/{id}             # Get podcast by ID
PUT    /api/v7.0/media/podcasts/{id}             # Update podcast
DELETE /api/v7.0/media/podcasts/{id}             # Delete podcast
POST   /api/v7.0/media/podcasts/{id}/publish     # Publish podcast
POST   /api/v7.0/media/podcasts/upload           # Upload podcast file

# Discovery endpoints
GET    /api/v7.0/media/podcasts/discovery/trending # Get trending podcasts
GET    /api/v7.0/media/podcasts/discovery/featured # Get featured podcasts
GET    /api/v7.0/media/podcasts/discovery/search   # Search podcasts
GET    /api/v7.0/media/podcasts/discovery/categories # Get categories

# Analytics endpoints
GET    /api/v7.0/media/podcasts/analytics        # Get dashboard analytics
GET    /api/v7.0/media/podcasts/analytics/{id}   # Get podcast analytics

# Interaction endpoints
POST   /api/v7.0/media/podcasts/interactions/{id}/like      # Like podcast
POST   /api/v7.0/media/podcasts/interactions/{id}/comments  # Add comment
POST   /api/v7.0/media/podcasts/interactions/{id}/subscribe # Subscribe
DELETE /api/v7.0/media/podcasts/interactions/{id}/subscribe # Unsubscribe
```

### Request/Response Models

#### Video Upload Request
```typescript
interface VideoUploadRequest {
  title: string;
  description: string;
  quality: 'HD' | 'FHD' | '4K';
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  scheduledPublishAt?: Date;
}
```

#### Podcast Upload Request
```typescript
interface PodcastUploadRequest {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  allowDownload: boolean;
  episodeNumber?: number;
  seasonNumber?: number;
  seriesId?: string;
  transcript?: string;
  scheduledPublishAt?: Date;
}
```

## Frontend Architecture

### Component Structure

#### Dashboard (React)
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── layout/                # Layout components
│   └── shared/                # Shared business components
├── pages/
│   ├── media/
│   │   ├── MediaOverview.tsx
│   │   ├── MediaManagement.tsx
│   │   └── components/
│   │       ├── VideoManagement.tsx
│   │       ├── PodcastManagement.tsx
│   │       ├── MediaAnalytics.tsx
│   │       └── MediaUpload.tsx
│   └── dashboard/
├── services/
│   ├── api/                   # API service layer
│   ├── media/                 # Media-specific services
│   └── auth/                  # Authentication services
├── hooks/                     # Custom React hooks
├── contexts/                  # React contexts
└── types/                     # TypeScript type definitions
```

#### Main App (Angular)
```
src/app/
├── core/
│   ├── services/              # Core services
│   ├── guards/                # Route guards
│   └── interceptors/          # HTTP interceptors
├── shared/
│   ├── components/            # Shared components
│   └── pipes/                 # Custom pipes
├── features/
│   └── media/
│       ├── components/
│       │   ├── video/         # Video-specific components
│       │   ├── podcast/       # Podcast-specific components
│       │   └── shared/        # Shared media components
│       ├── services/          # Media services
│       ├── models/            # Data models
│       └── media.module.ts
└── layout/                    # Layout components
```

### State Management

#### React Context Pattern
```typescript
interface MediaContextState {
  videos: Video[];
  podcasts: Podcast[];
  loading: boolean;
  error: string | null;
  filters: MediaFilters;
  selectedItems: string[];
}

interface MediaContextActions {
  loadVideos: (filters?: MediaFilters) => Promise<void>;
  loadPodcasts: (filters?: MediaFilters) => Promise<void>;
  uploadVideo: (file: File, metadata: VideoUploadRequest) => Promise<void>;
  uploadPodcast: (file: File, metadata: PodcastUploadRequest) => Promise<void>;
  deleteMedia: (ids: string[], type: 'video' | 'podcast') => Promise<void>;
  updateFilters: (filters: Partial<MediaFilters>) => void;
  selectItems: (ids: string[]) => void;
}
```

#### Angular Services Pattern
```typescript
@Injectable({
  providedIn: 'root'
})
export class MediaStateService {
  private videosSubject = new BehaviorSubject<Video[]>([]);
  private podcastsSubject = new BehaviorSubject<Podcast[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public videos$ = this.videosSubject.asObservable();
  public podcasts$ = this.podcastsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private videoService: VideoService,
    private podcastService: PodcastService
  ) {}

  async loadVideos(filters?: MediaFilters): Promise<void> {
    this.loadingSubject.next(true);
    try {
      const result = await this.videoService.getVideos(filters);
      this.videosSubject.next(result.items);
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
```

## Backend Architecture

### Clean Architecture Layers

#### Domain Layer
```csharp
// Entities
public class Video : MediaItem
{
    public string VideoUrl { get; private set; }
    public VideoQuality Quality { get; private set; }
    public TimeSpan Duration { get; private set; }
    
    public void UpdateMetadata(string title, string description, List<string> tags)
    {
        Title = title;
        Description = description;
        Tags = tags;
        UpdatedAt = DateTime.UtcNow;
    }
    
    public void Publish()
    {
        if (Status == MediaStatus.Draft)
        {
            Status = MediaStatus.Published;
            PublishedAt = DateTime.UtcNow;
        }
    }
}

// Domain Services
public interface IMediaDomainService
{
    Task<bool> CanUserAccessMediaAsync(string userId, string mediaId);
    Task<MediaAnalytics> CalculateAnalyticsAsync(string mediaId);
}
```

#### Application Layer
```csharp
// Commands
public class CreateVideoCommand : IRequest<CreateVideoResponse>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public IFormFile VideoFile { get; set; }
    public VideoQuality Quality { get; set; }
    public List<string> Tags { get; set; }
    public bool IsPublic { get; set; }
}

// Command Handlers
public class CreateVideoCommandHandler : IRequestHandler<CreateVideoCommand, CreateVideoResponse>
{
    private readonly IVideoRepository _videoRepository;
    private readonly IFileStorageService _fileStorage;
    private readonly IVideoProcessingService _videoProcessing;

    public async Task<CreateVideoResponse> Handle(CreateVideoCommand request, CancellationToken cancellationToken)
    {
        // Upload file to storage
        var uploadResult = await _fileStorage.UploadVideoAsync(request.VideoFile);
        
        // Create video entity
        var video = new Video(
            request.Title,
            request.Description,
            uploadResult.Url,
            request.Quality,
            request.Tags,
            request.IsPublic
        );
        
        // Save to repository
        await _videoRepository.AddAsync(video);
        
        // Queue for processing
        await _videoProcessing.QueueForProcessingAsync(video.Id);
        
        return new CreateVideoResponse { VideoId = video.Id };
    }
}

// Queries
public class GetVideosQuery : IRequest<PaginatedResult<VideoDto>>
{
    public MediaFilters Filters { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
```

#### Infrastructure Layer
```csharp
// Repository Implementation
public class VideoRepository : IVideoRepository
{
    private readonly ApplicationDbContext _context;

    public async Task<PaginatedResult<Video>> GetVideosAsync(MediaFilters filters, int pageNumber, int pageSize)
    {
        var query = _context.Videos.AsQueryable();
        
        if (!string.IsNullOrEmpty(filters.Search))
        {
            query = query.Where(v => v.Title.Contains(filters.Search) || 
                                   v.Description.Contains(filters.Search));
        }
        
        if (filters.IsPublic.HasValue)
        {
            query = query.Where(v => v.IsPublic == filters.IsPublic.Value);
        }
        
        if (filters.Tags?.Any() == true)
        {
            query = query.Where(v => v.Tags.Any(t => filters.Tags.Contains(t)));
        }
        
        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
            
        return new PaginatedResult<Video>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }
}

// File Storage Service
public class AzureBlobStorageService : IFileStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly IConfiguration _configuration;

    public async Task<FileUploadResult> UploadVideoAsync(IFormFile file)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient("videos");
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var blobClient = containerClient.GetBlobClient(fileName);
        
        using var stream = file.OpenReadStream();
        await blobClient.UploadAsync(stream, overwrite: true);
        
        return new FileUploadResult
        {
            Url = blobClient.Uri.ToString(),
            FileName = fileName,
            FileSize = file.Length
        };
    }
}
```

## Security Design

### Authentication & Authorization
```csharp
// JWT Configuration
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    });

// Authorization Policies
services.AddAuthorization(options =>
{
    options.AddPolicy("ContentCreator", policy =>
        policy.RequireClaim("role", "ContentCreator", "Administrator"));
    
    options.AddPolicy("MediaAdmin", policy =>
        policy.RequireClaim("role", "Administrator"));
});
```

### Content Security
```csharp
// File Validation
public class FileValidationService : IFileValidationService
{
    private readonly Dictionary<string, string[]> _allowedExtensions = new()
    {
        { "video", new[] { ".mp4", ".avi", ".mov", ".webm" } },
        { "audio", new[] { ".mp3", ".wav", ".aac", ".flac" } },
        { "image", new[] { ".jpg", ".jpeg", ".png", ".webp" } }
    };

    public async Task<ValidationResult> ValidateFileAsync(IFormFile file, string mediaType)
    {
        // Check file extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions[mediaType].Contains(extension))
        {
            return ValidationResult.Failure("Invalid file type");
        }

        // Check file size
        var maxSize = mediaType == "video" ? 2_000_000_000 : 500_000_000; // 2GB for video, 500MB for audio
        if (file.Length > maxSize)
        {
            return ValidationResult.Failure("File size exceeds limit");
        }

        // Scan for malware (integrate with antivirus service)
        var scanResult = await _antivirusService.ScanFileAsync(file);
        if (!scanResult.IsClean)
        {
            return ValidationResult.Failure("File failed security scan");
        }

        return ValidationResult.Success();
    }
}
```

## Performance Optimization

### Caching Strategy
```csharp
// Redis Caching
public class CachedVideoService : IVideoService
{
    private readonly IVideoService _videoService;
    private readonly IDistributedCache _cache;
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(15);

    public async Task<Video> GetVideoAsync(string id)
    {
        var cacheKey = $"video:{id}";
        var cachedVideo = await _cache.GetStringAsync(cacheKey);
        
        if (cachedVideo != null)
        {
            return JsonSerializer.Deserialize<Video>(cachedVideo);
        }

        var video = await _videoService.GetVideoAsync(id);
        if (video != null)
        {
            var serializedVideo = JsonSerializer.Serialize(video);
            await _cache.SetStringAsync(cacheKey, serializedVideo, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = _cacheDuration
            });
        }

        return video;
    }
}
```

### Database Optimization
```sql
-- Indexes for performance
CREATE INDEX IX_Videos_CreatorId_Status ON Videos (CreatorId, Status);
CREATE INDEX IX_Videos_PublishedAt_IsPublic ON Videos (PublishedAt DESC, IsPublic);
CREATE INDEX IX_Videos_Tags ON Videos USING GIN (Tags);
CREATE INDEX IX_MediaAnalytics_MediaId_MediaType ON MediaAnalytics (MediaId, MediaType);

-- Partitioning for large tables
CREATE TABLE MediaAnalytics_2024 PARTITION OF MediaAnalytics
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

## Monitoring and Logging

### Application Insights Integration
```csharp
// Logging Configuration
services.AddLogging(builder =>
{
    builder.AddSerilog(new LoggerConfiguration()
        .WriteTo.Console()
        .WriteTo.ApplicationInsights(services.BuildServiceProvider()
            .GetRequiredService<TelemetryConfiguration>(), TelemetryConverter.Traces)
        .CreateLogger());
});

// Custom Telemetry
public class MediaTelemetryService
{
    private readonly TelemetryClient _telemetryClient;

    public void TrackVideoUpload(string videoId, long fileSize, TimeSpan uploadDuration)
    {
        _telemetryClient.TrackEvent("VideoUploaded", new Dictionary<string, string>
        {
            { "VideoId", videoId },
            { "FileSize", fileSize.ToString() },
            { "UploadDuration", uploadDuration.TotalSeconds.ToString() }
        });
    }

    public void TrackVideoView(string videoId, string userId, TimeSpan watchDuration)
    {
        _telemetryClient.TrackEvent("VideoViewed", new Dictionary<string, string>
        {
            { "VideoId", videoId },
            { "UserId", userId },
            { "WatchDuration", watchDuration.TotalSeconds.ToString() }
        });
    }
}
```

## Deployment Strategy

### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/WebAPI/WebAPI.csproj", "src/WebAPI/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/Infrastructure.csproj", "src/Infrastructure/"]
RUN dotnet restore "src/WebAPI/WebAPI.csproj"
COPY . .
WORKDIR "/src/src/WebAPI"
RUN dotnet build "WebAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WebAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebAPI.dll"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: media-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: media-api
  template:
    metadata:
      labels:
        app: media-api
    spec:
      containers:
      - name: media-api
        image: media-platform/api:latest
        ports:
        - containerPort: 80
        env:
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: media-secrets
              key: database-connection
        - name: Redis__ConnectionString
          valueFrom:
            secretKeyRef:
              name: media-secrets
              key: redis-connection
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

This design specification provides a comprehensive technical foundation for implementing the media streaming platform with proper architecture, security, performance, and scalability considerations.