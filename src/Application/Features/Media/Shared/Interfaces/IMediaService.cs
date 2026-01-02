using Application.Common.Models;

namespace Application.Features.Media.Shared.Interfaces;

public interface IMediaService
{
    Task<Result<string>> ProcessVideoAsync(string videoPath, Guid videoId);
    Task<Result<string>> ProcessAudioAsync(string audioPath, Guid podcastId);
    Task<Result<TimeSpan>> GetVideoDurationAsync(string videoPath);
    Task<Result<TimeSpan>> GetAudioDurationAsync(string audioPath);
    Task<Result<string>> GenerateVideoThumbnailAsync(string videoPath, TimeSpan position);
    Task<Result<string>> GenerateVideoPreviewAsync(string videoPath);
    Task<Result<bool>> ValidateVideoFileAsync(string videoPath);
    Task<Result<bool>> ValidateAudioFileAsync(string audioPath);
}