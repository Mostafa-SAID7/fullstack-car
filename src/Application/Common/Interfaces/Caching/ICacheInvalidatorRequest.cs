namespace Application.Common.Interfaces.Caching
{
    public interface ICacheInvalidatorRequest
    {
        string[] CacheTags { get; }
    }
}
