using Application.Features.Shared.Localization.Interfaces;

namespace Application.Features.Shared.Localization.Services
{
    public class CultureInfoProvider : ICultureInfoProvider
    {
        public Task<object> GetCultureInfoAsync(string language)
        {
            var cultureInfo = language switch
            {
                "ar-EG" => new
                {
                    Language = "ar-EG",
                    DisplayName = "Arabic (Egypt)",
                    NativeName = "العربية (مصر)",
                    Direction = "rtl",
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm",
                    CurrencySymbol = "ج.م",
                    CurrencyCode = "EGP",
                    Flag = "🇪🇬",
                    Region = "Egypt"
                },
                "ar-SA" => new
                {
                    Language = "ar-SA",
                    DisplayName = "Arabic (Saudi Arabia)",
                    NativeName = "العربية (السعودية)",
                    Direction = "rtl",
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm",
                    CurrencySymbol = "ر.س",
                    CurrencyCode = "SAR",
                    Flag = "🇸🇦",
                    Region = "Saudi Arabia"
                },
                "ar-AE" => new
                {
                    Language = "ar-AE",
                    DisplayName = "Arabic (UAE)",
                    NativeName = "العربية (الإمارات)",
                    Direction = "rtl",
                    DateFormat = "dd/MM/yyyy",
                    TimeFormat = "HH:mm",
                    CurrencySymbol = "د.إ",
                    CurrencyCode = "AED",
                    Flag = "🇦🇪",
                    Region = "United Arab Emirates"
                },
                _ => new
                {
                    Language = "en-US",
                    DisplayName = "English (United States)",
                    NativeName = "English (US)",
                    Direction = "ltr",
                    DateFormat = "MM/dd/yyyy",
                    TimeFormat = "h:mm tt",
                    CurrencySymbol = "$",
                    CurrencyCode = "USD",
                    Flag = "🇺🇸",
                    Region = "United States"
                }
            };

            return Task.FromResult<object>(cultureInfo);
        }
    }
}
