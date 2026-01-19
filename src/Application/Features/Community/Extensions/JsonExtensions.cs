using System.Text.Json;

namespace Application.Features.Community.Extensions;

public static class JsonExtensions
{
    private static readonly JsonSerializerOptions DefaultOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public static List<string> DeserializeStringList(this string? json)
    {
        if (string.IsNullOrEmpty(json))
            return new List<string>();

        try
        {
            return JsonSerializer.Deserialize<List<string>>(json, DefaultOptions) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    public static string SerializeStringList(this List<string> list)
    {
        if (list == null || list.Count == 0)
            return "[]";

        try
        {
            return JsonSerializer.Serialize(list, DefaultOptions);
        }
        catch
        {
            return "[]";
        }
    }
}
