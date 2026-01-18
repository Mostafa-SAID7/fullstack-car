using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.SiteSettings.Queries;

public class GetEnvironmentInfoQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetEnvironmentInfoQueryHandler : IRequestHandler<GetEnvironmentInfoQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetEnvironmentInfoQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var environmentInfo = new
        {
            Environment = "Production",
            Version = "1.0.0",
            BuildDate = DateTime.UtcNow.AddDays(-5),
            Framework = ".NET 9.0",
            OperatingSystem = Environment.OSVersion.ToString(),
            MachineName = Environment.MachineName,
            ProcessorCount = Environment.ProcessorCount,
            WorkingSet = Environment.WorkingSet,
            ServerTime = DateTime.UtcNow,
            TimeZone = TimeZoneInfo.Local.DisplayName
        };
        
        return ApiResponseDto<object>.Success(environmentInfo);
    }
}