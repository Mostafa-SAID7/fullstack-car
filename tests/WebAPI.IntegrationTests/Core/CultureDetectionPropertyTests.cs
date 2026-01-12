using FsCheck;
using FsCheck.Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using WebAPI.IntegrationTests.Core;

namespace WebAPI.IntegrationTests.Core;

/// <summary>
/// Property-based tests for Culture Detection Middleware
/// Feature: community-localization-enhancement
/// </summary>
public class CultureDetectionPropertyTests : BaseIntegrationTest
{
    public CultureDetectionPropertyTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    /// <summary>
    /// Property 18: Browser Language Detection
    /// For any valid Accept-Language header, the middleware should either select a supported culture or fallback to en-US
    /// Validates: Requirements 14.1
    /// </summary>
    [Property(MaxTest = 10)]
    public bool BrowserLanguageDetection_ShouldAlwaysReturnSupportedCulture()
    {
        var supportedCultures = new[] { "en-US", "ar-EG", "ar-AE", "ar-SA" };
        var acceptLanguageHeaders = new[] 
        { 
            "", 
            "en-US", 
            "ar-EG", 
            "ar,en;q=0.9", 
            "fr-FR,en;q=0.8", 
            "ar-EG,ar;q=0.9,en;q=0.8",
            "de-DE,fr;q=0.9,en;q=0.8",
            "ar-SA,ar;q=0.9",
            "en-GB,en;q=0.9",
            "invalid-header"
        };
        
        var acceptLanguageHeader = acceptLanguageHeaders[new System.Random().Next(acceptLanguageHeaders.Length)];
        
        try
        {
            // Arrange
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/v4/shared/localization/languages");
            if (!string.IsNullOrEmpty(acceptLanguageHeader))
            {
                request.Headers.Add("Accept-Language", acceptLanguageHeader);
            }

            // Act
            var response = UnauthenticatedClient.SendAsync(request).Result;

            // Assert
            if (!response.Headers.Contains("X-Culture"))
                return false;
                
            var culture = response.Headers.GetValues("X-Culture").FirstOrDefault();
            
            // Property: The returned culture should always be one of the supported cultures
            return supportedCultures.Contains(culture);
        }
        catch (Exception)
        {
            // If any exception occurs, the test should fail
            return false;
        }
    }

    /// <summary>
    /// Property: RTL Detection Consistency
    /// For any Arabic culture variant, RTL should be true; for non-Arabic cultures, RTL should be false
    /// </summary>
    [Property(MaxTest = 10)]
    public bool RTLDetection_ShouldBeConsistentWithCulture()
    {
        var cultures = new[] { "en-US", "ar-EG", "ar-AE", "ar-SA", "fr-FR", "de-DE" };
        var culture = cultures[new System.Random().Next(cultures.Length)];
        
        try
        {
            // Arrange
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v4/shared/localization/languages?culture={culture}");

            // Act
            var response = UnauthenticatedClient.SendAsync(request).Result;

            // Assert
            if (!response.Headers.Contains("X-Culture") || !response.Headers.Contains("X-Is-RTL"))
                return false;
                
            var actualCulture = response.Headers.GetValues("X-Culture").FirstOrDefault();
            var isRtlString = response.Headers.GetValues("X-Is-RTL").FirstOrDefault();
            
            if (!bool.TryParse(isRtlString, out var isRtl))
                return false;
            
            // Property: RTL should be true only for Arabic cultures
            var expectedRtl = actualCulture?.StartsWith("ar-") == true;
            
            return isRtl == expectedRtl;
        }
        catch (Exception)
        {
            return false;
        }
    }

    /// <summary>
    /// Property: Culture Priority Logic
    /// URL parameter should always take precedence over Accept-Language header
    /// </summary>
    [Property(MaxTest = 10)]
    public bool CulturePriority_UrlParameterShouldTakePrecedence()
    {
        var supportedCultures = new[] { "en-US", "ar-EG", "ar-AE", "ar-SA" };
        var acceptLanguageHeaders = new[] { "fr-FR", "de-DE", "es-ES", "ar-EG", "en-US" };
        
        var urlCulture = supportedCultures[new System.Random().Next(supportedCultures.Length)];
        var acceptLanguage = acceptLanguageHeaders[new System.Random().Next(acceptLanguageHeaders.Length)];
        
        try
        {
            // Arrange
            var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v4/shared/localization/languages?culture={urlCulture}");
            request.Headers.Add("Accept-Language", acceptLanguage);

            // Act
            var response = UnauthenticatedClient.SendAsync(request).Result;

            // Assert
            if (!response.Headers.Contains("X-Culture"))
                return false;
                
            var actualCulture = response.Headers.GetValues("X-Culture").FirstOrDefault();
            
            // Property: URL parameter should always take precedence
            return actualCulture == urlCulture;
        }
        catch (Exception)
        {
            return false;
        }
    }


}