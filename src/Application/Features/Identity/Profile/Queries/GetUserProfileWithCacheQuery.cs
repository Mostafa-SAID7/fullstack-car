using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Features.Identity.Profile.DTOs.Responses;
using MediatR;
using System;

namespace Application.Features.Identity.Profile.Queries
{
    public class GetUserProfileWithCacheQuery : IRequest<UserDto>, ICacheableRequest
    {
        public string UserId { get; set; } = string.Empty;

        public string CacheKey => $"user:profile:{UserId}";
        public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(30);
        public string[]? CacheTags => new[] { "user-profile" };
    }
}
