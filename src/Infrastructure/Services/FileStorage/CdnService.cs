using Application.Common.Interfaces;
using Infrastructure.Common;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace Infrastructure.Services.FileStorage;

public class CdnService : ICdnService
{
    private readonly FileStorageSettings _settings;
    private readonly HttpClient _httpClient;
    private readonly ILogger<CdnService> _logger;

    public CdnService(
        IOptions<FileStorageSettings> settings,
        HttpClient httpClient,
        ILogger<CdnService> logger)
    {
        _settings = settings.Value;
        _httpClient = httpClient;
        _logger = logger;
    }

    public string GetCdnUrl(string fileUrl)
    {
        try
        {
            if (_settings.Cdn?.Enabled != true || string.IsNullOrEmpty(_settings.Cdn.BaseUrl))
            {
                return fileUrl; // Return original URL if CDN is not configured
            }

            // If the file URL is already a CDN URL, return as-is
            if (fileUrl.StartsWith(_settings.Cdn.BaseUrl, StringComparison.OrdinalIgnoreCase))
            {
                return fileUrl;
            }

            // Convert storage URL to CDN URL
            var uri = new Uri(fileUrl);
            var path = uri.AbsolutePath;
            
            // Remove leading slash if present
            if (path.StartsWith("/"))
            {
                path = path[1..];
            }

            var cdnUrl = $"{_settings.Cdn.BaseUrl.TrimEnd('/')}/{path}";
            
            _logger.LogDebug("Converted storage URL to CDN URL: {OriginalUrl} -> {CdnUrl}", fileUrl, cdnUrl);
            
            return cdnUrl;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to convert URL to CDN URL: {FileUrl}", fileUrl);
            return fileUrl; // Return original URL on error
        }
    }

    public async Task<bool> PurgeFileFromCdnAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            if (_settings.Cdn?.Enabled != true || string.IsNullOrEmpty(_settings.Cdn.ApiKey))
            {
                _logger.LogWarning("CDN purge requested but CDN is not properly configured");
                return false;
            }

            var cdnUrl = GetCdnUrl(fileUrl);
            var success = await PurgeCdnUrlAsync(cdnUrl, cancellationToken);
            
            if (success)
            {
                _logger.LogInformation("Successfully purged file from CDN: {FileUrl}", fileUrl);
            }
            else
            {
                _logger.LogWarning("Failed to purge file from CDN: {FileUrl}", fileUrl);
            }

            return success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error purging file from CDN: {FileUrl}", fileUrl);
            return false;
        }
    }

    public async Task<bool> PurgeFileFromCdnAsync(IEnumerable<string> fileUrls, CancellationToken cancellationToken = default)
    {
        try
        {
            if (_settings.Cdn?.Enabled != true || string.IsNullOrEmpty(_settings.Cdn.ApiKey))
            {
                _logger.LogWarning("CDN bulk purge requested but CDN is not properly configured");
                return false;
            }

            var cdnUrls = fileUrls.Select(GetCdnUrl).ToList();
            var success = await PurgeCdnUrlsAsync(cdnUrls, cancellationToken);
            
            if (success)
            {
                _logger.LogInformation("Successfully purged {Count} files from CDN", cdnUrls.Count);
            }
            else
            {
                _logger.LogWarning("Failed to purge {Count} files from CDN", cdnUrls.Count);
            }

            return success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error purging files from CDN");
            return false;
        }
    }

    public async Task<CdnStatistics> GetCdnStatisticsAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            if (_settings.Cdn?.Enabled != true || string.IsNullOrEmpty(_settings.Cdn.ApiKey))
            {
                _logger.LogWarning("CDN statistics requested but CDN is not properly configured");
                return new CdnStatistics();
            }

            var cdnUrl = GetCdnUrl(fileUrl);
            var statistics = await GetCdnUrlStatisticsAsync(cdnUrl, cancellationToken);
            
            _logger.LogDebug("Retrieved CDN statistics for: {FileUrl}", fileUrl);
            
            return statistics;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving CDN statistics: {FileUrl}", fileUrl);
            return new CdnStatistics();
        }
    }

    private async Task<bool> PurgeCdnUrlAsync(string cdnUrl, CancellationToken cancellationToken)
    {
        try
        {
            // This is a generic implementation - you would need to adapt this for your specific CDN provider
            // Examples: CloudFlare, AWS CloudFront, Azure CDN, etc.
            
            if (string.IsNullOrEmpty(_settings.Cdn?.ZoneId))
            {
                _logger.LogWarning("CDN Zone ID not configured for purge operation");
                return false;
            }

            // Example CloudFlare API call
            var purgeRequest = new
            {
                files = new[] { cdnUrl }
            };

            var requestContent = new StringContent(
                JsonSerializer.Serialize(purgeRequest),
                System.Text.Encoding.UTF8,
                "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_settings.Cdn.ApiKey}");
            _httpClient.DefaultRequestHeaders.Add("Content-Type", "application/json");

            var response = await _httpClient.PostAsync(
                $"https://api.cloudflare.com/client/v4/zones/{_settings.Cdn.ZoneId}/purge_cache",
                requestContent,
                cancellationToken);

            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error making CDN purge API call: {CdnUrl}", cdnUrl);
            return false;
        }
    }

    private async Task<bool> PurgeCdnUrlsAsync(IList<string> cdnUrls, CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrEmpty(_settings.Cdn?.ZoneId))
            {
                _logger.LogWarning("CDN Zone ID not configured for bulk purge operation");
                return false;
            }

            // Batch purge request
            var purgeRequest = new
            {
                files = cdnUrls.ToArray()
            };

            var requestContent = new StringContent(
                JsonSerializer.Serialize(purgeRequest),
                System.Text.Encoding.UTF8,
                "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_settings.Cdn.ApiKey}");
            _httpClient.DefaultRequestHeaders.Add("Content-Type", "application/json");

            var response = await _httpClient.PostAsync(
                $"https://api.cloudflare.com/client/v4/zones/{_settings.Cdn.ZoneId}/purge_cache",
                requestContent,
                cancellationToken);

            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error making CDN bulk purge API call");
            return false;
        }
    }

    private async Task<CdnStatistics> GetCdnUrlStatisticsAsync(string cdnUrl, CancellationToken cancellationToken)
    {
        try
        {
            // This is a placeholder implementation
            // In a real implementation, you would call your CDN provider's analytics API
            // to get actual statistics for the file
            
            await Task.Delay(100, cancellationToken); // Simulate API call
            
            return new CdnStatistics
            {
                TotalRequests = 0,
                TotalBandwidth = 0,
                CacheHitRatio = 0.0,
                LastAccessed = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving CDN statistics: {CdnUrl}", cdnUrl);
            return new CdnStatistics();
        }
    }
}