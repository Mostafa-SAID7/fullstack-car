using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Queries;

public class GetPublicProfileQuery : IRequest<Result<PublicProfileDto>>
{
    public Guid UserId { get; set; }
}

public class GetPublicProfileQueryHandler : IRequestHandler<GetPublicProfileQuery, Result<PublicProfileDto>>
{
    public async Task<Result<PublicProfileDto>> Handle(GetPublicProfileQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement public profile retrieval logic
        await Task.CompletedTask;
        
        var profile = new PublicProfileDto
        {
            Id = request.UserId,
            Username = "user",
            FirstName = "John",
            LastName = "Doe",
            Bio = "Sample bio",
            AvatarUrl = null,
            JoinedAt = DateTime.UtcNow,
            PostsCount = 0,
            FollowersCount = 0,
            FollowingCount = 0
        };
        
        return Result<PublicProfileDto>.Success(profile);
    }
}