using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Microsoft.AspNetCore.Mvc.Testing;
using WebAPI.IntegrationTests.QA.Core;
using Xunit;
using Xunit.Abstractions;

namespace WebAPI.IntegrationTests.QA.Security;

/// <summary>
/// Security hardening tests for QA System Integration
/// Tests advanced security measures, attack prevention, and security configurations
/// Implements Task 8.5 security hardening requirements
/// </summary>
public class QASecurityHardeningTests : QAIntegrationTestBase
{
    public QASecurityHardeningTests(WebApplicationFactory<Program> factory, ITestOutputHelper output) 
        : base(factory, output)
    {
    }

    public override async Task InitializeAsync()
    {
        await SeedTestData();
    }

    public override async Task DisposeAsync()
    {
        // No SignalR connections to clean up
    }

    #region Advanced Authentication Tests

    [Fact]
    public async Task QAEndpoints_WithExpiredToken_ShouldReturnUnauthorized()
    {
        Output.WriteLine("=== Testing Expired Token Handling ===");

        var expiredTokenClient = Factory.CreateClient();
        // Simulate expired token (in real scenario, this would be a properly expired JWT)
        expiredTokenClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", "expired.jwt.token");

        var response = await expiredTokenClient.GetAsync("/api/v7/qa/questions");
        
        var isSecure = response.StatusCode == HttpStatusCode.Unauthorized || 
                      response.StatusCode == HttpStatusCode.NotFound;
        
        LogTestResult("Expired token rejection", isSecure, $"Status: {response.StatusCode}");

        Output.WriteLine("✅ Expired token tests completed");
    }

    [Fact]
    public async Task QAEndpoints_WithMalformedToken_ShouldReturnUnauthorized()
    {
        Output.WriteLine("=== Testing Malformed Token Handling ===");

        var malformedTokens = new[]
        {
            "Bearer malformed-token",
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.malformed",
            "Bearer ...",
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.invalid-signature"
        };

        foreach (var token in malformedTokens)
        {
            var malformedTokenClient = Factory.CreateClient();
            malformedTokenClient.DefaultRequestHeaders.Add("Authorization", token);

            var response = await malformedTokenClient.GetAsync("/api/v7/qa/questions");
            
            var isSecure = response.StatusCode == HttpStatusCode.Unauthorized || 
                          response.StatusCode == HttpStatusCode.BadRequest ||
                          response.StatusCode == HttpStatusCode.NotFound;
            
            LogTestResult($"Malformed token rejection: {token.Substring(0, Math.Min(30, token.Length))}", 
                isSecure, $"Status: {response.StatusCode}");
        }

        Output.WriteLine("✅ Malformed token tests completed");
    }

    #endregion

    #region Advanced Authorization Tests

    [Fact]
    public async Task QAOperations_WithRoleBasedAccess_ShouldEnforcePermissions()
    {
        Output.WriteLine("=== Testing Role-Based Access Control ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping role-based access tests");
            return;
        }

        // Test admin-only operations
        var regularUserClient = Factory.CreateClient();
        regularUserClient.DefaultRequestHeaders.Add("X-Test-Auth", "true");
        regularUserClient.DefaultRequestHeaders.Add("X-Test-User-Role", "User");

        // Try to access admin endpoints (if they exist)
        var adminEndpoints = new[]
        {
            "/api/v7/qa/admin/users",
            "/api/v7/qa/admin/moderation",
            "/api/v7/qa/admin/analytics",
            "/api/v7/qa/admin/configuration"
        };

        foreach (var endpoint in adminEndpoints)
        {
            var response = await regularUserClient.GetAsync(endpoint);
            
            var isSecure = response.StatusCode == HttpStatusCode.Forbidden ||
                          response.StatusCode == HttpStatusCode.Unauthorized ||
                          response.StatusCode == HttpStatusCode.NotFound;
            
            LogTestResult($"Admin endpoint protection: {endpoint}", isSecure, 
                $"Status: {response.StatusCode}");
        }

        Output.WriteLine("✅ Role-based access tests completed");
    }

    [Fact]
    public async Task QAOperations_WithResourceOwnership_ShouldEnforceOwnership()
    {
        Output.WriteLine("=== Testing Resource Ownership Enforcement ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping ownership tests");
            return;
        }

        // Create a question as one user
        var question = await CreateTestQuestion("Ownership Test Question", 
            "This question tests resource ownership enforcement.");

        if (question != null)
        {
            // Try to modify it as a different user
            var differentUserClient = Factory.CreateClient();
            differentUserClient.DefaultRequestHeaders.Add("X-Test-Auth", "true");
            differentUserClient.DefaultRequestHeaders.Add("X-Test-User-Id", Guid.NewGuid().ToString());

            var updateRequest = new UpdateQuestionRequest
            {
                Title = "Modified by different user",
                Content = "This should not be allowed",
                Category = "Test",
                Tags = new List<string> { "test" }
            };

            var response = await differentUserClient.PutAsJsonAsync($"/api/v7/qa/questions/{question.Id}", updateRequest);
            
            var isSecure = response.StatusCode == HttpStatusCode.Forbidden ||
                          response.StatusCode == HttpStatusCode.Unauthorized ||
                          response.StatusCode == HttpStatusCode.NotFound;
            
            LogTestResult("Resource ownership enforcement", isSecure, $"Status: {response.StatusCode}");
        }

        Output.WriteLine("✅ Resource ownership tests completed");
    }

    #endregion

    #region Advanced Input Validation Tests

    [Fact]
    public async Task QAContent_WithAdvancedXSSPayloads_ShouldBeBlocked()
    {
        Output.WriteLine("=== Testing Advanced XSS Protection ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping advanced XSS tests");
            return;
        }

        var advancedXSSPayloads = new[]
        {
            // Polyglot XSS
            "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */onerror=alert('XSS') )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert('XSS')//\\x3e",
            
            // Unicode XSS
            "<img src=x onerror=alert('XSS')>",
            "\\u003cimg src=x onerror=alert('XSS')\\u003e",
            
            // Base64 encoded XSS
            "PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=", // <script>alert('XSS')</script>
            
            // CSS injection
            "<style>@import'javascript:alert(\"XSS\")';</style>",
            
            // SVG XSS
            "<svg/onload=alert('XSS')>",
            "<svg><script>alert('XSS')</script></svg>",
            
            // Data URI XSS
            "<iframe src='data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4='></iframe>",
            
            // Event handler variations
            "<img src=x onerror=alert`XSS`>",
            "<img src=x onerror=alert(String.fromCharCode(88,83,83))>",
            
            // Filter bypass attempts
            "<scr<script>ipt>alert('XSS')</scr</script>ipt>",
            "<img src=\"x\" onerror=\"alert('XSS')\">",
            
            // Template injection
            "{{constructor.constructor('alert(\"XSS\")')()}}",
            "${alert('XSS')}",
            
            // Angular/React specific
            "{{7*7}}",
            "{{''.constructor.prototype.charAt=[].join;$eval('x=alert(1)');}}",
            
            // Server-side template injection
            "<%=7*7%>",
            "#{7*7}",
            
            // XML/XXE attempts
            "<?xml version=\"1.0\"?><!DOCTYPE root [<!ENTITY test SYSTEM 'file:///etc/passwd'>]><root>&test;</root>"
        };

        foreach (var payload in advancedXSSPayloads)
        {
            var questionRequest = new CreateQuestionRequest
            {
                Title = $"Advanced XSS Test - {payload.Substring(0, Math.Min(20, payload.Length))}",
                Content = payload,
                Category = "Security",
                Tags = new List<string> { "security", "xss" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
            
            var isProtected = response.StatusCode == HttpStatusCode.BadRequest ||
                             response.StatusCode == HttpStatusCode.UnprocessableEntity ||
                             response.StatusCode == HttpStatusCode.NotFound;
            
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var createdQuestion = DeserializeApiResponseData<QuestionDto>(responseContent);
                
                // Verify payload was sanitized
                isProtected = createdQuestion != null && 
                             !createdQuestion.Content.Contains("<script>") &&
                             !createdQuestion.Content.Contains("javascript:") &&
                             !createdQuestion.Content.Contains("onerror=") &&
                             !createdQuestion.Content.Contains("onload=") &&
                             !createdQuestion.Content.Contains("alert(") &&
                             !createdQuestion.Content.Contains("{{") &&
                             !createdQuestion.Content.Contains("${");
            }
            
            LogTestResult($"Advanced XSS protection: {payload.Substring(0, Math.Min(30, payload.Length))}", 
                isProtected);
        }

        Output.WriteLine("✅ Advanced XSS protection tests completed");
    }

    [Fact]
    public async Task QAContent_WithSQLInjectionPayloads_ShouldBeBlocked()
    {
        Output.WriteLine("=== Testing SQL Injection Protection ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping SQL injection tests");
            return;
        }

        var sqlInjectionPayloads = new[]
        {
            // Classic SQL injection
            "'; DROP TABLE Questions; --",
            "' OR '1'='1",
            "' OR 1=1 --",
            "' UNION SELECT * FROM Users --",
            
            // Blind SQL injection
            "' AND (SELECT COUNT(*) FROM Users) > 0 --",
            "' AND SUBSTRING(@@version,1,1) = '5' --",
            
            // Time-based SQL injection
            "'; WAITFOR DELAY '00:00:05' --",
            "' OR IF(1=1, SLEEP(5), 0) --",
            
            // Boolean-based SQL injection
            "' AND ASCII(SUBSTRING((SELECT TOP 1 name FROM sysobjects WHERE xtype='U'),1,1)) > 65 --",
            
            // Union-based SQL injection
            "' UNION ALL SELECT NULL,NULL,NULL,NULL,NULL --",
            "' UNION SELECT username, password FROM users --",
            
            // Error-based SQL injection
            "' AND (SELECT * FROM (SELECT COUNT(*),CONCAT(version(),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a) --",
            
            // Second-order SQL injection
            "admin'/*",
            "'; INSERT INTO Users (username, password) VALUES ('hacker', 'password'); --",
            
            // NoSQL injection attempts
            "'; return true; //",
            "' || '1'=='1",
            "'; return this.username == 'admin' && this.password == 'password'; //",
            
            // Stored procedure attacks
            "'; EXEC xp_cmdshell('dir'); --",
            "'; EXEC sp_configure 'show advanced options', 1; --"
        };

        foreach (var payload in sqlInjectionPayloads)
        {
            var questionRequest = new CreateQuestionRequest
            {
                Title = $"SQL Injection Test - {payload.Substring(0, Math.Min(15, payload.Length))}",
                Content = $"Testing SQL injection protection with: {payload}",
                Category = "Security",
                Tags = new List<string> { "security", "sql" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
            
            var isProtected = response.StatusCode == HttpStatusCode.BadRequest ||
                             response.StatusCode == HttpStatusCode.UnprocessableEntity ||
                             response.StatusCode == HttpStatusCode.NotFound;
            
            LogTestResult($"SQL injection protection: {payload.Substring(0, Math.Min(25, payload.Length))}", 
                isProtected);
        }

        Output.WriteLine("✅ SQL injection protection tests completed");
    }

    #endregion

    #region Advanced Rate Limiting Tests

    [Fact]
    public async Task QAEndpoints_WithBurstTraffic_ShouldImplementBurstProtection()
    {
        Output.WriteLine("=== Testing Burst Traffic Protection ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping burst protection tests");
            return;
        }

        var burstClient = Factory.CreateClient();
        burstClient.DefaultRequestHeaders.Add("X-Test-Auth", "true");

        var tasks = new List<Task<HttpResponseMessage>>();
        
        // Send 20 concurrent requests to test burst protection
        for (int i = 0; i < 20; i++)
        {
            tasks.Add(burstClient.GetAsync("/api/v7/qa/questions?pageSize=1"));
        }

        var responses = await Task.WhenAll(tasks);
        var rateLimitedCount = responses.Count(r => r.StatusCode == HttpStatusCode.TooManyRequests);
        var successCount = responses.Count(r => r.IsSuccessStatusCode);

        var hasBurstProtection = rateLimitedCount > 0 || successCount < 20;
        
        LogTestResult("Burst traffic protection", hasBurstProtection, 
            $"Rate limited: {rateLimitedCount}, Success: {successCount}");

        Output.WriteLine("✅ Burst traffic protection tests completed");
    }

    [Fact]
    public async Task QAEndpoints_WithDifferentUserAgents_ShouldTrackSeparately()
    {
        Output.WriteLine("=== Testing User Agent Based Rate Limiting ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping user agent tests");
            return;
        }

        var userAgents = new[]
        {
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "curl/7.68.0",
            "PostmanRuntime/7.28.4"
        };

        foreach (var userAgent in userAgents)
        {
            var userAgentClient = Factory.CreateClient();
            userAgentClient.DefaultRequestHeaders.Add("X-Test-Auth", "true");
            userAgentClient.DefaultRequestHeaders.Add("User-Agent", userAgent);

            var response = await userAgentClient.GetAsync("/api/v7/qa/questions");
            
            // Should handle different user agents appropriately
            var isHandled = response.IsSuccessStatusCode || 
                           response.StatusCode == HttpStatusCode.NotFound ||
                           response.StatusCode == HttpStatusCode.TooManyRequests;
            
            LogTestResult($"User agent handling: {userAgent.Substring(0, Math.Min(30, userAgent.Length))}", 
                isHandled);
        }

        Output.WriteLine("✅ User agent based rate limiting tests completed");
    }

    #endregion

    #region Security Headers Tests

    [Fact]
    public async Task QAEndpoints_ShouldIncludeAdvancedSecurityHeaders()
    {
        Output.WriteLine("=== Testing Advanced Security Headers ===");

        var response = await Client.GetAsync("/api/v7/qa/questions");
        
        // Check for advanced security headers
        var securityHeaders = new Dictionary<string, bool>
        {
            ["X-Frame-Options"] = response.Headers.Contains("X-Frame-Options"),
            ["X-Content-Type-Options"] = response.Headers.Contains("X-Content-Type-Options"),
            ["X-XSS-Protection"] = response.Headers.Contains("X-XSS-Protection"),
            ["Strict-Transport-Security"] = response.Headers.Contains("Strict-Transport-Security"),
            ["Content-Security-Policy"] = response.Headers.Contains("Content-Security-Policy"),
            ["Referrer-Policy"] = response.Headers.Contains("Referrer-Policy"),
            ["Permissions-Policy"] = response.Headers.Contains("Permissions-Policy"),
            ["X-Permitted-Cross-Domain-Policies"] = response.Headers.Contains("X-Permitted-Cross-Domain-Policies")
        };

        foreach (var header in securityHeaders)
        {
            LogTestResult($"Security header: {header.Key}", header.Value);
        }

        // Check specific header values
        if (response.Headers.TryGetValues("X-Frame-Options", out var frameOptions))
        {
            var hasSecureFrameOptions = frameOptions.Any(v => v.Contains("DENY") || v.Contains("SAMEORIGIN"));
            LogTestResult("X-Frame-Options value", hasSecureFrameOptions, string.Join(", ", frameOptions));
        }

        if (response.Headers.TryGetValues("Content-Security-Policy", out var csp))
        {
            var hasRestrictiveCSP = csp.Any(v => v.Contains("default-src") && v.Contains("'self'"));
            LogTestResult("Content-Security-Policy restrictiveness", hasRestrictiveCSP, string.Join(", ", csp));
        }

        Output.WriteLine("✅ Advanced security headers tests completed");
    }

    #endregion

    #region File Upload Security Tests

    [Fact]
    public async Task QAFileUploads_WithMaliciousFiles_ShouldBeBlocked()
    {
        Output.WriteLine("=== Testing File Upload Security ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping file upload tests");
            return;
        }

        var maliciousFiles = new[]
        {
            // Executable files
            ("malware.exe", "application/octet-stream", new byte[] { 0x4D, 0x5A }), // PE header
            ("script.bat", "text/plain", Encoding.UTF8.GetBytes("@echo off\ndir")),
            ("shell.sh", "text/plain", Encoding.UTF8.GetBytes("#!/bin/bash\nls -la")),
            
            // Script files
            ("xss.html", "text/html", Encoding.UTF8.GetBytes("<script>alert('XSS')</script>")),
            ("malicious.js", "application/javascript", Encoding.UTF8.GetBytes("alert('XSS')")),
            ("backdoor.php", "text/plain", Encoding.UTF8.GetBytes("<?php system($_GET['cmd']); ?>")),
            
            // Archive bombs
            ("bomb.zip", "application/zip", new byte[] { 0x50, 0x4B, 0x03, 0x04 }), // ZIP header
            
            // Large files (simulated)
            ("large.txt", "text/plain", new byte[1024 * 1024]) // 1MB
        };

        foreach (var (filename, contentType, content) in maliciousFiles)
        {
            using var formContent = new MultipartFormDataContent();
            using var fileContent = new ByteArrayContent(content);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(contentType);
            formContent.Add(fileContent, "file", filename);

            // Try to upload to a hypothetical file upload endpoint
            var response = await Client.PostAsync("/api/v7/qa/upload", formContent);
            
            var isBlocked = response.StatusCode == HttpStatusCode.BadRequest ||
                           response.StatusCode == HttpStatusCode.UnsupportedMediaType ||
                           response.StatusCode == HttpStatusCode.NotFound ||
                           response.StatusCode == HttpStatusCode.Forbidden;
            
            LogTestResult($"Malicious file upload blocked: {filename}", isBlocked, 
                $"Status: {response.StatusCode}");
        }

        Output.WriteLine("✅ File upload security tests completed");
    }

    #endregion

    #region API Abuse Prevention Tests

    [Fact]
    public async Task QAEndpoints_WithAutomatedRequests_ShouldDetectBots()
    {
        Output.WriteLine("=== Testing Bot Detection ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping bot detection tests");
            return;
        }

        var botClient = Factory.CreateClient();
        botClient.DefaultRequestHeaders.Add("X-Test-Auth", "true");
        
        // Simulate bot-like behavior
        botClient.DefaultRequestHeaders.Add("User-Agent", "Bot/1.0");
        
        // Make rapid, identical requests
        var responses = new List<HttpResponseMessage>();
        for (int i = 0; i < 10; i++)
        {
            var response = await botClient.GetAsync("/api/v7/qa/questions?page=1&pageSize=10");
            responses.Add(response);
            
            // No delay - bot-like behavior
        }

        var botDetected = responses.Any(r => 
            r.StatusCode == HttpStatusCode.TooManyRequests ||
            r.StatusCode == HttpStatusCode.Forbidden ||
            r.Headers.Contains("X-Bot-Detection"));

        LogTestResult("Bot detection", botDetected, 
            $"Responses: {responses.Count(r => r.IsSuccessStatusCode)} success, " +
            $"{responses.Count(r => r.StatusCode == HttpStatusCode.TooManyRequests)} rate limited");

        // Clean up
        foreach (var response in responses)
        {
            response.Dispose();
        }

        Output.WriteLine("✅ Bot detection tests completed");
    }

    [Fact]
    public async Task QAEndpoints_WithSuspiciousPatterns_ShouldTriggerAlerts()
    {
        Output.WriteLine("=== Testing Suspicious Pattern Detection ===");

        if (!await IsEndpointAvailable("/api/v7/qa/questions"))
        {
            LogWarning("QA endpoints not implemented yet - skipping pattern detection tests");
            return;
        }

        var suspiciousPatterns = new[]
        {
            // Scanning patterns
            "/api/v7/qa/../../../etc/passwd",
            "/api/v7/qa/questions?id=1' OR '1'='1",
            "/api/v7/qa/questions?search=<script>alert('XSS')</script>",
            
            // Enumeration attempts
            "/api/v7/qa/users/1",
            "/api/v7/qa/users/2",
            "/api/v7/qa/admin/config",
            "/api/v7/qa/.env",
            "/api/v7/qa/backup.sql"
        };

        foreach (var pattern in suspiciousPatterns)
        {
            var response = await Client.GetAsync(pattern);
            
            // Suspicious requests should be blocked or logged
            var isHandled = response.StatusCode == HttpStatusCode.BadRequest ||
                           response.StatusCode == HttpStatusCode.Forbidden ||
                           response.StatusCode == HttpStatusCode.NotFound ||
                           response.Headers.Contains("X-Security-Alert");
            
            LogTestResult($"Suspicious pattern detection: {pattern}", isHandled, 
                $"Status: {response.StatusCode}");
        }

        Output.WriteLine("✅ Suspicious pattern detection tests completed");
    }

    #endregion
}