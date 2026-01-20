using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Likes.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Likes.Handlers;

public class UnlikeCommandHandler : IRequestHandler<UnlikeCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public UnlikeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(UnlikeCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // For now, just return success since we don't have the Likes DbSet yet
            // This will be implemented when the database schema is updated
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to unlike content: {ex.Message}");
        }
    }
}