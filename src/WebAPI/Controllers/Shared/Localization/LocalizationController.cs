using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using Application.Features.Shared.Localization.Queries;
using Application.Features.Shared.Localization.Commands;
using Asp.Versioning;

namespace WebAPI.Controllers.Shared.Localization
{

    [ApiVersion("4.0")]
    [Route("api/v{version:apiVersion}/shared/localization")]
    public class LocalizationController : BaseController
    {
        private readonly IMediator _mediator;

        public LocalizationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("languages")]
        public async Task<IActionResult> GetSupportedLanguages()
        {
            var result = await _mediator.Send(new GetSupportedLanguagesQuery());
            return Ok(new { Languages = result, TotalCount = result.Count() });
        }

        [HttpGet("resources/{language}")]
        public async Task<IActionResult> GetLanguageResources(string language)
        {
            try
            {
                var result = await _mediator.Send(new GetLanguageResourcesQuery { Language = language });
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message, Language = language });
            }
        }

        [HttpGet("categories/{language}/{category}")]
        public async Task<IActionResult> GetCategoryResources(string language, string category)
        {
            try
            {
                var result = await _mediator.Send(new GetCategoryResourcesQuery { Language = language, Category = category });
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message, Language = language });
            }
        }

        [HttpGet("translate/{language}/{key}")]
        public async Task<IActionResult> GetTranslation(string language, string key)
        {
            try
            {
                var result = await _mediator.Send(new GetTranslationQuery { Language = language, Key = key });
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message, Language = language });
            }
        }

        [Authorize]
        [HttpPost("set-language")]
        public async Task<IActionResult> SetUserLanguage([FromBody] SetLanguageRequest request)
        {
            try
            {
                var userId = User.Identity?.Name ?? "anonymous"; // In real app, get ID from Claims
                var result = await _mediator.Send(new SetUserLanguageCommand { Language = request.Language, UserId = userId });
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("detect")]
        public async Task<IActionResult> DetectLanguage()
        {
            var result = await _mediator.Send(new DetectLanguageQuery
            {
                AcceptLanguage = Request.Headers["Accept-Language"].ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString()
            });
            return Ok(result);
        }

        [HttpGet("culture/{language}")]
        public async Task<IActionResult> GetCultureInfo(string language)
        {
            try
            {
                var result = await _mediator.Send(new GetCultureInfoQuery { Language = language });
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message, Language = language });
            }
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateTranslations([FromBody] ValidateTranslationsRequest request)
        {
            try
            {
                var result = await _mediator.Send(new ValidateTranslationsQuery { Language = request.Language });
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message, Language = request.Language });
            }
        }

        // CRUD Operations for Translation Management
        [Authorize(Roles = "Admin")]
        [HttpGet("translations")]
        public async Task<IActionResult> GetTranslations([FromQuery] GetTranslationsQuery query)
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("translations")]
        public async Task<IActionResult> CreateTranslation([FromBody] CreateTranslationCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetTranslations),
                    new { language = result.Language, category = result.Category },
                    result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("translations/{id}")]
        public async Task<IActionResult> UpdateTranslation(string id, [FromBody] UpdateTranslationCommand command)
        {
            try
            {
                command.Id = id;
                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = "Translation not found" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("translations/{id}")]
        public async Task<IActionResult> DeleteTranslation(string id)
        {
            try
            {
                var result = await _mediator.Send(new DeleteTranslationCommand { Id = id });
                return Ok(new { Success = result, Message = "Translation deleted successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = "Translation not found" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("stats")]
        public async Task<IActionResult> GetTranslationStats()
        {
            var result = await _mediator.Send(new GetTranslationStatsQuery());
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("bulk-import")]
        public async Task<IActionResult> BulkImportTranslations([FromBody] BulkImportTranslationsCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("export")]
        public async Task<IActionResult> ExportTranslations([FromBody] ExportTranslationsCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return File(result.Content, result.ContentType, result.FileName);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }

    public class SetLanguageRequest
    {
        public string Language { get; set; } = "en-US";
    }

    public class ValidateTranslationsRequest
    {
        public string Language { get; set; } = string.Empty;
    }
}
