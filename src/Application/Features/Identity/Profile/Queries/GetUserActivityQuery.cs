using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Queries;

public class GetUserActivityQuery : IRequest<Result<PaginatedList<UserActivityDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? ActivityType { get; set; }
}

public class UserActivityDto
{
    public Guid Id { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class GetUserActivityQueryHandler : IRequestHandler<GetUserActivityQuery, Result<PaginatedList<UserActivityDto>>>
{
    public async Task<Result<PaginatedList<UserActivityDto>>> Handle(GetUserActivityQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement user activity retrieval logic
        await Task.CompletedTask;
        
        var activities = new List<UserActivityDto>();
        var paginatedList = new PaginatedList<UserActivityDto>(activities, 0, request.PageNumber, request.PageSize);
        
        return Result<PaginatedList<UserActivityDto>>.Success(paginatedList);
    }
}