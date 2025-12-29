using Application.Common.Models;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Posts.Queries
{
    public class GetPostStatisticsQuery : IRequest<Result<PostStatisticsDto>>
    {
    }

    public class PostStatisticsDto
    {
        public int TotalPosts { get; set; }
        public int PublishedPosts { get; set; }
        public int PendingPosts { get; set; }
        public int RejectedPosts { get; set; }
        public int DraftPosts { get; set; }
        public int TotalViews { get; set; }
        public int TotalLikes { get; set; }
        public int TotalComments { get; set; }
        public Dictionary<string, int> PostsByType { get; set; } = new();
        public Dictionary<string, int> PostsByMonth { get; set; } = new();
    }

    public class GetPostStatisticsQueryHandler : IRequestHandler<GetPostStatisticsQuery, Result<PostStatisticsDto>>
    {
        private readonly IRepository<Post> _postRepository;

        public GetPostStatisticsQueryHandler(IRepository<Post> postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PostStatisticsDto>> Handle(GetPostStatisticsQuery request, CancellationToken cancellationToken)
        {
            var posts = await _postRepository.GetAllAsync(cancellationToken);

            var statistics = new PostStatisticsDto
            {
                TotalPosts = posts.Count(),
                PublishedPosts = posts.Count(p => p.Status == PostStatus.Published),
                PendingPosts = posts.Count(p => p.Status == PostStatus.Pending),
                RejectedPosts = posts.Count(p => p.Status == PostStatus.Rejected),
                DraftPosts = posts.Count(p => p.Status == PostStatus.Draft),
                TotalViews = posts.Sum(p => p.ViewsCount),
                TotalLikes = posts.Sum(p => p.LikesCount),
                TotalComments = posts.Sum(p => p.CommentsCount)
            };

            // Posts by type
            statistics.PostsByType = posts
                .GroupBy(p => p.Type.ToString())
                .ToDictionary(g => g.Key, g => g.Count());

            // Posts by month (last 12 months)
            var twelveMonthsAgo = DateTime.UtcNow.AddMonths(-12);
            statistics.PostsByMonth = posts
                .Where(p => p.CreatedAt >= twelveMonthsAgo)
                .GroupBy(p => p.CreatedAt.ToString("yyyy-MM"))
                .ToDictionary(g => g.Key, g => g.Count());

            return Result<PostStatisticsDto>.Success(statistics);
        }
    }
}