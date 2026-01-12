using System.Globalization;

namespace Application.Common.Interfaces;

public interface ICultureService
{
    /// <summary>
    /// Gets all supported cultures for the application
    /// </summary>
    IEnumerable<CultureInfo> GetSupportedCultures();
    
    /// <summary>
    /// Checks if a culture is supported by the application
    /// </summary>
    bool IsSupportedCulture(string culture);
    
    /// <summary>
    /// Gets the default culture for the application
    /// </summary>
    CultureInfo GetDefaultCulture();
    
    /// <summary>
    /// Determines if a culture uses right-to-left text direction
    /// </summary>
    bool IsRightToLeft(string culture);
    
    /// <summary>
    /// Maps a language code to the best supported culture variant
    /// </summary>
    string? MapLanguageToSupportedCulture(string languageCode);
    
    /// <summary>
    /// Validates and sanitizes culture input
    /// </summary>
    string ValidateAndSanitizeCulture(string culture);
}