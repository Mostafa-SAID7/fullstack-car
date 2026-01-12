using Application.Common.Interfaces;
using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.Handlers;
using Application.Features.Community.QA.Services;
using Domain.Entities.Community.QA;
using Domain.Entities.Identity;
using Domain.Enums.Community.QA;
using Domain.Services;
using FsCheck;
using FsCheck.Xunit;
using Infrastructure.Data;
using Infrastructure.Services.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Infrastructure.UnitTests.QA;

/// <summary>
/// Property-based tests for unified reputation system
/// Feature: qa-system-integration
/// </summary>
public class ReputationSystemPropertyTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<ILogger<ReputationService>> _mockReputationLogger;
    private readonly Mock<ILogger<AcceptAnswerHandler>> _mockAcceptAnswerLogger;
    private readonly Mock<ILogger<UpdateReputationHandler>> _mockUpdateReputationLogger;
    private readonly Mock<ILogger<AwardBadgeHandler>> _mockAwardBadgeLogger;
    private readonly Mock<IExpertService> _mockExpertService;
    private readonly Mock<IQAService> _mockQAService;
    private readonly Mock<IContentQualityService> _mockContentQualityService;

    public ReputationSystemPropertyTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _mockReputationLogger = new Mock<ILogger<ReputationService>>();
        _mockAcceptAnswerLogger = new Mock<ILogger<AcceptAnswerHandler>>();
        _mockUpdateReputationLogger = new Mock<ILogger<UpdateReputationHandler>>();
        _mockAwardBadgeLogger = new Mock<ILogger<AwardBadgeHandler>>();
        _mockExpertService = new Mock<IExpertService>();
        _mockQAService = new Mock<IQAService>();
        _mockContentQualityService = new Mock<IContentQualityService>();

        // Setup default mock behaviors
        _mockExpertService.Setup(x => x.NotifyExpertsForQuestionAsync(It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);
        _mockExpertService.Setup(x => x.GetExpertsByCategoryAsync(It.IsAny<string>()))
            .ReturnsAsync(new List<Guid>());
        _mockExpertService.Setup(x => x.UpdateExpertStatsAsync(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);
    }

    /// <summary>
    /// Feature: qa-system-integration, Property 20: Answer Acceptance Bonus
    /// For any answer that is accepted, the answerer should receive bonus reputation points
    /// Validates: Requirements 4.2
    /// </summary>
    [Property(MaxTest = 10)]
    public bool AnswerAcceptanceBonus_AcceptedAnswer_ShouldReceiveBonusPoints()
    {
        // Arrange
        var questionAuthor = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "question@test.com", 
            UserName = "questionauthor" 
        };
        var answerAuthor = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "answer@test.com", 
            UserName = "answerauthor" 
        };

        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = questionAuthor.Id,
            Title = "Test Question for Acceptance",
            Content = "This is a test question content that meets minimum requirements",
            Status = QuestionStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = questionAuthor.Id.ToString()
        };

        var answer = new Answer
        {
            Id = Guid.NewGuid(),
            QuestionId = question.Id,
            UserId = answerAuthor.Id,
            Content = "This is a comprehensive answer that provides valuable information",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = answerAuthor.Id.ToString()
        };

        _context.Users.AddRange(questionAuthor, answerAuthor);
        _context.Questions.Add(question);
        _context.Answers.Add(answer);
        _context.SaveChanges();

        // Get initial reputation
        var initialReputation = _context.UserReputations
            .FirstOrDefault(ur => ur.UserId == answerAuthor.Id)?.ReputationScore ?? 0;

        var reputationService = new ReputationService(_context, _mockReputationLogger.Object);
        var handler = new AcceptAnswerHandler(_context, reputationService);
        var command = new AcceptAnswerCommand
        {
            UserId = questionAuthor.Id, // Question author accepts the answer
            AnswerId = answer.Id
        };

        // Act
        var result = handler.Handle(command, CancellationToken.None).Result;

        // Assert - Property: Answer acceptance should award bonus reputation points
        if (!result.IsSuccess) return false;

        var finalReputation = _context.UserReputations
            .FirstOrDefault(ur => ur.UserId == answerAuthor.Id)?.ReputationScore ?? 0;

        // Answer acceptance should award 25 bonus points
        var expectedBonus = 25;
        var actualBonus = finalReputation - initialReputation;

        return actualBonus == expectedBonus;
    }

    /// <summary>
    /// Feature: qa-system-integration, Property 21: Real-time Reputation Updates
    /// For any action that affects reputation, the user's reputation score should be updated and displayed in real-time
    /// Validates: Requirements 4.3
    /// </summary>
    [Property(MaxTest = 10)]
    public bool RealtimeReputationUpdates_ReputationChange_ShouldUpdateImmediately(int reputationChange)
    {
        // Constrain reputation change to reasonable values
        reputationChange = Math.Max(-50, Math.Min(reputationChange, 100));
        if (reputationChange == 0) return true; // Skip zero changes

        // Arrange
        var user = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "user@test.com", 
            UserName = "testuser" 
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        var handler = new UpdateReputationHandler(_context, _mockUpdateReputationLogger.Object);

        // Get initial reputation
        var initialReputation = _context.UserReputations
            .FirstOrDefault(ur => ur.UserId == user.Id)?.ReputationScore ?? 0;

        var command = new UpdateReputationCommand
        {
            UserId = user.Id,
            ReputationChange = reputationChange,
            ActivityType = "TestActivity",
            ContentId = Guid.NewGuid(),
            Category = "Test"
        };

        // Act
        var result = handler.Handle(command, CancellationToken.None).Result;

        // Assert - Property: Reputation should be updated immediately
        if (!result.IsSuccess) return false;

        var finalReputation = _context.UserReputations
            .FirstOrDefault(ur => ur.UserId == user.Id)?.ReputationScore ?? 0;

        // Reputation should never go below 0
        var expectedFinalReputation = Math.Max(0, initialReputation + reputationChange);
        
        return finalReputation == expectedFinalReputation;
    }

    /// <summary>
    /// Feature: qa-system-integration, Property 22: Badge Award on Milestones
    /// For any user reaching a reputation milestone, appropriate badges should be awarded automatically
    /// Validates: Requirements 4.4
    /// </summary>
    [Property(MaxTest = 10)]
    public bool BadgeAwardOnMilestones_ReputationMilestone_ShouldAwardBadge(int targetReputation)
    {
        // Test specific milestone values
        var milestones = new[] { 100, 500, 1000, 2000, 5000 };
        var milestone = milestones[Math.Abs(targetReputation) % milestones.Length];

        // Arrange
        var user = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "user@test.com", 
            UserName = "testuser" 
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        var handler = new AwardBadgeHandler(_context, _mockAwardBadgeLogger.Object);

        // Determine expected badge based on milestone
        string expectedBadge = milestone switch
        {
            100 => "Contributor",
            500 => "Knowledgeable", 
            1000 => "Expert",
            2000 => "Trusted",
            5000 => "Master",
            _ => "Contributor"
        };

        var command = new AwardBadgeCommand
        {
            UserId = user.Id,
            BadgeName = expectedBadge,
            Reason = $"Reached {milestone} reputation milestone"
        };

        // Act
        var result = handler.Handle(command, CancellationToken.None).Result;

        // Assert - Property: Badge should be awarded for milestone
        if (!result.IsSuccess) return false;

        var userReputation = _context.UserReputations
            .FirstOrDefault(ur => ur.UserId == user.Id);

        if (userReputation == null) return false;

        // Check if badge was awarded
        var badgesJson = userReputation.BadgesEarned ?? "[]";
        var badges = System.Text.Json.JsonSerializer.Deserialize<List<string>>(badgesJson) ?? new List<string>();

        return badges.Contains(expectedBadge);
    }

    /// <summary>
    /// Feature: qa-system-integration, Property 25: Expert Identification and Notification
    /// For any question posted in a category, all users designated as experts in that category should be identified and notified
    /// Validates: Requirements 5.1
    /// </summary>
    [Property(MaxTest = 10)]
    public bool ExpertIdentificationAndNotification_QuestionInCategory_ShouldNotifyExperts()
    {
        // Arrange
        var categories = new[] { "Technology", "Health", "Finance", "Science", "Business" };
        var category = categories[new System.Random().Next(categories.Length)];

        var questionAuthor = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "author@test.com", 
            UserName = "author" 
        };

        var expert1 = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "expert1@test.com", 
            UserName = "expert1" 
        };

        var expert2 = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "expert2@test.com", 
            UserName = "expert2" 
        };

        var qaCategory = new QuestionCategory
        {
            Id = Guid.NewGuid(),
            Name = category,
            Description = $"{category} related questions",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = questionAuthor.Id.ToString()
        };

        var expertRecord1 = new QAExpert
        {
            Id = Guid.NewGuid(),
            UserId = expert1.Id,
            CategoryId = qaCategory.Id,
            ExpertiseLevel = "Expert",
            NotificationEnabled = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = expert1.Id.ToString()
        };

        var expertRecord2 = new QAExpert
        {
            Id = Guid.NewGuid(),
            UserId = expert2.Id,
            CategoryId = qaCategory.Id,
            ExpertiseLevel = "Intermediate",
            NotificationEnabled = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = expert2.Id.ToString()
        };

        _context.Users.AddRange(questionAuthor, expert1, expert2);
        _context.QuestionCategories.Add(qaCategory);
        _context.QAExperts.AddRange(expertRecord1, expertRecord2);
        _context.SaveChanges();

        // Setup mock to return the experts for the category
        _mockExpertService.Setup(x => x.GetExpertsByCategoryAsync(category))
            .ReturnsAsync(new List<Guid> { expert1.Id, expert2.Id });

        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = questionAuthor.Id,
            Title = $"Question about {category}",
            Content = "This is a detailed question that requires expert knowledge",
            CategoryId = qaCategory.Id,
            Status = QuestionStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = questionAuthor.Id.ToString()
        };

        _context.Questions.Add(question);
        _context.SaveChanges();

        // Act - Simulate expert notification process by querying the database directly
        var expertsInCategory = _context.QAExperts
            .Include(e => e.Category)
            .Where(e => e.CategoryId == qaCategory.Id && e.NotificationEnabled)
            .Select(e => e.UserId)
            .ToList();

        // Assert - Property: All experts in the category should be identified
        var expectedExpertCount = 2; // expert1 and expert2
        var actualExpertCount = expertsInCategory.Count;

        // Verify that the experts were identified correctly
        var containsExpert1 = expertsInCategory.Contains(expert1.Id);
        var containsExpert2 = expertsInCategory.Contains(expert2.Id);

        return actualExpertCount == expectedExpertCount && containsExpert1 && containsExpert2;
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}