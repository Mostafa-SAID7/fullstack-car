namespace WebAPI.Extensions;

public static class HttpContextExtensions
{
    /// <summary>
    /// Gets the current culture from HttpContext items set by CultureDetectionMiddleware
    /// </summary>
    public static string GetCurrentCulture(this HttpContext context)
    {
        return context.Items["Culture"]?.ToString() ?? "en-US";
    }

    /// <summary>
    /// Gets whether the current culture uses RTL text direction
    /// </summary>
    public static bool IsRTL(this HttpContext context)
    {
        return context.Items["IsRTL"] is bool isRtl && isRtl;
    }

    /// <summary>
    /// Gets culture information for the current request
    /// </summary>
    public static (string Culture, bool IsRTL) GetCultureInfo(this HttpContext context)
    {
        return (GetCurrentCulture(context), IsRTL(context));
    }
}