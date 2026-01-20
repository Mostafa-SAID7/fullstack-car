using Application.Common.Models;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.QA
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/qa/questions/{questionId}/events")]
    public class QuestionEventsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetQuestionEvents(
            Guid questionId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool upcomingOnly = true)
        {
            var query = new GetRelatedEventsQuery
            {
                ContentType = ContentType.Question,
                ContentId = questionId,
                PageNumber = page,
                PageSize = pageSize,
                UpcomingOnly = upcomingOnly
            };

            var result = await Mediator.Send(query);
            return Success(result, "Question events retrieved successfully");
        }

        [HttpPost("{eventId}")]
        public async Task<IActionResult> LinkEvent(Guid questionId, Guid eventId)
        {
            var result = await Mediator.Send(new LinkEventCommand { EventId = eventId, TargetContentType = ContentType.Question, TargetId = questionId });
            return result.Succeeded ? Success(result.Data, "Event linked to question successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{eventId}")]
        public async Task<IActionResult> UnlinkEvent(Guid eventId)
        {
            var result = await Mediator.Send(new UnlinkEventCommand { EventId = eventId });
            return result.Succeeded ? Success(result.Data, "Event unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
