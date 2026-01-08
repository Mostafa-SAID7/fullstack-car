using Amazon.S3;
using Amazon.S3.Model;
using Application.Common.Interfaces;
using Application.Common.Models;
using Infrastructure.Common;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services.FileStorage;

public class AmazonS3StorageService : IMediaFileStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly FileStorageSettings _settings;
    private readonly ILogger<AmazonS3StorageService> _logger;

    public AmazonS3StorageService(
        IAmazonS3 s3Client,
        IOptions<FileStorageSettings> settings,
        ILogger<AmazonS3StorageService> logger)
    {
        _s3Client = s3Client;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<Application.Common.Models.FileUploadResult> UploadVideoAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        try
        {
            var bucketName = _settings.AmazonS3?.BucketName ?? throw new InvalidOperationException("S3 bucket name is not configured");
            var key = GenerateUniqueKey(fileName, _settings.AmazonS3.VideoPrefix);

            var request = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = key,
                InputStream = fileStream,
                ContentType = contentType,
                ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256,
                Metadata =
                {
                    ["OriginalFileName"] = fileName,
                    ["UploadedAt"] = DateTime.UtcNow.ToString("O"),
                    ["MediaType"] = "video"
                }
            };

            fileStream.Position = 0;
            var response = await _s3Client.PutObjectAsync(request, cancellationToken);

            var fileUrl = GetFileUrl(bucketName, key);
            
            _logger.LogInformation("Video uploaded successfully: {Key} to bucket {BucketName}", key, bucketName);

            return Application.Common.Models.FileUploadResult.Success(fileUrl, key, fileStream.Length, contentType, bucketName);
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
            var bucketName = _settings.AmazonS3?.BucketName ?? throw new InvalidOperationException("S3 bucket name is not configured");
            var key = GenerateUniqueKey(fileName, _settings.AmazonS3.AudioPrefix);

            var request = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = key,
                InputStream = fileStream,
                ContentType = contentType,
                ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256,
                Metadata =
                {
                    ["OriginalFileName"] = fileName,
                    ["UploadedAt"] = DateTime.UtcNow.ToString("O"),
                    ["MediaType"] = "audio"
                }
            };

            fileStream.Position = 0;
            var response = await _s3Client.PutObjectAsync(request, cancellationToken);

            var fileUrl = GetFileUrl(bucketName, key);
            
            _logger.LogInformation("Audio uploaded successfully: {Key} to bucket {BucketName}", key, bucketName);

            return Application.Common.Models.FileUploadResult.Success(fileUrl, key, fileStream.Length, contentType, bucketName);
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
            var bucketName = _settings.AmazonS3?.BucketName ?? throw new InvalidOperationException("S3 bucket name is not configured");
            var key = GenerateUniqueKey(fileName, _settings.AmazonS3.ImagePrefix);

            var request = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = key,
                InputStream = fileStream,
                ContentType = contentType,
                ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256,
                Metadata =
                {
                    ["OriginalFileName"] = fileName,
                    ["UploadedAt"] = DateTime.UtcNow.ToString("O"),
                    ["MediaType"] = "image"
                }
            };

            fileStream.Position = 0;
            var response = await _s3Client.PutObjectAsync(request, cancellationToken);

            var fileUrl = GetFileUrl(bucketName, key);
            
            _logger.LogInformation("Image uploaded successfully: {Key} to bucket {BucketName}", key, bucketName);

            return Application.Common.Models.FileUploadResult.Success(fileUrl, key, fileStream.Length, contentType, bucketName);
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
            var (bucketName, key) = ParseFileUrl(fileUrl);
            if (string.IsNullOrEmpty(bucketName) || string.IsNullOrEmpty(key))
            {
                _logger.LogWarning("Invalid file URL format: {FileUrl}", fileUrl);
                return false;
            }

            var request = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = key
            };

            var response = await _s3Client.DeleteObjectAsync(request, cancellationToken);
            
            _logger.LogInformation("File deleted: {FileUrl}", fileUrl);
            return response.HttpStatusCode == System.Net.HttpStatusCode.NoContent;
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
            var (bucketName, key) = ParseFileUrl(fileUrl);
            if (string.IsNullOrEmpty(bucketName) || string.IsNullOrEmpty(key))
            {
                throw new ArgumentException("Invalid file URL format", nameof(fileUrl));
            }

            var request = new GetObjectRequest
            {
                BucketName = bucketName,
                Key = key
            };

            var response = await _s3Client.GetObjectAsync(request, cancellationToken);
            return response.ResponseStream;
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
            var (bucketName, key) = ParseFileUrl(fileName);
            if (string.IsNullOrEmpty(bucketName) || string.IsNullOrEmpty(key))
            {
                return fileName; // Return as-is if not an S3 URL
            }

            if (expiry.HasValue)
            {
                // Generate pre-signed URL for temporary access
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = bucketName,
                    Key = key,
                    Verb = HttpVerb.GET,
                    Expires = DateTime.UtcNow.Add(expiry.Value)
                };

                return await _s3Client.GetPreSignedURLAsync(request);
            }

            return GetFileUrl(bucketName, key);
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
            var (bucketName, key) = ParseFileUrl(fileUrl);
            if (string.IsNullOrEmpty(bucketName) || string.IsNullOrEmpty(key))
            {
                return false;
            }

            var request = new GetObjectMetadataRequest
            {
                BucketName = bucketName,
                Key = key
            };

            var response = await _s3Client.GetObjectMetadataAsync(request, cancellationToken);
            return response.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
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
            var (bucketName, key) = ParseFileUrl(fileUrl);
            if (string.IsNullOrEmpty(bucketName) || string.IsNullOrEmpty(key))
            {
                return 0;
            }

            var request = new GetObjectMetadataRequest
            {
                BucketName = bucketName,
                Key = key
            };

            var response = await _s3Client.GetObjectMetadataAsync(request, cancellationToken);
            return response.ContentLength;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get file size: {FileUrl}", fileUrl);
            return 0;
        }
    }

    private string GenerateUniqueKey(string originalFileName, string prefix)
    {
        var extension = Path.GetExtension(originalFileName);
        var uniqueId = Guid.NewGuid().ToString("N");
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        return $"{prefix.TrimEnd('/')}/{timestamp}_{uniqueId}{extension}";
    }

    private string GetFileUrl(string bucketName, string key)
    {
        if (_settings.AmazonS3?.EnableCloudFront == true && !string.IsNullOrEmpty(_settings.AmazonS3.CloudFrontDomain))
        {
            return $"https://{_settings.AmazonS3.CloudFrontDomain.TrimEnd('/')}/{key}";
        }

        var region = _settings.AmazonS3?.Region ?? "us-east-1";
        return $"https://{bucketName}.s3.{region}.amazonaws.com/{key}";
    }

    private (string bucketName, string key) ParseFileUrl(string fileUrl)
    {
        try
        {
            var uri = new Uri(fileUrl);
            
            // Handle CloudFront URLs
            if (_settings.AmazonS3?.EnableCloudFront == true && 
                !string.IsNullOrEmpty(_settings.AmazonS3.CloudFrontDomain) &&
                uri.Host.Contains(_settings.AmazonS3.CloudFrontDomain))
            {
                var key = uri.AbsolutePath.TrimStart('/');
                return (_settings.AmazonS3.BucketName ?? string.Empty, key);
            }
            
            // Handle direct S3 URLs
            if (uri.Host.Contains(".s3.") && uri.Host.Contains(".amazonaws.com"))
            {
                var bucketName = uri.Host.Split('.')[0];
                var key = uri.AbsolutePath.TrimStart('/');
                return (bucketName, key);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse file URL: {FileUrl}", fileUrl);
        }

        return (string.Empty, string.Empty);
    }
}