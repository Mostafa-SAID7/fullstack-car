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
    [Route("api/v{version:apiVersion}/qa/votes")]
    public class VotingController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IQAHubService _qaHubService;

        public VotingController(
            ICurrentUserService currentUserService,
            IQAHubService qaHubService)
        {
            _currentUserService = currentUserService;
            _qaHubService = qaHubService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateVote([FromBody] CreateVoteRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateVoteCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // Send real-time notification about vote update
                try
                {
                    var voteUpdateDto = new VoteUpdateDto
                    {
                        ContentId = request.ContentId,
                        ContentType = request.ContentType,
                        VoteType = request.VoteType,
                        NewVoteScore = 0, // This should be populated from the result
                        VoterId = userGuid,
                        Timestamp = DateTime.UtcNow
                    };
                    await _qaHubService.NotifyVoteUpdateAsync(voteUpdateDto);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request
                    // Real-time notification failure shouldn't break the core functionality
                    // TODO: Add proper logging here
                }

                return Created(string.Empty, new { message = "Vote created successfully" });
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Content not found");

            if (result.Errors.Any(e => e.Contains("own content") || e.Contains("self-vote")))
                return BadRequest("Cannot vote on your own content", result.Errors);

            if (result.Errors.Any(e => e.Contains("already voted")))
                return BadRequest("You have already voted on this content", result.Errors);

            if (result.Errors.Any(e => e.Contains("reputation") || e.Contains("downvote")))
                return BadRequest("Insufficient reputation to downvote", result.Errors);

            return BadRequest("Failed to create vote", result.Errors);
        }
        [HttpDelete("{contentType}/{contentId}")]
        public async Task<IActionResult> RemoveVote(Guid contentId, string contentType)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            // Validate content type
            if (contentType != "Question" && contentType != "Answer")
            {
                return BadRequest("Invalid content type. Must be 'Question' or 'Answer'");
            }

            var command = new RemoveVoteCommand
            {
                UserId = userGuid,
                ContentId = contentId,
                ContentType = contentType
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // Send real-time notification about vote removal
                try
                {
                    var voteUpdateDto = new VoteUpdateDto
                    {
                        ContentId = contentId,
                        ContentType = contentType,
                        VoteType = "Removed",
                        NewVoteScore = 0, // This should be populated from the result
                        VoterId = userGuid,
                        Timestamp = DateTime.UtcNow
                    };
                    await _qaHubService.NotifyVoteUpdateAsync(voteUpdateDto);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request
                    // Real-time notification failure shouldn't break the core functionality
                    // TODO: Add proper logging here
                }

                return Success("Vote removed successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Vote not found");

            if (result.Errors.Any(e => e.Contains("5 minutes") || e.Contains("time limit")))
                return BadRequest("Votes can only be removed within 5 minutes of casting", result.Errors);

            return BadRequest("Failed to remove vote", result.Errors);
        }
        [HttpPut]
        public async Task<IActionResult> ChangeVote([FromBody] ChangeVoteRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new ChangeVoteCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
            {
                // Send real-time notification about vote change
                try
                {
                    var voteUpdateDto = new VoteUpdateDto
                    {
                        ContentId = request.ContentId,
                        ContentType = request.ContentType,
                        VoteType = request.NewVoteType,
                        NewVoteScore = 0, // This should be populated from the result
                        VoterId = userGuid,
                        Timestamp = DateTime.UtcNow
                    };
                    await _qaHubService.NotifyVoteUpdateAsync(voteUpdateDto);
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail the request
                    // Real-time notification failure shouldn't break the core functionality
                    // TODO: Add proper logging here
                }

                return Success("Vote changed successfully");
            }

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Vote not found");

            if (result.Errors.Any(e => e.Contains("5 minutes") || e.Contains("time limit")))
                return BadRequest("Votes can only be changed within 5 minutes of casting", result.Errors);

            if (result.Errors.Any(e => e.Contains("same type") || e.Contains("already")))
                return BadRequest("Vote is already of the requested type", result.Errors);

            if (result.Errors.Any(e => e.Contains("reputation") || e.Contains("downvote")))
                return BadRequest("Insufficient reputation to downvote", result.Errors);

            return BadRequest("Failed to change vote", result.Errors);
        }
        [HttpGet("my-votes")]
        [OutputCache(Duration = 30, Tags = new[] { "Votes", "UserVotes" })]
        public async Task<IActionResult> GetUserVotes([FromQuery] GetUserVotesQuery query)
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
                return Success(result.Data, "User votes retrieved successfully");

            return BadRequest("Failed to retrieve user votes", result.Errors);
        }
        [HttpGet("{contentType}/{contentId}/status")]
        [OutputCache(Duration = 60, Tags = new[] { "Votes", "VoteStatus" })]
        public async Task<IActionResult> GetVoteStatus(Guid contentId, string contentType)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                // Return null vote status for unauthenticated users
                return Success(new { HasVoted = false, VoteType = (string?)null }, "Vote status retrieved");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            // Validate content type
            if (contentType != "Question" && contentType != "Answer")
            {
                return BadRequest("Invalid content type. Must be 'Question' or 'Answer'");
            }

            try
            {
                var vote = await Mediator.Send(new GetUserVotesQuery 
                { 
                    UserId = userGuid,
                    ContentType = contentType,
                    PageSize = 1
                });

                if (vote.Succeeded && vote.Data.Items.Any(v => v.ContentId == contentId))
                {
                    var userVote = vote.Data.Items.First(v => v.ContentId == contentId);
                    return Success(new 
                    { 
                        HasVoted = true, 
                        VoteType = userVote.VoteType.ToString().Replace("vote", ""),
                        VotedAt = userVote.CreatedAt,
                        CanChange = (DateTime.UtcNow - userVote.CreatedAt).TotalMinutes <= 5
                    }, "Vote status retrieved");
                }

                return Success(new { HasVoted = false, VoteType = (string?)null }, "Vote status retrieved");
            }
            catch (Exception)
            {
                return Success(new { HasVoted = false, VoteType = (string?)null }, "Vote status retrieved");
            }
        }
        [HttpGet("{contentType}/{contentId}/stats")]
        [AllowAnonymous]
        [OutputCache(Duration = 30, Tags = new[] { "Votes", "VoteStats" })]
        public async Task<IActionResult> GetVoteStats(Guid contentId, string contentType)
        {
            // Validate content type
            if (contentType != "Question" && contentType != "Answer")
            {
                return BadRequest("Invalid content type. Must be 'Question' or 'Answer'");
            }

            try
            {
                if (contentType == "Question")
                {
                    var question = await Mediator.Send(new GetQuestionDetailQuery { QuestionId = contentId });
                    if (question.Succeeded)
                    {
                        return Success(new
                        {
                            UpvotesCount = question.Data.UpvotesCount,
                            DownvotesCount = question.Data.DownvotesCount,
                            VoteScore = question.Data.VoteScore,
                            TotalVotes = question.Data.UpvotesCount + question.Data.DownvotesCount
                        }, "Vote statistics retrieved");
                    }
                }
                else
                {
                    var answer = await Mediator.Send(new GetAnswerQuery { AnswerId = contentId });
                    if (answer.Succeeded)
                    {
                        return Success(new
                        {
                            UpvotesCount = answer.Data.UpvotesCount,
                            DownvotesCount = answer.Data.DownvotesCount,
                            VoteScore = answer.Data.VoteScore,
                            TotalVotes = answer.Data.UpvotesCount + answer.Data.DownvotesCount
                        }, "Vote statistics retrieved");
                    }
                }

                return NotFound("Content not found");
            }
            catch (Exception)
            {
                return BadRequest("Failed to retrieve vote statistics");
            }
        }
    }
}


