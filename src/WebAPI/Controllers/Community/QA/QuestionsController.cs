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
    }
}

            // Set current user context for personalized data (voting status, etc.)
            if (_currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                query.UserId = userId;
            }

            var result = await Mediator.Send(query);

            if (result.IsSuccess)
                return Success(result.Data, "Question retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return this.ApiNotFound("Question", id.ToString());

            return this.ApiBadRequest<QuestionDetailDto>(result.Errors, "Failed to retrieve question");
        }
        [HttpPost]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                return this.ApiUnauthorized("User authentication required");

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
                return this.ApiUnauthorized("Invalid user context");

            var command = new CreateQuestionCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.IsSuccess)
            {
                // Send real-time notifications about the new question
                try
                {
                    // Notify category followers and experts
                    var notification = new NewQuestionNotificationDto { Question = result.Data };
                    await _qaHubService.NotifyNewQuestionToCategoryAsync(notification, result.Data.Category);

                    // Notify experts in the category
                    var expertNotification = new ExpertNotificationDto
                    {
                        QuestionId = result.Data.Id,
                        QuestionTitle = result.Data.Title,
                        Category = result.Data.Category,
                        NotifiedExpertIds = new List<Guid>() // This would be populated by the expert service
                    };
                    await _qaHubService.NotifyExpertsAsync(expertNotification);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request
                    // Real-time notification failure shouldn't break the core functionality
                    // TODO: Add proper logging here
                }

                return this.ApiCreated(result.Data, nameof(GetQuestion), new { id = result.Data.Id }, "Question created successfully");
            }

            return this.ApiBadRequest<QuestionDto>(result.Errors, "Failed to create question");
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(Guid id, [FromBody] UpdateQuestionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateQuestionCommand
            {
                QuestionId = id,
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // Send real-time notification about question update
                try
                {
                    await _qaHubService.NotifyQuestionUpdateAsync(result.Data);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request
                    // Real-time notification failure shouldn't break the core functionality
                    // TODO: Add proper logging here
                }

                return Success(result.Data, "Question updated successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Question not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to update this question");

            return BadRequest("Failed to update question", result.Errors);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new DeleteQuestionCommand
            {
                QuestionId = id,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Question deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Question not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to delete this question");

            return BadRequest("Failed to delete question", result.Errors);
        }
        [HttpPost("{id}/close")]
        public async Task<IActionResult> CloseQuestion(Guid id, [FromBody] CloseQuestionRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CloseQuestionCommand
            {
                QuestionId = id,
                UserId = userGuid,
                Reason = request.Reason
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // Send real-time notification about question closure
                try
                {
                    var questionClosedDto = new QuestionClosedDto
                    {
                        QuestionId = id,
                        QuestionAuthorId = userGuid, // This should be the actual question author ID
                        ClosedReason = request.Reason,
                        ClosedAt = DateTime.UtcNow,
                        ClosedByUserId = userGuid
                    };
                    await _qaHubService.NotifyQuestionClosedAsync(questionClosedDto);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request
                    // Real-time notification failure shouldn't break the core functionality
                    // TODO: Add proper logging here
                }

                return Success("Question closed successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Question not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("You don't have permission to close this question");

            return BadRequest("Failed to close question", result.Errors);
        }
        [HttpGet("search")]
        [OutputCache(Duration = 30, Tags = new[] { "Questions", "Search" })]
        public async Task<IActionResult> SearchQuestions([FromQuery] SearchQuestionsQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Search completed successfully");

            return BadRequest("Search failed", result.Errors);
        }
        [HttpGet("{id}/similar")]
        [OutputCache(Duration = 300, Tags = new[] { "Questions", "Similar" })]
        public async Task<IActionResult> GetSimilarQuestions(Guid id, [FromQuery] GetSimilarQuestionsQuery query)
        {
            query.QuestionId = id;
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Similar questions retrieved successfully");

            return BadRequest("Failed to retrieve similar questions", result.Errors);
        }
        [HttpPost("similar")]
        [OutputCache(Duration = 60, Tags = new[] { "Questions", "Similar" })]
        public async Task<IActionResult> GetSimilarQuestionsByContent([FromBody] GetSimilarQuestionsQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Similar questions retrieved successfully");

            return BadRequest("Failed to retrieve similar questions", result.Errors);
        }
        [HttpGet("my-questions")]
        [OutputCache(Duration = 30, Tags = new[] { "Questions", "UserQuestions" })]
        public async Task<IActionResult> GetMyQuestions([FromQuery] GetMyQuestionsQuery query)
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
                return Success(result.Data, "User questions retrieved successfully");

            return BadRequest("Failed to retrieve user questions", result.Errors);
        }
        [HttpPost("{id}/accept-answer/{answerId}")]
        public async Task<IActionResult> AcceptAnswer(Guid id, Guid answerId)
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
                AnswerId = answerId,
                UserId = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // Send real-time notification about answer acceptance
                try
                {
                    var answerAcceptedDto = new AnswerAcceptedDto
                    {
                        AnswerId = answerId,
                        QuestionId = id,
                        AnswerAuthorId = Guid.Empty, // This should be populated from the answer data
                        AcceptedAt = DateTime.UtcNow,
                        AcceptedByUserId = userGuid
                    };
                    await _qaHubService.NotifyAnswerAcceptedAsync(answerAcceptedDto);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request
                    // Real-time notification failure shouldn't break the core functionality
                    // TODO: Add proper logging here
                }

                return Success("Answer accepted successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Question or answer not found");

            if (result.Errors.Any(e => e.Contains("unauthorized") || e.Contains("permission")))
                return Forbidden("Only the question author can accept answers");

            return BadRequest("Failed to accept answer", result.Errors);
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


