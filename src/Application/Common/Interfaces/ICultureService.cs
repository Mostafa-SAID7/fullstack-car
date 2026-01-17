using System.Globalization;

namespace Application.Common.Interfaces;

public interface ICultureService
{
    IEnumerable<CultureInfo> GetSupportedCultures();
    bool IsSupportedCulture(string culture);
    CultureInfo GetDefaultCulture();
    bool IsRightToLeft(string culture);
    string? MapLanguageToSupportedCulture(string languageCode);
    string ValidateAndSanitizeCulture(string culture);
}