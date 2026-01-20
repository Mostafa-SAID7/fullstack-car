using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.QA
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/qa/questions/{questionId}/reviews")]
    public class QuestionReviewsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetQuestionReviews(
            Guid questionId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedReviewsQuery
            {
                ContentType = ContentType.Question,
                ContentId = questionId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Question reviews retrieved successfully");
        }
    }
}
