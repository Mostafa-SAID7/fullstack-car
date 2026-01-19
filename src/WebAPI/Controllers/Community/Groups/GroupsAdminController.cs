using Application.Common.Attributes;
using Application.Common.Interfaces;
using Application.Features.Community.Groups.Commands;
using Application.Features.Community.Groups.Queries;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Groups
{
    /// <summary>
    /// Admin and moderator operations for Groups (Dashboard integration)
    /// </summary>
    [Authorize(Roles = "Admin,Moderator")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/groups")]
    public class GroupsAdminController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<GroupsAdminController> _logger;

        public GroupsAdminController(
            ICurrentUserService currentUserService,
            ILogger<GroupsAdminController> logger)
        {
            _currentUserService = currentUserService;
            _logger = logger;
        }

        [HttpPut("{id}/moderate")]
        public async Task<IActionResult> ModerateGroup(Guid id, [FromBody] ModerateGroupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Moderator {UserId} is performing action {Action} on group {GroupId}", userGuid, request.Action, id);

            var result = await Mediator.Send(new ModerateGroupCommand
            {
                GroupId = id,
                ModeratorId = userGuid,
                Action = request.Action,
                Reason = request.Reason
            });

            if (result.Succeeded)
                return Success("Group moderated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Group not found");

            return BadRequest("Failed to moderate group", result.Errors);
        }

        [HttpPost("{id}/feature")]
        public async Task<IActionResult> FeatureGroup(Guid id, [FromBody] FeatureGroupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized("Invalid user context");

            _logger.LogInformation("Moderator {UserId} is featuring group {GroupId}", userGuid, id);

            var result = await Mediator.Send(new FeatureGroupCommand
            {
                GroupId = id,
                FeaturedBy = userGuid,
                Request = request
            });

            if (result.Succeeded)
                return Success("Group featured successfully");

            return BadRequest("Failed to feature group", result.Errors);
        }

        [HttpDelete("{id}/feature")]
        public async Task<IActionResult> UnfeatureGroup(Guid id)
        {
            _logger.LogInformation("Unfeaturing group {GroupId}", id);
            var result = await Mediator.Send(new UnfeatureGroupCommand { GroupId = id });

            if (result.Succeeded)
                return Success("Group unfeatured successfully");

            return BadRequest("Failed to unfeature group", result.Errors);
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        [Cache(Duration = 1800, Tags = new[] { "Groups", "Stats" })]
        [OutputCache(Duration = 1800, Tags = new[] { "Groups", "Stats" })]
        public async Task<IActionResult> GetGroupsStats()
        {
            _logger.LogInformation("Retrieving global groups statistics");
            var result = await Mediator.Send(new GetGroupsStatsQuery());
            if (result.Succeeded)
                return Success(result.Data, "Groups statistics retrieved successfully");

            return BadRequest("Failed to retrieve groups statistics", result.Errors);
        }

        [HttpGet("{id}/analytics")]
        [Cache(Duration = 300, Tags = new[] { "Groups", "Analytics" })]
        [OutputCache(Duration = 300, Tags = new[] { "Groups", "Analytics" })]
        public async Task<IActionResult> GetGroupAnalytics(
            Guid id,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            _logger.LogInformation("Retrieving analytics for group {GroupId}", id);
            var result = await Mediator.Send(new GetGroupAnalyticsQuery
            {
                GroupId = id,
                FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                ToDate = toDate ?? DateTime.UtcNow
            });

            if (result.Succeeded)
                return Success(result.Data, "Group analytics retrieved successfully");

            return BadRequest("Failed to retrieve group analytics", result.Errors);
        }
    }
}
