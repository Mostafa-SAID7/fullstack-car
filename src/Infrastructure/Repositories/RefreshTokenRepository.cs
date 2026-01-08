using Application.Features.Identity.Core.Interfaces;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _context;

        public RefreshTokenRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == token);
        }

        public async Task<RefreshToken?> GetActiveTokenByUserIdAsync(Guid userId)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User)
                .Where(rt => rt.UserId == userId && rt.IsActive)
                .OrderByDescending(rt => rt.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<RefreshToken>> GetActiveTokensByUserIdAsync(Guid userId)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User)
                .Where(rt => rt.UserId == userId && rt.IsActive)
                .ToListAsync();
        }

        public async Task AddAsync(RefreshToken refreshToken)
        {
            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task RevokeAllUserTokensAsync(Guid userId)
        {
            var tokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId && rt.IsActive)
                .ToListAsync();

            foreach (var token in tokens)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
                token.RevokedReason = "All tokens revoked by user";
            }

            await _context.SaveChangesAsync();
        }

        public async Task RevokeTokenAsync(string token)
        {
            var refreshToken = await GetByTokenAsync(token);
            if (refreshToken != null && refreshToken.IsActive)
            {
                refreshToken.IsRevoked = true;
                refreshToken.RevokedAt = DateTime.UtcNow;
                refreshToken.RevokedReason = "Token revoked by user";
                await UpdateAsync(refreshToken);
            }
        }

        public async Task CleanupExpiredTokensAsync()
        {
            var expiredTokens = await _context.RefreshTokens
                .Where(rt => rt.ExpiresAt < DateTime.UtcNow)
                .ToListAsync();

            _context.RefreshTokens.RemoveRange(expiredTokens);
            await _context.SaveChangesAsync();
        }
    }
}