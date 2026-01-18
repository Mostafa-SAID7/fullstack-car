using Application.Features.Community.Feed.DTOs;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;

namespace WebAPI.Controllers.Community.Feed
{

    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/feed")]
    public class FeedController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public FeedController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [OutputCache(Duration = 60, Tags = new[] { "Feed" })] // 1 minute cache
        public async Task<IActionResult> GetUserFeed(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] string? feedType = "all", // all, posts, stories, activities
            [FromQuery] string? sortBy = "recent") // recent, popular, trending
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                // Mock feed data
                var feedItems = new List<object>
                {
                    new {
                        Id = Guid.NewGuid(),
                        Type = "post",
                        Content = new {
                            Id = Guid.NewGuid(),
                            Title = "Latest Car Maintenance Tips",
                            Content = "Here are some essential car maintenance tips...",
                            Author = new { Id = Guid.NewGuid(), Name = "John Doe", Avatar = "/avatars/john.jpg" },
                            CreatedAt = DateTime.UtcNow.AddHours(-2),
                            Likes = 45,
                            Comments = 12,
                            Shares = 8,
                            Images = new[] { "/images/car-maintenance.jpg" },
                            Tags = new[] { "maintenance", "tips", "automotive" }
                        }
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Type = "story",
                        Content = new {
                            Id = Guid.NewGuid(),
                            Author = new { Id = Guid.NewGuid(), Name = "Jane Smith", Avatar = "/avatars/jane.jpg" },
                            MediaUrl = "/stories/story-video.mp4",
                            MediaType = "video",
                            Duration = 15,
                            CreatedAt = DateTime.UtcNow.AddMinutes(-30),
                            Views = 234,
                            IsViewed = false
                        }
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Type = "activity",
                        Content = new {
                            Id = Guid.NewGuid(),
                            ActivityType = "group_join",
                            Actor = new { Id = Guid.NewGuid(), Name = "Mike Johnson", Avatar = "/avatars/mike.jpg" },
                            Target = new { Id = Guid.NewGuid(), Name = "Car Enthusiasts Group", Type = "group" },
                            CreatedAt = DateTime.UtcNow.AddHours(-1),
                            Message = "joined the group"
                        }
                    }
                };

                // Apply filters
                if (!string.IsNullOrEmpty(feedType) && feedType != "all")
                {
                    feedItems = feedItems.Where(item => ((dynamic)item).Type == feedType).ToList();
                }

                // Apply pagination
                var paginatedItems = feedItems
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new
                {
                    Items = paginatedItems,
                    TotalCount = feedItems.Count,
                    Page = page,
                    PageSize = pageSize,
                    HasNextPage = feedItems.Count > page * pageSize
                };

                return Success(result, "Feed retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve feed" });
            }
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Feed", "Trending" })] // 5 minutes cache
        public async Task<IActionResult> GetTrendingContent(
            [FromQuery] string timeframe = "day", // hour, day, week, month
            [FromQuery] string contentType = "all", // all, posts, stories, questions
            [FromQuery] int maxResults = 20)
        {
            try
            {
                var trendingContent = new List<object>
                {
                    new {
                        Id = Guid.NewGuid(),
                        Type = "post",
                        Title = "Electric Vehicle Charging Station Guide",
                        Author = new { Id = Guid.NewGuid(), Name = "EV Expert", Avatar = "/avatars/ev-expert.jpg" },
                        TrendingScore = 95.8,
                        Engagement = new { Likes = 156, Comments = 43, Shares = 28, Views = 2340 },
                        CreatedAt = DateTime.UtcNow.AddHours(-6),
                        Tags = new[] { "electric-vehicles", "charging", "guide" }
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Type = "question",
                        Title = "Best brake pads for winter driving?",
                        Author = new { Id = Guid.NewGuid(), Name = "Winter Driver", Avatar = "/avatars/winter-driver.jpg" },
                        TrendingScore = 87.3,
                        Engagement = new { Likes = 89, Comments = 67, Shares = 15, Views = 1890 },
                        CreatedAt = DateTime.UtcNow.AddHours(-4),
                        Tags = new[] { "brakes", "winter", "safety" }
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Type = "story",
                        Author = new { Id = Guid.NewGuid(), Name = "Car Photographer", Avatar = "/avatars/photographer.jpg" },
                        TrendingScore = 82.1,
                        Engagement = new { Views = 3450, Likes = 234, Shares = 45 },
                        CreatedAt = DateTime.UtcNow.AddHours(-2),
                        MediaType = "image",
                        Tags = new[] { "photography", "cars", "showcase" }
                    }
                };

                // Apply filters
                if (contentType != "all")
                {
                    trendingContent = trendingContent.Where(item => ((dynamic)item).Type == contentType).ToList();
                }

                var results = trendingContent
                    .OrderByDescending(item => ((dynamic)item).TrendingScore)
                    .Take(maxResults)
                    .ToList();

                return Success(results, "Trending content retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve trending content" });
            }
        }

        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Feed", "UserFeed" })] // 3 minutes cache
        public async Task<IActionResult> GetUserFeed(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string contentType = "all") // all, posts, stories
        {
            try
            {
                var userFeedItems = new List<object>
                {
                    new {
                        Id = Guid.NewGuid(),
                        Type = "post",
                        Title = "My Car Restoration Project",
                        Content = "Just finished restoring my 1967 Mustang...",
                        CreatedAt = DateTime.UtcNow.AddDays(-1),
                        Likes = 78,
                        Comments = 23,
                        Images = new[] { "/images/mustang-restoration.jpg" },
                        IsPublic = true
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Type = "story",
                        MediaUrl = "/stories/garage-tour.mp4",
                        MediaType = "video",
                        CreatedAt = DateTime.UtcNow.AddHours(-8),
                        Views = 456,
                        IsPublic = true
                    }
                };

                // Apply filters
                if (contentType != "all")
                {
                    userFeedItems = userFeedItems.Where(item => ((dynamic)item).Type == contentType).ToList();
                }

                var paginatedItems = userFeedItems
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new
                {
                    UserId = userId,
                    Items = paginatedItems,
                    TotalCount = userFeedItems.Count,
                    Page = page,
                    PageSize = pageSize
                };

                return Success(result, "User feed retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve user feed" });
            }
        }

        [HttpGet("group/{groupId}")]
        [Authorize]
        [OutputCache(Duration = 120, Tags = new[] { "Feed", "GroupFeed" })] // 2 minutes cache
        public async Task<IActionResult> GetGroupFeed(
            Guid groupId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string sortBy = "recent") // recent, popular, pinned
        {
            try
            {
                var groupFeedItems = new List<object>
                {
                    new {
                        Id = Guid.NewGuid(),
                        Type = "post",
                        Title = "Group Meetup This Weekend",
                        Content = "Don't forget about our car show meetup this Saturday...",
                        Author = new { Id = Guid.NewGuid(), Name = "Group Admin", Role = "admin" },
                        CreatedAt = DateTime.UtcNow.AddHours(-3),
                        IsPinned = true,
                        Likes = 34,
                        Comments = 18
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Type = "post",
                        Title = "New Member Introduction",
                        Content = "Hi everyone! Just joined the group and excited to share...",
                        Author = new { Id = Guid.NewGuid(), Name = "New Member", Role = "member" },
                        CreatedAt = DateTime.UtcNow.AddHours(-5),
                        IsPinned = false,
                        Likes = 12,
                        Comments = 8
                    }
                };

                // Apply sorting
                groupFeedItems = sortBy switch
                {
                    "popular" => groupFeedItems.OrderByDescending(item => ((dynamic)item).Likes).ToList(),
                    "pinned" => groupFeedItems.OrderByDescending(item => ((dynamic)item).IsPinned)
                                             .ThenByDescending(item => ((dynamic)item).CreatedAt).ToList(),
                    _ => groupFeedItems.OrderByDescending(item => ((dynamic)item).CreatedAt).ToList()
                };

                var paginatedItems = groupFeedItems
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new
                {
                    GroupId = groupId,
                    Items = paginatedItems,
                    TotalCount = groupFeedItems.Count,
                    Page = page,
                    PageSize = pageSize
                };

                return Success(result, "Group feed retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve group feed" });
            }
        }

        [HttpPost("{feedItemId}/read")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead(Guid feedItemId)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new
                {
                    FeedItemId = feedItemId,
                    UserId = userId,
                    ReadAt = DateTime.UtcNow,
                    Status = "read"
                };

                return Success(result, "Feed item marked as read");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to mark item as read" });
            }
        }

        [HttpPost("{feedItemId}/hide")]
        [Authorize]
        public async Task<IActionResult> HideFeedItem(Guid feedItemId, [FromBody] HideFeedItemRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new
                {
                    FeedItemId = feedItemId,
                    UserId = userId,
                    HiddenAt = DateTime.UtcNow,
                    Reason = request.Reason,
                    Status = "hidden"
                };

                return Success(result, "Feed item hidden successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to hide feed item" });
            }
        }

        [HttpPost("{feedItemId}/report")]
        [Authorize]
        public async Task<IActionResult> ReportFeedItem(Guid feedItemId, [FromBody] ReportFeedItemRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new
                {
                    FeedItemId = feedItemId,
                    ReporterId = userId,
                    Reason = request.Reason,
                    Description = request.Description,
                    ReportedAt = DateTime.UtcNow,
                    Status = "pending_review"
                };

                return Success(result, "Feed item reported successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to report feed item" });
            }
        }

        [HttpGet("analytics")]
        [Authorize]
        [OutputCache(Duration = 600, Tags = new[] { "Feed", "Analytics" })] // 10 minutes cache
        public async Task<IActionResult> GetFeedAnalytics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var analytics = new
                {
                    UserId = userId,
                    Period = new
                    {
                        From = fromDate ?? DateTime.UtcNow.AddDays(-30),
                        To = toDate ?? DateTime.UtcNow
                    },
                    Metrics = new
                    {
                        TotalPosts = 45,
                        TotalViews = 12340,
                        TotalLikes = 567,
                        TotalComments = 234,
                        TotalShares = 89,
                        EngagementRate = 4.2,
                        TopPerformingPost = new
                        {
                            Id = Guid.NewGuid(),
                            Title = "Ultimate Car Care Guide",
                            Views = 2340,
                            Likes = 156,
                            Comments = 43
                        },
                        AudienceGrowth = 12.5,
                        BestPostingTimes = new[] { "09:00", "13:00", "19:00" }
                    }
                };

                return Success(analytics, "Feed analytics retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve analytics" });
            }
        }
    }
}


