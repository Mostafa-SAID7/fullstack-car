using Application.Features.Community.Chat.Commands;
using Application.Features.Community.Chat.DTOs;
using Application.Features.Community.Chat.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Community.Chat
{
    [Authorize]
    [Route("api/community/[controller]")]
    public class ChatController : BaseController
    {
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userId, out var userGuid)) return Unauthorized();

            var result = await Mediator.Send(new GetConversationsQuery { UserId = userGuid });
            return Ok(result.Data);
        }

        [HttpGet("conversations/{id}/messages")]
        public async Task<IActionResult> GetMessages(Guid id, [FromQuery] int pageSize = 50, [FromQuery] DateTime? before = null)
        {
            var result = await Mediator.Send(new GetChatHistoryQuery { ConversationId = id, PageSize = pageSize, Before = before });
            return Ok(result.Data);
        }

        [HttpPost("conversations")]
        public async Task<IActionResult> CreateConversation([FromBody] CreateConversationRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userId, out var userGuid)) return Unauthorized();

            var result = await Mediator.Send(new CreateConversationCommand { UserId = userGuid, Request = request });
            if (result.Succeeded) return Ok(result.Data);
            return BadRequest(result.Errors);
        }

        [HttpPost("messages")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userId, out var userGuid)) return Unauthorized();

            var result = await Mediator.Send(new SendMessageCommand { UserId = userGuid, Request = request });
            if (result.Succeeded) return Ok(result.Data);
            return BadRequest(result.Errors);
        }
    }
}
