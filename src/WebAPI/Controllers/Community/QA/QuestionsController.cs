using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.DTOs.Shared;
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
    /// <summary>
    /// Unified Questions API controller serving both Angular and React frontends
    /// Provides comprehensive CRUD operations for questions with search and discovery features
    /// </summary>
    [Authorize]
    [ApiVersion("7.0")]
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

        /// <summary>
        /// Get paginated list of questions with filtering and sorting
        /// Supports both Angular and React frontend requirements
        /// </summary>
        /// <param name="query">Query parameters for filtering and pagination</param>
        /// <returns>Paginated list of questions</returns>
        [HttpGet]
        [OutputCache(Duration = 60, Tags = new[] { "Questions" })]
        public async Task<IActionResult> GetQuestions([FromQuery] GetQuestionsQuery query)
        {
            // Set current user context for personalized results
            if (_currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                query.UserId = userId;
            }

            var result = await Mediator.Send(query);

            return result.IsSuccess 
                ? this.ApiPaginatedSuccess(result.Data, "Questions retrieved successfully")
                : this.ApiPaginatedBadRequest<QuestionListDto>(result.Errors, "Failed to retrieve questions");
        }

        /// <summary>
        /// Get detailed question information including answers and similar questions
        /// Optimized for both Angular and React consumption
        /// </summary>
        /// <param name="id">Question ID</param>
        /// <returns>Detailed question information</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestion(Guid id)
        {
            var query = new GetQuestionDetailQuery { QuestionId = id };

            // Set current user context for personalized data (voting status, etc.)
            if (_currentUserService.IsAuthenticated && Guid.TryParse(_currentUserService.UserId, out var userId))
            {
                query.UserId = userId;
            }

            var result = await Mediator.Send(query);

            if (result.IsSuccess)
                return this.ApiSuccess(result.Data, "Question retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return this.ApiNotFound("Question", id.ToString());

            return this.ApiBadRequest<QuestionDetailDto>(result.Errors, "Failed to retrieve question");
        }

        /// <summary>
        /// Create a new question with validation and expert notification
        /// Serves both Angular and React frontend creation workflows
        /// </summary>
        /// <param name="request">Question creation request</param>
        /// <returns>Created question details</returns>
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

        /// <summary>
        /// Update existing question with validation and version tracking
        /// Supports both Angular and React editing interfaces
        /// </summary>
        /// <param name="id">Question ID</param>
        /// <param name="request">Question update request</param>
        /// <returns>Updated question details</returns>
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

        /// <summary>
        /// Delete a question (soft delete with reputation impact)
        /// Available to question authors and moderators
        /// </summary>
        /// <param name="id">Question ID</param>
        /// <returns>Success confirmation</returns>
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

        /// <summary>
        /// Close a question with a specific reason
        /// Available to question authors and moderators
        /// </summary>
        /// <param name="id">Question ID</param>
        /// <param name="request">Close question request with reason</param>
        /// <returns>Success confirmation</returns>
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

        /// <summary>
        /// Search questions with full-text search and advanced filtering
        /// Optimized for both Angular and React search interfaces
        /// </summary>
        /// <param name="query">Search parameters</param>
        /// <returns>Paginated search results</returns>
        [HttpGet("search")]
        [OutputCache(Duration = 30, Tags = new[] { "Questions", "Search" })]
        public async Task<IActionResult> SearchQuestions([FromQuery] SearchQuestionsQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Search completed successfully");

            return BadRequest("Search failed", result.Errors);
        }

        /// <summary>
        /// Get similar questions for duplicate prevention and discovery
        /// Used by both Angular and React for duplicate detection
        /// </summary>
        /// <param name="id">Question ID to find similar questions for</param>
        /// <param name="query">Similarity parameters</param>
        /// <returns>List of similar questions with similarity scores</returns>
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

        /// <summary>
        /// Get similar questions by content for duplicate prevention during creation
        /// Used by both Angular and React for real-time duplicate detection
        /// </summary>
        /// <param name="query">Content-based similarity query</param>
        /// <returns>List of similar questions with similarity scores</returns>
        [HttpPost("similar")]
        [OutputCache(Duration = 60, Tags = new[] { "Questions", "Similar" })]
        public async Task<IActionResult> GetSimilarQuestionsByContent([FromBody] GetSimilarQuestionsQuery query)
        {
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Similar questions retrieved successfully");

            return BadRequest("Failed to retrieve similar questions", result.Errors);
        }

        /// <summary>
        /// Get user's own questions with filtering
        /// Used by both Angular and React for user profile pages
        /// </summary>
        /// <param name="query">User questions query parameters</param>
        /// <returns>Paginated list of user's questions</returns>
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

        /// <summary>
        /// Accept an answer for a question (question author only)
        /// Updates reputation and marks answer as accepted
        /// </summary>
        /// <param name="id">Question ID</param>
        /// <param name="answerId">Answer ID to accept</param>
        /// <returns>Success confirmation</returns>
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

        /// <summary>
        /// Get questions requiring moderation
        /// Used by React Dashboard for admin moderation workflows
        /// </summary>
        /// <param name="pageSize">Number of questions per page</param>
        /// <returns>Paginated list of questions requiring moderation</returns>
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