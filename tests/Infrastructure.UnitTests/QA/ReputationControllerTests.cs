using Application.Common.Interfaces;
using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Handlers;
using Application.Features.Community.QA.Queries;
using Domain.Entities.Community.QA;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Infrastructure.UnitTests.QA;

/// <summary>
/// Integration tests for Reputation system functionality
/// Feature: qa-system-integration, Task 3.1
/// </summary>
public class ReputationControllerTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<ILogger<GetUserReputationHandler>> _mockLogger;

    public ReputationControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _mockLogger = new Mock<ILogger<GetUserReputationHandler>>();
    }

    /// <summary>
    /// Test that GetUserReputationHandler returns default reputation for new user
    /// Validates: Requirements 4.1, 4.2
    /// </summary>
    [Fact]
    public async Task GetUserReputation_NewUser_ReturnsDefaultReputation()
    {
        // Arrange
        var user = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "test@test.com", 
            UserName = "test@test.com" 
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new GetUserReputationHandler(_context, _mockLogger.Object);
        var query = new GetUserReputationQuery { UserId = user.Id };

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(user.Id, result.Data.UserId);
        Assert.Equal(0, result.Data.ReputationScore);
        Assert.Equal(1, result.Data.Rank); // Should be rank 1 with 0 reputation
        Assert.Empty(result.Data.BadgesEarned);
        Assert.Empty(result.Data.ExpertiseAreas);
    }

    /// <summary>
    /// Test that UpdateExpertiseAreasHandler creates and updates expertise areas
    /// Validates: Requirements 4.5, 5.1
    /// </summary>
    [Fact]
    public async Task UpdateExpertiseAreas_ValidRequest_UpdatesSuccessfully()
    {
        // Arrange
        var user = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "test@test.com", 
            UserName = "test@test.com" 
        };
        _context.Users.Add(user);

        // Add some categories
        var categories = new[]
        {
            new QACategory { Id = Guid.NewGuid(), Name = "Technology", Description = "Tech questions" },
            new QACategory { Id = Guid.NewGuid(), Name = "Health", Description = "Health questions" }
        };
        _context.QACategories.AddRange(categories);
        await _context.SaveChangesAsync();

        var mockLogger = new Mock<ILogger<UpdateExpertiseAreasHandler>>();
        var handler = new UpdateExpertiseAreasHandler(_context, mockLogger.Object);
        var command = new UpdateExpertiseAreasCommand
        {
            UserId = user.Id,
            ExpertiseAreas = new List<string> { "Technology", "Health" }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(user.Id, result.Data.UserId);
        Assert.Contains("Technology", result.Data.ExpertiseAreas);
        Assert.Contains("Health", result.Data.ExpertiseAreas);

        // Verify expert records were created
        var expertRecords = await _context.QAExperts
            .Where(e => e.UserId == user.Id)
            .ToListAsync();
        Assert.Equal(2, expertRecords.Count);
    }

    /// <summary>
    /// Test that AwardBadgeHandler awards badges correctly
    /// Validates: Requirements 4.4
    /// </summary>
    [Fact]
    public async Task AwardBadge_ValidRequest_AwardsBadgeSuccessfully()
    {
        // Arrange
        var user = new ApplicationUser 
        { 
            Id = Guid.NewGuid(), 
            Email = "test@test.com", 
            UserName = "test@test.com" 
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var mockLogger = new Mock<ILogger<AwardBadgeHandler>>();
        var handler = new AwardBadgeHandler(_context, mockLogger.Object);
        var command = new AwardBadgeCommand
        {
            UserId = user.Id,
            BadgeName = "First Answer",
            Reason = "Provided first answer"
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(user.Id, result.Data.UserId);
        Assert.Contains("First Answer", result.Data.BadgesEarned);

        // Verify activity was logged
        var activity = await _context.QAUserActivities
            .FirstOrDefaultAsync(a => a.UserId == user.Id && a.ActivityType == "BadgeEarned");
        Assert.NotNull(activity);
    }

    /// <summary>
    /// Test that GetReputationLeaderboardHandler returns ranked users
    /// Validates: Requirements 4.2, 4.3
    /// </summary>
    [Fact]
    public async Task GetReputationLeaderboard_MultipleUsers_ReturnsRankedList()
    {
        // Arrange
        var users = new[]
        {
            new ApplicationUser { Id = Guid.NewGuid(), Email = "user1@test.com", UserName = "user1" },
            new ApplicationUser { Id = Guid.NewGuid(), Email = "user2@test.com", UserName = "user2" },
            new ApplicationUser { Id = Guid.NewGuid(), Email = "user3@test.com", UserName = "user3" }
        };
        _context.Users.AddRange(users);

        var reputations = new[]
        {
            new UserReputation { Id = Guid.NewGuid(), UserId = users[0].Id, ReputationScore = 100 },
            new UserReputation { Id = Guid.NewGuid(), UserId = users[1].Id, ReputationScore = 200 },
            new UserReputation { Id = Guid.NewGuid(), UserId = users[2].Id, ReputationScore = 50 }
        };
        _context.UserReputations.AddRange(reputations);
        await _context.SaveChangesAsync();

        var mockLogger = new Mock<ILogger<GetReputationLeaderboardHandler>>();
        var handler = new GetReputationLeaderboardHandler(_context, mockLogger.Object);
        var query = new GetReputationLeaderboardQuery { Count = 10 };

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(3, result.Data.Count);
        
        // Verify ranking order (highest reputation first)
        Assert.Equal(200, result.Data[0].ReputationScore);
        Assert.Equal(1, result.Data[0].Rank);
        Assert.Equal(100, result.Data[1].ReputationScore);
        Assert.Equal(2, result.Data[1].Rank);
        Assert.Equal(50, result.Data[2].ReputationScore);
        Assert.Equal(3, result.Data[2].Rank);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}