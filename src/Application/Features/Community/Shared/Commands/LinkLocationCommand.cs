using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Commands;

public class LinkLocationCommand : IRequest<Result<Guid>>
{
    public Guid LocationId { get; set; }
    public ContentType TargetContentType { get; set; }
    public Guid TargetId { get; set; }
}

public class LinkLocationCommandHandler : IRequestHandler<LinkLocationCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    public LinkLocationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(LinkLocationCommand request, CancellationToken cancellationToken)
    {
        var location = await _context.Locations
            .FirstOrDefaultAsync(l => l.Id == request.LocationId, cancellationToken);

        if (location == null)
        {
            return Result<Guid>.Failure("Location not found");
        }

        location.TargetContentType = request.TargetContentType;
        location.TargetId = request.TargetId;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(location.Id);
    }
}
