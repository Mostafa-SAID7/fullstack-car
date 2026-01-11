using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Queries;
using Domain.Enums.Community.QA;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.QA.Handlers;

public class GetUserVotesHandler : IRequestHandler<GetUserVotesQuery, Result<PaginatedList<VoteDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetUserVotesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<VoteDto>>> Handle(GetUserVotesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Build query for user's votes
            var query = _context.QAVotes
                .Where(v => v.UserId == request.UserId);

            // Apply content type filter if specified
            if (!string.IsNullOrEmpty(request.ContentType))
            {
                query = query.Where(v => v.ContentType == request.ContentType);
            }

            // Apply vote type filter if specified
            if (!string.IsNullOrEmpty(request.VoteType))
            {
                if (Enum.TryParse<VoteType>(request.VoteType + "vote", true, out var voteType))
                {
                    query = query.Where(v => v.VoteType == voteType);
                }
            }

            // Apply sorting
            query = request.SortBy.ToLower() switch
            {
                "contenttype" => request.SortDescending 
                    ? query.OrderByDescending(v => v.ContentType)
                    : query.OrderBy(v => v.ContentType),
                "votetype" => request.SortDescending 
                    ? query.OrderByDescending(v => v.VoteType)
                    : query.OrderBy(v => v.VoteType),
                "updatedat" => request.SortDescending 
                    ? query.OrderByDescending(v => v.UpdatedAt ?? v.CreatedAt)
                    : query.OrderBy(v => v.UpdatedAt ?? v.CreatedAt),
                _ => request.SortDescending 
                    ? query.OrderByDescending(v => v.CreatedAt)
                    : query.OrderBy(v => v.CreatedAt)
            };

            // Project to DTOs with content information
            var votesQuery = query
                .Select(v => new VoteDto
                {
                    Id = v.Id,
                    UserId = v.UserId,
                    ContentId = v.ContentId,
                    ContentType = v.ContentType,
                    VoteType = v.VoteType,
                    CreatedAt = v.CreatedAt,
                    UpdatedAt = v.UpdatedAt,
                    // Get content title and vote score based on content type
                    ContentTitle = v.ContentType == "Question" 
                        ? _context.Questions
                            .Where(q => q.Id == v.ContentId && !q.IsDeleted)
                            .Select(q => q.Title)
                            .FirstOrDefault() ?? "Question not found"
                        : _context.Answers
                            .Where(a => a.Id == v.ContentId && !a.IsDeleted)
                            .Select(a => a.Content)
                            .FirstOrDefault() ?? "Answer not found",
                    // ContentUrl will be set in post-processing to avoid LINQ translation issues
                    ContentUrl = "",
                    ContentVoteScore = v.ContentType == "Question"
                        ? _context.Questions
                            .Where(q => q.Id == v.ContentId && !q.IsDeleted)
                            .Select(q => q.UpvotesCount - q.DownvotesCount)
                            .FirstOrDefault()
                        : _context.Answers
                            .Where(a => a.Id == v.ContentId && !a.IsDeleted)
                            .Select(a => a.UpvotesCount - a.DownvotesCount)
                            .FirstOrDefault(),
                    // Store QuestionId for answers to build URL later
                    QuestionId = v.ContentType == "Answer" 
                        ? _context.Answers
                            .Where(a => a.Id == v.ContentId)
                            .Select(a => a.QuestionId)
                            .FirstOrDefault()
                        : (Guid?)null
                });

            // Apply pagination
            var paginatedVotes = await PaginatedList<VoteDto>.CreateAsync(
                votesQuery, request.PageNumber, request.PageSize);

            // Post-process to build URLs and truncate answer content
            foreach (var vote in paginatedVotes.Items)
            {
                // Build content URLs
                if (vote.ContentType == "Question")
                {
                    vote.ContentUrl = $"/questions/{vote.ContentId}";
                }
                else if (vote.ContentType == "Answer" && vote.QuestionId.HasValue)
                {
                    vote.ContentUrl = $"/questions/{vote.QuestionId}/answers/{vote.ContentId}";
                }

                // Truncate answer content for display
                if (vote.ContentType == "Answer" && vote.ContentTitle.Length > 100)
                {
                    vote.ContentTitle = vote.ContentTitle.Substring(0, 100) + "...";
                }
            }

            return Result<PaginatedList<VoteDto>>.Success(paginatedVotes);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<VoteDto>>.Failure($"Error retrieving user votes: {ex.Message}");
        }
    }
}