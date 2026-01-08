namespace Application.Common.Models;

public class FileUploadResult
{
    public bool IsSuccess { get; set; }
    public string? FileUrl { get; set; }
    public string? FileName { get; set; }
    public long FileSize { get; set; }
    public string? ContentType { get; set; }
    public string? Container { get; set; }
    public DateTime UploadedAt { get; set; }
    public string? ErrorMessage { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();

    public static FileUploadResult Success(string fileUrl, string fileName, long fileSize, string contentType, string? container = null)
    {
        return new FileUploadResult
        {
            IsSuccess = true,
            FileUrl = fileUrl,
            FileName = fileName,
            FileSize = fileSize,
            ContentType = contentType,
            Container = container,
            UploadedAt = DateTime.UtcNow
        };
    }

    public static FileUploadResult Failure(string errorMessage)
    {
        return new FileUploadResult
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            UploadedAt = DateTime.UtcNow
        };
    }
}