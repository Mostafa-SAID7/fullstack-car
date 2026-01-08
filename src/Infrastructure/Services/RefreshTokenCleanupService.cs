using Application.Features.Identity.Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services
{
    public class RefreshTokenCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RefreshTokenCleanupService> _logger;
        private readonly TimeSpan _cleanupInterval = TimeSpan.FromHours(24); // Run daily

        public RefreshTokenCleanupService(
            IServiceProvider serviceProvider,
            ILogger<RefreshTokenCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var refreshTokenRepository = scope.ServiceProvider.GetRequiredService<IRefreshTokenRepository>();
                    
                    await refreshTokenRepository.CleanupExpiredTokensAsync();
                    _logger.LogInformation("Expired refresh tokens cleaned up successfully");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while cleaning up expired refresh tokens");
                }

                await Task.Delay(_cleanupInterval, stoppingToken);
            }
        }
    }
}