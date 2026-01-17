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

namespace WebAPI.Controllers.Community.QA
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/qa/answers")]
    public class AnswersController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IQAHubService _qaHubService;

        public AnswersController(
            ICurrentUserService currentUserService,
            IQAHubService qaHubService)
        {
            _currentUserService = currentUserService;
            _qaHubService = qaHubService;
        }
        [HttpGet("question/{questionId}")]
        [OutputCache(Duration = 30, Tags = new[] { "Answers", "Question" })]
        public async Task<IActionResult> GetAnswersByQuestion(Guid questionId, [FromQuery] GetAnswersByQuestionQuery query)
        {
            query.QuestionId = questionId;

            // Set current user context for personalized results (voting status, etc.)
            if (_currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                query.UserId = userId;
            }

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Answers retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Question not found");

            return BadRequest("Failed to retrieve answers", result.Errors);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnswer(Guid id)
        {
            var query = new GetAnswerQuery { AnswerId = id };

            // Set current user context for personalized data (voting status, etc.)
            if (_currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                query.UserId = userId;
            }

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Answer retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Answer not found");

            return BadRequest("Failed to retrieve answer", result.Errors);
        }
        [HttpPost]
        public async Task<IActionResult> CreateAnswer([FromBody] CreateAnswerRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            // Extract QuestionId from request body
            if (!request.QuestionId.HasValue)
            {
                return BadRequest("QuestionId is required");
            }

            var command = new CreateAnswerCommand
            {
                QuestionId = request.QuestionId.Value,
                UserId = userGuid,
                Request = new CreateAnswerRequest
                {
                    Content = request.Content
                }
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // Send real-time notification about the new answer
                try
                {
                    await _qaHubService.NotifyNewAnswerAsync(result.Data);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request
                    // Real-time notification failure shouldn't break the core functionality
                    // TODO: Add proper logging here
                }

                var location = Url.Action(nameof(GetAnswer), new { id = result.Data.Id });
                return Created(result.Data, location!, "Answer created successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Question not found");

            if (result.Errors.Any(e => e.Contains("closed")))
                return BadRequest("Cannot answer a closed question", result.Errors);

            if (result.Errors.Any(e => e.Contains("already answered")))
                return BadRequest("You have already answered this question", result.Errors);

            return BadRequest("Failed to create answer", result.Errors);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnswer(Guid id, [FromBody] UpdateAnswerRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateAnswerCommand
            {
                AnswerId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Answer updated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Answer not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to update this answer");

            if (result.Errors.Any(e => e.Contains("24 hours") || e.Contains("votes")))
                return BadRequest("Answer cannot be edited after 24 hours if it has votes", result.Errors);

            return BadRequest("Failed to update answer", result.Errors);
        }
        [HttpPost("{id}/accept")]
        public async Task<IActionResult> AcceptAnswer(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new AcceptAnswerCommand
            {
                AnswerId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Answer accepted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Answer not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("Only the question author can accept answers");

            return BadRequest("Failed to accept answer", result.Errors);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnswer(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteAnswerCommand
            {
                AnswerId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Answer deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Answer not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to delete this answer");

            if (result.Errors.Any(e => e.Contains("accepted")))
                return BadRequest("Cannot delete an accepted answer", result.Errors);

            if (result.Errors.Any(e => e.Contains("vote counts")))
                return BadRequest("Cannot delete answers with high vote counts", result.Errors);

            return BadRequest("Failed to delete answer", result.Errors);
        }
        [HttpGet("my-answers")]
        [OutputCache(Duration = 30, Tags = new[] { "Answers", "UserAnswers" })]
        public async Task<IActionResult> GetMyAnswers([FromQuery] GetMyAnswersQuery query)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            query.UserId = userGuid;
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "User answers retrieved successfully");

            return BadRequest("Failed to retrieve user answers", result.Errors);
        }
    }
}