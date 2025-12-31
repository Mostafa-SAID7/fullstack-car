using Application.Common.Models;
using Domain.Entities.Marketplace;

namespace Application.Features.Marketplace.ServiceProviders.Interfaces
{
    public interface IServiceProviderService
    {
        Task<Result<ServiceProvider>> GetServiceProviderByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<PaginatedList<ServiceProvider>>> GetServiceProvidersAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<Result<ServiceProvider>> CreateServiceProviderAsync(ServiceProvider serviceProvider, CancellationToken cancellationToken = default);
        Task<Result<ServiceProvider>> UpdateServiceProviderAsync(ServiceProvider serviceProvider, CancellationToken cancellationToken = default);
        Task<Result> DeleteServiceProviderAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result> VerifyServiceProviderAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<PaginatedList<ServiceProvider>>> SearchServiceProvidersAsync(string searchTerm, string location, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
    }
}