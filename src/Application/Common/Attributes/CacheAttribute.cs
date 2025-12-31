using System;

namespace Application.Common.Attributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class CacheAttribute : Attribute
    {
        public int Duration { get; set; } = 300; // 5 minutes default
        public string[] Tags { get; set; } = Array.Empty<string>();
        public bool VaryByUser { get; set; } = false;
        public bool VaryByRole { get; set; } = false;
        public string[] VaryByParameters { get; set; } = Array.Empty<string>();
        public CacheLocation Location { get; set; } = CacheLocation.Any;
        public bool SlidingExpiration { get; set; } = false;
    }
    
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class CacheInvalidateAttribute : Attribute
    {
        public string[] Tags { get; set; } = Array.Empty<string>();
        public string[] Keys { get; set; } = Array.Empty<string>();
        public string[] Patterns { get; set; } = Array.Empty<string>();
    }
    
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class NoCacheAttribute : Attribute
    {
    }
    
    public enum CacheLocation
    {
        Any,
        Memory,
        Distributed,
        Response,
        Output
    }
}