using System.Text.Json;

namespace WebAPI.Services
{
    public interface IPredefinedStylesService
    {
        Task<List<PredefinedStyleInfo>> GetAvailableStylesAsync();
        Task<PredefinedStyleDefinition?> GetStyleDefinitionAsync(string styleName);
        Task<string> GenerateCssFromStyleAsync(PredefinedStyleDefinition style);
    }

    public class PredefinedStylesService : IPredefinedStylesService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<PredefinedStylesService> _logger;
        private readonly string _stylesPath;

        public PredefinedStylesService(IWebHostEnvironment environment, ILogger<PredefinedStylesService> logger)
        {
            _environment = environment;
            _logger = logger;
            _stylesPath = Path.Combine(_environment.ContentRootPath, "Styles", "Predefined");
        }

        public async Task<List<PredefinedStyleInfo>> GetAvailableStylesAsync()
        {
            try
            {
                var styles = new List<PredefinedStyleInfo>();
                
                if (!Directory.Exists(_stylesPath))
                {
                    _logger.LogWarning("Predefined styles directory not found: {Path}", _stylesPath);
                    return styles;
                }

                var styleFiles = Directory.GetFiles(_stylesPath, "*.json");
                
                foreach (var file in styleFiles)
                {
                    try
                    {
                        var content = await File.ReadAllTextAsync(file);
                        var styleDefinition = JsonSerializer.Deserialize<PredefinedStyleDefinition>(content, new JsonSerializerOptions
                        {
                            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                        });

                        if (styleDefinition != null)
                        {
                            styles.Add(new PredefinedStyleInfo
                            {
                                Name = styleDefinition.Name,
                                Description = styleDefinition.Description,
                                Category = styleDefinition.Category,
                                Version = styleDefinition.Version,
                                FileName = Path.GetFileNameWithoutExtension(file),
                                PreviewColors = ExtractPreviewColors(styleDefinition)
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error loading style file: {File}", file);
                    }
                }

                return styles.OrderBy(s => s.Category).ThenBy(s => s.Name).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available styles");
                return new List<PredefinedStyleInfo>();
            }
        }

        public async Task<PredefinedStyleDefinition?> GetStyleDefinitionAsync(string styleName)
        {
            try
            {
                var filePath = Path.Combine(_stylesPath, $"{styleName}.json");
                
                if (!File.Exists(filePath))
                {
                    _logger.LogWarning("Style file not found: {FilePath}", filePath);
                    return null;
                }

                var content = await File.ReadAllTextAsync(filePath);
                var styleDefinition = JsonSerializer.Deserialize<PredefinedStyleDefinition>(content, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                return styleDefinition;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading style definition: {StyleName}", styleName);
                return null;
            }
        }

        public async Task<string> GenerateCssFromStyleAsync(PredefinedStyleDefinition style)
        {
            try
            {
                var css = new System.Text.StringBuilder();
                
                // Generate CSS custom properties (variables)
                css.AppendLine(":root {");
                foreach (var variable in style.Variables)
                {
                    css.AppendLine($"  --{variable.Key}: {variable.Value};");
                }
                css.AppendLine("}");
                css.AppendLine();

                // Generate component styles
                foreach (var component in style.Components)
                {
                    if (component.Value is JsonElement element && element.ValueKind == JsonValueKind.Object)
                    {
                        GenerateComponentCss(css, component.Key, element);
                    }
                }

                return css.ToString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating CSS from style: {StyleName}", style.Name);
                return string.Empty;
            }
        }

        private void GenerateComponentCss(System.Text.StringBuilder css, string componentName, JsonElement componentStyles)
        {
            foreach (var variant in componentStyles.EnumerateObject())
            {
                var className = variant.Name == "primary" || variant.Name == "default" 
                    ? $".{componentName}" 
                    : $".{componentName}-{variant.Name}";

                css.AppendLine($"{className} {{");
                
                if (variant.Value.ValueKind == JsonValueKind.Object)
                {
                    foreach (var property in variant.Value.EnumerateObject())
                    {
                        var cssProperty = ConvertToCssProperty(property.Name);
                        css.AppendLine($"  {cssProperty}: {property.Value.GetString()};");
                    }
                }
                
                css.AppendLine("}");
                css.AppendLine();
            }
        }

        private string ConvertToCssProperty(string property)
        {
            // Convert camelCase to kebab-case
            return string.Concat(property.Select((x, i) => i > 0 && char.IsUpper(x) ? "-" + x : x.ToString())).ToLower();
        }

        private Dictionary<string, string> ExtractPreviewColors(PredefinedStyleDefinition style)
        {
            var colors = new Dictionary<string, string>();
            
            var colorKeys = new[] { "primary-color", "secondary-color", "accent-color", "success-color", "warning-color", "error-color" };
            
            foreach (var key in colorKeys)
            {
                if (style.Variables.TryGetValue(key, out var color))
                {
                    colors[key] = color;
                }
            }

            return colors;
        }
    }

    public class PredefinedStyleInfo
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public Dictionary<string, string> PreviewColors { get; set; } = new();
    }

    public class PredefinedStyleDefinition
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public Dictionary<string, string> Variables { get; set; } = new();
        public Dictionary<string, object> Components { get; set; } = new();
    }
}