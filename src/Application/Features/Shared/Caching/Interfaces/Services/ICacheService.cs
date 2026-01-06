using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Shared.Caching.Interfaces.Services
{
    public interface ICacheService
    {
        Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class;

        Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default);

        Task RemoveAsync(string key, CancellationToken cancellationToken = default);

        Task RemoveByTagAsync(string tag, CancellationToken cancellationToken = default);

        Task SetWithTagAsync<T>(string key, T value, string tag, TimeSpan? expiration = null, CancellationToken cancellationToken = default);
    }
}
