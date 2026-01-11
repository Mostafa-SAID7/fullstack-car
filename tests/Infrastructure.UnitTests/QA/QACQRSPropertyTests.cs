using Application.Common.Interfaces;
using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.Handlers;
using Application.Features.Community.QA.Services;
using Domain.Entities.Community.QA;
using Domain.Entities.Identity;
using Domain.Enums.Community.QA;
using FsCheck;
using FsCheck.Xunit;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Infrastructure.UnitTests.QA;

/// <summary>
/// Property-based tests for QA System CQRS handlers
/// Feature: qa-system-integration
/// </summary>
public class QACQRSPropertyTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<IQAService> _mockQAService;
    private readonly Mock<IReputationService> _mockReputationService;
    private readonly Mock<ILogger<CreateQuestionHandler>> _mockQuestionLogger;
    private readonly Mock<ILogger<CreateVoteHandler>> _mockVoteLogger;

    public QACQRSPropertyTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _mockQAService = new Mock<IQAService>();
        _mockReputationService = new Mock<IReputationService>();
        _mockQuestionLogger = new Mock<ILogger<CreateQuestionHandler>>();
        _mockVoteLogger = new Mock<ILogger<CreateVoteHandler>>();

        // Setup default mock behaviors
        _mockQAService.Setup(x => x.ValidateContentQualityAsync(It.IsAny<string>()))
            .ReturnsAsync(true);
        _mockQAService.Setup(x => x.IsQuestionDuplicateAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(false);
        _mockReputationService.Setup(x => x.HasSufficientReputationAsync(It.IsAny<Guid>(), It.IsAny<string>()))
            .ReturnsAsync(true);
        _mockReputationService.Setup(x => x.CalculateReputationChangeAsync(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(10);
        _mockReputationService.Setup(x => x.UpdateUserReputationAsync(It.IsAny<Guid>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);
    }

    /// <summary>
    /// Feature: qa-system-integration, Property 1: Question Creation Validation
    /// For any question creation request, if required fields (title, content, category) are missing, 
    /// the system should reject the request with appropriate validation errors
    /// Validates: Requirements 1.1
    /// </summary>
    [Property(MaxTest = 25)]
    public bool QuestionCreationValidation_RequiredFieldsMissing_ShouldReject(string content)
    {
        // Skip valid content for this property test - we only want to test invalid cases
        if (!string.IsNullOrWhiteSpace(content) && content.Length >= 20)
            return true;

        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), Email = "test@test.com", UserName = "test@test.com" };
        _context.Users.Add(user);
        _context.SaveChanges();

        // Setup mock to validate content quality - reject empty/short content
        _mockQAService.Setup(x => x.ValidateContentQualityAsync(It.IsAny<string>()))
            .ReturnsAsync((string c) => !string.IsNullOrWhiteSpace(c) && c.Length >= 20);

        var handler = new CreateQuestionHandler(_context, _mockQAService.Object, _mockReputationService.Object);
        var command = new CreateQuestionCommand
        {
            UserId = user.Id,
            Request = new CreateQuestionRequest
            {
                Title = "Valid Test Title", // Always provide valid title to test content validation
                Content = content,
                Tags = new List<string>()
            }
        };

        // Act
        var result = handler.Handle(command, CancellationToken.None).Result;
        
        // Property: Invalid content should be rejected by the QA service validation
        var hasValidContent = !string.IsNullOrWhiteSpace(content) && content.Length >= 20;
        
        if (!hasValidContent)
        {
            // Should be rejected due to content quality validation
            return !result.IsSuccess && result.ErrorMessage != null && 
                   result.ErrorMessage.Contains("quality standards");
        }
        
        // Valid input should succeed
        return result.IsSuccess;
    }

    /// <summary>
    /// Feature: qa-system-integration, Property 2: Content Length and Quality Validation
    /// For any question submission, the system should validate content length and appropriateness 
    /// according to defined rules and reject invalid content
    /// Validates: Requirements 1.2
    /// </summary>
    [Property(MaxTest = 25)]
    public bool ContentLengthAndQualityValidation_InvalidContent_ShouldReject(string title, string content)
    {
        // Skip null/empty titles for this test
        if (string.IsNullOrWhiteSpace(title))
            return true;

        // Only test invalid content scenarios
        var isInvalidContent = string.IsNullOrWhiteSpace(content) || 
                              content.Length < 20 || 
                              content.Length > 10000 || 
                              content.Contains("spam");

        if (!isInvalidContent)
            return true;

        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), Email = "test@test.com", UserName = "test@test.com" };
        _context.Users.Add(user);
        _context.SaveChanges();

        // Setup mock to reject low quality content
        _mockQAService.Setup(x => x.ValidateContentQualityAsync(content))
            .ReturnsAsync(!string.IsNullOrWhiteSpace(content) && 
                         content.Length >= 20 && 
                         content.Length <= 10000 && 
                         !content.Contains("spam"));

        var handler = new CreateQuestionHandler(_context, _mockQAService.Object, _mockReputationService.Object);
        var command = new CreateQuestionCommand
        {
            UserId = user.Id,
            Request = new CreateQuestionRequest
            {
                Title = title,
                Content = content,
                Tags = new List<string>()
            }
        };

        // Act
        var result = handler.Handle(command, CancellationToken.None).Result;
        
        // Property: Invalid content should be rejected
        return !result.IsSuccess;
    }

    /// <summary>
    /// Feature: qa-system-integration, Property 13: Vote Count Updates
    /// For any vote cast on content, the vote count should be updated immediately and reflected in real-time
    /// Validates: Requirements 3.1
    /// </summary>
    [Property(MaxTest = 25)]
    public bool VoteCountUpdates_VoteCast_ShouldUpdateImmediately(bool isUpvote, bool isQuestion)
    {
        // Arrange
        var user1 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user1@test.com", UserName = "user1@test.com" };
        var user2 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user2@test.com", UserName = "user2@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user1.Id,
            Title = "Test Question",
            Content = "Test Content for question validation",
            Status = QuestionStatus.Open,
            UpvotesCount = 0,
            DownvotesCount = 0,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user1.Id.ToString()
        };

        _context.Users.AddRange(user1, user2);
        _context.Questions.Add(question);

        Guid contentId = question.Id;
        string contentType = "Question";
        int initialUpvotes = 0;
        int initialDownvotes = 0;

        if (!isQuestion)
        {
            var answer = new Answer
            {
                Id = Guid.NewGuid(),
                QuestionId = question.Id,
                UserId = user1.Id,
                Content = "Test Answer for validation",
                UpvotesCount = 0,
                DownvotesCount = 0,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = user1.Id.ToString()
            };
            _context.Answers.Add(answer);
            contentId = answer.Id;
            contentType = "Answer";
        }

        _context.SaveChanges();

        var handler = new CreateVoteHandler(_context, _mockReputationService.Object, _mockVoteLogger.Object);
        var command = new CreateVoteCommand
        {
            UserId = user2.Id,
            Request = new CreateVoteRequest
            {
                ContentId = contentId,
                ContentType = contentType,
                VoteType = isUpvote ? "Up" : "Down"
            }
        };

        // Act
        var result = handler.Handle(command, CancellationToken.None).Result;

        // Assert - Property: Vote counts should be updated immediately
        if (!result.IsSuccess) return false;

        if (isQuestion)
        {
            var updatedQuestion = _context.Questions.Find(contentId);
            var expectedUpvotes = isUpvote ? initialUpvotes + 1 : initialUpvotes;
            var expectedDownvotes = !isUpvote ? initialDownvotes + 1 : initialDownvotes;
            
            return updatedQuestion!.UpvotesCount == expectedUpvotes && 
                   updatedQuestion.DownvotesCount == expectedDownvotes;
        }
        else
        {
            var updatedAnswer = _context.Answers.Find(contentId);
            var expectedUpvotes = isUpvote ? initialUpvotes + 1 : initialUpvotes;
            var expectedDownvotes = !isUpvote ? initialDownvotes + 1 : initialDownvotes;
            
            return updatedAnswer!.UpvotesCount == expectedUpvotes && 
                   updatedAnswer.DownvotesCount == expectedDownvotes;
        }
    }

    /// <summary>
    /// Feature: qa-system-integration, Property 14: Self-Vote Prevention
    /// For any user attempting to vote on their own content, the system should reject the vote
    /// Validates: Requirements 3.2
    /// </summary>
    [Property(MaxTest = 25)]
    public bool SelfVotePrevention_UserVotesOnOwnContent_ShouldReject(bool isUpvote, bool isQuestion)
    {
        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), Email = "user@test.com", UserName = "user@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user.Id, // Same user owns the content
            Title = "Test Question",
            Content = "Test Content for question validation",
            Status = QuestionStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user.Id.ToString()
        };

        _context.Users.Add(user);
        _context.Questions.Add(question);

        Guid contentId = question.Id;
        string contentType = "Question";

        if (!isQuestion)
        {
            var answer = new Answer
            {
                Id = Guid.NewGuid(),
                QuestionId = question.Id,
                UserId = user.Id, // Same user owns the answer
                Content = "Test Answer for validation",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = user.Id.ToString()
            };
            _context.Answers.Add(answer);
            contentId = answer.Id;
            contentType = "Answer";
        }

        _context.SaveChanges();

        var handler = new CreateVoteHandler(_context, _mockReputationService.Object, _mockVoteLogger.Object);
        var command = new CreateVoteCommand
        {
            UserId = user.Id, // Same user trying to vote on their own content
            Request = new CreateVoteRequest
            {
                ContentId = contentId,
                ContentType = contentType,
                VoteType = isUpvote ? "Up" : "Down"
            }
        };

        // Act
        var result = handler.Handle(command, CancellationToken.None).Result;

        // Assert - Property: Self-votes should always be rejected
        return !result.IsSuccess && 
               result.ErrorMessage != null &&
               result.ErrorMessage.Contains("Users cannot vote on their own content");
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}