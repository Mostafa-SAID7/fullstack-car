using Application.Common.Interfaces;
using Application.Common.Models;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Infrastructure.Common;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services.FileStorage;

public class AzureBlobStorageService : IMediaFileStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly FileStorageSettings _settings;
    private readonly ILogger<AzureBlobStorageService> _logger;

    public AzureBlobStorageService(
        IOptions<FileStorageSettings> settings,
        ILogger<AzureBlobStorageService> logger)
    {
        _settings = settings.Value;
        _logger = logger;

        if (_settings.AzureBlob?.ConnectionString != null)
        {
            _blobServiceClient = new BlobServiceClient(_settings.AzureBlob.ConnectionString);
        }
        else
        {
            throw new InvalidOperationException("Azure Blob Storage connection string is not configured");
        }
    }

    public async Task<Application.Common.Models.FileUploadResult> UploadVideoAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        try
        {
            var containerName = _settings.AzureBlob?.VideoContainer ?? "videos";
            var containerClient = await GetOrCreateContainerAsync(containerName, cancellationToken);
            
            var blobName = GenerateUniqueBlobName(fileName, "videos");
            var blobClient = containerClient.GetBlobClient(blobName);

            var uploadOptions = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = contentType
                },
                Metadata = new Dictionary<string, string>
                {
                    { "OriginalFileName", fileName },
                    { "UploadedAt", DateTime.UtcNow.ToString("O") },
                    { "MediaType", "video" }
                }
            };

            fileStream.Position = 0;
            var response = await blobClient.UploadAsync(fileStream, uploadOptions, cancellationToken);

            var fileUrl = GetFileUrl(containerName, blobName);
            
            _logger.LogInformation("Video uploaded successfully: {BlobName} to container {ContainerName}", blobName, containerName);

            return Application.Common.Models.FileUploadResult.Success(fileUrl, blobName, fileStream.Length, contentType, containerName);
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
            var containerName = _settings.AzureBlob?.AudioContainer ?? "podcasts";
            var containerClient = await GetOrCreateContainerAsync(containerName, cancellationToken);
            
            var blobName = GenerateUniqueBlobName(fileName, "podcasts");
            var blobClient = containerClient.GetBlobClient(blobName);

            var uploadOptions = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = contentType
                },
                Metadata = new Dictionary<string, string>
                {
                    { "OriginalFileName", fileName },
                    { "UploadedAt", DateTime.UtcNow.ToString("O") },
                    { "MediaType", "audio" }
                }
            };

            fileStream.Position = 0;
            var response = await blobClient.UploadAsync(fileStream, uploadOptions, cancellationToken);

            var fileUrl = GetFileUrl(containerName, blobName);
            
            _logger.LogInformation("Audio uploaded successfully: {BlobName} to container {ContainerName}", blobName, containerName);

            return Application.Common.Models.FileUploadResult.Success(fileUrl, blobName, fileStream.Length, contentType, containerName);
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
            var containerName = _settings.AzureBlob?.ImageContainer ?? "images";
            var containerClient = await GetOrCreateContainerAsync(containerName, cancellationToken);
            
            var blobName = GenerateUniqueBlobName(fileName, "images");
            var blobClient = containerClient.GetBlobClient(blobName);

            var uploadOptions = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = contentType
                },
                Metadata = new Dictionary<string, string>
                {
                    { "OriginalFileName", fileName },
                    { "UploadedAt", DateTime.UtcNow.ToString("O") },
                    { "MediaType", "image" }
                }
            };

            fileStream.Position = 0;
            var response = await blobClient.UploadAsync(fileStream, uploadOptions, cancellationToken);

            var fileUrl = GetFileUrl(containerName, blobName);
            
            _logger.LogInformation("Image uploaded successfully: {BlobName} to container {ContainerName}", blobName, containerName);

            return Application.Common.Models.FileUploadResult.Success(fileUrl, blobName, fileStream.Length, contentType, containerName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload image: {FileName}", fileName);
            return Application.Common.Models.FileUploadResult.Failure($"Failed to upload image: {ex.Message}");
        }
    }

    public async Task<bool> DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var (containerName, blobName) = ParseFileUrl(fileUrl);
            if (string.IsNullOrEmpty(containerName) || string.IsNullOrEmpty(blobName))
            {
                _logger.LogWarning("Invalid file URL format: {FileUrl}", fileUrl);
                return false;
            }

            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            var response = await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots, cancellationToken: cancellationToken);
            
            _logger.LogInformation("File deleted: {FileUrl}, Success: {Success}", fileUrl, response.Value);
            return response.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete file: {FileUrl}", fileUrl);
            return false;
        }
    }

    public async Task<Stream> GetFileStreamAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var (containerName, blobName) = ParseFileUrl(fileUrl);
            if (string.IsNullOrEmpty(containerName) || string.IsNullOrEmpty(blobName))
            {
                throw new ArgumentException("Invalid file URL format", nameof(fileUrl));
            }

            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            var response = await blobClient.DownloadStreamingAsync(cancellationToken: cancellationToken);
            return response.Value.Content;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get file stream: {FileUrl}", fileUrl);
            throw;
        }
    }

    public async Task<string> GetFileUrlAsync(string fileName, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var (containerName, blobName) = ParseFileUrl(fileName);
            if (string.IsNullOrEmpty(containerName) || string.IsNullOrEmpty(blobName))
            {
                return fileName; // Return as-is if not a blob URL
            }

            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            if (expiry.HasValue)
            {
                // Generate SAS URL for temporary access
                var sasBuilder = new Azure.Storage.Sas.BlobSasBuilder
                {
                    BlobContainerName = containerName,
                    BlobName = blobName,
                    Resource = "b",
                    ExpiresOn = DateTimeOffset.UtcNow.Add(expiry.Value)
                };
                sasBuilder.SetPermissions(Azure.Storage.Sas.BlobSasPermissions.Read);

                return blobClient.GenerateSasUri(sasBuilder).ToString();
            }

            return blobClient.Uri.ToString();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get file URL: {FileName}", fileName);
            return fileName;
        }
    }

    public async Task<bool> FileExistsAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var (containerName, blobName) = ParseFileUrl(fileUrl);
            if (string.IsNullOrEmpty(containerName) || string.IsNullOrEmpty(blobName))
            {
                return false;
            }

            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            var response = await blobClient.ExistsAsync(cancellationToken);
            return response.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check file existence: {FileUrl}", fileUrl);
            return false;
        }
    }

    public async Task<long> GetFileSizeAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var (containerName, blobName) = ParseFileUrl(fileUrl);
            if (string.IsNullOrEmpty(containerName) || string.IsNullOrEmpty(blobName))
            {
                return 0;
            }

            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            var properties = await blobClient.GetPropertiesAsync(cancellationToken: cancellationToken);
            return properties.Value.ContentLength;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get file size: {FileUrl}", fileUrl);
            return 0;
        }
    }

    private async Task<BlobContainerClient> GetOrCreateContainerAsync(string containerName, CancellationToken cancellationToken)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob, cancellationToken: cancellationToken);
        return containerClient;
    }

    private string GenerateUniqueBlobName(string originalFileName, string prefix)
    {
        var extension = Path.GetExtension(originalFileName);
        var uniqueId = Guid.NewGuid().ToString("N");
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        return $"{prefix}/{timestamp}_{uniqueId}{extension}";
    }

    private string GetFileUrl(string containerName, string blobName)
    {
        if (_settings.AzureBlob?.EnableCdn == true && !string.IsNullOrEmpty(_settings.AzureBlob.CdnEndpoint))
        {
            return $"{_settings.AzureBlob.CdnEndpoint.TrimEnd('/')}/{containerName}/{blobName}";
        }

        return $"{_blobServiceClient.Uri.ToString().TrimEnd('/')}/{containerName}/{blobName}";
    }

    private (string containerName, string blobName) ParseFileUrl(string fileUrl)
    {
        try
        {
            var uri = new Uri(fileUrl);
            var segments = uri.AbsolutePath.TrimStart('/').Split('/');
            
            if (segments.Length >= 2)
            {
                var containerName = segments[0];
                var blobName = string.Join("/", segments.Skip(1));
                return (containerName, blobName);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse file URL: {FileUrl}", fileUrl);
        }

        return (string.Empty, string.Empty);
    }
}