using Microsoft.AspNetCore.Http;

namespace Application.Common.Interfaces.Storage
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

    public class FileUploadResult
    {
        public bool Success { get; set; }
        public string? FilePath { get; set; }
        public string? FileName { get; set; }
        public string? OriginalFileName { get; set; }
        public long FileSize { get; set; }
        public string? ContentType { get; set; }
        public string? FileUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public List<string> Errors { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class FileDownloadResult
    {
        public bool Success { get; set; }
        public Stream? FileStream { get; set; }
        public string? FileName { get; set; }
        public string? ContentType { get; set; }
        public long FileSize { get; set; }
        public List<string> Errors { get; set; } = new();
    }

    public class FileValidationSettings
    {
        public long MaxFileSize { get; set; } = 10 * 1024 * 1024; // 10MB
        public List<string> AllowedExtensions { get; set; } = new();
        public List<string> AllowedMimeTypes { get; set; } = new();
        public List<string> BlockedExtensions { get; set; } = new();
        public bool ScanForViruses { get; set; } = false;
        public bool ValidateImageDimensions { get; set; } = false;
        public int MaxImageWidth { get; set; } = 4000;
        public int MaxImageHeight { get; set; } = 4000;
    }
}