using Application.Features.Identity.Core.Interfaces;
using Application.Common.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OutputCaching;
using System.ComponentModel.DataAnnotations;
using Application.Features.Community.Friends.Commands;
using Application.Features.Community.Friends.DTOs;
using Application.Features.Community.Friends.Queries;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.Social
{
    [Authorize]
    [ApiController]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/social/friends")]
    public class FriendsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public FriendsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        private Guid CurrentUserGuid => Guid.TryParse(_currentUserService.UserId, out var guid) ? guid : Guid.Empty;

        [HttpGet]
        [OutputCache(Duration = 300, Tags = new[] { "Friends" })]
        public async Task<IActionResult> GetFriends(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? sortBy = "FriendshipDate")
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var query = new GetFriendsQuery
            {
                UserId = CurrentUserGuid,
                PageNumber = page,
                PageSize = pageSize,
                SearchTerm = searchTerm,
                SortBy = sortBy
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Friends retrieved successfully");

            return BadRequest("Failed to retrieve friends", result.Errors);
        }

        [HttpGet("requests")]
        [OutputCache(Duration = 60, Tags = new[] { "FriendRequests" })]
        public async Task<IActionResult> GetFriendRequests(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = "Pending")
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var query = new GetFriendRequestsQuery
            {
                UserId = CurrentUserGuid,
                PageNumber = page,
                PageSize = pageSize,
                Status = status
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Friend requests retrieved successfully");

            return BadRequest("Failed to retrieve friend requests", result.Errors);
        }

        [HttpGet("requests/sent")]
        [OutputCache(Duration = 60, Tags = new[] { "FriendRequests" })]
        public async Task<IActionResult> GetSentFriendRequests(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var query = new GetSentFriendRequestsQuery
            {
                UserId = CurrentUserGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Sent friend requests retrieved successfully");

            return BadRequest("Failed to retrieve sent friend requests", result.Errors);
        }

        [HttpPost("request/{friendId:guid}")]
        public async Task<IActionResult> SendFriendRequest([FromRoute] Guid friendId)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            if (friendId == CurrentUserGuid)
                return BadRequest("Cannot send friend request to yourself");

            var command = new SendFriendRequestCommand
            {
                UserId = CurrentUserGuid,
                FriendId = friendId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Friend request sent successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("User not found");

            if (result.Errors.Any(e => e.Contains("already friends")))
                return BadRequest("You are already friends with this user", result.Errors);

            if (result.Errors.Any(e => e.Contains("pending request")))
                return BadRequest("Friend request already pending", result.Errors);

            return BadRequest("Failed to send friend request", result.Errors);
        }

        [HttpPut("request/{requestId:guid}/accept")]
        public async Task<IActionResult> AcceptFriendRequest([FromRoute] Guid requestId)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var command = new AcceptFriendRequestCommand
            {
                RequestId = requestId,
                UserId = CurrentUserGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Friend request accepted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Friend request not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to accept this request");

            if (result.Errors.Any(e => e.Contains("already processed")))
                return BadRequest("Friend request has already been processed", result.Errors);

            return BadRequest("Failed to accept friend request", result.Errors);
        }

        [HttpPut("request/{requestId:guid}/decline")]
        public async Task<IActionResult> DeclineFriendRequest([FromRoute] Guid requestId)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var command = new DeclineFriendRequestCommand
            {
                RequestId = requestId,
                UserId = CurrentUserGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Friend request declined successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Friend request not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to decline this request");

            if (result.Errors.Any(e => e.Contains("already processed")))
                return BadRequest("Friend request has already been processed", result.Errors);

            return BadRequest("Failed to decline friend request", result.Errors);
        }

        [HttpDelete("request/{requestId:guid}")]
        public async Task<IActionResult> CancelFriendRequest([FromRoute] Guid requestId)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var command = new CancelFriendRequestCommand
            {
                RequestId = requestId,
                UserId = CurrentUserGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Friend request cancelled successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Friend request not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to cancel this request");

            return BadRequest("Failed to cancel friend request", result.Errors);
        }

        [HttpDelete("{friendId:guid}")]
        public async Task<IActionResult> RemoveFriend([FromRoute] Guid friendId)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var command = new RemoveFriendCommand
            {
                UserId = CurrentUserGuid,
                FriendId = friendId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Friend removed successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Friendship not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to remove this friend");

            return BadRequest("Failed to remove friend", result.Errors);
        }

        [HttpPost("{friendId:guid}/block")]
        public async Task<IActionResult> BlockUser([FromRoute] Guid friendId)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            if (friendId == CurrentUserGuid)
                return BadRequest("Cannot block yourself");

            var command = new BlockUserCommand
            {
                UserId = CurrentUserGuid,
                BlockedUserId = friendId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("User blocked successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("User not found");

            if (result.Errors.Any(e => e.Contains("already blocked")))
                return BadRequest("User is already blocked", result.Errors);

            return BadRequest("Failed to block user", result.Errors);
        }

        [HttpDelete("{friendId:guid}/unblock")]
        public async Task<IActionResult> UnblockUser([FromRoute] Guid friendId)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var command = new UnblockUserCommand
            {
                UserId = CurrentUserGuid,
                BlockedUserId = friendId
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("User unblocked successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Block relationship not found");

            return BadRequest("Failed to unblock user", result.Errors);
        }

        [HttpGet("blocked")]
        [OutputCache(Duration = 300, Tags = new[] { "BlockedUsers" })]
        public async Task<IActionResult> GetBlockedUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var query = new GetBlockedUsersQuery
            {
                UserId = CurrentUserGuid,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Blocked users retrieved successfully");

            return BadRequest("Failed to retrieve blocked users", result.Errors);
        }

        [HttpGet("suggestions")]
        [OutputCache(Duration = 1800, Tags = new[] { "FriendSuggestions" })]
        public async Task<IActionResult> GetFriendSuggestions([FromQuery] int pageSize = 10)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var query = new GetFriendSuggestionsQuery
            {
                UserId = CurrentUserGuid,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Friend suggestions retrieved successfully");

            return BadRequest("Failed to retrieve friend suggestions", result.Errors);
        }

        [HttpGet("mutual/{userId:guid}")]
        [OutputCache(Duration = 600, Tags = new[] { "MutualFriends" })]
        public async Task<IActionResult> GetMutualFriends(
            [FromRoute] Guid userId,
            [FromQuery] int pageSize = 10)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var query = new GetMutualFriendsQuery
            {
                UserId = CurrentUserGuid,
                OtherUserId = userId,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Mutual friends retrieved successfully");

            return BadRequest("Failed to retrieve mutual friends", result.Errors);
        }

        [HttpGet("status/{userId:guid}")]
        [OutputCache(Duration = 300, Tags = new[] { "FriendshipStatus" })]
        public async Task<IActionResult> GetFriendshipStatus([FromRoute] Guid userId)
        {
            if (CurrentUserGuid == Guid.Empty) 
                return Unauthorized("User authentication required");

            var query = new GetFriendshipStatusQuery
            {
                UserId = CurrentUserGuid,
                OtherUserId = userId
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Friendship status retrieved successfully");

            return BadRequest("Failed to retrieve friendship status", result.Errors);
        }
    }
}


