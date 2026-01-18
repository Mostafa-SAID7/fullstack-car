namespace Application.Features.Admin.Layouts.DTOs;

public class CreateLayoutRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LayoutType { get; set; } = string.Empty; // "page", "component", "template"
    public string HtmlContent { get; set; } = string.Empty;
    public string CssContent { get; set; } = string.Empty;
    public Dictionary<string, object> Configuration { get; set; } = new();
}

public class UpdateLayoutRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HtmlContent { get; set; } = string.Empty;
    public string CssContent { get; set; } = string.Empty;
    public Dictionary<string, object> Configuration { get; set; } = new();
}

public class CreateCustomComponentRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ComponentType { get; set; } = string.Empty;
    public string HtmlTemplate { get; set; } = string.Empty;
    public string CssStyles { get; set; } = string.Empty;
    public Dictionary<string, object> Properties { get; set; } = new();
}

public class UpdateCustomComponentRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HtmlTemplate { get; set; } = string.Empty;
    public string CssStyles { get; set; } = string.Empty;
    public Dictionary<string, object> Properties { get; set; } = new();
}

public class CreateLayoutFromTemplateRequest
{
    public Guid TemplateId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, object> Customizations { get; set; } = new();
}

public class PreviewLayoutRequest
{
    public string? DeviceType { get; set; } // "desktop", "tablet", "mobile"
    public Dictionary<string, object> PreviewOptions { get; set; } = new();
}

public class UpdateResponsiveBreakpointsRequest
{
    public Dictionary<string, int> Breakpoints { get; set; } = new();
}
public class ActivateLayoutRequest
{
    public bool SetAsDefault { get; set; } = false;
    public string? ActivationNotes { get; set; }
}

public class DuplicateLayoutRequest
{
    public string NewName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IncludeCustomizations { get; set; } = true;
}