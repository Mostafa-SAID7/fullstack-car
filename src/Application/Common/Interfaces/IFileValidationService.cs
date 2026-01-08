using Application.Common.Models;

namespace Application.Common.Interfaces;

public interface IFileValidationService
{
    Task<Application.Common.Models.ValidationResult> ValidateVideoFileAsync(Stream fileStream, string fileName, string contentType, long fileSize, CancellationToken cancellationToken = default);
    Task<Application.Common.Models.ValidationResult> ValidateAudioFileAsync(Stream fileStream, string fileName, string contentType, long fileSize, CancellationToken cancellationToken = default);
    Task<Application.Common.Models.ValidationResult> ValidateImageFileAsync(Stream fileStream, string fileName, string contentType, long fileSize, CancellationToken cancellationToken = default);
    Task<MediaMetadata> ExtractVideoMetadataAsync(Stream videoStream, string fileName, CancellationToken cancellationToken = default);
    Task<MediaMetadata> ExtractAudioMetadataAsync(Stream audioStream, string fileName, CancellationToken cancellationToken = default);
}