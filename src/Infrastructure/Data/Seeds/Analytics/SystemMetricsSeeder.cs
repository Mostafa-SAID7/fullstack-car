using Domain.Entities.Admin.Analytics;

namespace Infrastructure.Data.Seeds.Analytics
{
    public class SystemMetricsSeeder : BaseAnalyticsSeeder
    {
        public SystemMetricsSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<SystemMetricsSeeder> logger) : base(context, userManager, logger)
        {
        }

        public override async Task SeedAsync()
        {
            try
            {
                await SeedSystemMetricsAsync();
                await SeedPerformanceLogsAsync();
                await SeedErrorLogsAsync();
                await SeedApiUsageLogsAsync();
                
                await _context.SaveChangesAsync();
                _logger.LogInformation("System metrics seed data created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding system metrics data");
                throw;
            }
        }

        private async Task SeedSystemMetricsAsync()
        {
            var metrics = new List<SystemMetric>();
            var startDate = DateTime.UtcNow.AddDays(-30);
            var metricTypes = GetSystemMetricTypes();

            // Generate hourly metrics for the last 30 days
            for (int day = 0; day < 30; day++)
            {
                for (int hour = 0; hour < 24; hour++)
                {
                    var timestamp = startDate.AddDays(day).AddHours(hour);
                    
                    foreach (var metricType in metricTypes)
                    {
                        var metric = new SystemMetric
                        {
                            MetricName = metricType.Key,
                            Value = GenerateMetricValue(metricType.Key),
                            Unit = metricType.Value,
                            Timestamp = timestamp,
                            Category = "SystemMonitor",
                            Tags = GenerateMetricTags(metricType.Key)
                        };

                        metrics.Add(metric);
                    }
                }
            }

            await _context.SystemMetrics.AddRangeAsync(metrics);
        }

        private async Task SeedPerformanceLogsAsync()
        {
            var performanceLogs = new List<PerformanceLog>();
            var startDate = DateTime.UtcNow.AddDays(-7);
            var endpoints = GetApiEndpoints();

            for (int i = 0; i < 5000; i++)
            {
                var timestamp = GetRandomDateInRange(startDate, 7);
                var endpoint = endpoints[_random.Next(endpoints.Length)];

                var performanceLog = new PerformanceLog
                {
                    Operation = $"{endpoint.Method} {endpoint.Path}",
                    ExecutionTimeMs = (long)GenerateResponseTime(endpoint.Path),
                    MemoryUsageMb = _random.Next(10, 100),
                    CpuUsagePercent = _random.Next(5, 80),
                    Timestamp = timestamp,
                    AdditionalMetrics = $"StatusCode:{GenerateStatusCode()},RequestSize:{_random.Next(100, 5000)},ResponseSize:{_random.Next(500, 50000)},IP:{GenerateRandomIpAddress()}"
                };

                performanceLogs.Add(performanceLog);
            }

            await _context.PerformanceLogs.AddRangeAsync(performanceLogs);
        }

        private async Task SeedErrorLogsAsync()
        {
            var errorLogs = new List<ErrorLog>();
            var startDate = DateTime.UtcNow.AddDays(-30);
            var errorTypes = GetErrorTypes();

            for (int i = 0; i < 200; i++)
            {
                var timestamp = GetRandomDateInRange(startDate, 30);
                var errorType = errorTypes[_random.Next(errorTypes.Length)];

                var errorLog = new ErrorLog
                {
                    ErrorType = errorType.Type,
                    Message = errorType.Message,
                    StackTrace = GenerateStackTrace(errorType.Type),
                    Severity = errorType.Severity,
                    Source = errorType.Source,
                    Timestamp = timestamp,
                    UserId = null
                };

                errorLogs.Add(errorLog);
            }

            await _context.ErrorLogs.AddRangeAsync(errorLogs);
        }

        private async Task SeedApiUsageLogsAsync()
        {
            var apiUsageLogs = new List<ApiUsageLog>();
            var startDate = DateTime.UtcNow.AddDays(-30);
            var apiKeys = GenerateApiKeys();

            for (int i = 0; i < 10000; i++)
            {
                var timestamp = GetRandomDateInRange(startDate, 30);
                var apiKey = apiKeys[_random.Next(apiKeys.Length)];

                var apiUsageLog = new ApiUsageLog
                {
                    ApiKey = apiKey,
                    Endpoint = GetApiEndpoints()[_random.Next(GetApiEndpoints().Length)].Path,
                    RequestCount = _random.Next(1, 100),
                    DataTransferred = _random.Next(1000, 1000000),
                    Timestamp = timestamp,
                    ClientId = Guid.NewGuid().ToString(),
                    IpAddress = GenerateRandomIpAddress()
                };

                apiUsageLogs.Add(apiUsageLog);
            }

            await _context.ApiUsageLogs.AddRangeAsync(apiUsageLogs);
        }

        private Dictionary<string, string> GetSystemMetricTypes()
        {
            return new Dictionary<string, string>
            {
                { "CpuUsage", "Percentage" },
                { "MemoryUsage", "Percentage" },
                { "DiskUsage", "Percentage" },
                { "NetworkIn", "Bytes" },
                { "NetworkOut", "Bytes" },
                { "ActiveConnections", "Count" },
                { "DatabaseConnections", "Count" },
                { "CacheHitRate", "Percentage" },
                { "QueueLength", "Count" },
                { "ResponseTime", "Milliseconds" }
            };
        }

        private double GenerateMetricValue(string metricType)
        {
            return metricType switch
            {
                "CpuUsage" => Math.Round(_random.NextDouble() * 100, 2),
                "MemoryUsage" => Math.Round(_random.NextDouble() * 100, 2),
                "DiskUsage" => Math.Round(_random.NextDouble() * 100, 2),
                "NetworkIn" => _random.Next(1000, 1000000),
                "NetworkOut" => _random.Next(1000, 1000000),
                "ActiveConnections" => _random.Next(10, 1000),
                "DatabaseConnections" => _random.Next(5, 100),
                "CacheHitRate" => Math.Round(_random.NextDouble() * 100, 2),
                "QueueLength" => _random.Next(0, 50),
                "ResponseTime" => Math.Round(_random.NextDouble() * 2000, 2),
                _ => _random.NextDouble() * 100
            };
        }

        private string GenerateMetricTags(string metricType)
        {
            var tags = new Dictionary<string, string>
            {
                { "server", $"server-{_random.Next(1, 5)}" },
                { "environment", "production" },
                { "region", "us-east-1" }
            };

            return string.Join(",", tags.Select(kv => $"{kv.Key}={kv.Value}"));
        }

        private (string Path, string Method)[] GetApiEndpoints()
        {
            return new[]
            {
                ("/api/posts", "GET"),
                ("/api/posts", "POST"),
                ("/api/posts/{id}", "GET"),
                ("/api/posts/{id}", "PUT"),
                ("/api/posts/{id}", "DELETE"),
                ("/api/users", "GET"),
                ("/api/users/{id}", "GET"),
                ("/api/users/{id}", "PUT"),
                ("/api/groups", "GET"),
                ("/api/groups", "POST"),
                ("/api/groups/{id}", "GET"),
                ("/api/auth/login", "POST"),
                ("/api/auth/register", "POST"),
                ("/api/auth/refresh", "POST"),
                ("/api/comments", "GET"),
                ("/api/comments", "POST"),
                ("/api/analytics/users", "GET"),
                ("/api/analytics/content", "GET"),
                ("/api/analytics/engagement", "GET")
            };
        }

        private int GenerateResponseTime(string endpoint)
        {
            return endpoint switch
            {
                "/api/auth/login" => _random.Next(100, 500),
                "/api/auth/register" => _random.Next(200, 800),
                "/api/posts" => _random.Next(50, 300),
                "/api/analytics/users" => _random.Next(500, 2000),
                "/api/analytics/content" => _random.Next(500, 2000),
                "/api/analytics/engagement" => _random.Next(500, 2000),
                _ => _random.Next(50, 1000)
            };
        }

        private int GenerateStatusCode()
        {
            var statusCodes = new[] { 200, 200, 200, 200, 200, 201, 204, 400, 401, 404, 500 };
            return statusCodes[_random.Next(statusCodes.Length)];
        }

        private (string Type, string Message, string Severity, string Source, string RequestPath)[] GetErrorTypes()
        {
            return new[]
            {
                ("NullReferenceException", "Object reference not set to an instance of an object", "Error", "Application", "/api/posts"),
                ("ArgumentException", "Invalid argument provided", "Warning", "Application", "/api/users"),
                ("UnauthorizedAccessException", "Access denied", "Warning", "Security", "/api/admin"),
                ("SqlException", "Database connection timeout", "Error", "Database", "/api/posts"),
                ("ValidationException", "Model validation failed", "Warning", "Application", "/api/posts"),
                ("TimeoutException", "Request timeout", "Error", "Network", "/api/analytics"),
                ("OutOfMemoryException", "Insufficient memory", "Critical", "System", "/api/upload"),
                ("FileNotFoundException", "Required file not found", "Error", "FileSystem", "/api/files")
            };
        }

        private string GenerateStackTrace(string errorType)
        {
            return $"   at Application.Services.{errorType.Replace("Exception", "Service")}.Method()\n" +
                   $"   at Application.Controllers.BaseController.HandleRequest()\n" +
                   $"   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.Execute()";
        }

        private string[] GenerateApiKeys()
        {
            return Enumerable.Range(1, 10)
                .Select(i => $"api_key_{Guid.NewGuid().ToString("N")[..16]}")
                .ToArray();
        }
    }
}