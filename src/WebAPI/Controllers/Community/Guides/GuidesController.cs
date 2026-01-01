using Application.Features.Community.Guides.Commands;
using Application.Features.Community.Guides.DTOs.Requests;
using Application.Features.Community.Guides.Queries;
using Domain.Enums.Community.Guides;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Community.Guides;

[ApiController]
[Route("api/community/guides")]
[Authorize]
public class GuidesController : ControllerBase
{
    private readonly IMediator _mediator;

    public GuidesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private string GetCurrentUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetGuides(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] GuideCategory? category = null,
        [FromQuery] GuideDifficulty? difficulty = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] bool? isFeatured = null,
        [FromQuery] string? sortBy = "CreatedAt",
        [FromQuery] bool sortDescending = true)
    {
        var userId = User.Identity?.IsAuthenticated == true ? GetCurrentUserId() : null;
        var query = new GetGuidesQuery(page, pageSize, category, difficulty, searchTerm, isFeatured, sortBy, sortDescending, userId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGuideById(int id)
    {
        var userId = User.Identity?.IsAuthenticated == true ? GetCurrentUserId() : null;
        var query = new GetGuideByIdQuery(id, userId);
        var result = await _mediator.Send(query);
        
        if (result == null)
            return NotFound();
            
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGuide([FromBody] CreateGuideRequest request)
    {
        var command = new CreateGuideCommand(request, GetCurrentUserId());
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetGuideById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGuide(int id, [FromBody] UpdateGuideRequest request)
    {
        if (id != request.Id)
            return BadRequest("ID mismatch");

        try
        {
            var command = new UpdateGuideCommand(request, GetCurrentUserId());
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost("{id}/rate")]
    public async Task<IActionResult> RateGuide(int id, [FromBody] RateGuideRequest request)
    {
        if (id != request.GuideId)
            return BadRequest("ID mismatch");

        if (request.Rating < 1 || request.Rating > 5)
            return BadRequest("Rating must be between 1 and 5");

        var command = new RateGuideCommand(request, GetCurrentUserId());
        var result = await _mediator.Send(command);
        
        if (!result)
            return NotFound();
            
        return Ok();
    }

    [HttpPost("{id}/bookmark")]
    public async Task<IActionResult> BookmarkGuide(int id, [FromBody] string? notes = null)
    {
        var command = new BookmarkGuideCommand(id, GetCurrentUserId(), notes);
        var result = await _mediator.Send(command);
        
        if (!result)
            return NotFound();
            
        return Ok();
    }

    [HttpGet("bookmarks")]
    public async Task<IActionResult> GetBookmarkedGuides(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = new GetUserBookmarkedGuidesQuery(GetCurrentUserId(), page, pageSize);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("categories")]
    [AllowAnonymous]
    public IActionResult GetCategories()
    {
        var categories = Enum.GetValues<GuideCategory>()
            .Select(c => new { Value = (int)c, Name = c.ToString() })
            .ToList();
        return Ok(categories);
    }

    [HttpGet("difficulties")]
    [AllowAnonymous]
    public IActionResult GetDifficulties()
    {
        var difficulties = Enum.GetValues<GuideDifficulty>()
            .Select(d => new { Value = (int)d, Name = d.ToString() })
            .ToList();
        return Ok(difficulties);
    }
}