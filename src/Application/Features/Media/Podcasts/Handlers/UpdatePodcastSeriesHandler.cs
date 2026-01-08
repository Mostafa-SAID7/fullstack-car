using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Media.Podcasts.Commands;
using Application.Features.Media.Podcasts.DTOs.Responses;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Media.Podcasts.Handlers;

public class UpdatePodcastSeriesHandler : IRequestHandler<UpdatePodcastSeriesCommand, Result<PodcastSeriesDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdatePodcastSeriesHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<PodcastSeriesDto>> Handle(UpdatePodcastSeriesCommand request, CancellationToken cancellationToken)
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

            if (series.CreatorId != request.UserId)
            {
                return Result<PodcastSeriesDto>.Failure(new[] { "You don't have permission to update this series" });
            }

            // Update series properties
            series.Name = request.Request.Name;
            series.Description = request.Request.Description;
            series.CoverImage = request.Request.CoverImage;
            series.Category = request.Request.Category;
            series.Language = request.Request.Language;
            series.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            var seriesDto = _mapper.Map<PodcastSeriesDto>(series);
            return Result<PodcastSeriesDto>.Success(seriesDto);
        }
        catch (Exception ex)
        {
            return Result<PodcastSeriesDto>.Failure(new[] { $"Error updating podcast series: {ex.Message}" });
        }
    }
}