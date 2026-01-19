using Application.Common.Attributes;
using Application.Features.Community.Groups.Queries;
using Application.Features.Community.Posts.Queries;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Shared.Localization.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Groups
{
    /// <summary>
    /// Discovery and query operations for Groups
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/groups")]
    public class GroupsQueriesController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;

        public GroupsQueriesController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
        }

        [HttpGet("featured")]
        [AllowAnonymous]
        [Cache(Duration = 1800, Tags = new[] { "Groups", "Featured" })]
        [OutputCache(Duration = 1800, Tags = new[] { "Groups", "Featured" })]
        public async Task<IActionResult> GetFeaturedGroups([FromQuery] int pageSize = 6)
        {
            var result = await Mediator.Send(new GetFeaturedGroupsQuery { PageSize = pageSize });
            if (result.Succeeded)
                return Success(result.Data, "Featured groups retrieved successfully");

            return BadRequest("Failed to retrieve featured groups", result.Errors);
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [Cache(Duration = 600, Tags = new[] { "Groups", "Trending" }, VaryByParameters = new[] { "pageSize", "timeframe" })]
        [OutputCache(Duration = 600, Tags = new[] { "Groups", "Trending" })]
        public async Task<IActionResult> GetTrendingGroups(
            [FromQuery] int pageSize = 10,
            [FromQuery] string timeframe = "week")
        {
            var result = await Mediator.Send(new GetTrendingGroupsQuery { PageSize = pageSize, Timeframe = timeframe });
            if (result.Succeeded)
                return Success(result.Data, "Trending groups retrieved successfully");

            return BadRequest("Failed to retrieve trending groups", result.Errors);
        }

        [HttpGet("popular")]
        [AllowAnonymous]
        [Cache(Duration = 900, Tags = new[] { "Groups", "Popular" })]
        [OutputCache(Duration = 900, Tags = new[] { "Groups", "Popular" })]
        public async Task<IActionResult> GetPopularGroups([FromQuery] int pageSize = 10)
        {
            var result = await Mediator.Send(new GetPopularGroupsQuery { PageSize = pageSize });
            if (result.Succeeded)
                return Success(result.Data, "Popular groups retrieved successfully");

            return BadRequest("Failed to retrieve popular groups", result.Errors);
        }

        [HttpGet("categories")]
        [AllowAnonymous]
        [Cache(Duration = 3600, Tags = new[] { "Groups", "Categories" })]
        [OutputCache(Duration = 3600, Tags = new[] { "Groups", "Categories" })]
        public async Task<IActionResult> GetGroupCategories()
        {
            var result = await Mediator.Send(new GetGroupCategoriesQuery());
            if (result.Succeeded)
                return Success(result.Data, "Group categories retrieved successfully");

            return BadRequest("Failed to retrieve group categories", result.Errors);
        }

        [HttpGet("{id}/members")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Groups", "Members" }, VaryByParameters = new[] { "page", "pageSize", "role" })]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Members" })]
        public async Task<IActionResult> GetGroupMembers(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? role = null,
            [FromQuery] string? searchTerm = null)
        {
            var result = await Mediator.Send(new GetGroupMembersQuery 
            { 
                GroupId = id, 
                PageNumber = page, 
                PageSize = pageSize, 
                Role = role, 
                SearchTerm = searchTerm 
            });

            if (result.Succeeded)
                return Success(result.Data, "Group members retrieved successfully");

            return BadRequest("Failed to retrieve group members", result.Errors);
        }

        [HttpGet("{id}/posts")]
        [AllowAnonymous]
        [Cache(Duration = 180, Tags = new[] { "Groups", "Posts" }, VaryByParameters = new[] { "page", "pageSize", "sortBy" })]
        [OutputCache(Duration = 180, Tags = new[] { "Groups", "Posts" })]
        public async Task<IActionResult> GetGroupPosts(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "CreatedAt",
            [FromQuery] bool sortDescending = true)
        {
            var result = await Mediator.Send(new GetPostsQuery
            {
                GroupId = id,
                PageNumber = page,
                PageSize = pageSize,
                SortBy = sortBy,
                SortDescending = sortDescending
            });

            if (result.Succeeded)
                return Success(result.Data, "Group posts retrieved successfully");

            return BadRequest("Failed to retrieve group posts", result.Errors);
        }

        [HttpGet("{id}/events")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Groups", "Events" }, VaryByParameters = new[] { "page", "pageSize", "upcomingOnly" })]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Events" })]
        public async Task<IActionResult> GetGroupEvents(
            Guid id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? upcomingOnly = true)
        {
            var result = await Mediator.Send(new GetGroupEventsQuery
            {
                GroupId = id,
                PageNumber = page,
                PageSize = pageSize,
                UpcomingOnly = upcomingOnly
            });

            if (result.Succeeded)
                return Success(result.Data, "Group events retrieved successfully");

            return BadRequest("Failed to retrieve group events", result.Errors);
        }

        [HttpGet("my")]
        [Cache(Duration = 60, Tags = new[] { "Groups", "MyGroups" }, VaryByParameters = new[] { "page", "pageSize", "role" })]
        [OutputCache(Duration = 60, Tags = new[] { "Groups", "MyGroups" })]
        public async Task<IActionResult> GetMyGroups(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? role = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new GetUserGroupsQuery
            {
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize,
                Role = role
            });

            if (result.Succeeded)
                return Success(result.Data, "My groups retrieved successfully");

            return BadRequest("Failed to retrieve my groups", result.Errors);
        }

        [HttpGet("my/owned")]
        [Cache(Duration = 60, Tags = new[] { "Groups", "OwnedGroups" })]
        [OutputCache(Duration = 60, Tags = new[] { "Groups", "OwnedGroups" })]
        public async Task<IActionResult> GetMyOwnedGroups(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new GetUserOwnedGroupsQuery
            {
                UserId = userGuid,
                PageNumber = page,
                PageSize = pageSize
            });

            if (result.Succeeded)
                return Success(result.Data, "Owned groups retrieved successfully");

            return BadRequest("Failed to retrieve owned groups", result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [Cache(Duration = 180, Tags = new[] { "Groups", "Search" }, VaryByParameters = new[] { "query", "page", "pageSize", "category" })]
        [OutputCache(Duration = 180, Tags = new[] { "Groups", "Search" })]
        public async Task<IActionResult> SearchGroups(
            [FromQuery] string query,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] bool? isPublic = null)
        {
            var result = await Mediator.Send(new SearchGroupsQuery
            {
                SearchTerm = query,
                PageNumber = page,
                PageSize = pageSize,
                Category = category,
                IsPublic = isPublic
            });

            if (result.Succeeded)
                return Success(result.Data, "Group search completed successfully");

            return BadRequest("Failed to search groups", result.Errors);
        }

        [HttpGet("recommendations")]
        [Cache(Duration = 1800, Tags = new[] { "Groups", "Recommendations" })]
        [OutputCache(Duration = 1800, Tags = new[] { "Groups", "Recommendations" })]
        public async Task<IActionResult> GetGroupRecommendations([FromQuery] int pageSize = 10)
        {
            var userId = _currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userGuid)
                ? userGuid : Guid.Empty;

            var result = await Mediator.Send(new GetGroupRecommendationsQuery
            {
                UserId = userId,
                Count = pageSize
            });

            if (result.Succeeded)
                return Success(result.Data, "Group recommendations retrieved successfully");

            return BadRequest("Failed to retrieve group recommendations", result.Errors);
        }
    }
}
