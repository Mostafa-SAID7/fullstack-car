using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Application.Features.Media.Podcasts.Queries;
using Domain.Enums.Media;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class GetPodcastsHandler : IRequestHandler<GetPodcastsQuery, Result<PaginatedList<PodcastListDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetPodcastsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<PodcastListDto>>> Handle(GetPodcastsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Podcasts
            .Where(p => !p.IsDeleted && p.Status == MediaStatus.Published && p.IsPublic)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            query = query.Where(p => p.Title.Contains(request.SearchTerm) || 
                                   p.Description.Contains(request.SearchTerm) ||
                                   (p.Tags != null && p.Tags.Contains(request.SearchTerm)));
        }

        if (request.CreatorId.HasValue)
        {
            query = query.Where(p => p.CreatorId == request.CreatorId.Value);
        }

        if (request.SeriesId.HasValue)
        {
            query = query.Where(p => p.SeriesId == request.SeriesId.Value);
        }

        if (request.FromDate.HasValue)
        {
            query = query.Where(p => p.PublishedAt >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            query = query.Where(p => p.PublishedAt <= request.ToDate.Value);
        }

        // Sorting
        query = request.SortBy.ToLower() switch
        {
            "title" => request.SortDescending ? query.OrderByDescending(p => p.Title) : query.OrderBy(p => p.Title),
            "plays" => request.SortDescending ? query.OrderByDescending(p => p.PlayCount) : query.OrderBy(p => p.PlayCount),
            "likes" => request.SortDescending ? query.OrderByDescending(p => p.LikeCount) : query.OrderBy(p => p.LikeCount),
            "published" => request.SortDescending ? query.OrderByDescending(p => p.PublishedAt) : query.OrderBy(p => p.PublishedAt),
            "episode" => request.SortDescending ? query.OrderByDescending(p => p.EpisodeNumber) : query.OrderBy(p => p.EpisodeNumber),
            _ => request.SortDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt)
        };

        var podcasts = await query
            .Select(p => new PodcastListDto
            {
                Id = p.Id,
                Title = p.Title,
                CoverImage = p.CoverImage,
                Duration = p.Duration,
                PlayCount = p.PlayCount,
                LikeCount = p.LikeCount,
                PublishedAt = p.PublishedAt,
                EpisodeNumber = p.EpisodeNumber,
                CreatorId = p.CreatorId
            })
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var totalCount = await query.CountAsync(cancellationToken);

        var paginatedList = new PaginatedList<PodcastListDto>(podcasts, totalCount, request.PageNumber, request.PageSize);

        return Result<PaginatedList<PodcastListDto>>.Success(paginatedList);
    }
}

public class GetPodcastByIdHandler : IRequestHandler<GetPodcastByIdQuery, Result<PodcastDetailsDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPodcastByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PodcastDetailsDto>> Handle(GetPodcastByIdQuery request, CancellationToken cancellationToken)
    {
        var podcast = await _context.Podcasts
            .Include(p => p.Series)
            .Include(p => p.Comments.Where(c => !c.IsDeleted))
                .ThenInclude(c => c.Replies.Where(r => !r.IsDeleted))
            .FirstOrDefaultAsync(p => p.Id == request.Id && !p.IsDeleted, cancellationToken);

        if (podcast == null)
        {
            return Result<PodcastDetailsDto>.Failure("Podcast not found");
        }

        // Check if user has liked the podcast
        bool isLikedByUser = false;

        if (request.UserId.HasValue)
        {
            var userLike = await _context.PodcastLikes
                .FirstOrDefaultAsync(l => l.PodcastId == request.Id && l.UserId == request.UserId.Value, cancellationToken);

            isLikedByUser = userLike != null;
        }

        var podcastDto = new PodcastDetailsDto
        {
            Id = podcast.Id,
            Title = podcast.Title,
            Description = podcast.Description,
            CoverImage = podcast.CoverImage,
            AudioUrl = podcast.AudioUrl,
            Duration = podcast.Duration,
            Status = podcast.Status,
            FileSize = podcast.FileSize,
            Tags = podcast.Tags,
            PlayCount = podcast.PlayCount,
            LikeCount = podcast.LikeCount,
            DownloadCount = podcast.DownloadCount,
            IsPublic = podcast.IsPublic,
            AllowComments = podcast.AllowComments,
            AllowDownload = podcast.AllowDownload,
            PublishedAt = podcast.PublishedAt,
            Transcript = podcast.Transcript,
            EpisodeNumber = podcast.EpisodeNumber,
            SeasonNumber = podcast.SeasonNumber,
            SeriesId = podcast.SeriesId,
            CreatorId = podcast.CreatorId,
            CreatedAt = podcast.CreatedAt,
            UpdatedAt = podcast.UpdatedAt,
            IsLikedByUser = isLikedByUser,
            Series = podcast.Series != null ? new PodcastSeriesDto
            {
                Id = podcast.Series.Id,
                Name = podcast.Series.Name,
                Description = podcast.Series.Description,
                CoverImage = podcast.Series.CoverImage,
                IsActive = podcast.Series.IsActive,
                Category = podcast.Series.Category,
                Language = podcast.Series.Language,
                CreatorId = podcast.Series.CreatorId,
                EpisodeCount = podcast.Series.Episodes.Count,
                CreatedAt = podcast.Series.CreatedAt
            } : null,
            Comments = podcast.Comments.Where(c => c.ParentCommentId == null).Select(c => new PodcastCommentDto
            {
                Id = c.Id,
                Content = c.Content,
                UserId = c.UserId,
                ParentCommentId = c.ParentCommentId,
                LikeCount = c.LikeCount,
                IsEdited = c.IsEdited,
                CreatedAt = c.CreatedAt,
                EditedAt = c.EditedAt,
                Replies = c.Replies.Select(r => new PodcastCommentDto
                {
                    Id = r.Id,
                    Content = r.Content,
                    UserId = r.UserId,
                    ParentCommentId = r.ParentCommentId,
                    LikeCount = r.LikeCount,
                    IsEdited = r.IsEdited,
                    CreatedAt = r.CreatedAt,
                    EditedAt = r.EditedAt
                }).ToList()
            }).ToList()
        };

        return Result<PodcastDetailsDto>.Success(podcastDto);
    }
}
