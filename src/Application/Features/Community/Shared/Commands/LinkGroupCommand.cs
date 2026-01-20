using Application.Common.Interfaces;
using Application.Common.Models;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Shared.Commands;

public class LinkGroupCommand : IRequest<Result<Guid>>
{
    public Guid GroupId { get; set; }
    public ContentType TargetContentType { get; set; }
    public Guid TargetId { get; set; }
}

public class LinkGroupCommandHandler : IRequestHandler<LinkGroupCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;

    public LinkGroupCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<Guid>> Handle(LinkGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await _context.Groups
            .FirstOrDefaultAsync(g => g.Id == request.GroupId, cancellationToken);

        if (group == null)
        {
            return Result<Guid>.Failure("Group not found");
        }

        group.TargetContentType = request.TargetContentType;
        group.TargetId = request.TargetId;

        await _context.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(group.Id);
    }
}
