using Application.Common.Models;
using Application.Features.Identity.Profile.DTOs;
using MediatR;

namespace Application.Features.Identity.Profile.Queries;

public class GetUserProfileQuery : IRequest<Result<UserProfileDto>>
{
    public Guid UserId { get; set; }
}

public class GetUserProfileQueryHandler : IRequestHandler<GetUserProfileQuery, Result<UserProfileDto>>
{
    public async Task<Result<UserProfileDto>> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement profile retrieval logic
        await Task.CompletedTask;
        
        var profile = new UserProfileDto
        {
            Id = request.UserId,
            Username = "user",
            Email = "user@example.com",
            FirstName = "John",
            LastName = "Doe",
            Bio = "Sample bio",
            AvatarUrl = null,
            IsEmailVerified = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        
        return Result<UserProfileDto>.Success(profile);
    }
}