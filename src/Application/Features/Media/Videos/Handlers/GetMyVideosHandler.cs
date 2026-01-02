using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Videos.DTOs.Responses;
using Application.Features.Media.Videos.Queries;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Videos.Handlers;

public class GetMyVideosHandler : IRequestHandler<GetMyVideosQuery, Result<PaginatedList<VideoListDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetMyVideosHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PaginatedList<VideoListDto>>> Handle(GetMyVideosQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Videos
                .Where(v => v.CreatorId == request.UserId)
                .OrderByDescending(v => v.CreatedAt)
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(v => v.Status == request.Status.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);
            
            var videos = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var videoDtos = _mapper.Map<List<VideoListDto>>(videos);
            
            var paginatedResult = new PaginatedList<VideoListDto>(
                videoDtos, 
                totalCount, 
                request.PageNumber, 
                request.PageSize);

            return Result<PaginatedList<VideoListDto>>.Success(paginatedResult);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<VideoListDto>>.Failure(new[] { $"Error retrieving user videos: {ex.Message}" });
        }
    }
}