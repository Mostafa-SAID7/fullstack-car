using Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Infrastructure.Services;

public class CultureService : ICultureService
{
    private readonly ILogger<CultureService> _logger;
    private readonly string[] _supportedCultures = { "en-US", "ar-EG", "ar-AE", "ar-SA" };
    private readonly Dictionary<string, string> _languageMappings = new()
    {
        { "en", "en-US" },
        { "ar", "ar-EG" }, // Default Arabic variant
        { "english", "en-US" },
        { "arabic", "ar-EG" }
    };

    public CultureService(ILogger<CultureService> logger)
    {
        _logger = logger;
    }

    public IEnumerable<CultureInfo> GetSupportedCultures()
    {
        return _supportedCultures.Select(culture => new CultureInfo(culture));
    }

    public bool IsSupportedCulture(string culture)
    {
        if (string.IsNullOrEmpty(culture))
            return false;

        return _supportedCultures.Contains(culture, StringComparer.OrdinalIgnoreCase);
    }

    public CultureInfo GetDefaultCulture()
    {
        return new CultureInfo("en-US");
    }

    public bool IsRightToLeft(string culture)
    {
        if (string.IsNullOrEmpty(culture))
            return false;

        return culture.StartsWith("ar-", StringComparison.OrdinalIgnoreCase);
    }

    public string? MapLanguageToSupportedCulture(string languageCode)
    {
        if (string.IsNullOrEmpty(languageCode))
            return null;

        var normalizedLanguage = languageCode.ToLower().Trim();

        // First check if it's already a supported culture
        if (IsSupportedCulture(languageCode))
            return languageCode;

        // Check direct mappings
        if (_languageMappings.TryGetValue(normalizedLanguage, out var mappedCulture))
            return mappedCulture;

        // Try to extract language part from culture code (e.g., "ar-SA" -> "ar")
        var languagePart = normalizedLanguage.Split('-')[0];
        if (_languageMappings.TryGetValue(languagePart, out var mappedFromLanguagePart))
            return mappedFromLanguagePart;

        _logger.LogDebug("No mapping found for language code: {LanguageCode}", languageCode);
        return null;
    }

    public string ValidateAndSanitizeCulture(string culture)
    {
        if (string.IsNullOrEmpty(culture))
            return "en-US";

        // Remove any non-alphanumeric characters except hyphens
        var sanitized = Regex.Replace(culture, @"[^a-zA-Z0-9-]", "");

        // Validate format (language-region)
        if (!Regex.IsMatch(sanitized, @"^[a-zA-Z]{2}-[a-zA-Z]{2}$"))
        {
            _logger.LogWarning("Invalid culture format: {Culture}. Using default.", culture);
            return "en-US";
        }

        // Check if it's supported
        if (IsSupportedCulture(sanitized))
            return sanitized;

        // Try to map the language part
        var mappedCulture = MapLanguageToSupportedCulture(sanitized);
        if (mappedCulture != null)
            return mappedCulture;

        _logger.LogWarning("Unsupported culture: {Culture}. Using default.", culture);
        return "en-US";
    }
}