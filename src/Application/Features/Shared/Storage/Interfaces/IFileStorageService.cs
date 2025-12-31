using Microsoft.AspNetCore.Http;
using Application.Features.Shared.Storage.Models;

namespace Application.Features.Shared.Storage.Interfaces
{
    public interface IFileStorageService
    {
        Task<FileUploadResult> UploadFileAsync(IFormFile file, string folder = "uploads", CancellationToken cancellationToken = default);
        Task<List<FileUploadResult>> UploadFilesAsync(IFormFileCollection files, string folder = "uploads", CancellationToken cancellationToken = default);
        Task<FileDownloadResult> DownloadFileAsync(string filePath, CancellationToken cancellationToken = default);
        Task<Stream> GetFileStreamAsync(string filePath, CancellationToken cancellationToken = default);
        Task<bool> DeleteFileAsync(string filePath, CancellationToken cancellationToken = default);
        Task<bool> FileExistsAsync(string filePath, CancellationToken cancellationToken = default);
        Task<FileInfo> GetFileInfoAsync(string filePath, CancellationToken cancellationToken = default);
        Task<string> GetFileUrlAsync(string filePath, TimeSpan? expiration = null);
        Task<List<string>> GetFilesInFolderAsync(string folder, CancellationToken cancellationToken = default);
        Task<bool> CreateFolderAsync(string folderPath, CancellationToken cancellationToken = default);
        Task<bool> DeleteFolderAsync(string folderPath, CancellationToken cancellationToken = default);
    }
}