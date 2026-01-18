using System.Text.Json.Serialization;

namespace Application.Common.DTOs;

/// <summary>
/// Paginated response DTO that works efficiently with both Angular and React frontends
/// Provides consistent pagination metadata across all endpoints
/// </summary>
/// <typeparam name="T">The type of items in the paginated list</typeparam>
public class PaginatedResponseDto<T>
{
    [JsonPropertyName("items")]
    public List<T> Items { get; set; } = new();

    [JsonPropertyName("pageNumber")]
    public int PageNumber { get; set; }

    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }

    [JsonPropertyName("totalCount")]
    public int TotalCount { get; set; }

    [JsonPropertyName("totalPages")]
    public int TotalPages { get; set; }

    [JsonPropertyName("hasNextPage")]
    public bool HasNextPage { get; set; }

    [JsonPropertyName("hasPreviousPage")]
    public bool HasPreviousPage { get; set; }

    [JsonPropertyName("isFirstPage")]
    public bool IsFirstPage => PageNumber == 1;

    [JsonPropertyName("isLastPage")]
    public bool IsLastPage => PageNumber == TotalPages;

    public static PaginatedResponseDto<T> Create(List<T> items, int pageNumber, int pageSize, int totalCount)
    {
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        
        return new PaginatedResponseDto<T>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasNextPage = pageNumber < totalPages,
            HasPreviousPage = pageNumber > 1
        };
    }

    public static PaginatedResponseDto<T> Empty(int pageNumber = 1, int pageSize = 10)
    {
        return new PaginatedResponseDto<T>
        {
            Items = new List<T>(),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = 0,
            TotalPages = 0,
            HasNextPage = false,
            HasPreviousPage = false
        };
    }
}

/// <summary>
/// Wrapper for paginated API responses with success/error handling
/// </summary>
/// <typeparam name="T">The type of items in the paginated list</typeparam>
public class PaginatedApiResponseDto<T> : ApiResponseDto<PaginatedResponseDto<T>>
{
    public static PaginatedApiResponseDto<T> Success(
        List<T> items, 
        int pageNumber, 
        int pageSize, 
        int totalCount, 
        string? message = null)
    {
        var paginatedData = PaginatedResponseDto<T>.Create(items, pageNumber, pageSize, totalCount);
        
        return new PaginatedApiResponseDto<T>
        {
            Succeeded = true,
            Data = paginatedData,
            Message = message ?? "Data retrieved successfully",
            StatusCode = 200,
            Timestamp = DateTime.UtcNow
        };
    }

    public static new PaginatedApiResponseDto<T> Failure(string[] errors, string? message = null, int statusCode = 400)
    {
        return new PaginatedApiResponseDto<T>
        {
            Succeeded = false,
            Data = PaginatedResponseDto<T>.Empty(),
            Message = message ?? "Failed to retrieve data",
            Errors = errors,
            StatusCode = statusCode,
            Timestamp = DateTime.UtcNow
        };
    }

    public static new PaginatedApiResponseDto<T> Failure(string error, string? message = null, int statusCode = 400)
    {
        return Failure(new[] { error }, message, statusCode);
    }
}