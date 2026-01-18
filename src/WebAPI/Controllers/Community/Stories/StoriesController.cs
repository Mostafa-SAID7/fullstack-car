using Application.Features.Community.Stories.DTOs;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;

namespace WebAPI.Controllers.Community.Stories
{

    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/stories")]
    public class StoriesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public StoriesController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [OutputCache(Duration = 60, Tags = new[] { "Stories" })] // 1 minute cache
        public async Task<IActionResult> GetStories(
            [FromQuery] string? storyType = "all", // all, user, group, highlight
            [FromQuery] bool includeViewed = true)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var stories = new List<object>
                {
                    new {
                        Id = Guid.NewGuid(),
                        Type = "user",
                        Author = new {
                            Id = Guid.NewGuid(),
                            Name = "John Doe",
                            Username = "johndoe",
                            Avatar = "/avatars/john.jpg",
                            IsVerified = false
                        },
                        MediaUrl = "/stories/story1.jpg",
                        MediaType = "image",
                        ThumbnailUrl = "/stories/thumbs/story1_thumb.jpg",
                        Caption = "Just finished detailing my car! ✨",
                        Duration = 5, // seconds for image, actual duration for video
                        CreatedAt = DateTime.UtcNow.AddMinutes(-30),
                        ExpiresAt = DateTime.UtcNow.AddHours(23.5), // 24 hours from creation
                        Views = 45,
                        IsViewed = false,
                        ViewedAt = (DateTime?)null,
                        Tags = new[] { "detailing", "carcare" },
                        Location = new {
                            Name = "Downtown Garage",
                            Latitude = 40.7128,
                            Longitude = -74.0060
                        }
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Type = "group",
                        Author = new {
                            Id = Guid.NewGuid(),
                            Name = "Car Enthusiasts Group",
                            Username = "car_enthusiasts",
                            Avatar = "/avatars/group.jpg",
                            IsVerified = true
                        },
                        MediaUrl = "/stories/story2.mp4",
                        MediaType = "video",
                        ThumbnailUrl = "/stories/thumbs/story2_thumb.jpg",
                        Caption = "Live from the car show! 🚗",
                        Duration = 15,
                        CreatedAt = DateTime.UtcNow.AddHours(-2),
                        ExpiresAt = DateTime.UtcNow.AddHours(22),
                        Views = 234,
                        IsViewed = true,
                        ViewedAt = DateTime.UtcNow.AddHours(-1),
                        Tags = new[] { "carshow", "live", "event" },
                        Location = new {
                            Name = "Auto Expo Center",
                            Latitude = 40.7589,
                            Longitude = -73.9851
                        }
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Type = "highlight",
                        Author = new {
                            Id = Guid.NewGuid(),
                            Name = "Mechanic Mike",
                            Username = "mechanic_mike",
                            Avatar = "/avatars/mike.jpg",
                            IsVerified = true
                        },
                        MediaUrl = "/stories/highlight1.jpg",
                        MediaType = "image",
                        ThumbnailUrl = "/stories/thumbs/highlight1_thumb.jpg",
                        Caption = "Engine repair tips series",
                        Duration = 0, // Highlights don't expire
                        CreatedAt = DateTime.UtcNow.AddDays(-5),
                        ExpiresAt = (DateTime?)null, // Highlights are permanent
                        Views = 1250,
                        IsViewed = false,
                        ViewedAt = (DateTime?)null,
                        Tags = new[] { "repair", "engine", "tips" },
                        HighlightInfo = new {
                            Title = "Engine Repair Series",
                            CoverImage = "/highlights/engine_repair_cover.jpg",
                            StoryCount = 8
                        }
                    }
                };

                // Apply filters
                if (!string.IsNullOrEmpty(storyType) && storyType != "all")
                {
                    stories = stories.Where(s => ((dynamic)s).Type == storyType).ToList();
                }

                if (!includeViewed)
                {
                    stories = stories.Where(s => !((dynamic)s).IsViewed).ToList();
                }

                // Group stories by author for better UI presentation
                var groupedStories = stories
                    .GroupBy(s => ((dynamic)s).Author.Id)
                    .Select(g => new {
                        Author = ((dynamic)g.First()).Author,
                        Stories = g.OrderByDescending(s => ((dynamic)s).CreatedAt).ToList(),
                        HasUnviewed = g.Any(s => !((dynamic)s).IsViewed),
                        LastStoryTime = g.Max(s => ((dynamic)s).CreatedAt)
                    })
                    .OrderByDescending(g => g.HasUnviewed)
                    .ThenByDescending(g => g.LastStoryTime)
                    .ToList();

                return Success(groupedStories, "Stories retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve stories" });
            }
        }

        [HttpGet("{storyId}")]
        [OutputCache(Duration = 300, Tags = new[] { "Stories" })] // 5 minutes cache
        public async Task<IActionResult> GetStory(Guid storyId)
        {
            try
            {
                var story = new
                {
                    Id = storyId,
                    Type = "user",
                    Author = new {
                        Id = Guid.NewGuid(),
                        Name = "John Doe",
                        Username = "johndoe",
                        Avatar = "/avatars/john.jpg",
                        IsVerified = false,
                        FollowersCount = 1250
                    },
                    MediaUrl = "/stories/story_detail.jpg",
                    MediaType = "image",
                    Caption = "Beautiful sunset drive in my classic car 🌅",
                    Duration = 5,
                    CreatedAt = DateTime.UtcNow.AddMinutes(-45),
                    ExpiresAt = DateTime.UtcNow.AddHours(23.25),
                    Views = 67,
                    Likes = 23,
                    IsViewed = false,
                    Tags = new[] { "sunset", "classic", "drive" },
                    Location = new {
                        Name = "Pacific Coast Highway",
                        Latitude = 34.0522,
                        Longitude = -118.2437
                    },
                    Viewers = new[] {
                        new { Id = Guid.NewGuid(), Name = "Alice", Avatar = "/avatars/alice.jpg", ViewedAt = DateTime.UtcNow.AddMinutes(-20) },
                        new { Id = Guid.NewGuid(), Name = "Bob", Avatar = "/avatars/bob.jpg", ViewedAt = DateTime.UtcNow.AddMinutes(-15) }
                    }
                };

                return Success(story, "Story retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Story not found" });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateStory([FromBody] CreateStoryRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated");
                }

                var story = new
                {
                    Id = Guid.NewGuid(),
                    AuthorId = userId,
                    MediaUrl = request.MediaUrl,
                    MediaType = request.MediaType,
                    ThumbnailUrl = request.ThumbnailUrl,
                    Caption = request.Caption,
                    Duration = request.Duration,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddHours(24),
                    Views = 0,
                    Likes = 0,
                    Tags = request.Tags,
                    Location = request.Location,
                    Privacy = request.Privacy ?? "public", // public, friends, private
                    Status = "active"
                };

                return Success(story, "Story created successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to create story" });
            }
        }

        [HttpDelete("{storyId}")]
        [Authorize]
        public async Task<IActionResult> DeleteStory(Guid storyId)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new
                {
                    StoryId = storyId,
                    DeletedBy = userId,
                    DeletedAt = DateTime.UtcNow,
                    Status = "deleted"
                };

                return Success(result, "Story deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to delete story" });
            }
        }

        [HttpPost("{storyId}/view")]
        [Authorize]
        public async Task<IActionResult> ViewStory(Guid storyId)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new
                {
                    StoryId = storyId,
                    ViewerId = userId,
                    ViewedAt = DateTime.UtcNow,
                    Status = "viewed"
                };

                return Success(result, "Story marked as viewed");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to mark story as viewed" });
            }
        }

        [HttpPost("{storyId}/like")]
        [Authorize]
        public async Task<IActionResult> LikeStory(Guid storyId)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new
                {
                    StoryId = storyId,
                    UserId = userId,
                    LikedAt = DateTime.UtcNow,
                    Status = "liked"
                };

                return Success(result, "Story liked successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to like story" });
            }
        }

        [HttpDelete("{storyId}/like")]
        [Authorize]
        public async Task<IActionResult> UnlikeStory(Guid storyId)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new
                {
                    StoryId = storyId,
                    UserId = userId,
                    UnlikedAt = DateTime.UtcNow,
                    Status = "unliked"
                };

                return Success(result, "Story unliked successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to unlike story" });
            }
        }

        [HttpGet("{storyId}/viewers")]
        [Authorize]
        [OutputCache(Duration = 60, Tags = new[] { "Stories", "Viewers" })]
        public async Task<IActionResult> GetStoryViewers(Guid storyId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            try
            {
                var viewers = new List<object>
                {
                    new {
                        Id = Guid.NewGuid(),
                        Name = "Alice Johnson",
                        Username = "alice_j",
                        Avatar = "/avatars/alice.jpg",
                        ViewedAt = DateTime.UtcNow.AddMinutes(-20),
                        IsFollowing = true
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Name = "Bob Smith",
                        Username = "bob_smith",
                        Avatar = "/avatars/bob.jpg",
                        ViewedAt = DateTime.UtcNow.AddMinutes(-15),
                        IsFollowing = false
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Name = "Carol Davis",
                        Username = "carol_d",
                        Avatar = "/avatars/carol.jpg",
                        ViewedAt = DateTime.UtcNow.AddMinutes(-10),
                        IsFollowing = true
                    }
                };

                var paginatedViewers = viewers
                    .OrderByDescending(v => ((dynamic)v).ViewedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new
                {
                    StoryId = storyId,
                    Viewers = paginatedViewers,
                    TotalViewers = viewers.Count,
                    Page = page,
                    PageSize = pageSize
                };

                return Success(result, "Story viewers retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve story viewers" });
            }
        }

        [HttpPost("highlights")]
        [Authorize]
        public async Task<IActionResult> CreateHighlight([FromBody] CreateHighlightRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var highlight = new
                {
                    Id = Guid.NewGuid(),
                    AuthorId = userId,
                    Title = request.Title,
                    CoverImage = request.CoverImage,
                    StoryIds = request.StoryIds,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsPublic = request.IsPublic,
                    Status = "active"
                };

                return Success(highlight, "Highlight created successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to create highlight" });
            }
        }

        [HttpGet("highlights")]
        [Authorize]
        [OutputCache(Duration = 300, Tags = new[] { "Stories", "Highlights" })]
        public async Task<IActionResult> GetHighlights([FromQuery] Guid? userId = null)
        {
            try
            {
                var targetUserId = userId ?? Guid.Parse(_currentUserService.UserId ?? Guid.Empty.ToString());
                
                var highlights = new List<object>
                {
                    new {
                        Id = Guid.NewGuid(),
                        Title = "Car Shows 2024",
                        CoverImage = "/highlights/car_shows_cover.jpg",
                        StoryCount = 12,
                        CreatedAt = DateTime.UtcNow.AddMonths(-2),
                        UpdatedAt = DateTime.UtcNow.AddDays(-5),
                        IsPublic = true
                    },
                    new {
                        Id = Guid.NewGuid(),
                        Title = "Restoration Project",
                        CoverImage = "/highlights/restoration_cover.jpg",
                        StoryCount = 8,
                        CreatedAt = DateTime.UtcNow.AddMonths(-3),
                        UpdatedAt = DateTime.UtcNow.AddDays(-14),
                        IsPublic = true
                    }
                };

                return Success(highlights, "Highlights retrieved successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to retrieve highlights" });
            }
        }

        [HttpPost("{storyId}/report")]
        [Authorize]
        public async Task<IActionResult> ReportStory(Guid storyId, [FromBody] ReportStoryRequest request)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var result = new
                {
                    StoryId = storyId,
                    ReporterId = userId,
                    Reason = request.Reason,
                    Description = request.Description,
                    ReportedAt = DateTime.UtcNow,
                    Status = "pending_review"
                };

                return Success(result, "Story reported successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred", new[] { "Failed to report story" });
            }
        }
    }
}


