using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.SystemConfiguration.Commands;

public class UpdateDatabaseConfigurationRequest
{
    public string ConnectionString { get; set; } = string.Empty;
    public int CommandTimeout { get; set; }
}

public class UpdateCacheConfigurationRequest
{
    public bool EnableCaching { get; set; }
    public int CacheExpirationMinutes { get; set; }
}

public class UpdateLoggingConfigurationRequest
{
    public string LogLevel { get; set; } = string.Empty;
    public bool EnableFileLogging { get; set; }
}

public class UpdatePerformanceConfigurationRequest
{
    public int MaxConcurrentRequests { get; set; }
    public int RequestTimeoutSeconds { get; set; }
}

public class ClearCacheRequest
{
    public string CacheType { get; set; } = string.Empty;
}

public class RestartServicesRequest
{
    public List<string> ServiceNames { get; set; } = new();
}

public class UpdateFeatureFlagsRequest
{
    public Dictionary<string, bool> FeatureFlags { get; set; } = new();
}

public class UpdateDatabaseConfigurationCommand : IRequest<ApiResponseDto<object>>
{
    public UpdateDatabaseConfigurationRequest Request { get; set; } = new();
}

public class UpdateDatabaseConfigurationCommandHandler : IRequestHandler<UpdateDatabaseConfigurationCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateDatabaseConfigurationCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Database configuration updated" });
    }
}