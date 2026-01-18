using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Commands;

public class DeactivateAccountCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public DeactivateAccountRequest Request { get; set; } = default!;
}

public class DeactivateAccountCommandHandler : IRequestHandler<DeactivateAccountCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(DeactivateAccountCommand request, CancellationToken cancellationToken)
    {
        // TODO: Implement account deactivation logic
        await Task.CompletedTask;
        
        return Result<bool>.Success(true);
    }
}