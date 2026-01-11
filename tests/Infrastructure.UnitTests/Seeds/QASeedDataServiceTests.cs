using Infrastructure.Data;
using Infrastructure.Data.Seeds;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Infrastructure.UnitTests.Seeds
{
    public class QASeedDataServiceTests
    {
        private readonly Mock<ILogger<QASeedDataService>> _mockLogger;
        private readonly ApplicationDbContext _context;
        private readonly QASeedDataService _service;

        public QASeedDataServiceTests()
        {
            _mockLogger = new Mock<ILogger<QASeedDataService>>();
            
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new ApplicationDbContext(options);
            _service = new QASeedDataService(_mockLogger.Object, _context);
        }

        [Fact]
        public void QASeedDataService_CanBeInstantiated()
        {
            // Arrange & Act
            var service = new QASeedDataService(_mockLogger.Object, _context);

            // Assert
            Assert.NotNull(service);
        }

        [Fact]
        public async Task SeedAllQADataAsync_WithEmptyDatabase_DoesNotThrow()
        {
            // Arrange
            // Empty database

            // Act & Assert
            var exception = await Record.ExceptionAsync(() => _service.SeedAllQADataAsync());
            Assert.Null(exception);
        }

        public void Dispose()
        {
            _context?.Dispose();
        }
    }
}