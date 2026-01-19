using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Maps.Queries;

public class GetLocationsQuery : IRequest<object>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Category { get; set; }
    public string? SearchTerm { get; set; }
}

public class GetNearbyLocationsQuery : IRequest<ApiResponseDto<List<object>>>
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double RadiusKm { get; set; } = 10;
    public string? Category { get; set; }
    public int PageSize { get; set; } = 20;
}

public class GetLocationByIdQuery : IRequest<ApiResponseDto<object>>
{
    public Guid LocationId { get; set; }
}

public class GetLocationCheckInsQuery : IRequest<ApiResponseDto<List<object>>>
{
    public Guid LocationId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetLocationReviewsQuery : IRequest<ApiResponseDto<List<object>>>
{
    public Guid LocationId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class SearchLocationsQuery : IRequest<ApiResponseDto<List<object>>>
{
    public string SearchTerm { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class GetLocationCategoriesQuery : IRequest<ApiResponseDto<List<object>>>
{
}

public class GetUserCheckInsQuery : IRequest<ApiResponseDto<List<object>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetMapStatsQuery : IRequest<ApiResponseDto<object>>
{
}
