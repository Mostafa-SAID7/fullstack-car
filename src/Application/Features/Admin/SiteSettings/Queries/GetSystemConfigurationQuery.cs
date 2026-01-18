using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.SiteSettings.Queries;

public class GetSystemConfigurationQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetSystemConfigurationQueryHandler : IRequestHandler<GetSystemConfigurationQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetSystemConfigurationQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var configuration = new
        {
            Database = new
            {
                ConnectionString = "Server=localhost;Database=CommunityCarDB;",
                CommandTimeout = 30,
                EnableRetryOnFailure = true,
                MaxRetryCount = 3
            },
            Cache = new
            {
                EnableCaching = true,
                DefaultCacheDuration = 300,
                CacheProvider = "Memory",
                RedisConnectionString = (string?)null
            },
            Logging = new
            {
                LogLevel = "Information",
                EnableFileLogging = true,
                EnableDatabaseLogging = false,
                MaxLogFileSize = 10,
                RetainLogDays = 30
            },
            Performance = new
            {
                EnableCompression = true,
                EnableMinification = true,
                RequestTimeout = 30,
                MaxConcurrentRequests = 100,
                EnableResponseCaching = true
            }
        };
        
        return ApiResponseDto<object>.Success(configuration);
    }
}