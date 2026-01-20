using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Commands;

public class UnlinkGroupCommand : IRequest<Result<Guid>>
{
    public Guid GroupId { get; set; }
}

public class UnlinkGroupCommandHandler : IRequestHandler<UnlinkGroupCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    public UnlinkGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(UnlinkGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await _context.Groups
            .FirstOrDefaultAsync(g => g.Id == request.GroupId, cancellationToken);

        if (group == null)
        {
            return Result<Guid>.Failure("Group not found");
        }

        group.TargetContentType = null;
        group.TargetId = null;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(group.Id);
    }
}
