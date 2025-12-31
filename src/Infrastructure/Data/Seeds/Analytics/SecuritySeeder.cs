namespace Infrastructure.Data.Seeds.Analytics
{
    public class SecuritySeeder : BaseAnalyticsSeeder
    {
        public SecuritySeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<SecuritySeeder> logger) : base(context, userManager, logger)
        {
        }

        public override async Task SeedAsync()
        {
            try
            {
                await SeedSecurityLogsAsync();
                await SeedSecurityIncidentsAsync();
                await SeedFailedLoginAttemptsAsync();
                
                await _context.SaveChangesAsync();
                _logger.LogInformation("Security seed data created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding security data");
                throw;
            }
        }

        private async Task SeedSecurityLogsAsync()
        {
            if (await _context.SecurityLogs.AnyAsync())
            {
                _logger.LogInformation("Security logs already exist, skipping seeding");
                return;
            }

            var users = await _context.Users.ToListAsync();
            if (!users.Any()) return;

            var securityLogs = new List<SecurityLog>();
            var eventTypes = GetSecurityEventTypes();
            var startDate = DateTime.UtcNow.AddMonths(-3);

            for (int i = 0; i < 800; i++)
            {
                var randomUser = users[_random.Next(users.Count)];
                var eventType = eventTypes[_random.Next(eventTypes.Length)];
                var logDate = GetRandomDateInRange(startDate, 90);

                var securityLog = new SecurityLog
                {
                    UserId = ShouldHaveUserId(eventType) ? randomUser.Id : Guid.Empty,
                    EventType = eventType,
                    Description = GenerateSecurityLogDetails(eventType),
                    IpAddress = GenerateRandomIpAddress(),
                    UserAgent = GenerateUserAgent(),
                    Timestamp = logDate,
                    IsSuccessful = !eventType.Contains("Failed") && !eventType.Contains("Suspicious"),
                    AdditionalData = $"Severity:{GetSecurityLogSeverity(eventType)}"
                };

                securityLogs.Add(securityLog);
            }

            await _context.SecurityLogs.AddRangeAsync(securityLogs);
        }

        private async Task SeedSecurityIncidentsAsync()
        {
            // Create security incidents based on patterns in security logs
            var suspiciousIps = new[]
            {
                "192.168.1.100", "10.0.0.50", "172.16.0.25", "203.0.113.10", "198.51.100.5"
            };

            var incidents = new List<SecurityLog>();
            var startDate = DateTime.UtcNow.AddMonths(-2);

            for (int i = 0; i < 25; i++)
            {
                var incidentDate = GetRandomDateInRange(startDate, 60);
                var suspiciousIp = suspiciousIps[_random.Next(suspiciousIps.Length)];

                var incident = new SecurityLog
                {
                    UserId = Guid.Empty,
                    EventType = "SecurityIncident",
                    Description = GenerateSecurityIncidentDetails(),
                    IpAddress = suspiciousIp,
                    UserAgent = GenerateUserAgent(),
                    Timestamp = incidentDate,
                    IsSuccessful = false,
                    AdditionalData = "Severity:Critical"
                };

                incidents.Add(incident);
            }

            await _context.SecurityLogs.AddRangeAsync(incidents);
        }

        private async Task SeedFailedLoginAttemptsAsync()
        {
            // Create patterns of failed login attempts
            var users = await _context.Users.Take(20).ToListAsync();
            if (!users.Any()) return;

            var failedAttempts = new List<SecurityLog>();
            var startDate = DateTime.UtcNow.AddDays(-30);

            foreach (var user in users)
            {
                var attemptCount = _random.Next(1, 8);
                
                for (int i = 0; i < attemptCount; i++)
                {
                    var attemptDate = GetRandomDateInRange(startDate, 30);

                    var failedAttempt = new SecurityLog
                    {
                        UserId = user.Id,
                        EventType = "FailedLogin",
                        Description = "Failed login attempt - incorrect password",
                        IpAddress = GenerateRandomIpAddress(),
                        UserAgent = GenerateUserAgent(),
                        Timestamp = attemptDate,
                        IsSuccessful = false,
                        AdditionalData = "Severity:Warning"
                    };

                    failedAttempts.Add(failedAttempt);
                }
            }

            await _context.SecurityLogs.AddRangeAsync(failedAttempts);
        }

        private string[] GetSecurityEventTypes()
        {
            return new[]
            {
                "Login", "Logout", "FailedLogin", "PasswordChange", 
                "SuspiciousActivity", "SecurityIncident", "AccountLocked",
                "PasswordReset", "TwoFactorEnabled", "TwoFactorDisabled",
                "ProfileUpdate", "EmailChange", "PhoneChange",
                "SessionExpired", "ConcurrentLogin", "UnusualLocation"
            };
        }

        private bool ShouldHaveUserId(string eventType)
        {
            var eventsWithoutUser = new[] { "SuspiciousActivity", "SecurityIncident" };
            return !eventsWithoutUser.Contains(eventType);
        }

        private string GenerateSecurityLogDetails(string eventType)
        {
            return eventType switch
            {
                "Login" => "User successfully logged in",
                "Logout" => "User logged out",
                "FailedLogin" => "Failed login attempt - incorrect password",
                "PasswordChange" => "User changed password successfully",
                "SuspiciousActivity" => "Multiple failed login attempts detected from same IP",
                "SecurityIncident" => "Potential security breach detected",
                "AccountLocked" => "Account locked due to multiple failed attempts",
                "PasswordReset" => "Password reset requested and completed",
                "TwoFactorEnabled" => "Two-factor authentication enabled",
                "TwoFactorDisabled" => "Two-factor authentication disabled",
                "ProfileUpdate" => "User profile information updated",
                "EmailChange" => "Email address changed",
                "PhoneChange" => "Phone number updated",
                "SessionExpired" => "User session expired",
                "ConcurrentLogin" => "Multiple concurrent sessions detected",
                "UnusualLocation" => "Login from unusual geographic location",
                _ => "Security event logged"
            };
        }

        private string GetSecurityLogSeverity(string eventType)
        {
            return eventType switch
            {
                "Login" or "Logout" or "ProfileUpdate" => "Info",
                "PasswordChange" or "PasswordReset" or "TwoFactorEnabled" => "Info",
                "FailedLogin" or "SuspiciousActivity" or "AccountLocked" => "Warning",
                "ConcurrentLogin" or "UnusualLocation" or "TwoFactorDisabled" => "Warning",
                "SecurityIncident" => "Critical",
                _ => "Info"
            };
        }

        private string GenerateSecurityIncidentDetails()
        {
            var incidents = new[]
            {
                "Multiple failed login attempts from suspicious IP address",
                "Potential brute force attack detected",
                "Unusual access pattern detected",
                "Suspicious user agent string detected",
                "Multiple accounts accessed from same IP in short timeframe",
                "Potential credential stuffing attack",
                "Anomalous login behavior detected",
                "Suspicious geographic location access pattern"
            };

            return incidents[_random.Next(incidents.Length)];
        }
    }
}