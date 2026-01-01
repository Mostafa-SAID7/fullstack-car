using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Common.Models;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class CreatePostWithCacheInvalidationCommand : IRequest<Result<Guid>>, ICacheInvalidatorRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Guid? GroupId { get; set; }
        public string[] Tags { get; set; } = Array.Empty<string>();

        public string[]? CacheKeysToInvalidate => null;
        public string[]? CacheTagsToInvalidate => new[] { "posts", "community-feed", "user-posts" };
    }
}