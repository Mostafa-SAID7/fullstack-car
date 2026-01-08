using Application.Common.Interfaces;
using Application.Common.Models;
using Infrastructure.Common;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services.FileStorage;

public class LocalFileStorageService : IMediaFileStorageService
{
    private readonly FileStorageSettings _settings;
    private readonly ILogger<LocalFileStorageService> _logger;

    public LocalFileStorageService(
        IOptions<FileStorageSettings> settings,
        ILogger<LocalFileStorageService> logger)
    {
        _settings = settings.Value;
        _logger = logger;

        // Ensure base directory exists
        if (!string.IsNullOrEmpty(_settings.LocalPath))
        {
            Directory.CreateDirectory(_settings.LocalPath);
        }
    }

    public async Task<Application.Common.Models.FileUploadResult> UploadVideoAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        try
        {
            var directory = Path.Combine(_settings.LocalPath ?? "uploads", "videos");
            Directory.CreateDirectory(directory);

            var uniqueFileName = GenerateUniqueFileName(fileName, "videos");
            var filePath = Path.Combine(directory, uniqueFileName);

            using var fileStreamWriter = new FileStream(filePath, FileMode.Create, FileAccess.Write);
            fileStream.Position = 0;
            await fileStream.CopyToAsync(fileStreamWriter, cancellationToken);

            var fileUrl = GetFileUrl("videos", uniqueFileName);
            
            _logger.LogInformation("Video uploaded successfully: {FilePath}", filePath);

            return Application.Common.Models.FileUploadResult.Success(fileUrl, uniqueFileName, fileStream.Length, contentType, "videos");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload video: {FileName}", fileName);
            return Application.Common.Models.FileUploadResult.Failure($"Failed to upload video: {ex.Message}");
        }
    }

    public async Task<Application.Common.Models.FileUploadResult> UploadAudioAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        try
        {
            var directory = Path.Combine(_settings.LocalPath ?? "uploads", "podcasts");
            Directory.CreateDirectory(directory);

            var uniqueFileName = GenerateUniqueFileName(fileName, "podcasts");
            var filePath = Path.Combine(directory, uniqueFileName);

            using var fileStreamWriter = new FileStream(filePath, FileMode.Create, FileAccess.Write);
            fileStream.Position = 0;
            await fileStream.CopyToAsync(fileStreamWriter, cancellationToken);

            var fileUrl = GetFileUrl("podcasts", uniqueFileName);
            
            _logger.LogInformation("Audio uploaded successfully: {FilePath}", filePath);

            return Application.Common.Models.FileUploadResult.Success(fileUrl, uniqueFileName, fileStream.Length, contentType, "podcasts");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload audio: {FileName}", fileName);
            return Application.Common.Models.FileUploadResult.Failure($"Failed to upload audio: {ex.Message}");
        }
    }

    public async Task<Application.Common.Models.FileUploadResult> UploadImageAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        try
        {
            var directory = Path.Combine(_settings.LocalPath ?? "uploads", "images");
            Directory.CreateDirectory(directory);

            var uniqueFileName = GenerateUniqueFileName(fileName, "images");
            var filePath = Path.Combine(directory, uniqueFileName);

            using var fileStreamWriter = new FileStream(filePath, FileMode.Create, FileAccess.Write);
            fileStream.Position = 0;
            await fileStream.CopyToAsync(fileStreamWriter, cancellationToken);

            var fileUrl = GetFileUrl("images", uniqueFileName);
            
            _logger.LogInformation("Image uploaded successfully: {FilePath}", filePath);

            return Application.Common.Models.FileUploadResult.Success(fileUrl, uniqueFileName, fileStream.Length, contentType, "images");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload image: {FileName}", fileName);
            return Application.Common.Models.FileUploadResult.Failure($"Failed to upload image: {ex.Message}");
        }
    }

    public Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var filePath = GetLocalFilePath(fileUrl);
            if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath))
            {
                _logger.LogWarning("File not found: {FileUrl}", fileUrl);
                return Task.FromResult(false);
            }

            File.Delete(filePath);
            
            _logger.LogInformation("File deleted: {FileUrl}", fileUrl);
            return Task.FromResult(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete file: {FileUrl}", fileUrl);
            return Task.FromResult(false);
        }
    }

    public Task<Stream> GetFileStreamAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var filePath = GetLocalFilePath(fileUrl);
            if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath))
            {
                throw new FileNotFoundException($"File not found: {fileUrl}");
            }

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return Task.FromResult<Stream>(stream);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get file stream: {FileUrl}", fileUrl);
            throw;
        }
    }

    public Task<string> GetFileUrlAsync(string fileName, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
    {
        // For local storage, expiry is not applicable
        return Task.FromResult(fileName);
    }

    public Task<bool> FileExistsAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var filePath = GetLocalFilePath(fileUrl);
            var exists = !string.IsNullOrEmpty(filePath) && File.Exists(filePath);
            return Task.FromResult(exists);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check file existence: {FileUrl}", fileUrl);
            return Task.FromResult(false);
        }
    }

    public Task<long> GetFileSizeAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var filePath = GetLocalFilePath(fileUrl);
            if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath))
            {
                return Task.FromResult(0L);
            }

            var fileInfo = new FileInfo(filePath);
            return Task.FromResult(fileInfo.Length);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get file size: {FileUrl}", fileUrl);
            return Task.FromResult(0L);
        }
    }

    private string GenerateUniqueFileName(string originalFileName, string category)
    {
        var extension = Path.GetExtension(originalFileName);
        var uniqueId = Guid.NewGuid().ToString("N");
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        return $"{timestamp}_{uniqueId}{extension}";
    }

    private string GetFileUrl(string category, string fileName)
    {
        return $"/uploads/{category}/{fileName}";
    }

    private string? GetLocalFilePath(string fileUrl)
    {
        try
        {
            // Remove leading slash and convert to local path
            var relativePath = fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var basePath = _settings.LocalPath ?? "uploads";
            
            // Ensure the path is within the uploads directory for security
            var fullPath = Path.GetFullPath(Path.Combine(basePath, relativePath));
            var baseFullPath = Path.GetFullPath(basePath);
            
            if (!fullPath.StartsWith(baseFullPath))
            {
                _logger.LogWarning("Attempted path traversal attack: {FileUrl}", fileUrl);
                return null;
            }

            return fullPath;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to resolve local file path: {FileUrl}", fileUrl);
            return null;
        }
    }
}