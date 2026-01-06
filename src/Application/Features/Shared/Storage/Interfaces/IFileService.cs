namespace Application.Features.Shared.Storage.Interfaces
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken);
        Task<Stream> DownloadFileAsync(string fileId);
        Task<Stream> DownloadFileAsync(string fileId, CancellationToken cancellationToken);
        Task DeleteFileAsync(string fileId);
        Task DeleteFileAsync(string fileId, CancellationToken cancellationToken);
        Task<bool> FileExistsAsync(string fileId);
        Task<bool> FileExistsAsync(string fileId, CancellationToken cancellationToken);
        Task<long> GetFileSizeAsync(string fileId);
        Task<long> GetFileSizeAsync(string fileId, CancellationToken cancellationToken);
    }
}
