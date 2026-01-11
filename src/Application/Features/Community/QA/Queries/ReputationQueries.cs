using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using MediatR;

namespace Application.Features.Community.QA.Queries;

public class GetUserReputationQuery : IRequest<Result<UserReputationDto>>
{
    public Guid UserId { get; set; }
}

public class GetReputationLeaderboardQuery : IRequest<Result<List<UserReputationDto>>>
{
    public int Count { get; set; } = 10;
    public string? Category { get; set; }
}

public class GetReputationHistoryQuery : IRequest<Result<PaginatedList<ReputationHistoryDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class GetExpertsByCategory : IRequest<Result<List<ExpertDto>>>
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; } = 10;
}