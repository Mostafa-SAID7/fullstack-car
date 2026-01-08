# Media Streaming Platform - Complete Integration Implementation Plan

## Overview

This comprehensive integration plan enhances the existing media streaming platform by implementing missing backend features, improving Dashboard admin capabilities, and creating seamless Main frontend integration. The plan follows Clean Architecture principles and ensures optimal performance, scalability, and user experience.

## Current State Analysis

### ✅ Existing Components
- Basic video and podcast controllers (v7.0 API)
- Dashboard video management interface
- Main frontend video detail component
- Basic CRUD operations for media content
- Authentication and authorization framework

### ❌ Missing Components
- File upload and processing system
- Media transcoding and optimization
- Advanced analytics and reporting
- Real-time streaming capabilities
- Content discovery algorithms
- Comprehensive admin tools
- Mobile-optimized player
- Advanced search and filtering

## Phase 1: Backend Infrastructure Enhancement (Weeks 1-4)

### 1.1 Enhanced Media Domain Models

```csharp
// Domain/Entities/Media/Video.cs
public class Video : AggregateRoot<Guid>
{
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string? ThumbnailUrl { get; private set; }
    public string? PreviewUrl { get; private set; }
    public TimeSpan Duration { get; private set; }
    public long FileSize { get; private set; }
    public string OriginalFileName { get; private set; } = string.Empty;
    public VideoQuality Quality { get; private set; }
    public VideoStatus Status { get; private set; }
    public bool IsPublic { get; private set; }
    public bool AllowComments { get; private set; }
    public bool AllowDownload { get; private set; }
    public Guid CreatorId { get; private set; }
    public string? CategoryId { get; private set; }
    public List<string> Tags { get; private set; } = new();
    
    // Analytics properties
    public long ViewCount { get; private set; }
    public long LikeCount { get; private set; }
    public long DislikeCount { get; private set; }
    public long CommentCount { get; private set; }
    public long ShareCount { get; private set; }
    public double AverageRating { get; private set; }
    
    // Processing properties
    public VideoProcessingStatus ProcessingStatus { get; private set; }
    public string? ProcessingError { get; private set; }
    public DateTime? ProcessedAt { get; private set; }
    
    // Streaming properties
    public List<VideoStream> Streams { get; private set; } = new();
    public string? HlsPlaylistUrl { get; private set; }
    public string? DashManifestUrl { get; private set; }
    
    // Navigation properties
    public ApplicationUser Creator { get; private set; } = null!;
    public Category? Category { get; private set; }
    public List<VideoComment> Comments { get; private set; } = new();
    public List<VideoLike> Likes { get; private set; } = new();
    public List<VideoView> Views { get; private set; } = new();
    public List<PlaylistVideo> PlaylistVideos { get; private set; } = new();
    
    // Factory method
    public static Video Create(string title, string description, Guid creatorId, 
        string originalFileName, long fileSize, TimeSpan duration)
    {
        var video = new Video(Guid.NewGuid())
        {
            Title = title,
            Description = description,
            CreatorId = creatorId,
            OriginalFileName = originalFileName,
            FileSize = fileSize,
            Duration = duration,
            Status = VideoStatus.Draft,
            ProcessingStatus = VideoProcessingStatus.Pending,
            IsPublic = false,
            AllowComments = true,
            AllowDownload = false
        };
        
        video.AddDomainEvent(new VideoCreatedEvent(video.Id, creatorId));
        return video;
    }
    
    // Business methods
    public void UpdateMetadata(string title, string description, List<string> tags, 
        string? categoryId, bool isPublic, bool allowComments, bool allowDownload)
    {
        Title = title;
        Description = description;
        Tags = tags;
        CategoryId = categoryId;
        IsPublic = isPublic;
        AllowComments = allowComments;
        AllowDownload = allowDownload;
        
        AddDomainEvent(new VideoUpdatedEvent(Id, CreatorId));
    }
    
    public void SetProcessingStatus(VideoProcessingStatus status, string? error = null)
    {
        ProcessingStatus = status;
        ProcessingError = error;
        
        if (status == VideoProcessingStatus.Completed)
        {
            ProcessedAt = DateTime.UtcNow;
            AddDomainEvent(new VideoProcessedEvent(Id, CreatorId));
        }
    }
    
    public void Publish()
    {
        if (ProcessingStatus != VideoProcessingStatus.Completed)
            throw new DomainException("Cannot publish video that is not fully processed");
            
        Status = VideoStatus.Published;
        AddDomainEvent(new VideoPublishedEvent(Id, CreatorId));
    }
    
    public void RecordView(Guid? userId, string ipAddress, TimeSpan? watchDuration = null)
    {
        ViewCount++;
        
        var view = VideoView.Create(Id, userId, ipAddress, watchDuration);
        Views.Add(view);
        
        AddDomainEvent(new VideoViewedEvent(Id, userId, watchDuration));
    }
}
```

### 1.2 File Upload and Processing System

```csharp
// Application/Features/Media/Upload/Commands/UploadVideoCommand.cs
public record UploadVideoCommand : IRequest<Result<VideoUploadResponse>>
{
    public IFormFile File { get; init; } = null!;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public List<string> Tags { get; init; } = new();
    public string? CategoryId { get; init; }
    public bool IsPublic { get; init; } = false;
    public bool AllowComments { get; init; } = true;
    public bool AllowDownload { get; init; } = false;
}

// Application/Features/Media/Upload/Handlers/UploadVideoCommandHandler.cs
public class UploadVideoCommandHandler : IRequestHandler<UploadVideoCommand, Result<VideoUploadResponse>>
{
    private readonly IVideoRepository _videoRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly IMediaProcessingService _mediaProcessingService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UploadVideoCommandHandler> _logger;

    public async Task<Result<VideoUploadResponse>> Handle(UploadVideoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Validate file
            var validationResult = ValidateVideoFile(request.File);
            if (!validationResult.IsValid)
                return Result<VideoUploadResponse>.Failure(validationResult.Errors);

            var userId = Guid.Parse(_currentUserService.UserId!);
            
            // Extract metadata
            var metadata = await _mediaProcessingService.ExtractMetadataAsync(request.File);
            
            // Upload file to storage
            var uploadResult = await _fileStorageService.UploadAsync(
                request.File, 
                $"videos/{userId}/{Guid.NewGuid()}", 
                cancellationToken);

            // Create video entity
            var video = Video.Create(
                request.Title,
                request.Description,
                userId,
                request.File.FileName,
                request.File.Length,
                metadata.Duration);

            video.UpdateMetadata(
                request.Title,
                request.Description,
                request.Tags,
                request.CategoryId,
                request.IsPublic,
                request.AllowComments,
                request.AllowDownload);

            await _videoRepository.AddAsync(video, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Queue for processing
            await _mediaProcessingService.QueueForProcessingAsync(video.Id, uploadResult.Url);

            var response = new VideoUploadResponse
            {
                VideoId = video.Id,
                Title = video.Title,
                Status = video.Status.ToString(),
                ProcessingStatus = video.ProcessingStatus.ToString(),
                UploadUrl = uploadResult.Url,
                ThumbnailUrl = video.ThumbnailUrl
            };

            return Result<VideoUploadResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading video");
            return Result<VideoUploadResponse>.Failure("Failed to upload video");
        }
    }
}
```

### 1.3 Enhanced API Controllers

```csharp
// WebAPI/Controllers/v7/Media/VideoUploadController.cs
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/videos")]
[Authorize]
public class VideoUploadController : BaseApiController
{
    [HttpPost("upload")]
    [RequestSizeLimit(2L * 1024 * 1024 * 1024)] // 2GB limit
    [ProducesResponseType(typeof(ApiResponse<VideoUploadResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadVideo([FromForm] UploadVideoRequest request)
    {
        var command = new UploadVideoCommand
        {
            File = request.File,
            Title = request.Title,
            Description = request.Description,
            Tags = request.Tags ?? new List<string>(),
            CategoryId = request.CategoryId,
            IsPublic = request.IsPublic,
            AllowComments = request.AllowComments,
            AllowDownload = request.AllowDownload
        };

        var result = await Mediator.Send(command);
        
        if (result.Succeeded)
        {
            return CreatedAtAction(
                nameof(VideosController.GetVideo),
                "Videos",
                new { id = result.Data.VideoId },
                HandleResult(result));
        }

        return HandleResult(result);
    }

    [HttpPost("{id:guid}/process")]
    [Authorize(Roles = "Admin,ContentModerator")]
    public async Task<IActionResult> ProcessVideo(Guid id)
    {
        var command = new ProcessVideoCommand { VideoId = id };
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }

    [HttpGet("{id:guid}/processing-status")]
    public async Task<IActionResult> GetProcessingStatus(Guid id)
    {
        var query = new GetVideoProcessingStatusQuery { VideoId = id };
        var result = await Mediator.Send(query);
        return HandleResult(result);
    }
}

// WebAPI/Controllers/v7/Media/VideoStreamingController.cs
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/videos")]
[AllowAnonymous]
public class VideoStreamingController : BaseApiController
{
    [HttpGet("{id:guid}/stream")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> StreamVideo(Guid id, [FromQuery] VideoQuality? quality = null)
    {
        var query = new GetVideoStreamQuery 
        { 
            VideoId = id, 
            Quality = quality ?? VideoQuality.Medium 
        };
        
        var result = await Mediator.Send(query);
        
        if (result.Succeeded)
        {
            return Redirect(result.Data.StreamUrl);
        }

        return NotFound();
    }

    [HttpGet("{id:guid}/hls/playlist.m3u8")]
    [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetHlsPlaylist(Guid id)
    {
        var query = new GetHlsPlaylistQuery { VideoId = id };
        var result = await Mediator.Send(query);
        
        if (result.Succeeded)
        {
            return Content(result.Data.PlaylistContent, "application/vnd.apple.mpegurl");
        }

        return NotFound();
    }

    [HttpPost("{id:guid}/view")]
    public async Task<IActionResult> RecordView(Guid id, [FromBody] RecordViewRequest request)
    {
        var command = new RecordVideoViewCommand
        {
            VideoId = id,
            WatchDuration = request.WatchDuration,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        };

        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
}
```

## Phase 2: Dashboard Admin Enhancement (Weeks 5-8)

### 2.1 Enhanced Video Management Interface

```typescript
// ClientApp/Dashboard/src/pages/media/VideoManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Upload, Play, Pause, Edit, Trash2, Eye, Heart, 
  MessageCircle, Calendar, Clock, Search, Filter, Plus, 
  MoreHorizontal, Settings, BarChart3, Download, Share2,
  CheckCircle, XCircle, AlertCircle, Loader2
} from 'lucide-react';
import { videoService } from '../../../services/media/VideoService';
import { VideoUploadModal } from './components/VideoUploadModal';
import { VideoEditModal } from './components/VideoEditModal';
import { VideoAnalyticsModal } from './components/VideoAnalyticsModal';
import { BulkActionsToolbar } from './components/BulkActionsToolbar';
import { VideoFilters } from './components/VideoFilters';
import { VideoCard } from './components/VideoCard';
import { VideoTable } from './components/VideoTable';
import { useToast } from '../../../hooks/useToast';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Video as VideoType, MediaFilters, VideoAnalytics } from '../../../types/media';

interface VideoManagementState {
  videos: VideoType[];
  loading: boolean;
  error: string | null;
  selectedVideos: Set<string>;
  viewMode: 'grid' | 'table';
  filters: MediaFilters;
  totalCount: number;
  analytics: VideoAnalytics | null;
}

export const VideoManagement: React.FC = () => {
  const [state, setState] = useState<VideoManagementState>({
    videos: [],
    loading: true,
    error: null,
    selectedVideos: new Set(),
    viewMode: 'grid',
    filters: {
      pageNumber: 1,
      pageSize: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    },
    totalCount: 0,
    analytics: null
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { showToast } = useToast();

  // Load videos with current filters
  const loadVideos = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await videoService.getVideos({
        ...state.filters,
        search: debouncedSearchQuery || undefined
      });
      
      setState(prev => ({
        ...prev,
        videos: result.items,
        totalCount: result.totalCount,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load videos',
        loading: false
      }));
      showToast('Failed to load videos', 'error');
    }
  }, [state.filters, debouncedSearchQuery, showToast]);

  // Load analytics dashboard
  const loadAnalytics = useCallback(async () => {
    try {
      const analytics = await videoService.getVideoDashboard();
      setState(prev => ({ ...prev, analytics }));
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Handle video selection
  const handleVideoSelect = (videoId: string, selected: boolean) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedVideos);
      if (selected) {
        newSelected.add(videoId);
      } else {
        newSelected.delete(videoId);
      }
      return { ...prev, selectedVideos: newSelected };
    });
  };

  // Handle video actions
  const handleVideoAction = async (action: string, videoId: string) => {
    try {
      switch (action) {
        case 'publish':
          await videoService.publishVideo(videoId);
          showToast('Video published successfully', 'success');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this video?')) {
            await videoService.deleteVideo(videoId);
            showToast('Video deleted successfully', 'success');
          }
          break;
        case 'edit':
          const video = state.videos.find(v => v.id === videoId);
          if (video) {
            setSelectedVideo(video);
            setShowEditModal(true);
          }
          break;
        case 'analytics':
          const analyticsVideo = state.videos.find(v => v.id === videoId);
          if (analyticsVideo) {
            setSelectedVideo(analyticsVideo);
            setShowAnalyticsModal(true);
          }
          break;
      }
      
      if (action !== 'edit' && action !== 'analytics') {
        loadVideos();
      }
    } catch (error) {
      showToast(`Failed to ${action} video`, 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header with Analytics */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Video Management</h1>
            <p className="text-muted-foreground">Manage and organize your video content</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </button>
        </div>

        {/* Analytics Cards */}
        {state.analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Total Videos</span>
              </div>
              <div className="text-2xl font-bold">{state.analytics.totalVideos.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                +{state.analytics.newVideosThisMonth} this month
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Total Views</span>
              </div>
              <div className="text-2xl font-bold">{state.analytics.totalViews.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                +{state.analytics.viewsThisMonth.toLocaleString()} this month
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Watch Time</span>
              </div>
              <div className="text-2xl font-bold">{state.analytics.totalWatchTime}</div>
              <div className="text-xs text-muted-foreground">
                +{state.analytics.watchTimeThisMonth} this month
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium">Engagement</span>
              </div>
              <div className="text-2xl font-bold">{state.analytics.engagementRate}%</div>
              <div className="text-xs text-muted-foreground">
                {state.analytics.engagementChange > 0 ? '+' : ''}{state.analytics.engagementChange}% vs last month
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Grid/Table */}
      <div className="bg-card rounded-lg border">
        {state.loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="p-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Video Content */}
            {state.videos.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No videos found</p>
                <p className="text-muted-foreground mb-4">Upload your first video to get started</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Upload Video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onAction={handleVideoAction}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          setShowUploadModal(false);
          loadVideos();
          loadAnalytics();
        }}
      />

      <VideoEditModal
        isOpen={showEditModal}
        video={selectedVideo}
        onClose={() => {
          setShowEditModal(false);
          setSelectedVideo(null);
        }}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedVideo(null);
          loadVideos();
        }}
      />

      <VideoAnalyticsModal
        isOpen={showAnalyticsModal}
        video={selectedVideo}
        onClose={() => {
          setShowAnalyticsModal(false);
          setSelectedVideo(null);
        }}
      />
    </motion.div>
  );
};
```

## Phase 3: Main Frontend Integration (Weeks 9-12)

### 3.1 Enhanced Video Player Component

```typescript
// ClientApp/Main/src/app/features/media/components/video-player/video-player.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Hls from 'hls.js';
import { VideoService } from '../../services/video.service';
import { VideoDetails, VideoQuality } from '../../models';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-player-container" [class.fullscreen]="isFullscreen">
      <div class="video-wrapper">
        <video
          #videoElement
          class="video-element"
          [poster]="video?.thumbnailUrl"
          (loadedmetadata)="onLoadedMetadata()"
          (timeupdate)="onTimeUpdate()"
          (ended)="onVideoEnded()"
          (play)="onPlay()"
          (pause)="onPause()"
          (volumechange)="onVolumeChange()"
        ></video>

        <!-- Loading Overlay -->
        <div class="loading-overlay" *ngIf="loading">
          <div class="spinner"></div>
        </div>

        <!-- Controls Overlay -->
        <div class="controls-overlay" [class.visible]="showControls" (mousemove)="showControlsTemporarily()">
          <!-- Play/Pause Button -->
          <button class="play-pause-btn" (click)="togglePlayPause()">
            <i class="icon" [class.play]="!isPlaying" [class.pause]="isPlaying"></i>
          </button>

          <!-- Progress Bar -->
          <div class="progress-container">
            <div class="progress-bar" (click)="seek($event)">
              <div class="progress-buffer" [style.width.%]="bufferedPercent"></div>
              <div class="progress-played" [style.width.%]="playedPercent"></div>
              <div class="progress-thumb" [style.left.%]="playedPercent"></div>
            </div>
          </div>

          <!-- Time Display -->
          <div class="time-display">
            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <span class="separator">/</span>
            <span class="duration">{{ formatTime(duration) }}</span>
          </div>

          <!-- Volume Control -->
          <div class="volume-control">
            <button class="volume-btn" (click)="toggleMute()">
              <i class="icon" [class.volume-high]="volume > 0.5" [class.volume-low]="volume > 0 && volume <= 0.5" [class.volume-mute]="volume === 0"></i>
            </button>
            <div class="volume-slider" (click)="setVolume($event)">
              <div class="volume-bar" [style.width.%]="volume * 100"></div>
            </div>
          </div>

          <!-- Quality Selector -->
          <div class="quality-selector" *ngIf="availableQualities.length > 1">
            <select [(ngModel)]="selectedQuality" (change)="changeQuality()">
              <option value="auto">Auto</option>
              <option *ngFor="let quality of availableQualities" [value]="quality.quality">
                {{ quality.label }}
              </option>
            </select>
          </div>

          <!-- Fullscreen Button -->
          <button class="fullscreen-btn" (click)="toggleFullscreen()">
            <i class="icon" [class.fullscreen-enter]="!isFullscreen" [class.fullscreen-exit]="isFullscreen"></i>
          </button>
        </div>

        <!-- Error Overlay -->
        <div class="error-overlay" *ngIf="error">
          <div class="error-content">
            <i class="error-icon"></i>
            <p class="error-message">{{ error }}</p>
            <button class="retry-btn" (click)="retry()">Retry</button>
          </div>
        </div>
      </div>

      <!-- Video Info -->
      <div class="video-info" *ngIf="video">
        <h2 class="video-title">{{ video.title }}</h2>
        <div class="video-meta">
          <span class="view-count">{{ video.viewCount | number }} views</span>
          <span class="upload-date">{{ video.createdAt | date:'mediumDate' }}</span>
        </div>
        <div class="video-actions">
          <button class="action-btn like-btn" [class.active]="video.isLikedByUser" (click)="toggleLike()">
            <i class="icon like"></i>
            <span>{{ video.likeCount | number }}</span>
          </button>
          <button class="action-btn share-btn" (click)="shareVideo()">
            <i class="icon share"></i>
            <span>Share</span>
          </button>
          <button class="action-btn download-btn" *ngIf="video.allowDownload" (click)="downloadVideo()">
            <i class="icon download"></i>
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() video: VideoDetails | null = null;
  @Input() autoplay = false;
  @Input() controls = true;
  @Output() videoEnded = new EventEmitter<void>();
  @Output() timeUpdate = new EventEmitter<number>();
  @Output() like = new EventEmitter<boolean>();

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  // Player state
  isPlaying = false;
  loading = false;
  error: string | null = null;
  currentTime = 0;
  duration = 0;
  volume = 1;
  playedPercent = 0;
  bufferedPercent = 0;
  isFullscreen = false;
  showControls = true;

  // HLS and quality
  hls: Hls | null = null;
  selectedQuality: VideoQuality | 'auto' = 'auto';
  availableQualities: { quality: VideoQuality; label: string }[] = [];

  private controlsTimeout: any;
  private viewRecorded = false;

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.setupPlayer();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private setupPlayer() {
    if (!this.video) return;

    this.loading = true;
    this.error = null;

    // Setup HLS if supported
    if (Hls.isSupported() && this.video.hlsPlaylistUrl) {
      this.setupHls();
    } else if (this.video.streams?.length > 0) {
      // Fallback to direct video URL
      const stream = this.video.streams.find(s => s.quality === VideoQuality.Medium) || this.video.streams[0];
      this.videoElement.nativeElement.src = stream.url;
    }

    // Setup available qualities
    this.availableQualities = this.video.streams?.map(stream => ({
      quality: stream.quality,
      label: this.getQualityLabel(stream.quality)
    })) || [];

    if (this.autoplay) {
      this.play();
    }
  }

  private setupHls() {
    if (!this.video?.hlsPlaylistUrl) return;

    this.hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });

    this.hls.loadSource(this.video.hlsPlaylistUrl);
    this.hls.attachMedia(this.videoElement.nativeElement);

    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      this.loading = false;
      if (this.autoplay) {
        this.play();
      }
    });

    this.hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS Error:', data);
      if (data.fatal) {
        this.error = 'Failed to load video';
        this.loading = false;
      }
    });
  }

  private cleanup() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
  }

  // Player controls
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    const video = this.videoElement.nativeElement;
    video.play().catch(error => {
      console.error('Play failed:', error);
      this.error = 'Failed to play video';
    });
  }

  pause() {
    this.videoElement.nativeElement.pause();
  }

  seek(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const seekTime = percent * this.duration;
    this.videoElement.nativeElement.currentTime = seekTime;
  }

  setVolume(event: MouseEvent) {
    const volumeSlider = event.currentTarget as HTMLElement;
    const rect = volumeSlider.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    this.volume = Math.max(0, Math.min(1, percent));
    this.videoElement.nativeElement.volume = this.volume;
  }

  toggleMute() {
    const video = this.videoElement.nativeElement;
    if (video.muted) {
      video.muted = false;
      video.volume = this.volume;
    } else {
      video.muted = true;
    }
  }

  changeQuality() {
    if (!this.hls || this.selectedQuality === 'auto') {
      if (this.hls) {
        this.hls.currentLevel = -1; // Auto quality
      }
      return;
    }

    const qualityIndex = this.availableQualities.findIndex(q => q.quality === this.selectedQuality);
    if (qualityIndex !== -1 && this.hls) {
      this.hls.currentLevel = qualityIndex;
    }
  }

  toggleFullscreen() {
    const container = this.videoElement.nativeElement.parentElement;
    if (!container) return;

    if (!this.isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Event handlers
  onLoadedMetadata() {
    this.duration = this.videoElement.nativeElement.duration;
    this.loading = false;
  }

  onTimeUpdate() {
    const video = this.videoElement.nativeElement;
    this.currentTime = video.currentTime;
    this.playedPercent = (this.currentTime / this.duration) * 100;
    
    // Update buffered progress
    if (video.buffered.length > 0) {
      this.bufferedPercent = (video.buffered.end(video.buffered.length - 1) / this.duration) * 100;
    }

    // Record view at 30% watch time
    if (!this.viewRecorded && this.currentTime > this.duration * 0.3) {
      this.recordView();
      this.viewRecorded = true;
    }

    this.timeUpdate.emit(this.currentTime);
  }

  onPlay() {
    this.isPlaying = true;
  }

  onPause() {
    this.isPlaying = false;
  }

  onVolumeChange() {
    this.volume = this.videoElement.nativeElement.volume;
  }

  onVideoEnded() {
    this.isPlaying = false;
    this.recordView(true); // Record as completed view
    this.videoEnded.emit();
  }

  // Actions
  toggleLike() {
    if (!this.video) return;
    
    const newLikeState = !this.video.isLikedByUser;
    this.videoService.likeVideo(this.video.id, newLikeState).subscribe({
      next: () => {
        if (this.video) {
          this.video.isLikedByUser = newLikeState;
          this.video.likeCount += newLikeState ? 1 : -1;
          this.like.emit(newLikeState);
        }
      },
      error: (error) => console.error('Failed to like video:', error)
    });
  }

  shareVideo() {
    if (!this.video) return;
    
    if (navigator.share) {
      navigator.share({
        title: this.video.title,
        text: this.video.description,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }

  downloadVideo() {
    if (!this.video?.allowDownload) return;
    
    const stream = this.video.streams?.find(s => s.quality === VideoQuality.High) || this.video.streams?.[0];
    if (stream) {
      const link = document.createElement('a');
      link.href = stream.url;
      link.download = this.video.title;
      link.click();
    }
  }

  retry() {
    this.error = null;
    this.setupPlayer();
  }

  // Utility methods
  showControlsTemporarily() {
    this.showControls = true;
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
    this.controlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.showControls = false;
      }
    }, 3000);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  getQualityLabel(quality: VideoQuality): string {
    switch (quality) {
      case VideoQuality.Low: return '360p';
      case VideoQuality.Medium: return '720p';
      case VideoQuality.High: return '1080p';
      default: return 'Unknown';
    }
  }

  private recordView(completed = false) {
    if (!this.video) return;
    
    this.videoService.recordView(this.video.id, this.currentTime, completed).subscribe({
      error: (error) => console.error('Failed to record view:', error)
    });
  }
}
```

## Implementation Timeline

### Week 1-2: Backend Foundation
- Enhanced domain models and entities
- File upload infrastructure
- Media processing service setup
- Database migrations and configurations

### Week 3-4: Backend API Enhancement
- Upload and streaming controllers
- Analytics and reporting endpoints
- Background processing implementation
- Performance optimizations

### Week 5-6: Dashboard Admin Core
- Enhanced video management interface
- Upload modal and file handling
- Basic analytics dashboard
- Search and filtering capabilities

### Week 7-8: Dashboard Admin Advanced
- Bulk operations and management
- Advanced analytics and reporting
- Content moderation tools
- Performance monitoring

### Week 9-10: Main Frontend Core
- Enhanced video player component
- Video discovery and browsing
- Search and filtering interface
- User interaction features

### Week 11-12: Main Frontend Advanced
- Mobile-optimized player
- Playlist and favorites management
- Social features integration
- Performance optimizations

## Success Metrics

### Technical Metrics
- Upload success rate > 99%
- Video processing time < 5 minutes for 1GB files
- Streaming startup time < 3 seconds
- API response time < 200ms
- Mobile player performance score > 90%

### User Experience Metrics
- User engagement rate > 75%
- Video completion rate > 60%
- Upload abandonment rate < 10%
- Search success rate > 85%
- Mobile usage satisfaction > 4.5/5

### Business Metrics
- Content creation increase by 200%
- User retention improvement by 40%
- Platform usage time increase by 150%
- Admin efficiency improvement by 60%

This comprehensive integration plan ensures seamless media streaming functionality across all platforms while maintaining high performance, scalability, and user experience standards.