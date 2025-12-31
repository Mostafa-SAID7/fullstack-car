using Application.Common.Interfaces.Caching;
using Application.Features.Identity.Profile.DTOs.Responses;
using MediatR;
using System;

namespace Application.Features.Identity.Profile.Queries
{
    public class GetUserProfileWithCacheQuery : IRequest<UserDto>, ICacheableRequest
    {
        public string UserId { get; set; } = string.Empty;

        public string CacheKey => $"user:profile:{UserId}";
        public TimeSpan? Expiration => TimeSpan.FromMinutes(30);
        public string? CacheTag => "user-profile";
    }
}