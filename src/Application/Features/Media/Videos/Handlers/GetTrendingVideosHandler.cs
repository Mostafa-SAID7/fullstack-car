using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Videos.Queries;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Videos.Handlers;

public class GetTrendingVideosHandler : IRequestHandler<GetTrendingVideosQuery, Result<List<VideoListDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTrendingVideosHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<List<VideoListDto>>> Handle(GetTrendingVideosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-request.Days);

            var trendingVideos = await _context.Videos
                .Where(v => v.Status == Domain.Enums.Media.MediaStatus.Published && 
                           v.IsPublic && 
                           v.CreatedAt >= cutoffDate)
                .GroupJoin(_context.VideoViews.Where(vv => vv.CreatedAt >= cutoffDate),
                    v => v.Id,
                    vv => vv.VideoId,
                    (video, views) => new { Video = video, ViewCount = views.Count() })
                .GroupJoin(_context.VideoLikes,
                    v => v.Video.Id,
                    vl => vl.VideoId,
                    (v, likes) => new { v.Video, v.ViewCount, LikeCount = likes.Count() })
                .OrderByDescending(x => x.ViewCount + (x.LikeCount * 2)) // Weight likes more than views
                .Take(request.Count)
                .Select(x => x.Video)
                .ToListAsync(cancellationToken);

            var videoDtos = _mapper.Map<List<VideoListDto>>(trendingVideos);

            return Result<List<VideoListDto>>.Success(videoDtos);
        }
        catch (Exception ex)
        {
            return Result<List<VideoListDto>>.Failure(new[] { $"Error retrieving trending videos: {ex.Message}" });
        }
    }
}
