using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using WebAPI.Services;
using Asp.Versioning;

namespace WebAPI.Controllers.SiteSettings
{
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/styles-api")]
    public class StylesApiController : ControllerBase
    {
        private readonly IPredefinedStylesService _predefinedStylesService;

        public StylesApiController(IPredefinedStylesService predefinedStylesService)
        {
            _predefinedStylesService = predefinedStylesService;
        }

        [HttpGet("predefined")]
        [OutputCache(Duration = 3600, Tags = new[] { "Styles", "Predefined" })]
        public async Task<IActionResult> GetPredefinedStyles()
        {
            var styles = await _predefinedStylesService.GetAvailableStylesAsync();
            return Ok(new { 
                success = true, 
                data = styles, 
                message = "Predefined styles retrieved successfully" 
            });
        }

        [HttpGet("predefined/{styleName}")]
        [OutputCache(Duration = 3600, Tags = new[] { "Styles", "Predefined" })]
        public async Task<IActionResult> GetPredefinedStyle(string styleName)
        {
            var style = await _predefinedStylesService.GetStyleDefinitionAsync(styleName);
            
            if (style == null)
            {
                return NotFound(new { 
                    success = false, 
                    message = "Predefined style not found" 
                });
            }

            return Ok(new { 
                success = true, 
                data = style, 
                message = "Predefined style retrieved successfully" 
            });
        }

        [HttpGet("predefined/{styleName}/css")]
        [OutputCache(Duration = 3600, Tags = new[] { "Styles", "CSS" })]
        public async Task<IActionResult> GetPredefinedStyleCss(string styleName)
        {
            var style = await _predefinedStylesService.GetStyleDefinitionAsync(styleName);
            
            if (style == null)
            {
                return NotFound();
            }

            var css = await _predefinedStylesService.GenerateCssFromStyleAsync(style);
            return Content(css, "text/css");
        }

        [HttpGet("preview/{styleName}")]
        [OutputCache(Duration = 1800, Tags = new[] { "Styles", "Preview" })]
        public async Task<IActionResult> GetStylePreview(string styleName)
        {
            var style = await _predefinedStylesService.GetStyleDefinitionAsync(styleName);
            
            if (style == null)
            {
                return NotFound(new { 
                    success = false, 
                    message = "Predefined style not found" 
                });
            }

            var previewHtml = GeneratePreviewHtml(style);
            return Content(previewHtml, "text/html");
        }

        private string GeneratePreviewHtml(PredefinedStyleDefinition style)
        {
            var css = _predefinedStylesService.GenerateCssFromStyleAsync(style).Result;
            
            return $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>{style.Name} Preview</title>
    <style>
        {css}
        body {{ 
            font-family: var(--font-family-primary); 
            background: var(--background-primary);
            color: var(--text-primary);
            margin: 0;
            padding: var(--spacing-lg);
        }}
        .preview-container {{ 
            max-width: 800px; 
            margin: 0 auto; 
            display: grid; 
            gap: var(--spacing-lg);
        }}
        .preview-section {{ 
            padding: var(--spacing-lg);
        }}
        .color-palette {{ 
            display: flex; 
            gap: var(--spacing-sm); 
            flex-wrap: wrap;
        }}
        .color-swatch {{ 
            width: 60px; 
            height: 60px; 
            border-radius: var(--border-radius-medium);
            border: 1px solid var(--border-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--font-size-xs);
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }}
        .buttons {{ 
            display: flex; 
            gap: var(--spacing-sm); 
            flex-wrap: wrap;
        }}
        .form-group {{ 
            margin-bottom: var(--spacing-md);
        }}
        .form-group label {{ 
            display: block; 
            margin-bottom: var(--spacing-xs);
            font-weight: var(--font-weight-medium);
        }}
    </style>
</head>
<body>
    <div class='preview-container'>
        <div class='preview-section'>
            <h1>{style.Name}</h1>
            <p>{style.Description}</p>
        </div>
        
        <div class='card preview-section'>
            <h2>Color Palette</h2>
            <div class='color-palette'>
                <div class='color-swatch' style='background: var(--primary-color)'>Primary</div>
                <div class='color-swatch' style='background: var(--secondary-color)'>Secondary</div>
                <div class='color-swatch' style='background: var(--success-color)'>Success</div>
                <div class='color-swatch' style='background: var(--warning-color)'>Warning</div>
                <div class='color-swatch' style='background: var(--error-color)'>Error</div>
            </div>
        </div>
        
        <div class='card preview-section'>
            <h2>Buttons</h2>
            <div class='buttons'>
                <button class='button'>Primary Button</button>
                <button class='button-secondary'>Secondary Button</button>
            </div>
        </div>
        
        <div class='card preview-section'>
            <h2>Form Elements</h2>
            <div class='form-group'>
                <label>Text Input</label>
                <input class='input' type='text' placeholder='Enter text here...' />
            </div>
            <div class='form-group'>
                <label>Select</label>
                <select class='input'>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                </select>
            </div>
        </div>
        
        <div class='card preview-section'>
            <h2>Typography</h2>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
            <p class='text-secondary'>This is secondary text.</p>
            <p class='text-tertiary'>This is tertiary text.</p>
        </div>
    </div>
</body>
</html>";
        }
    }
}