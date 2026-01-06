using Application.Common.Models;
using Application.Features.Marketplace.Customers.DTOs.Requests;
using Application.Features.Marketplace.Customers.DTOs.Responses;
using Domain.Enums.Marketplace;
using MediatR;

namespace Application.Features.Marketplace.Customers.Commands;

public class CreateCustomerCommand : IRequest<Result<CustomerResponse>>
{
    public Guid AdminId { get; set; }
    public CreateCustomerRequest Request { get; set; } = new();
}

public class UpdateCustomerCommand : IRequest<Result<CustomerResponse>>
{
    public Guid CustomerId { get; set; }
    public Guid AdminId { get; set; }
    public UpdateCustomerRequest Request { get; set; } = new();
}

public class DeleteCustomerCommand : IRequest<Result<bool>>
{
    public Guid CustomerId { get; set; }
    public Guid AdminId { get; set; }
}

public class UpdateCustomerStatusCommand : IRequest<Result<bool>>
{
    public Guid CustomerId { get; set; }
    public Guid AdminId { get; set; }
    public CustomerStatus Status { get; set; }
    public string? Reason { get; set; }
}

public class UpdateCustomerTypeCommand : IRequest<Result<bool>>
{
    public Guid CustomerId { get; set; }
    public Guid AdminId { get; set; }
    public CustomerType Type { get; set; }
}

public class AddLoyaltyPointsCommand : IRequest<Result<bool>>
{
    public Guid CustomerId { get; set; }
    public Guid AdminId { get; set; }
    public int Points { get; set; }
    public string? Reason { get; set; }
    public DateTime? ExpiryDate { get; set; }
}

public class BulkUpdateCustomersCommand : IRequest<Result<int>>
{
    public Guid AdminId { get; set; }
    public BulkUpdateCustomersRequest Request { get; set; } = new();
}

public class DeductLoyaltyPointsCommand : IRequest<Result<bool>>
{
    public Guid CustomerId { get; set; }
    public Guid AdminId { get; set; }
    public int Points { get; set; }
    public string? Reason { get; set; }
}

public class BulkUpdateLoyaltyPointsCommand : IRequest<Result<int>>
{
    public Guid AdminId { get; set; }
    public BulkUpdateLoyaltyPointsRequest Request { get; set; } = new();
}

public class CreateCustomerSegmentCommand : IRequest<Result<CustomerSegmentResponse>>
{
    public Guid AdminId { get; set; }
    public CreateCustomerSegmentRequest Request { get; set; } = new();
}

public class UpdateCustomerSegmentCommand : IRequest<Result<CustomerSegmentResponse>>
{
    public Guid SegmentId { get; set; }
    public Guid AdminId { get; set; }
    public UpdateCustomerSegmentRequest Request { get; set; } = new();
}

public class DeleteCustomerSegmentCommand : IRequest<Result<bool>>
{
    public Guid SegmentId { get; set; }
    public Guid AdminId { get; set; }
}
