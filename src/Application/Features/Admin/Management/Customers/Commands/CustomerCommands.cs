using Application.Common.Models;
using Application.Features.Admin.Management.Customers.DTOs.Requests;
using Application.Features.Admin.Management.Customers.DTOs.Responses;
using Domain.Enums.Admin.Management;
using MediatR;

namespace Application.Features.Admin.Management.Customers.Commands;

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
}

public class BulkUpdateCustomersCommand : IRequest<Result<int>>
{
    public List<Guid> CustomerIds { get; set; } = new();
    public Guid AdminId { get; set; }
    public CustomerStatus? Status { get; set; }
    public CustomerType? Type { get; set; }
    public Guid? AssignedSalesRepId { get; set; }
}