using System.Text.Json.Serialization;

namespace Application.Common.DTOs;

/// <summary>
/// Standardized API response wrapper that works efficiently with both Angular and React frontends
/// </summary>
/// <typeparam name="T">The type of data being returned</typeparam>
public class ApiResponseDto<T>
{
    [JsonPropertyName("succeeded")]
    public bool Succeeded { get; set; }

    [JsonPropertyName("isSuccess")]
    public bool IsSuccess => Succeeded;

    [JsonPropertyName("data")]
    public T? Data { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("errors")]
    public string[] Errors { get; set; } = Array.Empty<string>();

    [JsonPropertyName("statusCode")]
    public int? StatusCode { get; set; }

    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public static ApiResponseDto<T> Success(T data, string? message = null, int statusCode = 200)
    {
        return new ApiResponseDto<T>
        {
            Succeeded = true,
            Data = data,
            Message = message ?? "Operation completed successfully",
            StatusCode = statusCode,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ApiResponseDto<T> Failure(string[] errors, string? message = null, int statusCode = 400)
    {
        return new ApiResponseDto<T>
        {
            Succeeded = false,
            Data = default,
            Message = message ?? "Operation failed",
            Errors = errors,
            StatusCode = statusCode,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ApiResponseDto<T> Failure(string error, string? message = null, int statusCode = 400)
    {
        return Failure(new[] { error }, message, statusCode);
    }
}

/// <summary>
/// Non-generic API response for operations that don't return data
/// </summary>
public class ApiResponseDto : ApiResponseDto<object>
{
    public static ApiResponseDto Success(string? message = null, int statusCode = 200)
    {
        return new ApiResponseDto
        {
            Succeeded = true,
            Message = message ?? "Operation completed successfully",
            StatusCode = statusCode,
            Timestamp = DateTime.UtcNow
        };
    }

    public static new ApiResponseDto Failure(string[] errors, string? message = null, int statusCode = 400)
    {
        return new ApiResponseDto
        {
            Succeeded = false,
            Message = message ?? "Operation failed",
            Errors = errors,
            StatusCode = statusCode,
            Timestamp = DateTime.UtcNow
        };
    }

    public static new ApiResponseDto Failure(string error, string? message = null, int statusCode = 400)
    {
        return Failure(new[] { error }, message, statusCode);
    }
}

/// <summary>
/// Summary information about a user
/// </summary>
public class UserSummaryDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool IsOnline { get; set; }
}