using Application.Features.Shared.Interfaces.Caching;
using Application.Common.Models;
using Domain.Entities.Community.Posts;
using MediatR;
using System;

namespace Application.Features.Community.Posts.Queries
{
    public class GetPostsWithCacheQuery : IRequest<PaginatedList<Post>>, ICacheableRequest
    {
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 10;
        public string? Filter { get; set; }
        public string? Sort { get; set; }

        public string CacheKey => $"posts:list:page:{Page}:size:{Size}:filter:{Filter ?? "none"}:sort:{Sort ?? "none"}";
        public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
        public string? CacheTag => "posts";
    }
}