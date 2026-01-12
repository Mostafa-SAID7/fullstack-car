using Application.Common.Interfaces;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text;
using Xunit;

namespace Infrastructure.UnitTests.Repositories;

public class TranslationRepositoryTests : IDisposable
{
    private readonly Mock<IDistributedCache> _distributedCacheMock;
    private readonly Mock<IWebHostEnvironment> _environmentMock;
    private readonly Mock<ILogger<TranslationRepository>> _loggerMock;
    private readonly IMemoryCache _memoryCache;
    private readonly TranslationRepository _repository;
    private readonly string _testContentRoot;

    public TranslationRepositoryTests()
    {
        _distributedCacheMock = new Mock<IDistributedCache>();
        _environmentMock = new Mock<IWebHostEnvironment>();
        _loggerMock = new Mock<ILogger<TranslationRepository>>();
        
        // Use real MemoryCache for testing
        _memoryCache = new MemoryCache(new MemoryCacheOptions());
        
        // Setup test content root
        _testContentRoot = Path.Combine(Path.GetTempPath(), "TranslationTests", Guid.NewGuid().ToString());
        Directory.CreateDirectory(_testContentRoot);
        
        _environmentMock.Setup(x => x.ContentRootPath).Returns(_testContentRoot);
        
        _repository = new TranslationRepository(
            _memoryCache,
            _distributedCacheMock.Object,
            _environmentMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task GetSupportedCulturesAsync_ShouldReturnExpectedCultures()
    {
        // Act
        var cultures = await _repository.GetSupportedCulturesAsync();

        // Assert
        var cultureList = cultures.ToList();
        Assert.Contains("en-US", cultureList);
        Assert.Contains("ar-EG", cultureList);
        Assert.Contains("ar-AE", cultureList);
        Assert.Contains("ar-SA", cultureList);
        Assert.Equal(4, cultureList.Count);
    }

    [Fact]
    public async Task GetTranslationsAsync_WithValidResourceFile_ShouldReturnTranslations()
    {
        // Arrange
        var culture = "en-US";
        var feature = "posts";
        
        // Create test resource file
        var resourcePath = Path.Combine(_testContentRoot, "Resources", "Main", "Community", feature);
        Directory.CreateDirectory(resourcePath);
        
        var testTranslations = new
        {
            posts = new
            {
                title = "Posts",
                create = "Create Post"
            }
        };
        
        var jsonContent = System.Text.Json.JsonSerializer.Serialize(testTranslations);
        await File.WriteAllTextAsync(Path.Combine(resourcePath, $"{culture}.json"), jsonContent);

        // Setup distributed cache miss
        _distributedCacheMock.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                           .ReturnsAsync((byte[]?)null);

        // Act
        var result = await _repository.GetTranslationsAsync(culture, feature);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.ContainsKey("posts.title"));
        Assert.Equal("Posts", result["posts.title"]);
        Assert.True(result.ContainsKey("posts.create"));
        Assert.Equal("Create Post", result["posts.create"]);
    }

    [Fact]
    public async Task GetTranslationAsync_WithValidKey_ShouldReturnTranslation()
    {
        // Arrange
        var culture = "en-US";
        var key = "posts.title";
        
        // Create test resource file
        var resourcePath = Path.Combine(_testContentRoot, "Resources", "Main", "Community", "posts");
        Directory.CreateDirectory(resourcePath);
        
        var testTranslations = new
        {
            posts = new
            {
                title = "Posts"
            }
        };
        
        var jsonContent = System.Text.Json.JsonSerializer.Serialize(testTranslations);
        await File.WriteAllTextAsync(Path.Combine(resourcePath, $"{culture}.json"), jsonContent);

        // Setup distributed cache miss
        _distributedCacheMock.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                           .ReturnsAsync((byte[]?)null);

        // Act
        var result = await _repository.GetTranslationAsync(culture, key);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Posts", result);
    }

    [Fact]
    public async Task ValidateTranslationCompletenessAsync_WithCompleteTranslations_ShouldReturnTrue()
    {
        // Arrange
        var culture = "ar-EG";
        var feature = "posts";
        
        // Create reference (en-US) resource file
        var enResourcePath = Path.Combine(_testContentRoot, "Resources", "Main", "Community", feature);
        Directory.CreateDirectory(enResourcePath);
        
        var testTranslations = new
        {
            posts = new
            {
                title = "Posts",
                create = "Create Post"
            }
        };
        
        var jsonContent = System.Text.Json.JsonSerializer.Serialize(testTranslations);
        await File.WriteAllTextAsync(Path.Combine(enResourcePath, "en-US.json"), jsonContent);

        // Create target culture resource file with same keys
        var arTranslations = new
        {
            posts = new
            {
                title = "المنشورات",
                create = "إنشاء منشور"
            }
        };
        
        var arJsonContent = System.Text.Json.JsonSerializer.Serialize(arTranslations);
        await File.WriteAllTextAsync(Path.Combine(enResourcePath, $"{culture}.json"), arJsonContent);

        // Setup distributed cache miss
        _distributedCacheMock.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                           .ReturnsAsync((byte[]?)null);

        // Act
        var result = await _repository.ValidateTranslationCompletenessAsync(culture, feature);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task GetBatchTranslationsAsync_WithMultipleFeatures_ShouldReturnAllTranslations()
    {
        // Arrange
        var culture = "en-US";
        var features = new[] { "posts", "groups" };
        
        // Create test resource files for both features
        foreach (var feature in features)
        {
            var resourcePath = Path.Combine(_testContentRoot, "Resources", "Main", "Community", feature);
            Directory.CreateDirectory(resourcePath);
            
            var testTranslations = new Dictionary<string, object>
            {
                [feature] = new Dictionary<string, string>
                {
                    ["title"] = $"{feature} Title"
                }
            };
            
            var jsonContent = System.Text.Json.JsonSerializer.Serialize(testTranslations);
            await File.WriteAllTextAsync(Path.Combine(resourcePath, $"{culture}.json"), jsonContent);
        }

        // Setup distributed cache miss
        _distributedCacheMock.Setup(x => x.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                           .ReturnsAsync((byte[]?)null);

        // Act
        var result = await _repository.GetBatchTranslationsAsync(culture, features);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.True(result.ContainsKey("posts"));
        Assert.True(result.ContainsKey("groups"));
    }

    public void Dispose()
    {
        // Cleanup test directory
        if (Directory.Exists(_testContentRoot))
        {
            Directory.Delete(_testContentRoot, true);
        }
        
        _memoryCache?.Dispose();
    }
}