using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Globalization;
using System.Security.Claims;
using Domain.Entities.Identity;

namespace WebAPI.Middleware;

public class CultureDetectionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CultureDetectionMiddleware> _logger;
    private readonly string[] _supportedCultures = { "en-US", "ar-EG", "ar-AE", "ar-SA" };

    public CultureDetectionMiddleware(RequestDelegate next, ILogger<CultureDetectionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, UserManager<ApplicationUser> userManager)
    {
        _logger.LogDebug("CultureDetectionMiddleware invoked for path: {Path}", context.Request.Path);
        
        var culture = await DetermineCultureAsync(context, userManager);
        
        var cultureInfo = new CultureInfo(culture);
        Thread.CurrentThread.CurrentCulture = cultureInfo;
        Thread.CurrentThread.CurrentUICulture = cultureInfo;
        
        // Set culture information in HttpContext for use by other components
        context.Items["Culture"] = culture;
        context.Items["IsRTL"] = IsRightToLeft(culture);
        
        // Set response headers for client-side culture detection
        context.Response.Headers["X-Culture"] = culture;
        context.Response.Headers["X-Is-RTL"] = IsRightToLeft(culture).ToString().ToLower();
        
        _logger.LogDebug("Culture set to {Culture} for request {RequestPath}", culture, context.Request.Path);
        
        await _next(context);
    }

    private async Task<string> DetermineCultureAsync(HttpContext context, UserManager<ApplicationUser> userManager)
    {
        _logger.LogDebug("Determining culture for request");
        
        // Priority: URL parameter > User preference > Accept-Language header > Default
        
        // 1. Check URL parameter (highest priority for SEO and explicit selection)
        if (context.Request.Query.ContainsKey("culture"))
        {
            var urlCulture = context.Request.Query["culture"].ToString();
            _logger.LogDebug("Found URL culture parameter: {Culture}", urlCulture);
            if (IsSupportedCulture(urlCulture))
            {
                _logger.LogDebug("Culture determined from URL parameter: {Culture}", urlCulture);
                return urlCulture;
            }
        }

        // 2. Check user preference (if authenticated)
        if (context.User.Identity?.IsAuthenticated == true)
        {
            _logger.LogDebug("User is authenticated, checking preferences");
            try
            {
                var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var userGuid))
                {
                    var user = await userManager.FindByIdAsync(userGuid.ToString());
                    if (user != null && !string.IsNullOrEmpty(user.PreferredLanguage) && IsSupportedCulture(user.PreferredLanguage))
                    {
                        _logger.LogDebug("Culture determined from user preference: {Culture} for user {UserId}", user.PreferredLanguage, userId);
                        return user.PreferredLanguage;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error retrieving user language preference");
            }
        }

        // 3. Check Accept-Language header (browser preference)
        var acceptLanguage = context.Request.Headers["Accept-Language"].ToString();
        _logger.LogDebug("Accept-Language header: {AcceptLanguage}", acceptLanguage);
        if (!string.IsNullOrEmpty(acceptLanguage))
        {
            var browserCulture = ParseAcceptLanguageHeader(acceptLanguage);
            if (!string.IsNullOrEmpty(browserCulture) && IsSupportedCulture(browserCulture))
            {
                _logger.LogDebug("Culture determined from Accept-Language header: {Culture}", browserCulture);
                return browserCulture;
            }
        }

        // 4. Default fallback
        _logger.LogDebug("Using default culture: en-US");
        return "en-US";
    }

    private string? ParseAcceptLanguageHeader(string acceptLanguage)
    {
        try
        {
            _logger.LogDebug("Parsing Accept-Language header: {AcceptLanguage}", acceptLanguage);
            
            // Parse Accept-Language header (e.g., "en-US,en;q=0.9,ar;q=0.8")
            var languages = acceptLanguage
                .Split(',')
                .Select(lang => lang.Split(';')[0].Trim()) // Remove quality values
                .Where(lang => !string.IsNullOrEmpty(lang))
                .ToList();

            _logger.LogDebug("Parsed languages: {Languages}", string.Join(", ", languages));

            // Process languages in priority order (first to last)
            foreach (var language in languages)
            {
                _logger.LogDebug("Processing language: {Language}", language);
                
                // First, try exact match
                if (IsSupportedCulture(language))
                {
                    _logger.LogDebug("Found exact match: {Language}", language);
                    return language;
                }
                
                // If no exact match, try to map language code to supported variant
                var languageCode = language.Split('-')[0].ToLower();
                _logger.LogDebug("Trying to map language code: {LanguageCode} from {Language}", languageCode, language);
                
                var mappedCulture = languageCode switch
                {
                    "en" => "en-US",
                    "ar" => "ar-EG", // Default Arabic variant
                    _ => null
                };

                _logger.LogDebug("Mapped {LanguageCode} to {MappedCulture}", languageCode, mappedCulture);

                if (mappedCulture != null && IsSupportedCulture(mappedCulture))
                {
                    _logger.LogDebug("Found mapped culture: {MappedCulture}", mappedCulture);
                    return mappedCulture;
                }
                
                _logger.LogDebug("No mapping found for language: {Language}", language);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error parsing Accept-Language header: {AcceptLanguage}", acceptLanguage);
        }

        _logger.LogDebug("No matching culture found in Accept-Language header");
        return null;
    }

    private bool IsSupportedCulture(string culture)
    {
        return _supportedCultures.Contains(culture, StringComparer.OrdinalIgnoreCase);
    }

    private bool IsRightToLeft(string culture)
    {
        return culture.StartsWith("ar-", StringComparison.OrdinalIgnoreCase);
    }
}