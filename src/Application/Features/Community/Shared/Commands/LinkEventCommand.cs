using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Commands;

public class LinkEventCommand : IRequest<Result<Guid>>
{
    public Guid EventId { get; set; }
    public ContentType TargetContentType { get; set; }
    public Guid TargetId { get; set; }
}

public class LinkEventCommandHandler : IRequestHandler<LinkEventCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    public LinkEventCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(LinkEventCommand request, CancellationToken cancellationToken)
    {
        var @event = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == request.EventId, cancellationToken);

        if (@event == null)
        {
            return Result<Guid>.Failure("Event not found");
        }

        @event.TargetContentType = request.TargetContentType;
        @event.TargetId = request.TargetId;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(@event.Id);
    }
}
