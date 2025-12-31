using Application.Common.Interfaces.Caching;
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

        public string[] CacheTags => new[] { "posts", "community-feed", "user-posts" };
    }
}