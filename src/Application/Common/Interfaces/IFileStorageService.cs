using Application.Common.Models;

namespace Application.Common.Interfaces;

public interface IMediaFileStorageService
{
    Task<Application.Common.Models.FileUploadResult> UploadVideoAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<Application.Common.Models.FileUploadResult> UploadAudioAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<Application.Common.Models.FileUploadResult> UploadImageAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
    Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<Stream> GetFileStreamAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<string> GetFileUrlAsync(string fileName, TimeSpan? expiry = null, CancellationToken cancellationToken = default);
    Task<bool> FileExistsAsync(string fileUrl, CancellationToken cancellationToken = default);
    Task<long> GetFileSizeAsync(string fileUrl, CancellationToken cancellationToken = default);
}