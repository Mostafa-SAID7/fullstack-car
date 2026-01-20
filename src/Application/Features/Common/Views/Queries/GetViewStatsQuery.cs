using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Views.DTOs.Responses;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Views.Queries;

public record GetViewStatsQuery(
    Guid ContentId, 
    ContentType ContentType,
    DateTime? StartDate = null,
    DateTime? EndDate = null
) : IRequest<Result<ViewStatsResponse>>;

public class GetViewStatsQueryHandler : IRequestHandler<GetViewStatsQuery, Result<ViewStatsResponse>>
{
    private readonly IApplicationDbContext _context;

    public GetViewStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ViewStatsResponse>> Handle(GetViewStatsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var startDate = request.StartDate ?? DateTime.UtcNow.AddDays(-30);
            var endDate = request.EndDate ?? DateTime.UtcNow;

            var views = await _context.Views
                .Where(v => v.ContentId == request.ContentId && 
                           v.ContentType == request.ContentType &&
                           v.CreatedAt >= startDate && 
                           v.CreatedAt <= endDate)
                .ToListAsync(cancellationToken);

            var totalViews = views.Count;
            var uniqueViews = views.GroupBy(v => v.UserId ?? Guid.Empty).Count();
            var viewsToday = views.Count(v => v.CreatedAt.Date == DateTime.UtcNow.Date);
            var viewsThisWeek = views.Count(v => v.CreatedAt >= DateTime.UtcNow.AddDays(-7));
            var viewsThisMonth = views.Count(v => v.CreatedAt >= DateTime.UtcNow.AddDays(-30));
            var lastViewedAt = views.Any() ? views.Max(v => v.CreatedAt) : DateTime.MinValue;

            // Generate trend data
            var viewTrends = views
                .GroupBy(v => v.CreatedAt.Date)
                .Select(g => new ViewTrendData
                {
                    Date = g.Key,
                    ViewCount = g.Count(),
                    UniqueViewCount = g.GroupBy(v => v.UserId ?? Guid.Empty).Count()
                })
                .OrderBy(t => t.Date)
                .ToList();

            var response = new ViewStatsResponse
            {
                ContentId = request.ContentId,
                ContentType = request.ContentType,
                TotalViews = totalViews,
                UniqueViews = uniqueViews,
                ViewsToday = viewsToday,
                ViewsThisWeek = viewsThisWeek,
                ViewsThisMonth = viewsThisMonth,
                LastViewedAt = lastViewedAt,
                ViewTrends = viewTrends
            };

            return Result<ViewStatsResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<ViewStatsResponse>.Failure($"Failed to retrieve view statistics: {ex.Message}");
        }
    }
}