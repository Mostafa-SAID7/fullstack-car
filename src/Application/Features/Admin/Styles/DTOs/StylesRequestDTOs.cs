using Microsoft.AspNetCore.Http;

namespace Application.Features.Admin.Styles.DTOs;

public class ApplyPredefinedStyleRequest
{
    public string StyleName { get; set; } = string.Empty;
    public bool OverrideCustomizations { get; set; } = false;
}

public class UpdateCssVariablesRequest
{
    public Dictionary<string, string> Variables { get; set; } = new();
}

public class CreateCustomStyleRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CssContent { get; set; } = string.Empty;
    public Dictionary<string, string> Variables { get; set; } = new();
}

public class UpdateCustomStyleRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CssContent { get; set; } = string.Empty;
    public Dictionary<string, string> Variables { get; set; } = new();
}

public class UploadCustomFontRequest
{
    public IFormFile FontFile { get; set; } = null!;
    public string FontName { get; set; } = string.Empty;
    public string FontFamily { get; set; } = string.Empty;
    public string FontWeight { get; set; } = "400";
    public string FontStyle { get; set; } = "normal";
}

public class CreateColorSchemeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PrimaryColor { get; set; } = string.Empty;
    public string SecondaryColor { get; set; } = string.Empty;
    public string AccentColor { get; set; } = string.Empty;
    public Dictionary<string, string> AdditionalColors { get; set; } = new();
}

public class UpdateColorSchemeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PrimaryColor { get; set; } = string.Empty;
    public string SecondaryColor { get; set; } = string.Empty;
    public string AccentColor { get; set; } = string.Empty;
    public Dictionary<string, string> AdditionalColors { get; set; } = new();
}

public class PreviewStylesRequest
{
    public string? StyleName { get; set; }
    public Dictionary<string, string> Variables { get; set; } = new();
    public string? CustomCss { get; set; }
}