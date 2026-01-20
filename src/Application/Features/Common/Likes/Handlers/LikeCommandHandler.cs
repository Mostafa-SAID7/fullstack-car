using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Likes.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Likes.Handlers;

public class LikeCommandHandler : IRequestHandler<LikeCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public LikeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(LikeCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // For now, just return success since we don't have the Likes DbSet yet
            // This will be implemented when the database schema is updated
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Failed to like content: {ex.Message}");
        }
    }
}