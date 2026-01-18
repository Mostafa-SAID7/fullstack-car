using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using WebAPI.Services;
using Asp.Versioning;

namespace WebAPI.Controllers.SiteSettings
{
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/style-switcher")]
    public class StyleSwitcherController : BaseController
    {
        private readonly IPredefinedStylesService _predefinedStylesService;
        private readonly ICurrentUserService _currentUserService;

        public StyleSwitcherController(
            IPredefinedStylesService predefinedStylesService,
            ICurrentUserService currentUserService)
        {
            _predefinedStylesService = predefinedStylesService;
            _currentUserService = currentUserService;
        }

        [HttpGet("available-styles")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "StyleSwitcher", "Styles" })]
        public async Task<IActionResult> GetAvailableStyles()
        {
            var styles = await _predefinedStylesService.GetAvailableStylesAsync();
            
            var stylesWithPreview = styles.Select(style => new
            {
                style.Name,
                style.Description,
                style.Category,
                style.Version,
                style.FileName,
                style.PreviewColors,
                PreviewUrl = Url.Action("GetStylePreview", "StylesApi", new { styleName = style.FileName }),
                CssUrl = Url.Action("GetPredefinedStyleCss", "StylesApi", new { styleName = style.FileName }),
                ApplyUrl = Url.Action("ApplyStyle", new { styleName = style.FileName })
            }).ToList();

            return Success(stylesWithPreview, "Available styles retrieved successfully");
        }

        [HttpPost("apply/{styleName}")]
        [Authorize]
        public async Task<IActionResult> ApplyStyle(string styleName)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var style = await _predefinedStylesService.GetStyleDefinitionAsync(styleName);
            
            if (style == null)
            {
                return NotFound("Style not found");
            }

            // Here you would typically save the user's style preference to the database
            // For now, we'll just return the style information and CSS
            var css = await _predefinedStylesService.GenerateCssFromStyleAsync(style);

            var result = new
            {
                StyleName = style.Name,
                StyleDescription = style.Description,
                AppliedBy = userGuid,
                AppliedAt = DateTime.UtcNow,
                Css = css,
                Variables = style.Variables,
                Message = $"Style '{style.Name}' applied successfully"
            };

            return Success(result, $"Style '{style.Name}' applied successfully");
        }

        [HttpGet("current-style")]
        [Authorize]
        [OutputCache(Duration = 300, Tags = new[] { "StyleSwitcher", "CurrentStyle" })]
        public async Task<IActionResult> GetCurrentStyle()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            // Here you would typically fetch the user's current style preference from the database
            // For now, we'll return a default style
            var defaultStyle = await _predefinedStylesService.GetStyleDefinitionAsync("microsoft-fluent");
            
            if (defaultStyle == null)
            {
                return BadRequest("No style configured");
            }

            var result = new
            {
                UserId = userGuid,
                CurrentStyle = defaultStyle.Name,
                StyleDescription = defaultStyle.Description,
                Variables = defaultStyle.Variables,
                LastModified = DateTime.UtcNow
            };

            return Success(result, "Current style retrieved successfully");
        }

        [HttpPost("reset-to-default")]
        [Authorize]
        public async Task<IActionResult> ResetToDefaultStyle()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            // Reset to Microsoft Fluent as default
            var defaultStyle = await _predefinedStylesService.GetStyleDefinitionAsync("microsoft-fluent");
            
            if (defaultStyle == null)
            {
                return BadRequest("Default style not found");
            }

            var css = await _predefinedStylesService.GenerateCssFromStyleAsync(defaultStyle);

            var result = new
            {
                StyleName = defaultStyle.Name,
                StyleDescription = defaultStyle.Description,
                ResetBy = userGuid,
                ResetAt = DateTime.UtcNow,
                Css = css,
                Variables = defaultStyle.Variables,
                Message = "Style reset to default successfully"
            };

            return Success(result, "Style reset to default successfully");
        }

        [HttpGet("style-comparison")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "StyleSwitcher", "Comparison" })]
        public async Task<IActionResult> GetStyleComparison([FromQuery] string[] styleNames)
        {
            if (styleNames == null || styleNames.Length == 0)
            {
                return BadRequest("At least one style name is required");
            }

            var comparisons = new List<object>();

            foreach (var styleName in styleNames)
            {
                var style = await _predefinedStylesService.GetStyleDefinitionAsync(styleName);
                if (style != null)
                {
                    comparisons.Add(new
                    {
                        Name = style.Name,
                        Description = style.Description,
                        Category = style.Category,
                        PrimaryColor = style.Variables.GetValueOrDefault("primary-color", "#000000"),
                        SecondaryColor = style.Variables.GetValueOrDefault("secondary-color", "#666666"),
                        FontFamily = style.Variables.GetValueOrDefault("font-family-primary", "system-ui"),
                        BorderRadius = style.Variables.GetValueOrDefault("border-radius-medium", "4px"),
                        PreviewUrl = Url.Action("GetStylePreview", "StylesApi", new { styleName })
                    });
                }
            }

            return Success(comparisons, "Style comparison retrieved successfully");
        }

        [HttpGet("style-categories")]
        [AllowAnonymous]
        [OutputCache(Duration = 3600, Tags = new[] { "StyleSwitcher", "Categories" })]
        public async Task<IActionResult> GetStyleCategories()
        {
            var styles = await _predefinedStylesService.GetAvailableStylesAsync();
            
            var categories = styles
                .GroupBy(s => s.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Count = g.Count(),
                    Styles = g.Select(s => new
                    {
                        s.Name,
                        s.Description,
                        s.FileName,
                        s.PreviewColors
                    }).ToList()
                })
                .OrderBy(c => c.Category)
                .ToList();

            return Success(categories, "Style categories retrieved successfully");
        }
    }
}