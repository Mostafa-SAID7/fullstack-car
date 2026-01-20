using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Shared.Queries;
using Domain.Enums.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.QA
{
    [Authorize]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/qa/questions/{questionId}/groups")]
    public class QuestionGroupsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetQuestionGroups(
            Guid questionId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetRelatedGroupsQuery
            {
                ContentType = ContentType.Question,
                ContentId = questionId,
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);
            return Success(result, "Question groups retrieved successfully");
        }

        [HttpPost("{groupId}")]
        public async Task<IActionResult> LinkGroup(Guid questionId, Guid groupId)
        {
            var result = await Mediator.Send(new LinkGroupCommand { GroupId = groupId, TargetContentType = ContentType.Question, TargetId = questionId });
            return result.Succeeded ? Success(result.Data, "Group linked to question successfully") : BadRequest(result.Errors);
        }

        [HttpDelete("{groupId}")]
        public async Task<IActionResult> UnlinkGroup(Guid groupId)
        {
            var result = await Mediator.Send(new UnlinkGroupCommand { GroupId = groupId });
            return result.Succeeded ? Success(result.Data, "Group unlinked successfully") : BadRequest(result.Errors);
        }
    }
}
