using Application.Features.Marketing.Campaigns.Commands;
using Application.Features.Marketing.Campaigns.DTOs.Requests;
using Application.Features.Marketing.Campaigns.Queries;
using Application.Features.Marketing.Analytics.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Marketing;

[ApiController]
[Route("api/v1/marketing")]
[Authorize]
public class MarketingController : ControllerBase
{
    private readonly IMediator _mediator;

    public MarketingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    #region Campaigns

    /// <summary>
    /// Get all campaigns with pagination and filtering
    /// </summary>
    [HttpGet("campaigns")]
    public async Task<IActionResult> GetCampaigns([FromQuery] GetCampaignsQuery query)
    {
        var result = await _mediator.Send(query);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Get campaign by ID
    /// </summary>
    [HttpGet("campaigns/{id:guid}")]
    public async Task<IActionResult> GetCampaign(Guid id)
    {
        var result = await _mediator.Send(new GetCampaignByIdQuery(id));
        return result.Succeeded ? Ok(result) : NotFound(result);
    }

    /// <summary>
    /// Create a new campaign
    /// </summary>
    [HttpPost("campaigns")]
    public async Task<IActionResult> CreateCampaign([FromBody] CreateCampaignRequest request)
    {
        var result = await _mediator.Send(new CreateCampaignCommand(request));
        return result.Succeeded ? CreatedAtAction(nameof(GetCampaign), new { id = result.Data!.Id }, result) : BadRequest(result);
    }

    /// <summary>
    /// Update an existing campaign
    /// </summary>
    [HttpPut("campaigns/{id:guid}")]
    public async Task<IActionResult> UpdateCampaign(Guid id, [FromBody] UpdateCampaignRequest request)
    {
        var result = await _mediator.Send(new UpdateCampaignCommand(id, request));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Delete a campaign
    /// </summary>
    [HttpDelete("campaigns/{id:guid}")]
    public async Task<IActionResult> DeleteCampaign(Guid id)
    {
        var result = await _mediator.Send(new DeleteCampaignCommand(id));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    #endregion

    #region Campaign Content

    /// <summary>
    /// Get campaign contents
    /// </summary>
    [HttpGet("campaigns/{campaignId:guid}/contents")]
    public async Task<IActionResult> GetCampaignContents(Guid campaignId, [FromQuery] GetCampaignContentsQuery query)
    {
        query.CampaignId = campaignId;
        var result = await _mediator.Send(query);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Create campaign content
    /// </summary>
    [HttpPost("campaigns/contents")]
    public async Task<IActionResult> CreateCampaignContent([FromBody] CreateCampaignContentRequest request)
    {
        var result = await _mediator.Send(new CreateCampaignContentCommand(request));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Update campaign content
    /// </summary>
    [HttpPut("campaigns/contents/{id:guid}")]
    public async Task<IActionResult> UpdateCampaignContent(Guid id, [FromBody] UpdateCampaignContentRequest request)
    {
        var result = await _mediator.Send(new UpdateCampaignContentCommand(id, request));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Delete campaign content
    /// </summary>
    [HttpDelete("campaigns/contents/{id:guid}")]
    public async Task<IActionResult> DeleteCampaignContent(Guid id)
    {
        var result = await _mediator.Send(new DeleteCampaignContentCommand(id));
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    #endregion

    #region Analytics

    /// <summary>
    /// Get marketing overview analytics
    /// </summary>
    [HttpGet("analytics/overview")]
    public async Task<IActionResult> GetMarketingOverview([FromQuery] GetMarketingOverviewQuery query)
    {
        var result = await _mediator.Send(query);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Get platform analytics
    /// </summary>
    [HttpGet("analytics/platforms")]
    public async Task<IActionResult> GetPlatformAnalytics([FromQuery] GetPlatformAnalyticsQuery query)
    {
        var result = await _mediator.Send(query);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Get campaign analytics
    /// </summary>
    [HttpGet("analytics/campaigns")]
    public async Task<IActionResult> GetCampaignAnalytics([FromQuery] GetCampaignAnalyticsQuery query)
    {
        var result = await _mediator.Send(query);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Get marketing performance data
    /// </summary>
    [HttpGet("analytics/performance")]
    public async Task<IActionResult> GetMarketingPerformance([FromQuery] GetMarketingPerformanceQuery query)
    {
        var result = await _mediator.Send(query);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    /// <summary>
    /// Get top performing content
    /// </summary>
    [HttpGet("analytics/top-content")]
    public async Task<IActionResult> GetTopPerformingContent([FromQuery] GetTopPerformingContentQuery query)
    {
        var result = await _mediator.Send(query);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    #endregion

    #region Social Platforms

    /// <summary>
    /// Get all social platforms
    /// </summary>
    [HttpGet("platforms")]
    public async Task<IActionResult> GetSocialPlatforms([FromQuery] GetSocialPlatformsQuery query)
    {
        var result = await _mediator.Send(query);
        return result.Succeeded ? Ok(result) : BadRequest(result);
    }

    #endregion
}