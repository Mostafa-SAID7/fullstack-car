using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Application.Common.Interfaces;

namespace WebAPI.Controllers.Shared.Localization
{
    [Route("api/shared/localization")]
    public class LocalizationController : BaseController
    {
        private readonly ILocalizationService _localizationService;

        public LocalizationController(ILocalizationService localizationService)
        {
            _localizationService = localizationService;
        }

        [HttpGet("languages")]
        public async Task<IActionResult> GetSupportedLanguages()
        {
            var supportedLanguages = await _localizationService.GetSupportedLanguagesAsync();
            
            var languages = supportedLanguages.Select(lang => new
            {
                Code = lang,
                Name = GetLanguageDisplayName(lang),
                NativeName = GetLanguageNativeName(lang),
                IsDefault = lang == "en-US",
                Flag = GetLanguageFlag(lang),
                Direction = lang.StartsWith("ar-") ? "rtl" : "ltr",
                Region = GetLanguageRegion(lang)
            });
            
            return Ok(new { Languages = languages, TotalCount = languages.Count() });
        }

        [HttpGet("resources/{language}")]
        public async Task<IActionResult> GetLanguageResources(string language)
        {
            if (!await _localizationService.IsLanguageSupportedAsync(language))
            {
                return BadRequest(new { Message = "Unsupported language", Language = language });
            }

            var resources = await _localizationService.GetResourcesAsync(language);
            
            return Ok(new { 
                Language = language,
                Resources = resources,
                Direction = language.StartsWith("ar-") ? "rtl" : "ltr",
                LoadedAt = DateTime.UtcNow
            });
        }

        [HttpGet("categories/{language}/{category}")]
        public async Task<IActionResult> GetCategoryResources(string language, string category)
        {
            if (!await _localizationService.IsLanguageSupportedAsync(language))
            {
                return BadRequest(new { Message = "Unsupported language", Language = language });
            }

            var categoryResources = await _localizationService.GetCategoryResourcesAsync(language, category);
            
            return Ok(new { 
                Language = language,
                Category = category,
                Resources = categoryResources,
                Count = categoryResources.Count
            });
        }

        [HttpGet("translate/{language}/{key}")]
        public async Task<IActionResult> GetTranslation(string language, string key)
        {
            if (!await _localizationService.IsLanguageSupportedAsync(language))
            {
                return BadRequest(new { Message = "Unsupported language", Language = language });
            }

            var translation = await _localizationService.GetTranslationAsync(language, key);
            
            return Ok(new { 
                Key = key, 
                Translation = translation, 
                Language = language,
                Found = translation != key
            });
        }

        [Authorize]
        [HttpPost("set-language")]
        public async Task<IActionResult> SetUserLanguage([FromBody] SetLanguageRequest request)
        {
            if (!await _localizationService.IsLanguageSupportedAsync(request.Language))
            {
                var supportedLanguages = await _localizationService.GetSupportedLanguagesAsync();
                return BadRequest(new { Message = "Unsupported language", SupportedLanguages = supportedLanguages });
            }
            
            var userId = User.Identity?.Name ?? "anonymous";
            await _localizationService.SetUserLanguageAsync(userId, request.Language);
            
            return Ok(new { 
                Message = "Language preference updated successfully", 
                Language = request.Language,
                Direction = request.Language.StartsWith("ar-") ? "rtl" : "ltr"
            });
        }

        [HttpGet("detect")]
        public async Task<IActionResult> DetectLanguage()
        {
            var acceptLanguage = Request.Headers["Accept-Language"].ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();
            var detectedLanguage = await _localizationService.DetectLanguageAsync(acceptLanguage, userAgent);
            
            return Ok(new { 
                DetectedLanguage = detectedLanguage,
                AcceptLanguage = acceptLanguage,
                Direction = detectedLanguage.StartsWith("ar-") ? "rtl" : "ltr",
                Confidence = GetDetectionConfidence(acceptLanguage, detectedLanguage)
            });
        }

        [HttpGet("culture/{language}")]
        public async Task<IActionResult> GetCultureInfo(string language)
        {
            if (!await _localizationService.IsLanguageSupportedAsync(language))
            {
                return BadRequest(new { Message = "Unsupported language", Language = language });
            }

            var cultureInfo = await _localizationService.GetCultureInfoAsync(language);
            return Ok(cultureInfo);
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateTranslations([FromBody] ValidateTranslationsRequest request)
        {
            if (!await _localizationService.IsLanguageSupportedAsync(request.Language))
            {
                return BadRequest(new { Message = "Unsupported language", Language = request.Language });
            }

            var baseResources = await _localizationService.GetResourcesAsync("en-US");
            var targetResources = await _localizationService.GetResourcesAsync(request.Language);
            
            var missingKeys = baseResources.Keys.Except(targetResources.Keys).ToList();
            var extraKeys = targetResources.Keys.Except(baseResources.Keys).ToList();
            
            return Ok(new {
                Language = request.Language,
                TotalKeys = baseResources.Count,
                TranslatedKeys = targetResources.Count,
                MissingKeys = missingKeys,
                ExtraKeys = extraKeys,
                CompletionPercentage = Math.Round((double)targetResources.Count / baseResources.Count * 100, 2)
            });
        }

        private string GetLanguageDisplayName(string language) => language switch
        {
            "en-US" => "English (United States)",
            "ar-EG" => "Arabic (Egypt)",
            "ar-SA" => "Arabic (Saudi Arabia)",
            "ar-AE" => "Arabic (UAE)",
            _ => language
        };

        private string GetLanguageNativeName(string language) => language switch
        {
            "en-US" => "English (US)",
            "ar-EG" => "العربية (مصر)",
            "ar-SA" => "العربية (السعودية)",
            "ar-AE" => "العربية (الإمارات)",
            _ => language
        };

        private string GetLanguageFlag(string language) => language switch
        {
            "en-US" => "🇺🇸",
            "ar-EG" => "🇪🇬",
            "ar-SA" => "🇸🇦",
            "ar-AE" => "🇦🇪",
            _ => "🌐"
        };

        private string GetLanguageRegion(string language) => language switch
        {
            "en-US" => "United States",
            "ar-EG" => "Egypt",
            "ar-SA" => "Saudi Arabia",
            "ar-AE" => "United Arab Emirates",
            _ => "Unknown"
        };

        private double GetDetectionConfidence(string acceptLanguage, string detectedLanguage)
        {
            if (string.IsNullOrEmpty(acceptLanguage))
                return 0.5;

            if (acceptLanguage.Contains(detectedLanguage))
                return 0.9;
            
            if (acceptLanguage.Contains(detectedLanguage.Split('-')[0]))
                return 0.7;

            return 0.3;
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