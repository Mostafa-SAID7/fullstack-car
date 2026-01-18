using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Queries;
using Application.Features.Community.QA.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Application.Common.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.QA
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/qa/questions")]
    public class QuestionsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IQAHubService _qaHubService;

        public QuestionsController(
            ICurrentUserService currentUserService,
            IQAHubService qaHubService)
        {
            _currentUserService = currentUserService;
            _qaHubService = qaHubService;
        }

        [HttpGet]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "Questions" })]
        public async Task<IActionResult> GetQuestions([FromQuery] GetQuestionsQuery query)
        {
            if (_currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                query.UserId = userId;
            }

            var result = await Mediator.Send(query);
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetQuestion(Guid id)
        {
            var query = new GetQuestionDetailQuery { QuestionId = id };
            
            if (_currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                query.UserId = userId;
            }

            var result = await Mediator.Send(query);
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var command = new CreateQuestionCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            
            if (result.IsSuccess)
            {
                // Notify via SignalR
                await _qaHubService.NotifyQuestionCreated(result.Data);
                return CreatedAtAction(nameof(GetQuestion), new { id = result.Data.Id }, result.Data);
            }

            return BadRequest(result.Errors);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(Guid id, [FromBody] UpdateQuestionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var command = new UpdateQuestionCommand
            {
                QuestionId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);
            
            if (result.IsSuccess)
            {
                await _qaHubService.NotifyQuestionUpdated(result.Data);
                return Ok(result.Data);
            }

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var command = new DeleteQuestionCommand
            {
                QuestionId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            
            if (result.IsSuccess)
            {
                await _qaHubService.NotifyQuestionDeleted(id);
                return NoContent();
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/close")]
        public async Task<IActionResult> CloseQuestion(Guid id, [FromBody] CloseQuestionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var command = new CloseQuestionCommand
            {
                QuestionId = id,
                UserId = userGuid,
                Reason = request.Reason
            };

            var result = await Mediator.Send(command);
            return result.IsSuccess ? Ok(new { Message = "Question closed successfully" }) : BadRequest(result.Errors);
        }

        [HttpPost("{id}/reopen")]
        public async Task<IActionResult> ReopenQuestion(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var command = new ReopenQuestionCommand
            {
                QuestionId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);
            return result.IsSuccess ? Ok(new { Message = "Question reopened successfully" }) : BadRequest(result.Errors);
        }

        [HttpGet("trending")]
        [AllowAnonymous]
        [OutputCache(Duration = 300, Tags = new[] { "Questions", "Trending" })]
        public async Task<IActionResult> GetTrendingQuestions([FromQuery] int count = 10, [FromQuery] string timeframe = "day")
        {
            var query = new GetTrendingQuestionsQuery { Count = count, Timeframe = timeframe };
            var result = await Mediator.Send(query);
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpGet("unanswered")]
        [AllowAnonymous]
        [OutputCache(Duration = 120, Tags = new[] { "Questions", "Unanswered" })]
        public async Task<IActionResult> GetUnansweredQuestions([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetUnansweredQuestionsQuery { PageNumber = page, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyQuestions([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return Unauthorized();

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return Unauthorized();

            var query = new GetUserQuestionsQuery 
            { 
                UserId = userGuid, 
                PageNumber = page, 
                PageSize = pageSize 
            };
            var result = await Mediator.Send(query);
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        [OutputCache(Duration = 60, Tags = new[] { "Questions", "Search" })]
        public async Task<IActionResult> SearchQuestions([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var searchQuery = new SearchQuestionsQuery 
            { 
                SearchTerm = query, 
                PageNumber = page, 
                PageSize = pageSize 
            };
            var result = await Mediator.Send(searchQuery);
            return result.IsSuccess ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpGet("moderation-queue")]
        public async Task<IActionResult> GetModerationQueue([FromQuery] int pageSize = 10)
        {
            try
            {
                // Return mock moderation queue for now
                var moderationQueue = new
                {
                    Questions = new object[0],
                    TotalCount = 0,
                    PageSize = pageSize,
                    CurrentPage = 1
                };

                return Ok(moderationQueue);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}