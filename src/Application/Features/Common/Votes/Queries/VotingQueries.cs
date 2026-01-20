using Application.Common.Models;
using Application.Features.Common.Votes.DTOs.Responses;
using MediatR;

namespace Application.Features.Common.Votes.Queries;

public class GetUserVotesQuery : IRequest<Result<PaginatedList<VoteResponse>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? ContentType { get; set; } // Filter by "Question" or "Answer"
    public string? VoteType { get; set; } // Filter by "Up" or "Down"
    public string SortBy { get; set; } = "CreatedAt";
    public bool SortDescending { get; set; } = true;
}
