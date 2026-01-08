using Application.Common.Interfaces;
using Infrastructure.Common;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services.FileStorage;

public class FileStorageFactory
{
    private readonly IServiceProvider _serviceProvider;
    private readonly FileStorageSettings _settings;
    private readonly ILogger<FileStorageFactory> _logger;

    public FileStorageFactory(
        IServiceProvider serviceProvider,
        IOptions<FileStorageSettings> settings,
        ILogger<FileStorageFactory> logger)
    {
        _serviceProvider = serviceProvider;
        _settings = settings.Value;
        _logger = logger;
    }

    public IMediaFileStorageService CreateFileStorageService()
    {
        return _settings.Provider.ToLowerInvariant() switch
        {
            "azureblob" => _serviceProvider.GetRequiredService<AzureBlobStorageService>(),
            "amazons3" => _serviceProvider.GetRequiredService<AmazonS3StorageService>(),
            "local" => _serviceProvider.GetRequiredService<LocalFileStorageService>(),
            _ => throw new InvalidOperationException($"Unsupported file storage provider: {_settings.Provider}")
        };
    }
}

public class MediaFileStorageServiceWrapper : IMediaFileStorageService
{
    private readonly IMediaFileStorageService _fileStorageService;
    private readonly ICdnService _cdnService;
    private readonly ILogger<MediaFileStorageServiceWrapper> _logger;

    public MediaFileStorageServiceWrapper(
        FileStorageFactory factory,
        ICdnService cdnService,
        ILogger<MediaFileStorageServiceWrapper> logger)
    {
        _fileStorageService = factory.CreateFileStorageService();
        _cdnService = cdnService;
        _logger = logger;
    }

    public async Task<Application.Common.Models.FileUploadResult> UploadVideoAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var result = await _fileStorageService.UploadVideoAsync(fileStream, fileName, contentType, cancellationToken);
        
        if (result.IsSuccess && !string.IsNullOrEmpty(result.FileUrl))
        {
            // Convert to CDN URL if CDN is enabled
            var cdnUrl = _cdnService.GetCdnUrl(result.FileUrl);
            result.FileUrl = cdnUrl;
        }

        return result;
    }

    public async Task<Application.Common.Models.FileUploadResult> UploadAudioAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var result = await _fileStorageService.UploadAudioAsync(fileStream, fileName, contentType, cancellationToken);
        
        if (result.IsSuccess && !string.IsNullOrEmpty(result.FileUrl))
        {
            // Convert to CDN URL if CDN is enabled
            var cdnUrl = _cdnService.GetCdnUrl(result.FileUrl);
            result.FileUrl = cdnUrl;
        }

        return result;
    }

    public async Task<Application.Common.Models.FileUploadResult> UploadImageAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var result = await _fileStorageService.UploadImageAsync(fileStream, fileName, contentType, cancellationToken);
        
        if (result.IsSuccess && !string.IsNullOrEmpty(result.FileUrl))
        {
            // Convert to CDN URL if CDN is enabled
            var cdnUrl = _cdnService.GetCdnUrl(result.FileUrl);
            result.FileUrl = cdnUrl;
        }

        return result;
    }

    public async Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        var result = await _fileStorageService.DeleteFileAsync(fileUrl, cancellationToken);
        
        if (result)
        {
            // Purge from CDN if deletion was successful
            await _cdnService.PurgeFileFromCdnAsync(fileUrl, cancellationToken);
        }

        return result;
    }

    public Task<Stream> GetFileStreamAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        return _fileStorageService.GetFileStreamAsync(fileUrl, cancellationToken);
    }

    public Task<string> GetFileUrlAsync(string fileName, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
    {
        return _fileStorageService.GetFileUrlAsync(fileName, expiry, cancellationToken);
    }

    public Task<bool> FileExistsAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        return _fileStorageService.FileExistsAsync(fileUrl, cancellationToken);
    }

    public Task<long> GetFileSizeAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        return _fileStorageService.GetFileSizeAsync(fileUrl, cancellationToken);
    }
}