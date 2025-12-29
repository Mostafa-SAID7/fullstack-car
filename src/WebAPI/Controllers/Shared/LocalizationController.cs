using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Shared
{
    [Route("api/shared/[controller]")]
    public class LocalizationController : BaseController
    {
        [HttpGet("languages")]
        public async Task<IActionResult> GetSupportedLanguages()
        {
            // Implementation for getting supported languages
            var languages = new[]
            {
                new { Code = "en", Name = "English", IsDefault = true },
                new { Code = "ar", Name = "العربية", IsDefault = false },
                new { Code = "fr", Name = "Français", IsDefault = false }
            };
            
            return Ok(languages);
        }

        [HttpGet("resources/{language}")]
        public async Task<IActionResult> GetLanguageResources(string language)
        {
            // Implementation for getting language resources
            return Ok();
        }

        [HttpGet("resources/{language}/{key}")]
        public async Task<IActionResult> GetTranslation(string language, string key)
        {
            // Implementation for getting specific translation
            return Ok();
        }
    }
}