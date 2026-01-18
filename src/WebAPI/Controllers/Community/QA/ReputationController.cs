using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Queries;
using Application.Features.Community.QA.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;
using WebAPI.Extensions;

namespace WebAPI.Controllers.Community.QA
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/qa/reputation")]
    public class ReputationController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IQAHubService _qaHubService;

        public ReputationController(
            ICurrentUserService currentUserService,
            IQAHubService qaHubService)
        {
            _currentUserService = currentUserService;
            _qaHubService = qaHubService;
        }
        [HttpGet("user/{userId?}")]
        [OutputCache(Duration = 60, Tags = new[] { "Reputation" })]
        public async Task<IActionResult> GetUserReputation(Guid? userId = null)
        {
            // Use provided userId or default to current user
            var targetUserId = userId;
            if (!targetUserId.HasValue)
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                    return this.ApiUnauthorized("User authentication required");

                if (!Guid.TryParse(_currentUserService.UserId, out var currentUserGuid))
                    return this.ApiUnauthorized("Invalid user context");

                targetUserId = currentUserGuid;
            }

            var query = new GetUserReputationQuery { UserId = targetUserId.Value };
            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "User reputation retrieved successfully")
                : this.ApiBadRequest<UserReputationDto>(result.Errors, "Failed to retrieve user reputation");
        }
        [HttpGet("leaderboard")]
        [OutputCache(Duration = 300, Tags = new[] { "Reputation", "Leaderboard" })]
        public async Task<IActionResult> GetReputationLeaderboard(
            [FromQuery] int count = 10, 
            [FromQuery] string? category = null)
        {
            var query = new GetReputationLeaderboardQuery 
            { 
                Count = Math.Min(count, 100), // Limit to prevent abuse
                Category = category 
            };

            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Reputation leaderboard retrieved successfully")
                : this.ApiBadRequest<List<UserReputationDto>>(result.Errors, "Failed to retrieve reputation leaderboard");
        }
        [HttpGet("history")]
        [OutputCache(Duration = 60, Tags = new[] { "Reputation", "History" })]
        public async Task<IActionResult> GetReputationHistory(
            [FromQuery] Guid? userId = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            // Use provided userId or default to current user
            var targetUserId = userId;
            if (!targetUserId.HasValue)
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                    return this.ApiUnauthorized("User authentication required");

                if (!Guid.TryParse(_currentUserService.UserId, out var currentUserGuid))
                    return this.ApiUnauthorized("Invalid user context");

                targetUserId = currentUserGuid;
            }

            var query = new GetReputationHistoryQuery
            {
                UserId = targetUserId.Value,
                PageNumber = Math.Max(1, pageNumber),
                PageSize = Math.Min(Math.Max(1, pageSize), 100), // Limit page size
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? this.ApiPaginatedSuccess(result.Data, "Reputation history retrieved successfully")
                : this.ApiPaginatedBadRequest<ReputationHistoryDto>(result.Errors, "Failed to retrieve reputation history");
        }
        [HttpPost("expertise")]
        public async Task<IActionResult> UpdateExpertiseAreas([FromBody] UpdateExpertiseAreasRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return this.ApiUnauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return this.ApiUnauthorized("Invalid user context");

            var command = new UpdateExpertiseAreasCommand
            {
                UserId = userGuid,
                ExpertiseAreas = request.ExpertiseAreas
            };

            var result = await Mediator.Send(command);

            return result.IsSuccess 
                ? Success(result.Data, "Expertise areas updated successfully")
                : this.ApiBadRequest<UserReputationDto>(result.Errors, "Failed to update expertise areas");
        }
        [HttpPost("users/{userId}/badges")]
        [Authorize(Roles = "Admin,Moderator")]
        public async Task<IActionResult> AwardBadge(Guid userId, [FromBody] AwardBadgeRequest request)
        {
            var command = new AwardBadgeCommand
            {
                UserId = userId,
                BadgeName = request.BadgeName,
                Reason = request.Reason
            };

            var result = await Mediator.Send(command);

            if (result.IsSuccess)
            {
                // Send real-time notification about reputation/badge update
                try
                {
                    var reputationUpdateDto = new ReputationUpdateDto
                    {
                        UserId = userId,
                        Change = 0, // Badge awards might not change reputation score directly
                        NewReputation = result.Data.ReputationScore,
                        Reason = $"Badge awarded: {request.BadgeName}",
                        BadgesEarned = new List<string> { request.BadgeName },
                        Timestamp = DateTime.UtcNow
                    };
                    await _qaHubService.NotifyReputationUpdateAsync(reputationUpdateDto);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request
                    // Real-time notification failure shouldn't break the core functionality
                    // TODO: Add proper logging here
                }

                return Success(result.Data, "Badge awarded successfully");
            }

            return this.ApiBadRequest<UserReputationDto>(result.Errors, "Failed to award badge");
        }
        [HttpGet("experts/{category}")]
        [OutputCache(Duration = 300, Tags = new[] { "Reputation", "Experts" })]
        public async Task<IActionResult> GetExpertsByCategory(
            string category, 
            [FromQuery] int count = 10)
        {
            var query = new GetExpertsByCategory 
            { 
                Category = category,
                Count = Math.Min(count, 50) // Limit to prevent abuse
            };

            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? Success(result.Data, "Experts retrieved successfully")
                : this.ApiBadRequest<List<ExpertDto>>(result.Errors, "Failed to retrieve experts");
        }
        [HttpGet("me/summary")]
        [OutputCache(Duration = 30, Tags = new[] { "Reputation", "Summary" })]
        public async Task<IActionResult> GetMyReputationSummary()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return this.ApiUnauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return this.ApiUnauthorized("Invalid user context");

            var query = new GetUserReputationQuery { UserId = userGuid };
            var result = await Mediator.Send(query);

            if (!result.IsSuccess)
                return this.ApiBadRequest<UserReputationDto>(result.Errors, "Failed to retrieve reputation summary");

            // Return simplified summary for header/navigation display
            var summary = new
            {
                ReputationScore = result.Data.ReputationScore,
                Rank = result.Data.Rank,
                BadgeCount = result.Data.BadgesEarned.Count,
                RecentBadges = result.Data.BadgesEarned.TakeLast(3).ToList()
            };

            return Success(summary, "Reputation summary retrieved successfully");
        }
        [HttpGet("statistics")]
        [Authorize(Roles = "Admin,Moderator")]
        [OutputCache(Duration = 600, Tags = new[] { "Reputation", "Statistics" })]
        public async Task<IActionResult> GetReputationStatistics()
        {
            // This would typically be implemented with a dedicated query/handler
            // For now, return a placeholder response
            var statistics = new
            {
                TotalUsers = 0,
                AverageReputation = 0,
                TopReputationScore = 0,
                TotalBadgesAwarded = 0,
                ActiveExperts = 0,
                ReputationDistribution = new Dictionary<string, int>
                {
                    { "0-100", 0 },
                    { "101-500", 0 },
                    { "501-1000", 0 },
                    { "1001-2000", 0 },
                    { "2000+", 0 }
                }
            };

            return Success(statistics, "Reputation statistics retrieved successfully");
        }
    }
}


