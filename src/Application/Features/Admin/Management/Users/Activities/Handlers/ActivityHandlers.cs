using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Admin.Management.Users.Activities.Models;
using Application.Features.Admin.Management.Users.Activities.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Admin.Management.Users.Activities.Handlers
{
    public class GetUserActivityHandler : IRequestHandler<GetUserActivityQuery, Result<List<UserActivity>>>
    {
        private readonly IApplicationDbContext _context;

        public GetUserActivityHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<List<UserActivity>>> Handle(GetUserActivityQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // TODO: Implement actual user activity tracking
                // For now, return mock data based on user posts, comments, etc.
                
                var activities = new List<UserActivity>();

                // Get user posts as activities
                var posts = await _context.Posts
                    .Where(p => p.UserId == request.UserId)
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(50)
                    .ToListAsync(cancellationToken);

                foreach (var post in posts)
                {
                    activities.Add(new UserActivity
                    {
                        Id = Guid.NewGuid(),
                        UserId = request.UserId,
                        ActivityType = "Post Created",
                        Description = $"Created post: {post.Title}",
                        Timestamp = post.CreatedAt,
                        Metadata = new Dictionary<string, object>
                        {
                            { "postId", post.Id },
                            { "postTitle", post.Title }
                        }
                    });
                }

                // Get user comments as activities
                var comments = await _context.Comments
                    .Where(c => c.UserId == request.UserId)
                    .OrderByDescending(c => c.CreatedAt)
                    .Take(50)
                    .ToListAsync(cancellationToken);

                foreach (var comment in comments)
                {
                    activities.Add(new UserActivity
                    {
                        Id = Guid.NewGuid(),
                        UserId = request.UserId,
                        ActivityType = "Comment Posted",
                        Description = $"Posted comment: {comment.Content.Substring(0, Math.Min(50, comment.Content.Length))}...",
                        Timestamp = comment.CreatedAt,
                        Metadata = new Dictionary<string, object>
                        {
                            { "commentId", comment.Id },
                            { "postId", comment.PostId }
                        }
                    });
                }

                // Apply filters
                if (!string.IsNullOrEmpty(request.ActivityType))
                {
                    activities = activities.Where(a => a.ActivityType.Contains(request.ActivityType, StringComparison.OrdinalIgnoreCase)).ToList();
                }

                if (request.FromDate.HasValue)
                {
                    activities = activities.Where(a => a.Timestamp >= request.FromDate.Value).ToList();
                }

                if (request.ToDate.HasValue)
                {
                    activities = activities.Where(a => a.Timestamp <= request.ToDate.Value).ToList();
                }

                // Sort by timestamp descending
                activities = activities.OrderByDescending(a => a.Timestamp).ToList();

                // Apply pagination
                var paginatedActivities = activities
                    .Skip((request.Page - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                return Result<List<UserActivity>>.Success(paginatedActivities);
            }
            catch (Exception ex)
            {
                return Result<List<UserActivity>>.Failure($"Error retrieving user activities: {ex.Message}");
            }
        }
    }
}
