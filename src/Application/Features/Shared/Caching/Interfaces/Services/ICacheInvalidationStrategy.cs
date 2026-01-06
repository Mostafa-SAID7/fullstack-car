using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.Shared.Caching.Interfaces.Services
{
    public interface ICacheInvalidationStrategy
    {
        Task InvalidateAsync(string entityType, string entityId, CancellationToken cancellationToken = default);
        Task InvalidateRelatedAsync(string entityType, string entityId, CancellationToken cancellationToken = default);
        Task InvalidateByPatternAsync(string pattern, CancellationToken cancellationToken = default);
    }
}
