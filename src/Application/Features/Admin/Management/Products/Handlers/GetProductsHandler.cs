using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Admin.Management.Products.DTOs.Responses;
using Application.Features.Admin.Management.Products.Queries;
using Domain.Entities.Admin.Management.Products;
using Domain.Enums.Admin.Management;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Admin.Management.Products.Handlers;

public class GetProductsHandler : IRequestHandler<GetProductsQuery, Result<ProductListResponse>>
{
    private readonly IApplicationDbContext _context;

    public GetProductsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ProductListResponse>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Products.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.Search))
            {
                var searchLower = request.Search.ToLower();
                query = query.Where(p => 
                    p.Name.ToLower().Contains(searchLower) ||
                    p.SKU.ToLower().Contains(searchLower) ||
                    p.Brand.ToLower().Contains(searchLower) ||
                    p.Description.ToLower().Contains(searchLower));
            }

            if (request.Status.HasValue)
            {
                query = query.Where(p => p.Status == request.Status.Value);
            }

            if (request.Category.HasValue)
            {
                query = query.Where(p => p.Category == request.Category.Value);
            }

            if (!string.IsNullOrEmpty(request.Brand))
            {
                query = query.Where(p => p.Brand == request.Brand);
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= request.MaxPrice.Value);
            }

            if (request.IsFeatured.HasValue)
            {
                query = query.Where(p => p.IsFeatured == request.IsFeatured.Value);
            }

            if (request.IsLowStock.HasValue && request.IsLowStock.Value)
            {
                query = query.Where(p => p.StockQuantity <= p.MinStockLevel);
            }

            // Apply sorting
            query = request.SortBy?.ToLower() switch
            {
                "name" => request.SortDirection?.ToLower() == "desc" 
                    ? query.OrderByDescending(p => p.Name)
                    : query.OrderBy(p => p.Name),
                "price" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Price)
                    : query.OrderBy(p => p.Price),
                "stock" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.StockQuantity)
                    : query.OrderBy(p => p.StockQuantity),
                "sales" => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.SalesCount)
                    : query.OrderBy(p => p.SalesCount),
                _ => request.SortDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.CreatedAt)
                    : query.OrderBy(p => p.CreatedAt)
            };

            // Get total count
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination
            var products = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Map to DTOs
            var productSummaries = products.Select(p => new ProductSummary
            {
                Id = p.Id,
                Name = p.Name,
                SKU = p.SKU,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                StockQuantity = p.StockQuantity,
                Status = p.Status,
                StatusName = p.Status.ToString(),
                Category = p.Category,
                CategoryName = p.Category.ToString(),
                ImageUrl = p.ImageUrl,
                Brand = p.Brand,
                IsFeatured = p.IsFeatured,
                SalesCount = p.SalesCount,
                Rating = p.Rating,
                CreatedAt = p.CreatedAt
            }).ToList();

            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            var response = new ProductListResponse
            {
                Products = productSummaries,
                TotalCount = totalCount,
                PageNumber = request.Page,
                PageSize = request.PageSize,
                TotalPages = totalPages,
                HasNextPage = request.Page < totalPages,
                HasPreviousPage = request.Page > 1
            };

            return Result<ProductListResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<ProductListResponse>.Failure($"Error retrieving products: {ex.Message}");
        }
    }
}

public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, Result<ProductResponse>>
{
    private readonly IApplicationDbContext _context;

    public GetProductByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ProductResponse>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);

            if (product == null)
            {
                return Result<ProductResponse>.Failure("Product not found");
            }

            var response = new ProductResponse
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                SKU = product.SKU,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                StockQuantity = product.StockQuantity,
                MinStockLevel = product.MinStockLevel,
                Status = product.Status,
                StatusName = product.Status.ToString(),
                Category = product.Category,
                CategoryName = product.Category.ToString(),
                ImageUrl = product.ImageUrl,
                Brand = product.Brand,
                Model = product.Model,
                Weight = product.Weight,
                Dimensions = product.Dimensions,
                IsFeatured = product.IsFeatured,
                IsDigital = product.IsDigital,
                LaunchDate = product.LaunchDate,
                Tags = product.Tags,
                ViewCount = product.ViewCount,
                SalesCount = product.SalesCount,
                Rating = product.Rating,
                ReviewCount = product.ReviewCount,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };

            return Result<ProductResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<ProductResponse>.Failure($"Error retrieving product: {ex.Message}");
        }
    }
}

public class GetProductStatisticsHandler : IRequestHandler<GetProductStatisticsQuery, Result<ProductStatistics>>
{
    private readonly IApplicationDbContext _context;

    public GetProductStatisticsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<ProductStatistics>> Handle(GetProductStatisticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var fromDate = request.FromDate ?? DateTime.UtcNow.AddMonths(-1);
            var toDate = request.ToDate ?? DateTime.UtcNow;
            var currentMonth = DateTime.UtcNow.AddDays(-30);

            var products = await _context.Products.ToListAsync(cancellationToken);

            var totalProducts = products.Count;
            var activeProducts = products.Count(p => p.Status == ProductStatus.Active);
            var inactiveProducts = products.Count(p => p.Status == ProductStatus.Inactive);
            var outOfStockProducts = products.Count(p => p.Status == ProductStatus.OutOfStock);
            var lowStockProducts = products.Count(p => p.StockQuantity <= p.MinStockLevel);
            var featuredProducts = products.Count(p => p.IsFeatured);
            var totalValue = products.Sum(p => p.Price * p.StockQuantity);
            var averagePrice = products.Any() ? products.Average(p => p.Price) : 0;
            var newProductsThisMonth = products.Count(p => p.CreatedAt >= currentMonth);

            // Products by category
            var productsByCategory = new Dictionary<string, int>();
            foreach (ProductCategory category in Enum.GetValues<ProductCategory>())
            {
                var count = products.Count(p => p.Category == category);
                if (count > 0)
                    productsByCategory[category.ToString()] = count;
            }

            // Products by status
            var productsByStatus = new Dictionary<string, int>();
            foreach (ProductStatus status in Enum.GetValues<ProductStatus>())
            {
                var count = products.Count(p => p.Status == status);
                if (count > 0)
                    productsByStatus[status.ToString()] = count;
            }

            var statistics = new ProductStatistics
            {
                TotalProducts = totalProducts,
                ActiveProducts = activeProducts,
                InactiveProducts = inactiveProducts,
                OutOfStockProducts = outOfStockProducts,
                LowStockProducts = lowStockProducts,
                FeaturedProducts = featuredProducts,
                TotalValue = totalValue,
                AveragePrice = Math.Round(averagePrice, 2),
                NewProductsThisMonth = newProductsThisMonth,
                ProductsByCategory = productsByCategory,
                ProductsByStatus = productsByStatus
            };

            return Result<ProductStatistics>.Success(statistics);
        }
        catch (Exception ex)
        {
            return Result<ProductStatistics>.Failure($"Error retrieving product statistics: {ex.Message}");
        }
    }
}