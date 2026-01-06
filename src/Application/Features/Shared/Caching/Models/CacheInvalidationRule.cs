using System;

namespace Application.Features.Shared.Caching.Models
{
    public class CacheInvalidationRule
    {
        public string[] DirectTags { get; set; } = Array.Empty<string>();
        public string[] RelatedTags { get; set; } = Array.Empty<string>();
        public string[] Patterns { get; set; } = Array.Empty<string>();
    }
}
