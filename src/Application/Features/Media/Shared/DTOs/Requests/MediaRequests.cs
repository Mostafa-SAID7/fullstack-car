namespace Application.Features.Media.Shared.DTOs.Requests;

public class LikeVideoRequest
{
    public bool IsLike { get; set; } = true;
}

public class AddVideoCommentRequest
{
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}

public class AddPodcastCommentRequest
{
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}

public class UploadVideoRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Domain.Enums.Media.VideoQuality Quality { get; set; } = Domain.Enums.Media.VideoQuality.HD_720p;
    public string? Tags { get; set; }
    public bool IsPublic { get; set; } = true;
    public bool AllowComments { get; set; } = true;
}

public class UploadPodcastRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public bool IsPublic { get; set; } = true;
    public bool AllowComments { get; set; } = true;
    public bool AllowDownload { get; set; } = false;
    public int EpisodeNumber { get; set; }
    public int SeasonNumber { get; set; } = 1;
    public Guid? SeriesId { get; set; }
    public string? Transcript { get; set; }
}

public class TrackVideoViewRequest
{
    public TimeSpan WatchDuration { get; set; }
    public bool IsCompleted { get; set; }
    public string? Country { get; set; }
}

public class TrackPodcastPlayRequest
{
    public TimeSpan PlayDuration { get; set; }
    public bool IsCompleted { get; set; }
    public string? Country { get; set; }
}
