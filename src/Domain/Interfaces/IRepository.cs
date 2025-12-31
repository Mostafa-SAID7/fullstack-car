using Domain.Specifications;
using System.Linq.Expressions;

namespace Domain.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid id);
        Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<IReadOnlyList<T>> ListAllAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<T>> GetAllAsync(); // Add this method
        Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken); // Add this method
        Task<IReadOnlyList<T>> ListAsync(BaseSpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(BaseSpecification<T> spec, CancellationToken cancellationToken);
        Task<T?> FirstOrDefaultAsync(BaseSpecification<T> spec);
        Task<T?> FirstOrDefaultAsync(BaseSpecification<T> spec, CancellationToken cancellationToken);
        Task<int> CountAsync(BaseSpecification<T> spec);
        Task<int> CountAsync(BaseSpecification<T> spec, CancellationToken cancellationToken);
        Task<T> AddAsync(T entity);
        Task<T> AddAsync(T entity, CancellationToken cancellationToken);
        Task UpdateAsync(T entity);
        Task UpdateAsync(T entity, CancellationToken cancellationToken);
        Task DeleteAsync(T entity);
        Task DeleteAsync(T entity, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken);
        IQueryable<T> GetQueryable();
    }
}