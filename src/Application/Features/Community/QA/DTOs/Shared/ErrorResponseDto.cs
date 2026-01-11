using System.Text.Json.Serialization;

namespace Application.Features.Community.QA.DTOs.Shared;

/// <summary>
/// Standardized error response DTO for QA system that works with both Angular and React frontends
/// </summary>
public class ErrorResponseDto
{
    [JsonPropertyName("succeeded")]
    public bool Succeeded { get; set; } = false;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("errors")]
    public List<ErrorDetailDto> Errors { get; set; } = new();

    [JsonPropertyName("statusCode")]
    public int StatusCode { get; set; }

    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("traceId")]
    public string? TraceId { get; set; }

    [JsonPropertyName("path")]
    public string? Path { get; set; }

    public static ErrorResponseDto Create(
        string message, 
        int statusCode, 
        List<ErrorDetailDto>? errors = null,
        string? traceId = null,
        string? path = null)
    {
        return new ErrorResponseDto
        {
            Message = message,
            StatusCode = statusCode,
            Errors = errors ?? new List<ErrorDetailDto>(),
            TraceId = traceId,
            Path = path,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ErrorResponseDto ValidationError(List<ValidationErrorDto> validationErrors, string? path = null)
    {
        var errors = validationErrors.Select(ve => new ErrorDetailDto
        {
            Code = "VALIDATION_ERROR",
            Message = ve.Message,
            Field = ve.Field,
            AttemptedValue = ve.AttemptedValue?.ToString()
        }).ToList();

        return new ErrorResponseDto
        {
            Message = "Validation failed",
            StatusCode = 422,
            Errors = errors,
            Path = path,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ErrorResponseDto NotFound(string resource, string? identifier = null, string? path = null)
    {
        var message = identifier != null 
            ? $"{resource} with identifier '{identifier}' was not found"
            : $"{resource} was not found";

        return new ErrorResponseDto
        {
            Message = message,
            StatusCode = 404,
            Errors = new List<ErrorDetailDto>
            {
                new()
                {
                    Code = "NOT_FOUND",
                    Message = message,
                    Field = "id",
                    AttemptedValue = identifier
                }
            },
            Path = path,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ErrorResponseDto Unauthorized(string? message = null, string? path = null)
    {
        return new ErrorResponseDto
        {
            Message = message ?? "Authentication required",
            StatusCode = 401,
            Errors = new List<ErrorDetailDto>
            {
                new()
                {
                    Code = "UNAUTHORIZED",
                    Message = message ?? "Authentication required"
                }
            },
            Path = path,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ErrorResponseDto Forbidden(string? message = null, string? path = null)
    {
        return new ErrorResponseDto
        {
            Message = message ?? "Access denied",
            StatusCode = 403,
            Errors = new List<ErrorDetailDto>
            {
                new()
                {
                    Code = "FORBIDDEN",
                    Message = message ?? "Access denied"
                }
            },
            Path = path,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ErrorResponseDto BadRequest(string message, string? field = null, object? attemptedValue = null, string? path = null)
    {
        return new ErrorResponseDto
        {
            Message = message,
            StatusCode = 400,
            Errors = new List<ErrorDetailDto>
            {
                new()
                {
                    Code = "BAD_REQUEST",
                    Message = message,
                    Field = field,
                    AttemptedValue = attemptedValue?.ToString()?.ToString()
                }
            },
            Path = path,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ErrorResponseDto InternalServerError(string? message = null, string? path = null)
    {
        return new ErrorResponseDto
        {
            Message = message ?? "An internal server error occurred",
            StatusCode = 500,
            Errors = new List<ErrorDetailDto>
            {
                new()
                {
                    Code = "INTERNAL_SERVER_ERROR",
                    Message = message ?? "An internal server error occurred"
                }
            },
            Path = path,
            Timestamp = DateTime.UtcNow
        };
    }
}

/// <summary>
/// Detailed error information for specific validation or business rule failures
/// </summary>
public class ErrorDetailDto
{
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("field")]
    public string? Field { get; set; }

    [JsonPropertyName("attemptedValue")]
    public string? AttemptedValue { get; set; }

    [JsonPropertyName("severity")]
    public string Severity { get; set; } = "Error"; // "Error", "Warning", "Info"
}

/// <summary>
/// Validation error DTO for form validation failures
/// </summary>
public class ValidationErrorDto
{
    [JsonPropertyName("field")]
    public string Field { get; set; } = string.Empty;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("attemptedValue")]
    public object? AttemptedValue { get; set; }

    [JsonPropertyName("code")]
    public string? Code { get; set; }
}

/// <summary>
/// Business rule violation error DTO
/// </summary>
public class BusinessRuleErrorDto
{
    [JsonPropertyName("rule")]
    public string Rule { get; set; } = string.Empty;

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("context")]
    public Dictionary<string, object> Context { get; set; } = new();
}

/// <summary>
/// Rate limiting error DTO
/// </summary>
public class RateLimitErrorDto
{
    [JsonPropertyName("message")]
    public string Message { get; set; } = "Rate limit exceeded";

    [JsonPropertyName("retryAfter")]
    public int RetryAfterSeconds { get; set; }

    [JsonPropertyName("limit")]
    public int Limit { get; set; }

    [JsonPropertyName("remaining")]
    public int Remaining { get; set; }

    [JsonPropertyName("resetTime")]
    public DateTime ResetTime { get; set; }
}