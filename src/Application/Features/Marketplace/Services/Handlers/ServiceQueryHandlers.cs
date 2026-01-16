using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Marketplace.Services.DTOs.Responses;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Marketplace.Services.Handlers;

public class ExportServicesHandler : IRequestHandler<WebAPI.Controllers.Marketplace.ExportServicesQuery, Result<byte[]>>
{
    private readonly IApplicationDbContext _context;

    public ExportServicesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<byte[]>> Handle(WebAPI.Controllers.Marketplace.ExportServicesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.CarServices.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                var searchLower = request.SearchTerm.ToLower();
                query = query.Where(s => 
                    s.Name.ToLower().Contains(searchLower) ||
                    s.Title.ToLower().Contains(searchLower) ||
                    s.Description.ToLower().Contains(searchLower));
            }

            if (request.Type.HasValue)
            {
                query = query.Where(s => s.ServiceType == request.Type.Value);
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(s => s.BasePrice >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(s => s.BasePrice <= request.MaxPrice.Value);
            }

            if (request.IsEmergencyService.HasValue)
            {
                query = query.Where(s => s.IsEmergencyService == request.IsEmergencyService.Value);
            }

            if (request.IsAvailable24x7.HasValue)
            {
                query = query.Where(s => s.IsAvailable24x7 == request.IsAvailable24x7.Value);
            }

            if (request.MinRating.HasValue)
            {
                query = query.Where(s => s.AverageRating >= request.MinRating.Value);
            }

            var services = await query.OrderBy(s => s.Name).ToListAsync(cancellationToken);

            // Generate CSV
            var csv = new System.Text.StringBuilder();
            csv.AppendLine("ID,Name,Title,Service Type,Category,Status,Base Price,Max Price,Duration,Rating,Total Reviews,Total Bookings,Created At");

            foreach (var service in services)
            {
                csv.AppendLine($"{service.Id},{EscapeCsv(service.Name)},{EscapeCsv(service.Title)},{service.ServiceType},{EscapeCsv(service.Category)},{service.Status},{service.BasePrice},{service.MaxPrice},{service.EstimatedDuration},{service.AverageRating},{service.TotalReviews},{service.TotalBookings},{service.CreatedAt:yyyy-MM-dd}");
            }

            var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
            return Result<byte[]>.Success(bytes);
        }
        catch (Exception ex)
        {
            return Result<byte[]>.Failure($"Error exporting services: {ex.Message}");
        }
    }

    private string EscapeCsv(string? value)
    {
        if (string.IsNullOrEmpty(value))
            return string.Empty;

        if (value.Contains(',') || value.Contains('"') || value.Contains('\n'))
        {
            return $"\"{value.Replace("\"", "\"\"")}\"";
        }

        return value;
    }
}

public class GetPopularServicesHandler : IRequestHandler<WebAPI.Controllers.Marketplace.GetPopularServicesQuery, Result<List<CarServiceDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetPopularServicesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<CarServiceDto>>> Handle(WebAPI.Controllers.Marketplace.GetPopularServicesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var services = await _context.CarServices
                .Where(s => s.IsActive)
                .OrderByDescending(s => s.TotalBookings)
                .ThenByDescending(s => s.AverageRating)
                .Take(request.Limit)
                .ToListAsync(cancellationToken);

            var serviceDtos = services.Select(s => new CarServiceDto
            {
                Id = s.Id,
                ServiceProviderId = s.ServiceProviderId,
                Name = s.Name,
                Title = s.Title,
                Description = s.Description,
                ShortDescription = s.ShortDescription,
                BasePrice = s.BasePrice,
                MaxPrice = s.MaxPrice,
                EstimatedDuration = s.EstimatedDuration,
                MaxDuration = s.MaxDuration,
                ServiceType = s.ServiceType,
                Category = s.Category,
                SubCategory = s.SubCategory,
                Status = s.Status,
                IsActive = s.IsActive,
                IsPopular = s.IsPopular,
                RequiresApproval = s.RequiresApproval,
                Requirements = s.Requirements,
                Inclusions = s.Inclusions,
                Exclusions = s.Exclusions,
                Tags = s.Tags,
                SortOrder = s.SortOrder,
                AverageRating = s.AverageRating,
                TotalReviews = s.TotalReviews,
                TotalBookings = s.TotalBookings,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            }).ToList();

            return Result<List<CarServiceDto>>.Success(serviceDtos);
        }
        catch (Exception ex)
        {
            return Result<List<CarServiceDto>>.Failure($"Error retrieving popular services: {ex.Message}");
        }
    }
}

public class GetServiceStatisticsHandler : IRequestHandler<WebAPI.Controllers.Marketplace.GetServiceStatisticsQuery, Result<object>>
{
    private readonly IApplicationDbContext _context;

    public GetServiceStatisticsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<object>> Handle(WebAPI.Controllers.Marketplace.GetServiceStatisticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var fromDate = request.FromDate ?? DateTime.UtcNow.AddMonths(-1);
            var toDate = request.ToDate ?? DateTime.UtcNow;

            var services = await _context.CarServices.ToListAsync(cancellationToken);

            var statistics = new
            {
                TotalServices = services.Count,
                ActiveServices = services.Count(s => s.IsActive),
                InactiveServices = services.Count(s => !s.IsActive),
                PopularServices = services.Count(s => s.IsPopular),
                EmergencyServices = services.Count(s => s.IsEmergencyService),
                TotalBookings = services.Sum(s => s.TotalBookings),
                AverageRating = services.Any() ? services.Average(s => s.AverageRating) : 0,
                TotalRevenue = services.Sum(s => s.BasePrice * s.TotalBookings),
                ServicesByType = services.GroupBy(s => s.ServiceType.ToString())
                    .ToDictionary(g => g.Key, g => g.Count()),
                ServicesByStatus = services.GroupBy(s => s.Status.ToString())
                    .ToDictionary(g => g.Key, g => g.Count())
            };

            return Result<object>.Success(statistics);
        }
        catch (Exception ex)
        {
            return Result<object>.Failure($"Error retrieving service statistics: {ex.Message}");
        }
    }
}
