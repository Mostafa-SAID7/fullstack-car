using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Commands;

public class UnlinkLocationCommand : IRequest<Result<Guid>>
{
    public Guid LocationId { get; set; }
}

public class UnlinkLocationCommandHandler : IRequestHandler<UnlinkLocationCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    public UnlinkLocationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(UnlinkLocationCommand request, CancellationToken cancellationToken)
    {
        var location = await _context.Locations
            .FirstOrDefaultAsync(l => l.Id == request.LocationId, cancellationToken);

        if (location == null)
        {
            return Result<Guid>.Failure("Location not found");
        }

        location.TargetContentType = null;
        location.TargetId = null;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(location.Id);
    }
}
