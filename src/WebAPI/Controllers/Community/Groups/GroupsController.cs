
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Community.Groups.Commands;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Queries;
using Application.Features.Community.Posts.Queries;
using Application.Common.DTOs;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Groups
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/groups")]
    public class GroupsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;

        public GroupsController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            INotificationService notificationService)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _notificationService = notificationService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups" })]
        public async Task<IActionResult> GetGroups(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10, 
            [FromQuery] string? category = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true,
            [FromQuery] bool? isPublic = null,
            [FromQuery] bool? isActive = true)
        {
            var query = new GetGroupsQuery 
            { 
                PageNumber = page, 
                PageSize = pageSize,
                Category = category,
                SearchTerm = searchTerm,
                SortBy = sortBy,
                SortDescending = sortDescending,
                IsPublic = isPublic,
                IsActive = isActive
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, await _localizationProvider.GetTranslationAsync("en-US", "Groups.Retrieved"));

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpGet("featured")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Groups", "Featured" })]
        public async Task<IActionResult> GetFeaturedGroups([FromQuery] int pageSize = 6)
        {
            var query = new GetFeaturedGroupsQuery { PageSize = pageSize };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Featured groups retrieved successfully");

            return BadRequest("Failed to retrieve featured groups", result.Errors);
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 600, Tags = new[] { "Groups", "Trending" })]
        public async Task<IActionResult> GetTrendingGroups(
            [FromQuery] int pageSize = 10, 
            [FromQuery] string timeframe = "week")
        {
            var query = new GetTrendingGroupsQuery 
            { 
                PageSize = pageSize, 
                Timeframe = timeframe 
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Trending groups retrieved successfully");

            return BadRequest("Failed to retrieve trending groups", result.Errors);
        }

        [HttpGet("popular")]
        [AllowAnonymous]
        [OutputCache(Duration = 900, Tags = new[] { "Groups", "Popular" })]
        public async Task<IActionResult> GetPopularGroups([FromQuery] int pageSize = 10)
        {
            var query = new GetPopularGroupsQuery { PageSize = pageSize };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Popular groups retrieved successfully");

            return BadRequest("Failed to retrieve popular groups", result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "Groups", "Categories" })]
        public async Task<IActionResult> GetGroupCategories()
        {
            var query = new GetGroupCategoriesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group categories retrieved successfully");

            return BadRequest("Failed to retrieve group categories", result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups" })]
        public async Task<IActionResult> GetGroup(Guid id)
        {
            var userId = _currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userGuid) 
                ? userGuid : (Guid?)null;

            var query = new GetGroupByIdQuery 
            { 
                Id = id,
                UserId = userId // For membership status and permissions
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            return BadRequest("Failed to retrieve group", result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateGroupCommand
            {
                OwnerId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetGroup), new { id = result.Data.Id });
                
                // Send notification
                await _notificationService.NotifyGroupMemberJoinedAsync(
                    result.Data.Id, 
                    userGuid, 
                    _currentUserService.UserName ?? "Unknown User");
                
                return Created(result.Data, location!, await _localizationProvider.GetTranslationAsync("en-US", "Groups.Created"));
            }

            if (result.Errors.Any(e => e.Contains("duplicate name")))
                return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Groups.DuplicateName"), result.Errors);

            if (result.Errors.Any(e => e.Contains("limit exceeded")))
                return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Groups.LimitExceeded"), result.Errors);

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroup(Guid id, [FromBody] UpdateGroupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateGroupCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Group updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to update this group");

            return BadRequest("Failed to update group", result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteGroupCommand
            {
                Id = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Group deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to delete this group");

            if (result.Errors.Any(e => e.Contains("has members")))
                return BadRequest("Cannot delete group with active members", result.Errors);

            return BadRequest("Failed to delete group", result.Errors);
        }

        [HttpPost("{id}/join")]
        public async Task<IActionResult> JoinGroup(Guid id, [FromBody] JoinGroupRequest? request = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new JoinGroupCommand 
            { 
                GroupId = id, 
                UserId = userGuid,
                JoinMessage = request?.Message
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // Send notification
                await _notificationService.NotifyGroupMemberJoinedAsync(
                    id, 
                    userGuid, 
                    _currentUserService.UserName ?? "Unknown User");
                
                return Success(result.Data, await _localizationProvider.GetTranslationAsync("en-US", "Groups.Joined"));
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound(await _localizationProvider.GetTranslationAsync("en-US", "Groups.NotFound"));

            if (result.Errors.Any(e => e.Contains("already member")))
                return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Groups.AlreadyMember"), result.Errors);

            if (result.Errors.Any(e => e.Contains("private group")))
                return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Groups.PrivateGroup"), result.Errors);

            if (result.Errors.Any(e => e.Contains("banned")))
                return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Groups.Banned"), result.Errors);

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpPost("{id}/leave")]
        public async Task<IActionResult> LeaveGroup(Guid id, [FromBody] LeaveGroupRequest? request = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new LeaveGroupCommand 
            { 
                GroupId = id, 
                UserId = userGuid,
                LeaveReason = request?.Reason
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // Send notification
                await _notificationService.NotifyGroupMemberLeftAsync(
                    id, 
                    userGuid, 
                    _currentUserService.UserName ?? "Unknown User");
                
                return Success(await _localizationProvider.GetTranslationAsync("en-US", "Groups.Left"));
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound(await _localizationProvider.GetTranslationAsync("en-US", "Groups.NotFound"));

            if (result.Errors.Any(e => e.Contains("not member")))
                return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Groups.NotMember"), result.Errors);

            if (result.Errors.Any(e => e.Contains("owner cannot leave")))
                return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Groups.OwnerCannotLeave"), result.Errors);

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpPost("{id}/request-join")]
        public async Task<IActionResult> RequestToJoinGroup(Guid id, [FromBody] JoinRequestRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new RequestJoinGroupCommand
            {
                GroupId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Join request submitted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            if (result.Errors.Any(e => e.Contains("already requested")))
                return BadRequest("You have already requested to join this group", result.Errors);

            return BadRequest("Failed to submit join request", result.Errors);
        }

        [HttpGet("{id}/members")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Members" })]
        public async Task<IActionResult> GetGroupMembers(
            Guid id, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] string? role = null,
            [FromQuery] string? searchTerm = null)
        {
            var query = new GetGroupMembersQuery
            {
                GroupId = id,
                PageNumber = page,
                PageSize = pageSize,
                Role = role,
                SearchTerm = searchTerm
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group members retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            return BadRequest("Failed to retrieve group members", result.Errors);
        }

        [HttpGet("{id}/posts")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Groups", "Posts" })]
        public async Task<IActionResult> GetGroupPosts(
            Guid id, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true)
        {
            var query = new GetPostsQuery
            {
                GroupId = id,
                PageNumber = page,
                PageSize = pageSize,
                SortBy = sortBy,
                SortDescending = sortDescending
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group posts retrieved successfully");

            return BadRequest("Failed to retrieve group posts", result.Errors);
        }

        [HttpGet("{id}/events")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Events" })]
        public async Task<IActionResult> GetGroupEvents(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? upcomingOnly = true)
        {
            var query = new GetGroupEventsQuery
            {
                GroupId = id,
                PageNumber = page,
                PageSize = pageSize,
                UpcomingOnly = upcomingOnly
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group events retrieved successfully");

            return BadRequest("Failed to retrieve group events", result.Errors);
        }

        [HttpGet("{id}/analytics")]
        [Authorize(Roles = "Admin,Moderator")]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Analytics" })]
        public async Task<IActionResult> GetGroupAnalytics(
            Guid id,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetGroupAnalyticsQuery
            {
                GroupId = id,
                FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                ToDate = toDate ?? DateTime.UtcNow
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group analytics retrieved successfully");

            return BadRequest("Failed to retrieve group analytics", result.Errors);
        }

        [HttpGet("my")]
        [OutputCache(Duration = 60, Tags = new[] { "Groups", "MyGroups" })]
        public async Task<IActionResult> GetMyGroups(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? role = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserGroupsQuery 
            { 
                UserId = userGuid, 
                PageNumber = page, 
                PageSize = pageSize,
                Role = role
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "My groups retrieved successfully");

            return BadRequest("Failed to retrieve my groups", result.Errors);
        }

        [HttpGet("my/owned")]
        [OutputCache(Duration = 60, Tags = new[] { "Groups", "OwnedGroups" })]
        public async Task<IActionResult> GetMyOwnedGroups(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var query = new GetUserOwnedGroupsQuery
            {
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Owned groups retrieved successfully");

            return BadRequest("Failed to retrieve owned groups", result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 180, Tags = new[] { "Groups", "Search" })]
        public async Task<IActionResult> SearchGroups(
            [FromQuery] string query, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] bool? isPublic = null)
        {
            var searchQuery = new SearchGroupsQuery 
            { 
                SearchTerm = query, 
                PageNumber = page, 
                PageSize = pageSize,
                Category = category,
                IsPublic = isPublic
            };

            var result = await Mediator.Send(searchQuery);

            if (result.Succeeded)
                return Success(result.Data, "Group search completed successfully");

            return BadRequest("Failed to search groups", result.Errors);
        }

        [HttpGet("recommendations")]
        [OutputCache(Duration = 1800, Tags = new[] { "Groups", "Recommendations" })]
        public async Task<IActionResult> GetGroupRecommendations([FromQuery] int pageSize = 10)
        {
            var userId = _currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userGuid) 
                ? userGuid : (Guid?)null;

            var query = new GetGroupRecommendationsQuery
            {
                UserId = userId ?? Guid.Empty,
                Count = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Group recommendations retrieved successfully");

            return BadRequest("Failed to retrieve group recommendations", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "Groups", "Stats" })]
        public async Task<IActionResult> GetGroupsStats()
        {
            var query = new GetGroupsStatsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Groups statistics retrieved successfully");

            return BadRequest("Failed to retrieve groups statistics", result.Errors);
        }

        // Admin/Moderator endpoints
        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut("{id}/moderate")]
        public async Task<IActionResult> ModerateGroup(Guid id, [FromBody] ModerateGroupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ModerateGroupCommand
            {
                GroupId = id,
                ModeratorId = userGuid,
                Action = request.Action,
                Reason = request.Reason
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Group moderated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            return BadRequest("Failed to moderate group", result.Errors);
        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpPost("{id}/feature")]
        public async Task<IActionResult> FeatureGroup(Guid id, [FromBody] FeatureGroupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new FeatureGroupCommand
            {
                GroupId = id,
                FeaturedBy = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Group featured successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            return BadRequest("Failed to feature group", result.Errors);
        }

        [Authorize(Roles = "Admin,Moderator")]
        [HttpDelete("{id}/feature")]
        public async Task<IActionResult> UnfeatureGroup(Guid id)
        {
            var command = new UnfeatureGroupCommand { GroupId = id };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Group unfeatured successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            return BadRequest("Failed to unfeature group", result.Errors);
        }
    }
}


