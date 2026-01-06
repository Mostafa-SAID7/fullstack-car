using Application.Common.Models;
using Application.Features.Marketplace.Products.DTOs.Requests;
using Application.Features.Marketplace.Products.DTOs.Responses;
using MediatR;

namespace Application.Features.Marketplace.Products.Commands;

public class CreateProductCommand : IRequest<Result<ProductResponse>>
{
    public Guid AdminId { get; set; }
    public CreateProductRequest Request { get; set; } = new();
}

public class UpdateProductCommand : IRequest<Result<ProductResponse>>
{
    public Guid ProductId { get; set; }
    public Guid AdminId { get; set; }
    public UpdateProductRequest Request { get; set; } = new();
}

public class DeleteProductCommand : IRequest<Result<bool>>
{
    public Guid ProductId { get; set; }
    public Guid AdminId { get; set; }
}

public class UpdateProductStatusCommand : IRequest<Result<bool>>
{
    public Guid ProductId { get; set; }
    public Guid AdminId { get; set; }
    public Domain.Enums.Marketplace.ProductStatus Status { get; set; }
}

public class UpdateProductStockCommand : IRequest<Result<bool>>
{
    public Guid ProductId { get; set; }
    public Guid AdminId { get; set; }
    public int Quantity { get; set; }
    public string? Reason { get; set; }
}

public class BulkUpdateProductsCommand : IRequest<Result<int>>
{
    public List<Guid> ProductIds { get; set; } = new();
    public Guid AdminId { get; set; }
    public Domain.Enums.Marketplace.ProductStatus? Status { get; set; }
    public Domain.Enums.Marketplace.ProductCategory? Category { get; set; }
    public bool? IsFeatured { get; set; }
}

public class BulkUpdateProductStockCommand : IRequest<Result<int>>
{
    public Guid AdminId { get; set; }
    public BulkUpdateStockRequest Request { get; set; } = new();
}

public class BulkUpdateCategoryProductsCommand : IRequest<Result<int>>
{
    public Domain.Enums.Marketplace.ProductCategory Category { get; set; }
    public Guid AdminId { get; set; }
    public BulkUpdateCategoryProductsRequest Request { get; set; } = new();
}
