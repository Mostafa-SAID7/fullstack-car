namespace Application.Features.Shared.Caching.Interfaces
{
    public interface ICacheInvalidatorRequest
    {
        string[] CacheTags { get; }
    }
}