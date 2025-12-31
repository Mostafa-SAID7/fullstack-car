using FluentValidation;
using System.Text.RegularExpressions;

namespace Application.Common.Validators
{
    public static class CustomValidators
    {
        public static IRuleBuilderOptions<T, string> MustBeValidUsername<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .Must(username => !string.IsNullOrWhiteSpace(username) && 
                                 Regex.IsMatch(username, @"^[a-zA-Z0-9_]{3,20}$"))
                .WithMessage("Username must be 3-20 characters long and contain only letters, numbers, and underscores");
        }

        public static IRuleBuilderOptions<T, string> MustBeValidSlug<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .Must(slug => !string.IsNullOrWhiteSpace(slug) && 
                             Regex.IsMatch(slug, @"^[a-z0-9]+(?:-[a-z0-9]+)*$"))
                .WithMessage("Slug must contain only lowercase letters, numbers, and hyphens");
        }

        public static IRuleBuilderOptions<T, string> MustBeValidHexColor<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .Must(color => !string.IsNullOrWhiteSpace(color) && 
                              Regex.IsMatch(color, @"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"))
                .WithMessage("Color must be a valid hex color code (e.g., #FF0000 or #F00)");
        }

        public static IRuleBuilderOptions<T, string> MustBeValidIPAddress<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .Must(ip => System.Net.IPAddress.TryParse(ip, out _))
                .WithMessage("Must be a valid IP address");
        }

        public static IRuleBuilderOptions<T, string> MustBeValidJson<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .Must(json =>
                {
                    if (string.IsNullOrWhiteSpace(json)) return true;
                    try
                    {
                        System.Text.Json.JsonDocument.Parse(json);
                        return true;
                    }
                    catch
                    {
                        return false;
                    }
                })
                .WithMessage("Must be valid JSON format");
        }

        public static IRuleBuilderOptions<T, DateTime> MustBeInFuture<T>(this IRuleBuilder<T, DateTime> ruleBuilder)
        {
            return ruleBuilder
                .Must(date => date > DateTime.UtcNow)
                .WithMessage("Date must be in the future");
        }

        public static IRuleBuilderOptions<T, DateTime?> MustBeInFutureWhenProvided<T>(this IRuleBuilder<T, DateTime?> ruleBuilder)
        {
            return ruleBuilder
                .Must(date => !date.HasValue || date.Value > DateTime.UtcNow)
                .WithMessage("Date must be in the future when provided");
        }

        public static IRuleBuilderOptions<T, DateTime> MustBeInPast<T>(this IRuleBuilder<T, DateTime> ruleBuilder)
        {
            return ruleBuilder
                .Must(date => date < DateTime.UtcNow)
                .WithMessage("Date must be in the past");
        }

        public static IRuleBuilderOptions<T, DateTime> MustBeWithinAge<T>(this IRuleBuilder<T, DateTime> ruleBuilder, int minAge, int maxAge)
        {
            return ruleBuilder
                .Must(birthDate =>
                {
                    var age = DateTime.UtcNow.Year - birthDate.Year;
                    if (DateTime.UtcNow.DayOfYear < birthDate.DayOfYear) age--;
                    return age >= minAge && age <= maxAge;
                })
                .WithMessage($"Age must be between {minAge} and {maxAge} years");
        }

        public static IRuleBuilderOptions<T, string> MustBeValidBase64<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .Must(base64 =>
                {
                    if (string.IsNullOrWhiteSpace(base64)) return true;
                    try
                    {
                        Convert.FromBase64String(base64);
                        return true;
                    }
                    catch
                    {
                        return false;
                    }
                })
                .WithMessage("Must be valid Base64 encoded string");
        }

        public static IRuleBuilderOptions<T, ICollection<TItem>> MustHaveUniqueItems<T, TItem>(
            this IRuleBuilder<T, ICollection<TItem>> ruleBuilder,
            Func<TItem, object> keySelector)
        {
            return ruleBuilder
                .Must(collection => collection == null || 
                                   collection.GroupBy(keySelector).All(g => g.Count() == 1))
                .WithMessage("Collection must not contain duplicate items");
        }

        public static IRuleBuilderOptions<T, string> MustBeValidCreditCard<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .Must(cardNumber =>
                {
                    if (string.IsNullOrWhiteSpace(cardNumber)) return true;
                    
                    // Remove spaces and dashes
                    cardNumber = Regex.Replace(cardNumber, @"[\s-]", "");
                    
                    // Check if all characters are digits
                    if (!Regex.IsMatch(cardNumber, @"^\d+$")) return false;
                    
                    // Luhn algorithm
                    int sum = 0;
                    bool alternate = false;
                    
                    for (int i = cardNumber.Length - 1; i >= 0; i--)
                    {
                        int digit = int.Parse(cardNumber[i].ToString());
                        
                        if (alternate)
                        {
                            digit *= 2;
                            if (digit > 9) digit -= 9;
                        }
                        
                        sum += digit;
                        alternate = !alternate;
                    }
                    
                    return sum % 10 == 0;
                })
                .WithMessage("Must be a valid credit card number");
        }

        public static IRuleBuilderOptions<T, string> MustBeValidPostalCode<T>(this IRuleBuilder<T, string> ruleBuilder, string countryCode = "US")
        {
            return ruleBuilder
                .Must(postalCode =>
                {
                    if (string.IsNullOrWhiteSpace(postalCode)) return true;
                    
                    return countryCode.ToUpper() switch
                    {
                        "US" => Regex.IsMatch(postalCode, @"^\d{5}(-\d{4})?$"),
                        "CA" => Regex.IsMatch(postalCode, @"^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$"),
                        "UK" => Regex.IsMatch(postalCode, @"^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$"),
                        _ => true // Default to valid for unknown country codes
                    };
                })
                .WithMessage($"Must be a valid postal code for {countryCode}");
        }

        public static IRuleBuilderOptions<T, decimal> MustBePositiveAmount<T>(this IRuleBuilder<T, decimal> ruleBuilder)
        {
            return ruleBuilder
                .GreaterThan(0)
                .WithMessage("Amount must be positive")
                .ScalePrecision(2, 18)
                .WithMessage("Amount cannot have more than 2 decimal places");
        }

        public static IRuleBuilderOptions<T, string> MustBeValidLanguageCode<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var validLanguageCodes = new[] { "en", "ar", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko" };
            
            return ruleBuilder
                .Must(code => string.IsNullOrWhiteSpace(code) || validLanguageCodes.Contains(code.ToLower()))
                .WithMessage($"Language code must be one of: {string.Join(", ", validLanguageCodes)}");
        }

        public static IRuleBuilderOptions<T, string> MustBeValidTimeZone<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .Must(timeZone =>
                {
                    if (string.IsNullOrWhiteSpace(timeZone)) return true;
                    try
                    {
                        TimeZoneInfo.FindSystemTimeZoneById(timeZone);
                        return true;
                    }
                    catch
                    {
                        return false;
                    }
                })
                .WithMessage("Must be a valid time zone identifier");
        }
    }
}