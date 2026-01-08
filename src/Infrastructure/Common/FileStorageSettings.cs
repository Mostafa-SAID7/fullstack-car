namespace Infrastructure.Common;

public class FileStorageSettings
{
    public const string SectionName = "FileStorage";

    public string Provider { get; set; } = "Local"; // Local, AzureBlob, AmazonS3
    public string? LocalPath { get; set; }
    public long MaxVideoFileSize { get; set; } = 2_000_000_000; // 2GB
    public long MaxAudioFileSize { get; set; } = 500_000_000; // 500MB
    public long MaxImageFileSize { get; set; } = 10_000_000; // 10MB
    public string[] AllowedVideoExtensions { get; set; } = { ".mp4", ".avi", ".mov", ".webm" };
    public string[] AllowedAudioExtensions { get; set; } = { ".mp3", ".wav", ".aac", ".flac" };
    public string[] AllowedImageExtensions { get; set; } = { ".jpg", ".jpeg", ".png", ".webp" };
    public string[] AllowedVideoMimeTypes { get; set; } = { "video/mp4", "video/avi", "video/mov", "video/webm" };
    public string[] AllowedAudioMimeTypes { get; set; } = { "audio/mpeg", "audio/wav", "audio/aac", "audio/flac" };
    public string[] AllowedImageMimeTypes { get; set; } = { "image/jpeg", "image/png", "image/webp" };
    public bool EnableThumbnails { get; set; } = true;
    public int ThumbnailWidth { get; set; } = 300;
    public int ThumbnailHeight { get; set; } = 200;
    public bool EnableImageOptimization { get; set; } = true;
    public int ImageQuality { get; set; } = 85;
    public bool EnableVirusScan { get; set; } = false;
    public bool EnableContentModeration { get; set; } = false;

    // Azure Blob Storage settings
    public AzureBlobSettings? AzureBlob { get; set; }

    // Amazon S3 settings
    public AmazonS3Settings? AmazonS3 { get; set; }

    // CDN settings
    public CdnSettings? Cdn { get; set; }
}

public class AzureBlobSettings
{
    public string? ConnectionString { get; set; }
    public string? AccountName { get; set; }
    public string? AccountKey { get; set; }
    public string VideoContainer { get; set; } = "videos";
    public string AudioContainer { get; set; } = "podcasts";
    public string ImageContainer { get; set; } = "images";
    public string ThumbnailContainer { get; set; } = "thumbnails";
    public bool EnableCdn { get; set; } = true;
    public string? CdnEndpoint { get; set; }
}

public class AmazonS3Settings
{
    public string? AccessKey { get; set; }
    public string? SecretKey { get; set; }
    public string? Region { get; set; }
    public string? BucketName { get; set; }
    public string VideoPrefix { get; set; } = "videos/";
    public string AudioPrefix { get; set; } = "podcasts/";
    public string ImagePrefix { get; set; } = "images/";
    public string ThumbnailPrefix { get; set; } = "thumbnails/";
    public bool EnableCloudFront { get; set; } = true;
    public string? CloudFrontDomain { get; set; }
}

public class CdnSettings
{
    public bool Enabled { get; set; } = false;
    public string? BaseUrl { get; set; }
    public string? ApiKey { get; set; }
    public string? ZoneId { get; set; }
    public int CacheExpiryHours { get; set; } = 24;
}