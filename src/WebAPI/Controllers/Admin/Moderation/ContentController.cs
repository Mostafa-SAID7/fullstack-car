using Application.Features.Admin.Moderation.Commands;
using Application.Features.Admin.Moderation.DTOs;
using Application.Features.Admin.Moderation.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Admin.Moderation
{
    [Authorize(Roles = "Admin,Moderator")]

    [Route("api/v{version:apiVersion}/admin/moderation/content")]
    public class ContentController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public ContentController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet("moderation-stats")]
        public async Task<IActionResult> GetModerationStats()
        {
            var query = new GetModerationStatsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("reports")]
        public async Task<IActionResult> GetReports(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? type = null,
            [FromQuery] string? status = null,
            [FromQuery] string? priority = null)
        {
            var query = new GetContentReportsQuery
            {
                Page = page,
                PageSize = pageSize,
                ContentType = type,
                Status = status,
                Priority = priority
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("flagged")]
        public async Task<IActionResult> GetFlaggedContent(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? contentType = null,
            [FromQuery] ContentFilterRequest? filter = null)
        {
            var query = new GetFlaggedContentQuery
            {
                Page = page,
                PageSize = pageSize,
                ContentType = contentType,
                Filter = filter ?? new ContentFilterRequest()
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("reports/{id}/resolve")]
        public async Task<IActionResult> ResolveReport(
            Guid id,
            [FromBody] ResolveReportRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new ResolveReportCommand
            {
                ReportId = id,
                ModeratorId = Guid.Parse(_currentUserService.UserId),
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Report resolved successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPut("{contentType}/{id}/approve")]
        public async Task<IActionResult> ApproveContent(
            string contentType,
            Guid id,
            [FromBody] ApproveContentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new ApproveContentCommand
            {
                ContentId = id,
                ContentType = contentType,
                ModeratorId = Guid.Parse(_currentUserService.UserId),
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Content approved successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPut("{contentType}/{id}/reject")]
        public async Task<IActionResult> RejectContent(
            string contentType,
            Guid id,
            [FromBody] RejectContentRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new RejectContentCommand
            {
                ContentId = id,
                ContentType = contentType,
                ModeratorId = Guid.Parse(_currentUserService.UserId),
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Content rejected successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPost("bulk-moderation")]
        public async Task<IActionResult> BulkModeration([FromBody] BulkModerationRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new BulkModerationCommand
            {
                ModeratorId = Guid.Parse(_currentUserService.UserId),
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("auto-moderation-rules")]
        public async Task<IActionResult> GetAutoModerationRules()
        {
            var query = new GetAutoModerationRulesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("auto-moderation-rules")]
        public async Task<IActionResult> CreateAutoModerationRule([FromBody] AutoModerationRuleDto rule)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new CreateAutoModerationRuleCommand
            {
                AdminId = Guid.Parse(_currentUserService.UserId),
                Rule = rule
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetAutoModerationRules), new { id = result.Data }, result.Data);

            return BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("auto-moderation-rules/{id}")]
        public async Task<IActionResult> UpdateAutoModerationRule(Guid id, [FromBody] AutoModerationRuleDto rule)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new UpdateAutoModerationRuleCommand
            {
                RuleId = id,
                AdminId = Guid.Parse(_currentUserService.UserId),
                Rule = rule
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Auto-moderation rule updated successfully" });

            return BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("auto-moderation-rules/{id}")]
        public async Task<IActionResult> DeleteAutoModerationRule(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new DeleteAutoModerationRuleCommand
            {
                RuleId = id,
                AdminId = Guid.Parse(_currentUserService.UserId)
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }
    }
}
