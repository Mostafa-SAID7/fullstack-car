using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Media.Shared;

[ApiController]
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/playlists")]
[Authorize]
public class PlaylistsController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetPlaylists()
    {
        // Return empty array for now - this endpoint is called by the frontend
        // but not fully implemented yet
        return Ok(new
        {
            Success = true,
            Data = new object[0], // Empty array
            Message = "Playlists retrieved successfully"
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlaylist([FromBody] CreatePlaylistRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized(new
            {
                Success = false,
                Message = "User not authenticated"
            });
        }

        // TODO: Implement playlist creation
        return Ok(new
        {
            Success = true,
            Data = new { Id = Guid.NewGuid(), Name = request.Name, Description = request.Description },
            Message = "Playlist created successfully"
        });
    }
}

public class CreatePlaylistRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublic { get; set; } = true;
}