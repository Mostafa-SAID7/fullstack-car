using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Marketplace.Customers.DTOs.Responses;
using Application.Features.Marketplace.Customers.Queries;
using Domain.Entities.Marketplace.Customers;
using Domain.Enums.Marketplace;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Marketplace.Customers.Handlers;

public class GetCustomersHandler : IRequestHandler<GetCustomersQuery, Result<CustomerListResponse>>
{
    private readonly IApplicationDbContext _context;

    public GetCustomersHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CustomerListResponse>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Customers.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.Search))
            {
                var searchLower = request.Search.ToLower();
                query = query.Where(c => 
                    c.FirstName.ToLower().Contains(searchLower) ||
                    c.LastName.ToLower().Contains(searchLower) ||
                    c.Email.ToLower().Contains(searchLower) ||
                    c.Company.ToLower().Contains(searchLower));
            }

            if (request.Status.HasValue)
            {
                query = query.Where(c => c.Status == request.Status.Value);
            }

            if (request.Type.HasValue)
            {
                query = query.Where(c => c.Type == request.Type.Value);
            }

            if (!string.IsNullOrEmpty(request.Country))
            {
                query = query.Where(c => c.Country == request.Country);
            }

            if (!string.IsNullOrEmpty(request.City))
            {
                query = query.Where(c => c.City == request.City);
            }

            if (request.MinSpent.HasValue)
            {
                query = query.Where(c => c.TotalSpent >= request.MinSpent.Value);
            }

            if (request.MaxSpent.HasValue)
            {
                query = query.Where(c => c.TotalSpent <= request.MaxSpent.Value);
            }

            if (request.RegisteredAfter.HasValue)
            {
                query = query.Where(c => c.CreatedAt >= request.RegisteredAfter.Value);
            }

            if (request.RegisteredBefore.HasValue)
            {
                query = query.Where(c => c.CreatedAt <= request.RegisteredBefore.Value);
            }

            if (request.HasOrders.HasValue)
            {
                if (request.HasOrders.Value)
                    query = query.Where(c => c.OrderCount > 0);
                else
                    query = query.Where(c => c.OrderCount == 0);
            }

            // Apply sorting
            query = request.SortBy?.ToLower() switch
            {
                "firstname" => request.SortDirection?.ToLower() == "desc" 
                    ? query.OrderByDescending(c => c.FirstName)
                    : query.OrderBy(c => c.FirstName),
                "lastname" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(c => c.LastName)
                    : query.OrderBy(c => c.LastName),
                "email" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(c => c.Email)
                    : query.OrderBy(c => c.Email),
                "totalspent" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(c => c.TotalSpent)
                    : query.OrderBy(c => c.TotalSpent),
                "ordercount" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(c => c.OrderCount)
                    : query.OrderBy(c => c.OrderCount),
                "lastorder" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(c => c.LastOrderDate)
                    : query.OrderBy(c => c.LastOrderDate),
                _ => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(c => c.CreatedAt)
                    : query.OrderBy(c => c.CreatedAt)
            };

            // Get total count
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination
            var customers = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Map to DTOs
            var customerSummaries = customers.Select(c => new CustomerSummary
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                Phone = c.Phone,
                Status = c.Status,
                StatusName = c.Status.ToString(),
                Type = c.Type,
                TypeName = c.Type.ToString(),
                Company = c.Company,
                TotalSpent = c.TotalSpent,
                OrderCount = c.OrderCount,
                LastOrderDate = c.LastOrderDate,
                LifetimeValue = c.LifetimeValue,
                CreatedAt = c.CreatedAt
            }).ToList();

            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            var response = new CustomerListResponse
            {
                Customers = customerSummaries,
                TotalCount = totalCount,
                PageNumber = request.Page,
                PageSize = request.PageSize,
                TotalPages = totalPages,
                HasNextPage = request.Page < totalPages,
                HasPreviousPage = request.Page > 1
            };

            return Result<CustomerListResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<CustomerListResponse>.Failure($"Error retrieving customers: {ex.Message}");
        }
    }
}

public class GetCustomerByIdHandler : IRequestHandler<GetCustomerByIdQuery, Result<CustomerResponse>>
{
    private readonly IApplicationDbContext _context;

    public GetCustomerByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CustomerResponse>> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == request.CustomerId, cancellationToken);

            if (customer == null)
            {
                return Result<CustomerResponse>.Failure("Customer not found");
            }

            var response = new CustomerResponse
            {
                Id = customer.Id,
                FirstName = customer.FirstName,
                LastName = customer.LastName,
                Email = customer.Email,
                Phone = customer.Phone,
                DateOfBirth = customer.DateOfBirth,
                Status = customer.Status,
                StatusName = customer.Status.ToString(),
                Type = customer.Type,
                TypeName = customer.Type.ToString(),
                Company = customer.Company,
                JobTitle = customer.JobTitle,
                Address = customer.Address,
                City = customer.City,
                State = customer.State,
                Country = customer.Country,
                PostalCode = customer.PostalCode,
                TotalSpent = customer.TotalSpent,
                OrderCount = customer.OrderCount,
                LastOrderDate = customer.LastOrderDate,
                LastLoginDate = customer.LastLoginDate,
                PreferredLanguage = customer.PreferredLanguage,
                PreferredCurrency = customer.PreferredCurrency,
                IsEmailVerified = customer.IsEmailVerified,
                IsPhoneVerified = customer.IsPhoneVerified,
                MarketingOptIn = customer.MarketingOptIn,
                Notes = customer.Notes,
                Tags = customer.Tags,
                AssignedSalesRepId = customer.AssignedSalesRepId,
                LifetimeValue = customer.LifetimeValue,
                LoyaltyPoints = customer.LoyaltyPoints,
                CreatedAt = customer.CreatedAt,
                UpdatedAt = customer.UpdatedAt
            };

            return Result<CustomerResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<CustomerResponse>.Failure($"Error retrieving customer: {ex.Message}");
        }
    }
}

public class GetCustomerStatisticsHandler : IRequestHandler<GetCustomerStatisticsQuery, Result<CustomerStatistics>>
{
    private readonly IApplicationDbContext _context;

    public GetCustomerStatisticsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CustomerStatistics>> Handle(GetCustomerStatisticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var fromDate = request.FromDate ?? DateTime.UtcNow.AddMonths(-1);
            var toDate = request.ToDate ?? DateTime.UtcNow;
            var currentMonth = DateTime.UtcNow.AddDays(-30);

            var customers = await _context.Customers.ToListAsync(cancellationToken);

            var totalCustomers = customers.Count;
            var activeCustomers = customers.Count(c => c.Status == CustomerStatus.Active);
            var inactiveCustomers = customers.Count(c => c.Status == CustomerStatus.Inactive);
            var suspendedCustomers = customers.Count(c => c.Status == CustomerStatus.Suspended);
            var newCustomersThisMonth = customers.Count(c => c.CreatedAt >= currentMonth);
            var totalRevenue = customers.Sum(c => c.TotalSpent);
            var averageOrderValue = customers.Where(c => c.OrderCount > 0).Any() 
                ? customers.Where(c => c.OrderCount > 0).Average(c => c.TotalSpent / c.OrderCount) 
                : 0;
            var customerLifetimeValue = customers.Any() ? customers.Average(c => c.LifetimeValue) : 0;
            var totalOrders = customers.Sum(c => c.OrderCount);

            // Customers by type
            var customersByType = new Dictionary<string, int>();
            foreach (CustomerType type in Enum.GetValues<CustomerType>())
            {
                var count = customers.Count(c => c.Type == type);
                if (count > 0)
                    customersByType[type.ToString()] = count;
            }

            // Customers by status
            var customersByStatus = new Dictionary<string, int>();
            foreach (CustomerStatus status in Enum.GetValues<CustomerStatus>())
            {
                var count = customers.Count(c => c.Status == status);
                if (count > 0)
                    customersByStatus[status.ToString()] = count;
            }

            // Revenue by month (last 12 months)
            var revenueByMonth = new Dictionary<string, decimal>();
            for (int i = 11; i >= 0; i--)
            {
                var monthStart = DateTime.UtcNow.AddMonths(-i).Date.AddDays(1 - DateTime.UtcNow.AddMonths(-i).Day);
                var monthEnd = monthStart.AddMonths(1).AddDays(-1);
                var monthRevenue = customers
                    .Where(c => c.LastOrderDate >= monthStart && c.LastOrderDate <= monthEnd)
                    .Sum(c => c.TotalSpent);
                revenueByMonth[monthStart.ToString("MMM yyyy")] = monthRevenue;
            }

            var statistics = new CustomerStatistics
            {
                TotalCustomers = totalCustomers,
                ActiveCustomers = activeCustomers,
                InactiveCustomers = inactiveCustomers,
                SuspendedCustomers = suspendedCustomers,
                NewCustomersThisMonth = newCustomersThisMonth,
                TotalRevenue = totalRevenue,
                AverageOrderValue = Math.Round(averageOrderValue, 2),
                CustomerLifetimeValue = Math.Round(customerLifetimeValue, 2),
                TotalOrders = totalOrders,
                CustomersByType = customersByType,
                CustomersByStatus = customersByStatus,
                RevenueByMonth = revenueByMonth
            };

            return Result<CustomerStatistics>.Success(statistics);
        }
        catch (Exception ex)
        {
            return Result<CustomerStatistics>.Failure($"Error retrieving customer statistics: {ex.Message}");
        }
    }
}
