using Application.Common.Models;
using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Podcasts.DTOs.Responses;

namespace Application.Features.Media.Interfaces;

public interface IMediaService
{
    Task<Result<string>> UploadVideoAsync(Stream videoStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<Result<string>> UploadAudioAsync(Stream audioStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<Result<string>> UploadImageAsync(Stream imageStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<Result<bool>> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<Result<TimeSpan>> GetVideoDurationAsync(string videoUrl, CancellationToken cancellationToken = default);
    Task<Result<TimeSpan>> GetAudioDurationAsync(string audioUrl, CancellationToken cancellationToken = default);
    Task<Result<string>> GenerateVideoThumbnailAsync(string videoUrl, TimeSpan position, CancellationToken cancellationToken = default);
    Task<Result<string>> GenerateVideoPreviewAsync(string videoUrl, CancellationToken cancellationToken = default);
}

public interface IVideoProcessingService
{
    Task<Result<VideoProcessingResult>> ProcessVideoAsync(string videoUrl, Domain.Enums.Media.VideoQuality targetQuality, CancellationToken cancellationToken = default);
    Task<Result<bool>> IsProcessingCompleteAsync(string processingId, CancellationToken cancellationToken = default);
    Task<Result<VideoProcessingStatus>> GetProcessingStatusAsync(string processingId, CancellationToken cancellationToken = default);
}

public interface IAudioProcessingService
{
    Task<Result<AudioProcessingResult>> ProcessAudioAsync(string audioUrl, CancellationToken cancellationToken = default);
    Task<Result<string>> GenerateTranscriptAsync(string audioUrl, CancellationToken cancellationToken = default);
    Task<Result<bool>> IsProcessingCompleteAsync(string processingId, CancellationToken cancellationToken = default);
}

public class VideoProcessingResult
{
    public string ProcessingId { get; set; } = string.Empty;
    public string ProcessedVideoUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string PreviewUrl { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public long FileSize { get; set; }
    public Domain.Enums.Media.VideoQuality Quality { get; set; }
}

public class AudioProcessingResult
{
    public string ProcessingId { get; set; } = string.Empty;
    public string ProcessedAudioUrl { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public long FileSize { get; set; }
    public string? Transcript { get; set; }
}

public class VideoProcessingStatus
{
    public string ProcessingId { get; set; } = string.Empty;
    public bool IsComplete { get; set; }
    public int ProgressPercentage { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
}
