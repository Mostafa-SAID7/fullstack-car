using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Services;

public class TranslationCdnSettings
{
    public bool Enabled { get; set; }
    public string Provider { get; set; } = "CloudFlare";
    public string BaseUrl { get; set; } = string.Empty;
    public string TranslationPath { get; set; } = "/translations";
    public int CacheExpiryHours { get; set; } = 24;
    public bool EnableCacheBusting { get; set; } = true;
    public bool EnableCompression { get; set; } = true;
    public bool EnableMinification { get; set; } = true;
}
