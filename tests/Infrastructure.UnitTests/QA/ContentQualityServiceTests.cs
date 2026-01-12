using Application.Features.Community.QA.Services;
using Infrastructure.Services.QA;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Infrastructure.UnitTests.QA;

public class ContentQualityServiceTests
{
    private readonly IContentQualityService _contentQualityService;
    private readonly Mock<ILogger<ContentQualityService>> _mockLogger;

    public ContentQualityServiceTests()
    {
        _mockLogger = new Mock<ILogger<ContentQualityService>>();
        _contentQualityService = new ContentQualityService(_mockLogger.Object);
    }

    [Fact]
    public async Task EvaluateQuestionQualityAsync_ValidQuestion_ReturnsHighScore()
    {
        // Arrange
        var title = "How to implement JWT authentication in ASP.NET Core?";
        var content = "I'm building a web API and need to implement JWT token-based authentication. I want to understand the best practices for token generation, validation, and security considerations. Can someone provide guidance with code examples?";

        // Act
        var score = await _contentQualityService.EvaluateQuestionQualityAsync(title, content);

        // Assert
        Assert.True(score > 0.5, $"Expected score > 0.5, but got {score}");
    }

    [Fact]
    public async Task EvaluateQuestionQualityAsync_ShortContent_ReturnsLowScore()
    {
        // Arrange
        var title = "Help";
        var content = "Need help";

        // Act
        var score = await _contentQualityService.EvaluateQuestionQualityAsync(title, content);

        // Assert
        Assert.True(score < 0.5, $"Expected score < 0.5, but got {score}");
    }

    [Fact]
    public async Task IsSpamAsync_SpamContent_ReturnsTrue()
    {
        // Arrange
        var content = "Buy now! Click here for amazing deals! Free money guaranteed!";

        // Act
        var isSpam = await _contentQualityService.IsSpamAsync(content);

        // Assert
        Assert.True(isSpam);
    }

    [Fact]
    public async Task IsSpamAsync_ValidContent_ReturnsFalse()
    {
        // Arrange
        var content = "This is a comprehensive answer explaining the technical implementation details with proper examples and best practices.";

        // Act
        var isSpam = await _contentQualityService.IsSpamAsync(content);

        // Assert
        Assert.False(isSpam);
    }

    [Fact]
    public async Task DetectInappropriateContentAsync_InappropriateContent_ReturnsIssues()
    {
        // Arrange
        var content = "How to hack into systems and crack passwords?";

        // Act
        var issues = await _contentQualityService.DetectInappropriateContentAsync(content);

        // Assert
        Assert.NotEmpty(issues);
    }

    [Fact]
    public async Task DetectInappropriateContentAsync_AppropriateContent_ReturnsEmpty()
    {
        // Arrange
        var content = "How to implement secure authentication in web applications?";

        // Act
        var issues = await _contentQualityService.DetectInappropriateContentAsync(content);

        // Assert
        Assert.Empty(issues);
    }

    [Fact]
    public async Task ValidateContentQualityAsync_ValidContent_ReturnsTrue()
    {
        // Arrange
        var content = "This is a comprehensive answer that provides detailed technical information with proper examples and explanations.";

        // Act
        var isValid = await _contentQualityService.ValidateContentQualityAsync(content);

        // Assert
        Assert.True(isValid);
    }

    [Fact]
    public async Task ValidateContentQualityAsync_InvalidContent_ReturnsFalse()
    {
        // Arrange
        var content = "Short";

        // Act
        var isValid = await _contentQualityService.ValidateContentQualityAsync(content);

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public async Task GetDetailedQualityAssessmentAsync_ValidContent_ReturnsAssessment()
    {
        // Arrange
        var content = "This is a comprehensive answer that provides detailed technical information with proper examples and explanations.";

        // Act
        var assessment = await _contentQualityService.GetDetailedQualityAssessmentAsync(content, "Answer");

        // Assert
        Assert.NotNull(assessment);
        Assert.True(assessment.OverallScore > 0);
        Assert.NotNull(assessment.QualityScores);
        Assert.NotNull(assessment.QualityIssues);
        Assert.NotNull(assessment.PositiveIndicators);
        Assert.NotNull(assessment.Recommendations);
    }
}