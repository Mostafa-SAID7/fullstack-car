using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Theme.Queries;

public class GetAllThemesQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetAllThemesQueryHandler : IRequestHandler<GetAllThemesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetAllThemesQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var themes = new[]
        {
            new
            {
                Id = Guid.NewGuid(),
                Name = "Default Theme",
                IsActive = true,
                Colors = new { Primary = "#007bff", Secondary = "#6c757d" },
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new
            {
                Id = Guid.NewGuid(),
                Name = "Dark Theme",
                IsActive = false,
                Colors = new { Primary = "#343a40", Secondary = "#495057" },
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            }
        };
        
        return ApiResponseDto<object>.Success(themes);
    }
}