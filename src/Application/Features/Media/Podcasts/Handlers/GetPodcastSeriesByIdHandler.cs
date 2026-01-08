using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;
using Application.Features.Media.Podcasts.Queries;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class GetPodcastSeriesByIdHandler : IRequestHandler<GetPodcastSeriesByIdQuery, Result<PodcastSeriesDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetPodcastSeriesByIdHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PodcastSeriesDto>> Handle(GetPodcastSeriesByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var series = await _context.PodcastSeries
                .Include(s => s.Episodes)
                .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

            if (series == null)
            {
                return Result<PodcastSeriesDto>.Failure(new[] { "Podcast series not found" });
            }

            var seriesDto = _mapper.Map<PodcastSeriesDto>(series);
            return Result<PodcastSeriesDto>.Success(seriesDto);
        }
        catch (Exception ex)
        {
            return Result<PodcastSeriesDto>.Failure(new[] { $"Error retrieving podcast series: {ex.Message}" });
        }
    }
}