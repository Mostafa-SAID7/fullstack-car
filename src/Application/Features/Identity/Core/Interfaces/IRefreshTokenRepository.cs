using Domain.Entities.Identity;

namespace Application.Features.Identity.Core.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task<RefreshToken?> GetActiveTokenByUserIdAsync(Guid userId);
        Task<IEnumerable<RefreshToken>> GetActiveTokensByUserIdAsync(Guid userId);
        Task AddAsync(RefreshToken refreshToken);
        Task UpdateAsync(RefreshToken refreshToken);
        Task RevokeAllUserTokensAsync(Guid userId);
        Task RevokeTokenAsync(string token);
        Task CleanupExpiredTokensAsync();
    }
}