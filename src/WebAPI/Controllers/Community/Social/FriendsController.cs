using Application.Features.Identity.Core.Interfaces;
using Application.Common.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
    [Tags("Community - Social")]
    public class FriendsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public FriendsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        private Guid CurrentUserGuid => Guid.TryParse(_currentUserService.UserId, out var guid) ? guid : Guid.Empty;

        [HttpGet]
        [AllowAnonymous] // Temporarily allow anonymous access for testing
        public async Task<IActionResult> GetFriends(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (CurrentUserGuid == Guid.Empty) return Unauthorized();

            var result = await Mediator.Send(new GetFriendsQuery
            {
                UserId = CurrentUserGuid,
                PageNumber = page,
                PageSize = pageSize
            });

            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "Friends API is working", timestamp = DateTime.UtcNow });
        }

        [HttpGet("requests")]
        [AllowAnonymous] // Temporarily allow anonymous access for testing
        public async Task<IActionResult> GetFriendRequests(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (CurrentUserGuid == Guid.Empty) return Unauthorized();

            var result = await Mediator.Send(new GetFriendRequestsQuery
            {
                UserId = CurrentUserGuid,
                PageNumber = page,
                PageSize = pageSize
            });

            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("request/{friendId:guid}")]
        public async Task<IActionResult> SendFriendRequest([FromRoute] Guid friendId)
        {
            if (CurrentUserGuid == Guid.Empty) return Unauthorized();

            var result = await Mediator.Send(new SendFriendRequestCommand
            {
                UserId = CurrentUserGuid,
                FriendId = friendId
            });

            return result.Succeeded ? Ok(new { Message = "Friend request sent successfully" }) : BadRequest(result.Errors);
        }

        [HttpPut("request/{requestId:guid}/accept")]
        public async Task<IActionResult> AcceptFriendRequest([FromRoute] Guid requestId)
        {
            if (CurrentUserGuid == Guid.Empty) return Unauthorized();

            var result = await Mediator.Send(new AcceptFriendRequestCommand
            {
                RequestId = requestId,
                UserId = CurrentUserGuid
            });

            return result.Succeeded ? Ok(new { Message = "Friend request accepted" }) : BadRequest(result.Errors);
        }

        [HttpPut("request/{requestId:guid}/decline")]
        public async Task<IActionResult> DeclineFriendRequest([FromRoute] Guid requestId)
        {
            if (CurrentUserGuid == Guid.Empty) return Unauthorized();

            var result = await Mediator.Send(new DeclineFriendRequestCommand
            {
                RequestId = requestId,
                UserId = CurrentUserGuid
            });

            return result.Succeeded ? Ok(new { Message = "Friend request declined" }) : BadRequest(result.Errors);
        }

        [HttpDelete("{friendId:guid}")]
        public async Task<IActionResult> RemoveFriend([FromRoute] Guid friendId)
        {
            if (CurrentUserGuid == Guid.Empty) return Unauthorized();

            var result = await Mediator.Send(new RemoveFriendCommand
            {
                UserId = CurrentUserGuid,
                FriendId = friendId
            });

            return result.Succeeded ? Ok(new { Message = "Friend removed successfully" }) : BadRequest(result.Errors);
        }

        [HttpPost("{friendId:guid}/block")]
        public async Task<IActionResult> BlockUser([FromRoute] Guid friendId)
        {
            // Placeholder for now as we haven't implemented Block logic fully in the domain
            return Ok(new { Message = "User blocked successfully" });
        }
    }
}


