using Application.Common.Models;
using Application.Features.Marketplace.ServiceProviders.DTOs.Responses;
using Domain.Entities.Marketplace;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Marketplace.ServiceProviders.Queries
{
    public class GetServiceProvidersQuery : IRequest<Result<PaginatedList<ServiceProviderDto>>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public bool? IsVerified { get; set; }
        public bool? IsActive { get; set; }
        public decimal? MinRating { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public bool SortDescending { get; set; } = true;
    }

    public class GetServiceProvidersQueryHandler : IRequestHandler<GetServiceProvidersQuery, Result<PaginatedList<ServiceProviderDto>>>
    {
        private readonly IRepository<ServiceProvider> _serviceProviderRepository;

        public GetServiceProvidersQueryHandler(IRepository<ServiceProvider> serviceProviderRepository)
        {
            _serviceProviderRepository = serviceProviderRepository;
        }

        public async Task<Result<PaginatedList<ServiceProviderDto>>> Handle(GetServiceProvidersQuery request, CancellationToken cancellationToken)
        {
            var query = _serviceProviderRepository.GetQueryable()
                .Include(sp => sp.Owner)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(sp => sp.BusinessName.Contains(request.SearchTerm) ||
                                         sp.Description.Contains(request.SearchTerm));
            }

            if (!string.IsNullOrEmpty(request.City))
            {
                query = query.Where(sp => sp.City == request.City);
            }

            if (!string.IsNullOrEmpty(request.State))
            {
                query = query.Where(sp => sp.State == request.State);
            }

            if (request.IsVerified.HasValue)
            {
                query = query.Where(sp => sp.IsVerified == request.IsVerified.Value);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(sp => sp.IsActive == request.IsActive.Value);
            }

            if (request.MinRating.HasValue)
            {
                query = query.Where(sp => sp.AverageRating >= request.MinRating.Value);
            }

            // Apply sorting
            query = request.SortBy?.ToLower() switch
            {
                "businessname" => request.SortDescending ? query.OrderByDescending(sp => sp.BusinessName) : query.OrderBy(sp => sp.BusinessName),
                "rating" => request.SortDescending ? query.OrderByDescending(sp => sp.AverageRating) : query.OrderBy(sp => sp.AverageRating),
                "city" => request.SortDescending ? query.OrderByDescending(sp => sp.City) : query.OrderBy(sp => sp.City),
                _ => request.SortDescending ? query.OrderByDescending(sp => sp.CreatedAt) : query.OrderBy(sp => sp.CreatedAt)
            };

            var totalCount = await query.CountAsync(cancellationToken);

            var serviceProviders = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(sp => new ServiceProviderDto
                {
                    Id = sp.Id,
                    BusinessName = sp.BusinessName,
                    Description = sp.Description,
                    ContactEmail = sp.ContactEmail,
                    ContactPhone = sp.ContactPhone,
                    Address = sp.Address,
                    City = sp.City,
                    State = sp.State,
                    ZipCode = sp.ZipCode,
                    Country = sp.Country,
                    Latitude = sp.Latitude,
                    Longitude = sp.Longitude,
                    LogoUrl = sp.LogoUrl,
                    WebsiteUrl = sp.WebsiteUrl,
                    IsVerified = sp.IsVerified,
                    IsActive = sp.IsActive,
                    AverageRating = sp.AverageRating,
                    TotalReviews = sp.TotalReviews,
                    BusinessLicense = sp.BusinessLicense,
                    InsuranceInfo = sp.InsuranceInfo,
                    VerifiedAt = sp.VerifiedAt,
                    CreatedAt = sp.CreatedAt,
                    OwnerName = $"{sp.Owner.FirstName} {sp.Owner.LastName}",
                    TotalServices = sp.Services.Count(),
                    TotalBookings = sp.Bookings.Count()
                })
                .ToListAsync(cancellationToken);

            var paginatedList = new PaginatedList<ServiceProviderDto>(
                serviceProviders, totalCount, request.PageNumber, request.PageSize);

            return Result<PaginatedList<ServiceProviderDto>>.Success(paginatedList);
        }
    }
}