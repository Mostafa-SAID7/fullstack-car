namespace Application.Common.Models;

public class ThumbnailResult
{
    public bool IsSuccess { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? FileName { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public long FileSize { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime GeneratedAt { get; set; }

    public static ThumbnailResult Success(string thumbnailUrl, string fileName, int width, int height, long fileSize)
    {
        return new ThumbnailResult
        {
            IsSuccess = true,
            ThumbnailUrl = thumbnailUrl,
            FileName = fileName,
            Width = width,
            Height = height,
            FileSize = fileSize,
            GeneratedAt = DateTime.UtcNow
        };
    }

    public static ThumbnailResult Failure(string errorMessage)
    {
        return new ThumbnailResult
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            GeneratedAt = DateTime.UtcNow
        };
    }
}