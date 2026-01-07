using Application.Common.Models;
using Application.Features.Marketplace.Integration.DTOs.Requests;
using MediatR;

namespace Application.Features.Marketplace.Integration.Commands;

public class SyncCustomerDataCommand : IRequest<Result<object>>
{
    public Guid AdminId { get; set; }
    public SyncCustomerDataRequest Request { get; set; } = null!;
}