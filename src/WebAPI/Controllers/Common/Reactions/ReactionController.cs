using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Common.Reactions;

[Authorize]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/common/reactions")]
public class ReactionController : BaseController
{
    private readonly ICurrentUserService _currentUserService;

    public ReactionController(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    [HttpPost]
    public async Task<IActionResult> AddReaction([FromBody] object request)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Unauthorized("User authentication required");
        }

        // Placeholder implementation
        return Success("Reaction added successfully");
    }

    [HttpDelete("{contentType}/{contentId}/{reactionType}")]
    public async Task<IActionResult> RemoveReaction(Guid contentId, string contentType, string reactionType)
    {
        if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
        {
            return Unauthorized("User authentication required");
        }

        // Placeholder implementation
        return Success("Reaction removed successfully");
    }
}