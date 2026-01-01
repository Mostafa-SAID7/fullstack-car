using Application.Common.Interfaces;
using Application.Features.Admin.Analytics.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Analytics;

[ApiController]
[Route("api/admin/analytics/advanced")]
[Authorize(Roles = "Administrator")]
public class AdvancedAnalyticsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdvancedAnalyticsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAdvancedAnalytics([FromQuery] GetAdvancedAnalyticsQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
