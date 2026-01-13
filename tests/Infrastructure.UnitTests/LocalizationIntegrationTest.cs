using Application.Common.Interfaces;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Infrastructure.UnitTests;

/// <summary>
/// Integration test to verify core localization backend functionality is working
/// </summary>
public class LocalizationIntegrationTest : IDisposable
{
    private readonly Mock<IDistributedCache> _distributedCacheMock;
    private readonly Mock<IWebHostEnvironment> _environmentMock;
    private readonly Mock<ILogger<TranslationRepository>> _loggerMock;
    private readonly Mock<ITranslationCacheMetricsService> _metricsServiceMock;
    private readonly IMemoryCache _memoryCache;
    private readonly TranslationRepository _repository;
    private readonly string _testContentRoot;

    public LocalizationIntegrationTest()
    {
        _distributedCacheMock = new Mock<IDistributedCache>();
        _environmentMock = new Mock<IWebHostEnvironment>();
        _loggerMock = new Mock<ILogger<TranslationRepository>>();
        _metricsServiceMock = new Mock<ITranslationCacheMetricsService>();
        
        _memoryCache = new MemoryCache(new MemoryCacheOptions());
        
        _testContentRoot = Path.Combine(Path.GetTempPath(), "LocalizationIntegrationTest", Guid.NewGuid().ToString());
        Directory.CreateDirectory(_testContentRoot);
        
        _environmentMock.Setup(x => x.ContentRootPath).Returns(_testContentRoot);
        
        _repository = new TranslationRepository(
            _memoryCache,
            _distributedCacheMock.Object,
            _environmentMock.Object,
            _loggerMock.Object,
            _metricsServiceMock.Object);
    }

    [Fact]
    public async Task CoreLocalizationBackend_ShouldBeOperational()
    {
        // Arrange - Create basic test resource structure
        var resourcePath = Path.Combine(_testContentRoot, "Resources", "Main", "Community", "posts");
        Directory.CreateDirectory(resourcePath);
        
        var testTranslations = new
        {
            posts = new
            {
                title = "Posts",
                create = "Create Post",
                validation = new
                {
                    titleRequired = "Title is required"
                }
            }
        };
        
        var jsonContent = System.Text.Json.JsonSerializer.Serialize(testTranslations);
        await File.WriteAllTextAsync(Path.Combine(resourcePath, "en-US.json"), jsonContent);

        // Setup cache miss to force file loading
        _distributedCacheMock.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                           .ReturnsAsync((byte[]?)null);

        // Act & Assert - Test core functionality
        
        // 1. Test supported cultures
        var cultures = await _repository.GetSupportedCulturesAsync();
        Assert.NotNull(cultures);
        Assert.Contains("en-US", cultures);
        Assert.Contains("ar-EG", cultures);
        Assert.Contains("ar-AE", cultures);
        Assert.Contains("ar-SA", cultures);

        // 2. Test translation loading
        var translations = await _repository.GetTranslationsAsync("en-US", "posts");
        Assert.NotNull(translations);
        Assert.True(translations.ContainsKey("posts.title"));
        Assert.Equal("Posts", translations["posts.title"]);
        Assert.True(translations.ContainsKey("posts.validation.titleRequired"));
        Assert.Equal("Title is required", translations["posts.validation.titleRequired"]);

        // 3. Test individual translation retrieval
        var singleTranslation = await _repository.GetTranslationAsync("en-US", "posts.create");
        Assert.NotNull(singleTranslation);
        Assert.Equal("Create Post", singleTranslation);

        // 4. Test fallback behavior (request non-existent culture)
        var fallbackTranslation = await _repository.GetTranslationAsync("fr-FR", "posts.title");
        Assert.NotNull(fallbackTranslation);
        Assert.Equal("Posts", fallbackTranslation); // Should fallback to en-US

        // 5. Test batch translations
        var batchTranslations = await _repository.GetBatchTranslationsAsync("en-US", new[] { "posts" });
        Assert.NotNull(batchTranslations);
        Assert.True(batchTranslations.ContainsKey("posts"));
        Assert.True(batchTranslations["posts"].ContainsKey("posts.title"));
    }

    [Fact]
    public async Task LocalizationBackend_ShouldHandleArabicCultures()
    {
        // Arrange - Create Arabic translation file
        var resourcePath = Path.Combine(_testContentRoot, "Resources", "Main", "Community", "posts");
        Directory.CreateDirectory(resourcePath);
        
        var arabicTranslations = new
        {
            posts = new
            {
                title = "المنشورات",
                create = "إنشاء منشور"
            }
        };
        
        var jsonContent = System.Text.Json.JsonSerializer.Serialize(arabicTranslations);
        await File.WriteAllTextAsync(Path.Combine(resourcePath, "ar-EG.json"), jsonContent);

        // Setup cache miss
        _distributedCacheMock.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                           .ReturnsAsync((byte[]?)null);

        // Act & Assert
        var translations = await _repository.GetTranslationsAsync("ar-EG", "posts");
        Assert.NotNull(translations);
        Assert.True(translations.ContainsKey("posts.title"));
        Assert.Equal("المنشورات", translations["posts.title"]);
        Assert.True(translations.ContainsKey("posts.create"));
        Assert.Equal("إنشاء منشور", translations["posts.create"]);
    }

    public void Dispose()
    {
        if (Directory.Exists(_testContentRoot))
        {
            Directory.Delete(_testContentRoot, true);
        }
        
        _memoryCache?.Dispose();
    }
}