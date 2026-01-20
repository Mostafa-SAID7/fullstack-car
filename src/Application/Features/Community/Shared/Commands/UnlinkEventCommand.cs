using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Commands;

public class UnlinkEventCommand : IRequest<Result<Guid>>
{
    public Guid EventId { get; set; }
}

public class UnlinkEventCommandHandler : IRequestHandler<UnlinkEventCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    public UnlinkEventCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(UnlinkEventCommand request, CancellationToken cancellationToken)
    {
        var @event = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == request.EventId, cancellationToken);

        if (@event == null)
        {
            return Result<Guid>.Failure("Event not found");
        }

        @event.TargetContentType = null;
        @event.TargetId = null;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(@event.Id);
    }
}
