using Application.Common.Interfaces.Identity;
using Application.Common.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Controllers.Community.Social
{
    /// <summary>
    /// Manages friend relationships and social connections between users
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/community/social/friends")]
    [Tags("Community - Social")]
    [Produces("application/json")]
    public class FriendsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public FriendsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        /// <summary>
        /// Get user's friends list with pagination
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 10, max: 50)</param>
        /// <returns>Paginated list of user's friends</returns>
        /// <response code="200">Returns the user's friends list</response>
        /// <response code="401">User is not authenticated</response>
        /// <response code="400">Invalid pagination parameters</response>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedFriendsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFriends(
            [FromQuery, Range(1, int.MaxValue)] int page = 1,
            [FromQuery, Range(1, 50)] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized(new { Message = "User authentication required" });
            }

            if (page < 1 || pageSize < 1 || pageSize > 50)
            {
                return BadRequest(new { Message = "Invalid pagination parameters" });
            }

            // Implementation for getting user's friends
            var response = new PaginatedFriendsResponse
            {
                Data = new List<FriendDto>(),
                TotalCount = 0,
                Page = page,
                PageSize = pageSize,
                TotalPages = 0
            };

            return Ok(response);
        }

        /// <summary>
        /// Get pending friend requests for the current user
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 10, max: 50)</param>
        /// <returns>Paginated list of friend requests</returns>
        /// <response code="200">Returns pending friend requests</response>
        /// <response code="401">User is not authenticated</response>
        [HttpGet("requests")]
        [ProducesResponseType(typeof(PaginatedFriendRequestsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetFriendRequests(
            [FromQuery, Range(1, int.MaxValue)] int page = 1,
            [FromQuery, Range(1, 50)] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized(new { Message = "User authentication required" });
            }

            // Implementation for getting friend requests
            var response = new PaginatedFriendRequestsResponse
            {
                Data = new List<FriendRequestDto>(),
                TotalCount = 0,
                Page = page,
                PageSize = pageSize,
                TotalPages = 0
            };

            return Ok(response);
        }

        /// <summary>
        /// Send a friend request to another user
        /// </summary>
        /// <param name="friendId">ID of the user to send friend request to</param>
        /// <returns>Success message</returns>
        /// <response code="200">Friend request sent successfully</response>
        /// <response code="400">Invalid friend ID or request already exists</response>
        /// <response code="401">User is not authenticated</response>
        /// <response code="404">Target user not found</response>
        [HttpPost("request/{friendId:guid}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SendFriendRequest([FromRoute] Guid friendId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized(new { Message = "User authentication required" });
            }

            if (friendId == Guid.Empty)
            {
                return BadRequest(new { Message = "Invalid friend ID" });
            }

            // Implementation for sending friend request
            return Ok(new ApiResponse { Message = "Friend request sent successfully", Success = true });
        }

        /// <summary>
        /// Accept a pending friend request
        /// </summary>
        /// <param name="requestId">ID of the friend request to accept</param>
        /// <returns>Success message</returns>
        /// <response code="200">Friend request accepted successfully</response>
        /// <response code="400">Invalid request ID</response>
        /// <response code="401">User is not authenticated</response>
        /// <response code="404">Friend request not found</response>
        [HttpPut("request/{requestId:guid}/accept")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AcceptFriendRequest([FromRoute] Guid requestId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized(new { Message = "User authentication required" });
            }

            if (requestId == Guid.Empty)
            {
                return BadRequest(new { Message = "Invalid request ID" });
            }

            // Implementation for accepting friend request
            return Ok(new ApiResponse { Message = "Friend request accepted", Success = true });
        }

        /// <summary>
        /// Decline a pending friend request
        /// </summary>
        /// <param name="requestId">ID of the friend request to decline</param>
        /// <returns>Success message</returns>
        /// <response code="200">Friend request declined successfully</response>
        /// <response code="400">Invalid request ID</response>
        /// <response code="401">User is not authenticated</response>
        /// <response code="404">Friend request not found</response>
        [HttpPut("request/{requestId:guid}/decline")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeclineFriendRequest([FromRoute] Guid requestId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized(new { Message = "User authentication required" });
            }

            if (requestId == Guid.Empty)
            {
                return BadRequest(new { Message = "Invalid request ID" });
            }

            // Implementation for declining friend request
            return Ok(new ApiResponse { Message = "Friend request declined", Success = true });
        }

        /// <summary>
        /// Remove a friend from user's friends list
        /// </summary>
        /// <param name="friendId">ID of the friend to remove</param>
        /// <returns>Success message</returns>
        /// <response code="200">Friend removed successfully</response>
        /// <response code="400">Invalid friend ID</response>
        /// <response code="401">User is not authenticated</response>
        /// <response code="404">Friend not found</response>
        [HttpDelete("{friendId:guid}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveFriend([FromRoute] Guid friendId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized(new { Message = "User authentication required" });
            }

            if (friendId == Guid.Empty)
            {
                return BadRequest(new { Message = "Invalid friend ID" });
            }

            // Implementation for removing friend
            return Ok(new ApiResponse { Message = "Friend removed successfully", Success = true });
        }

        /// <summary>
        /// Block a user to prevent future interactions
        /// </summary>
        /// <param name="friendId">ID of the user to block</param>
        /// <returns>Success message</returns>
        /// <response code="200">User blocked successfully</response>
        /// <response code="400">Invalid user ID or user already blocked</response>
        /// <response code="401">User is not authenticated</response>
        /// <response code="404">User not found</response>
        [HttpPost("{friendId:guid}/block")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> BlockUser([FromRoute] Guid friendId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized(new { Message = "User authentication required" });
            }

            if (friendId == Guid.Empty)
            {
                return BadRequest(new { Message = "Invalid user ID" });
            }

            // Implementation for blocking user
            return Ok(new ApiResponse { Message = "User blocked successfully", Success = true });
        }

        /// <summary>
        /// Get friend suggestions based on mutual connections and interests
        /// </summary>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 10, max: 50)</param>
        /// <returns>Paginated list of friend suggestions</returns>
        /// <response code="200">Returns friend suggestions</response>
        /// <response code="401">User is not authenticated</response>
        [HttpGet("suggestions")]
        [ProducesResponseType(typeof(PaginatedFriendSuggestionsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetFriendSuggestions(
            [FromQuery, Range(1, int.MaxValue)] int page = 1,
            [FromQuery, Range(1, 50)] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized(new { Message = "User authentication required" });
            }

            // Implementation for getting friend suggestions
            var response = new PaginatedFriendSuggestionsResponse
            {
                Data = new List<FriendSuggestionDto>(),
                TotalCount = 0,
                Page = page,
                PageSize = pageSize,
                TotalPages = 0
            };

            return Ok(response);
        }

        /// <summary>
        /// Get mutual friends between current user and another user
        /// </summary>
        /// <param name="friendId">ID of the user to find mutual friends with</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 10, max: 50)</param>
        /// <returns>Paginated list of mutual friends</returns>
        /// <response code="200">Returns mutual friends</response>
        /// <response code="400">Invalid friend ID</response>
        /// <response code="401">User is not authenticated</response>
        /// <response code="404">User not found</response>
        [HttpGet("mutual/{friendId:guid}")]
        [ProducesResponseType(typeof(PaginatedMutualFriendsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMutualFriends(
            [FromRoute] Guid friendId,
            [FromQuery, Range(1, int.MaxValue)] int page = 1,
            [FromQuery, Range(1, 50)] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized(new { Message = "User authentication required" });
            }

            if (friendId == Guid.Empty)
            {
                return BadRequest(new { Message = "Invalid friend ID" });
            }

            // Implementation for getting mutual friends
            var response = new PaginatedMutualFriendsResponse
            {
                Data = new List<MutualFriendDto>(),
                TotalCount = 0,
                Page = page,
                PageSize = pageSize,
                TotalPages = 0
            };

            return Ok(response);
        }
    }

    // Response DTOs
    public class PaginatedFriendsResponse
    {
        public List<FriendDto> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class PaginatedFriendRequestsResponse
    {
        public List<FriendRequestDto> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class PaginatedFriendSuggestionsResponse
    {
        public List<FriendSuggestionDto> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class PaginatedMutualFriendsResponse
    {
        public List<MutualFriendDto> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class FriendDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? ProfilePicture { get; set; }
        public DateTime FriendsSince { get; set; }
        public bool IsOnline { get; set; }
        public DateTime? LastSeen { get; set; }
    }

    public class FriendRequestDto
    {
        public Guid Id { get; set; }
        public Guid FromUserId { get; set; }
        public string FromUserName { get; set; } = string.Empty;
        public string? FromUserProfilePicture { get; set; }
        public DateTime RequestDate { get; set; }
        public string? Message { get; set; }
    }

    public class FriendSuggestionDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? ProfilePicture { get; set; }
        public int MutualFriendsCount { get; set; }
        public List<string> CommonInterests { get; set; } = new();
        public string SuggestionReason { get; set; } = string.Empty;
    }

    public class MutualFriendDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? ProfilePicture { get; set; }
        public DateTime FriendsSince { get; set; }
    }
}

