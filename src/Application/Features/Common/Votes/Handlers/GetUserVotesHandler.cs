using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Votes.DTOs.Responses;
using Application.Features.Common.Votes.Queries;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Votes.Handlers;

public class GetUserVotesHandler : IRequestHandler<GetUserVotesQuery, Result<PaginatedList<VoteResponse>>>
{
    private readonly IApplicationDbContext _context;

    public GetUserVotesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<VoteResponse>>> Handle(GetUserVotesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Build query for user's votes
            var query = _context.Votes
                .Where(v => v.UserId == request.UserId);

            // Apply content type filter if specified
            if (!string.IsNullOrEmpty(request.ContentType))
            {
                if (Enum.TryParse<Domain.Enums.Common.ContentType>(request.ContentType, true, out var contentType))
                {
                    query = query.Where(v => v.ContentType == contentType);
                }
            }

            // Apply vote type filter if specified
            if (!string.IsNullOrEmpty(request.VoteType))
            {
                if (Enum.TryParse<VoteType>(request.VoteType, true, out var voteType))
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
                .Select(v => new VoteResponse
                {
                    Id = v.Id,
                    UserId = v.UserId,
                    ContentId = v.ContentId,
                    ContentType = v.ContentType.ToString(),
                    VoteType = v.VoteType,
                    CreatedAt = v.CreatedAt,
                    UpdatedAt = v.UpdatedAt,
                    // Get content title and vote score based on content type
                    ContentTitle = v.ContentType == ContentType.Question 
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
                    ContentVoteScore = v.ContentType == ContentType.Question
                        ? _context.Questions
                            .Where(q => q.Id == v.ContentId && !q.IsDeleted)
                            .Select(q => q.UpvotesCount - q.DownvotesCount)
                            .FirstOrDefault()
                        : _context.Answers
                            .Where(a => a.Id == v.ContentId && !a.IsDeleted)
                            .Select(a => a.UpvotesCount - a.DownvotesCount)
                            .FirstOrDefault(),
                    // Store QuestionId for answers to build URL later
                    QuestionId = v.ContentType == ContentType.Answer 
                        ? _context.Answers
                            .Where(a => a.Id == v.ContentId)
                            .Select(a => a.QuestionId)
                            .FirstOrDefault()
                        : (Guid?)null
                });

            // Apply pagination
            var paginatedVotes = await PaginatedList<VoteResponse>.CreateAsync(
                votesQuery, request.PageNumber, request.PageSize);

            // Post-process to build URLs and truncate answer content
            foreach (var vote in paginatedVotes.Items)
            {
                // Build content URLs
                if (vote.ContentType == ContentType.Question.ToString())
                {
                    vote.ContentUrl = $"/questions/{vote.ContentId}";
                }
                else if (vote.ContentType == ContentType.Answer.ToString() && vote.QuestionId.HasValue)
                {
                    vote.ContentUrl = $"/questions/{vote.QuestionId}/answers/{vote.ContentId}";
                }

                // Truncate answer content for display
                if (vote.ContentType == ContentType.Answer.ToString() && vote.ContentTitle.Length > 100)
                {
                    vote.ContentTitle = vote.ContentTitle.Substring(0, 100) + "...";
                }
            }

            return Result<PaginatedList<VoteResponse>>.Success(paginatedVotes);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<VoteResponse>>.Failure($"Error retrieving user votes: {ex.Message}");
        }
    }
}
