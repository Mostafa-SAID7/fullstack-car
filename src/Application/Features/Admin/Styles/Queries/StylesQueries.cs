using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.Styles.Queries;

public class GetPredefinedStylesQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetPredefinedStyleQuery : IRequest<ApiResponseDto<object>>
{
    public string StyleName { get; set; } = string.Empty;
}

public class GetActiveStylesQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetAllStylesQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetCompiledCssQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetCssVariablesQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetAvailableFontsQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetColorSchemesQuery : IRequest<ApiResponseDto<object>>
{
}

// Handlers
public class GetPredefinedStylesQueryHandler : IRequestHandler<GetPredefinedStylesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetPredefinedStylesQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var styles = new[]
        {
            new { Name = "Modern", Description = "Clean and modern design", Category = "Professional" },
            new { Name = "Classic", Description = "Traditional and elegant", Category = "Traditional" },
            new { Name = "Dark", Description = "Dark theme for night mode", Category = "Theme" }
        };
        
        return ApiResponseDto<object>.Success(styles);
    }
}

public class GetPredefinedStyleQueryHandler : IRequestHandler<GetPredefinedStyleQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetPredefinedStyleQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var style = new
        {
            Name = request.StyleName,
            Description = "Style description",
            CssContent = "/* CSS content */",
            Variables = new { PrimaryColor = "#007bff", SecondaryColor = "#6c757d" }
        };
        
        return ApiResponseDto<object>.Success(style);
    }
}

public class GetActiveStylesQueryHandler : IRequestHandler<GetActiveStylesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetActiveStylesQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var styles = new
        {
            Theme = "Modern",
            PrimaryColor = "#007bff",
            SecondaryColor = "#6c757d",
            FontFamily = "Inter, sans-serif",
            FontSize = "16px"
        };
        
        return ApiResponseDto<object>.Success(styles);
    }
}

public class GetAllStylesQueryHandler : IRequestHandler<GetAllStylesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetAllStylesQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var styles = new
        {
            Predefined = new[] { "Modern", "Classic", "Dark" },
            Custom = new[] { "Company Brand", "Custom Theme 1" },
            Active = "Modern"
        };
        
        return ApiResponseDto<object>.Success(styles);
    }
}

public class GetCompiledCssQueryHandler : IRequestHandler<GetCompiledCssQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetCompiledCssQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var css = new
        {
            CssContent = ":root { --primary-color: #007bff; --secondary-color: #6c757d; } body { font-family: Inter, sans-serif; }",
            LastCompiled = DateTime.UtcNow,
            Size = "45.2KB"
        };
        
        return ApiResponseDto<object>.Success(css);
    }
}

public class GetCssVariablesQueryHandler : IRequestHandler<GetCssVariablesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetCssVariablesQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var variables = new
        {
            Colors = new { Primary = "#007bff", Secondary = "#6c757d", Success = "#28a745", Danger = "#dc3545" },
            Typography = new { FontFamily = "Inter, sans-serif", FontSize = "16px", LineHeight = "1.5" },
            Spacing = new { Small = "8px", Medium = "16px", Large = "24px", XLarge = "32px" }
        };
        
        return ApiResponseDto<object>.Success(variables);
    }
}

public class GetAvailableFontsQueryHandler : IRequestHandler<GetAvailableFontsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetAvailableFontsQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var fonts = new
        {
            SystemFonts = new[] { "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana" },
            WebFonts = new[] { "Inter", "Roboto", "Open Sans", "Lato", "Montserrat" },
            CustomFonts = new[] { "Company Font", "Brand Typography" }
        };
        
        return ApiResponseDto<object>.Success(fonts);
    }
}

public class GetColorSchemesQueryHandler : IRequestHandler<GetColorSchemesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetColorSchemesQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var schemes = new[]
        {
            new { Id = Guid.NewGuid(), Name = "Blue Ocean", Primary = "#007bff", Secondary = "#0056b3", Accent = "#17a2b8" },
            new { Id = Guid.NewGuid(), Name = "Forest Green", Primary = "#28a745", Secondary = "#1e7e34", Accent = "#20c997" },
            new { Id = Guid.NewGuid(), Name = "Sunset Orange", Primary = "#fd7e14", Secondary = "#e55a00", Accent = "#ffc107" }
        };
        
        return ApiResponseDto<object>.Success(schemes);
    }
}