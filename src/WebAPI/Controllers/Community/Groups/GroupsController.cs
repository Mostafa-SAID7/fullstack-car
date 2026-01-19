using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Application.Common.Attributes;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Community.Groups.Commands;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Queries;
using Application.Common.DTOs;
using Application.Features.Shared.Localization.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Groups
{
    /// <summary>
    /// Core CRUD operations for Groups (Main App integration)
    /// </summary>
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/groups")]
    public class GroupsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly INotificationService _notificationService;
        private readonly ILogger<GroupsController> _logger;

        public GroupsController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            INotificationService notificationService,
            ILogger<GroupsController> logger)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _notificationService = notificationService;
            _logger = logger;
        }

        [HttpGet]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Groups" }, VaryByParameters = new[] { "page", "pageSize", "category", "searchTerm" })]
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
            var result = await Mediator.Send(new GetGroupsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                Category = category,
                SearchTerm = searchTerm,
                SortBy = sortBy,
                SortDescending = sortDescending,
                IsPublic = isPublic,
                IsActive = isActive
            });

            if (result.Succeeded)
                return Success(result.Data, await _localizationProvider.GetTranslationAsync("en-US", "Groups.Retrieved"));

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [Cache(Duration = 300, Tags = new[] { "Groups" })]
        [OutputCache(Duration = 300, Tags = new[] { "Groups" }, VaryByRouteValueNames = new[] { "id" })]
        public async Task<IActionResult> GetGroup(Guid id)
        {
            var userId = _currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userGuid)
                ? userGuid : (Guid?)null;

            var result = await Mediator.Send(new GetGroupByIdQuery { Id = id, UserId = userId });

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
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Creating group for user {UserId}: {GroupName}", userGuid, request.Name);

            var result = await Mediator.Send(new CreateGroupCommand { OwnerId = userGuid, Request = request });

            if (result.Succeeded)
            {
                var location = Url.Action(nameof(GetGroup), new { id = result.Data.Id });
                await _notificationService.NotifyGroupMemberJoinedAsync(result.Data.Id, userGuid, _currentUserService.UserName ?? "Unknown User");
                return Created(result.Data, location!, await _localizationProvider.GetTranslationAsync("en-US", "Groups.Created"));
            }

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGroup(Guid id, [FromBody] UpdateGroupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new UpdateGroupCommand { Id = id, UserId = userGuid, Request = request });

            if (result.Succeeded)
                return Success(result.Data, "Group updated successfully");

            return BadRequest("Failed to update group", result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new DeleteGroupCommand { Id = id, UserId = userGuid });

            if (result.Succeeded)
                return Success("Group deleted successfully");

            return BadRequest("Failed to delete group", result.Errors);
        }

        [HttpPost("{id}/join")]
        public async Task<IActionResult> JoinGroup(Guid id, [FromBody] JoinGroupRequest? request = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new JoinGroupCommand { GroupId = id, UserId = userGuid, JoinMessage = request?.Message });

            if (result.Succeeded)
            {
                await _notificationService.NotifyGroupMemberJoinedAsync(id, userGuid, _currentUserService.UserName ?? "Unknown User");
                return Success(result.Data, await _localizationProvider.GetTranslationAsync("en-US", "Groups.Joined"));
            }

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpPost("{id}/leave")]
        public async Task<IActionResult> LeaveGroup(Guid id, [FromBody] LeaveGroupRequest? request = null)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new LeaveGroupCommand { GroupId = id, UserId = userGuid, LeaveReason = request?.Reason });

            if (result.Succeeded)
            {
                await _notificationService.NotifyGroupMemberLeftAsync(id, userGuid, _currentUserService.UserName ?? "Unknown User");
                return Success(await _localizationProvider.GetTranslationAsync("en-US", "Groups.Left"));
            }

            return BadRequest(await _localizationProvider.GetTranslationAsync("en-US", "Error"), result.Errors);
        }

        [HttpPost("{id}/request-join")]
        public async Task<IActionResult> RequestToJoinGroup(Guid id, [FromBody] JoinRequestRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            var result = await Mediator.Send(new RequestJoinGroupCommand { GroupId = id, UserId = userGuid, Request = request });

            if (result.Succeeded)
                return Success(result.Data, "Join request submitted successfully");

            return BadRequest("Failed to submit join request", result.Errors);
        }
    }

    public class JoinGroupRequest { public string? Message { get; set; } }
    public class LeaveGroupRequest { public string? Reason { get; set; } }
}
