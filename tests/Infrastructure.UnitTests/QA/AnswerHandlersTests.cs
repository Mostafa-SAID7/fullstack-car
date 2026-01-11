using Application.Common.Interfaces.Data;
using Application.Common.Models;
using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Handlers;
using Application.Features.Community.QA.Services;
using Domain.Entities.Community.QA;
using Domain.Entities.Identity;
using Domain.Enums.Community.QA;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Infrastructure.UnitTests.QA;

public class AnswerHandlersTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<IQAService> _mockQAService;
    private readonly Mock<IReputationService> _mockReputationService;

    public AnswerHandlersTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _mockQAService = new Mock<IQAService>();
        _mockReputationService = new Mock<IReputationService>();

        // Setup default mock behaviors
        _mockQAService.Setup(x => x.ValidateContentQualityAsync(It.IsAny<string>()))
            .ReturnsAsync(true);
        
        _mockReputationService.Setup(x => x.UpdateUserReputationAsync(
            It.IsAny<Guid>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);
    }

    [Fact]
    public async Task CreateAnswerHandler_ValidRequest_ReturnsSuccess()
    {
        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "testuser" };
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Title = "Test Question",
            Content = "This is a test question content",
            Status = QuestionStatus.Open,
            AnswersCount = 0
        };

        _context.Users.Add(user);
        _context.Questions.Add(question);
        _context.UserReputations.Add(new UserReputation { UserId = user.Id, ReputationScore = 100 });
        await _context.SaveChangesAsync();

        var handler = new CreateAnswerHandler(_context, _mockQAService.Object, _mockReputationService.Object);
        var command = new CreateAnswerCommand
        {
            QuestionId = question.Id,
            UserId = user.Id,
            Request = new CreateAnswerRequest
            {
                Content = "This is a comprehensive answer to the question with sufficient detail."
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(command.Request.Content, result.Data.Content);
        Assert.Equal(user.Id, result.Data.UserId);
        Assert.Equal(question.Id, result.Data.QuestionId);

        // Verify answer was created in database
        var createdAnswer = await _context.Answers.FirstOrDefaultAsync(a => a.QuestionId == question.Id);
        Assert.NotNull(createdAnswer);
        Assert.Equal(command.Request.Content, createdAnswer.Content);

        // Verify question answer count was updated
        var updatedQuestion = await _context.Questions.FindAsync(question.Id);
        Assert.Equal(1, updatedQuestion!.AnswersCount);

        // Verify reputation service was called
        _mockReputationService.Verify(x => x.UpdateUserReputationAsync(
            user.Id, 5, "AnswerGiven", It.IsAny<Guid>(), "General"), Times.Once);
    }

    [Fact]
    public async Task CreateAnswerHandler_QuestionNotFound_ReturnsFailure()
    {
        // Arrange
        var handler = new CreateAnswerHandler(_context, _mockQAService.Object, _mockReputationService.Object);
        var command = new CreateAnswerCommand
        {
            QuestionId = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Request = new CreateAnswerRequest
            {
                Content = "This is a comprehensive answer to the question with sufficient detail."
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Question not found", result.ErrorMessage);
    }

    [Fact]
    public async Task CreateAnswerHandler_ClosedQuestion_ReturnsFailure()
    {
        // Arrange
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Title = "Test Question",
            Content = "This is a test question content",
            Status = QuestionStatus.Closed
        };

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        var handler = new CreateAnswerHandler(_context, _mockQAService.Object, _mockReputationService.Object);
        var command = new CreateAnswerCommand
        {
            QuestionId = question.Id,
            UserId = Guid.NewGuid(),
            Request = new CreateAnswerRequest
            {
                Content = "This is a comprehensive answer to the question with sufficient detail."
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Cannot answer a closed question", result.ErrorMessage);
    }

    [Fact]
    public async Task CreateAnswerHandler_DuplicateAnswer_ReturnsFailure()
    {
        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "testuser" };
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Title = "Test Question",
            Content = "This is a test question content",
            Status = QuestionStatus.Open
        };

        var existingAnswer = new Answer
        {
            Id = Guid.NewGuid(),
            QuestionId = question.Id,
            UserId = user.Id,
            Content = "Existing answer"
        };

        _context.Users.Add(user);
        _context.Questions.Add(question);
        _context.Answers.Add(existingAnswer);
        await _context.SaveChangesAsync();

        var handler = new CreateAnswerHandler(_context, _mockQAService.Object, _mockReputationService.Object);
        var command = new CreateAnswerCommand
        {
            QuestionId = question.Id,
            UserId = user.Id,
            Request = new CreateAnswerRequest
            {
                Content = "This is a comprehensive answer to the question with sufficient detail."
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("You have already answered this question. Please edit your existing answer instead.", result.ErrorMessage);
    }

    [Fact]
    public async Task UpdateAnswerHandler_ValidRequest_ReturnsSuccess()
    {
        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "testuser" };
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Title = "Test Question",
            Content = "This is a test question content",
            Status = QuestionStatus.Open
        };

        var answer = new Answer
        {
            Id = Guid.NewGuid(),
            QuestionId = question.Id,
            UserId = user.Id,
            Content = "Original answer content",
            CreatedAt = DateTime.UtcNow.AddMinutes(-30) // Within 24 hours
        };

        _context.Users.Add(user);
        _context.Questions.Add(question);
        _context.Answers.Add(answer);
        _context.UserReputations.Add(new UserReputation { UserId = user.Id, ReputationScore = 100 });
        await _context.SaveChangesAsync();

        var handler = new UpdateAnswerHandler(_context, _mockQAService.Object);
        var command = new UpdateAnswerCommand
        {
            AnswerId = answer.Id,
            UserId = user.Id,
            Request = new UpdateAnswerRequest
            {
                Content = "Updated answer content with more comprehensive information."
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(command.Request.Content, result.Data.Content);
        Assert.True(result.Data.IsEdited);

        // Verify answer was updated in database
        var updatedAnswer = await _context.Answers.FindAsync(answer.Id);
        Assert.Equal(command.Request.Content, updatedAnswer!.Content);

        // Verify history was created
        var history = await _context.AnswerHistories.FirstOrDefaultAsync(h => h.AnswerId == answer.Id);
        Assert.NotNull(history);
        Assert.Equal("Original answer content", history.Content);
        Assert.Equal(1, history.Version);
    }

    [Fact]
    public async Task UpdateAnswerHandler_NotOwner_ReturnsFailure()
    {
        // Arrange
        var owner = new ApplicationUser { Id = Guid.NewGuid(), UserName = "owner" };
        var otherUser = new ApplicationUser { Id = Guid.NewGuid(), UserName = "otheruser" };
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Title = "Test Question",
            Content = "This is a test question content",
            Status = QuestionStatus.Open
        };

        var answer = new Answer
        {
            Id = Guid.NewGuid(),
            QuestionId = question.Id,
            UserId = owner.Id,
            Content = "Original answer content"
        };

        _context.Users.AddRange(owner, otherUser);
        _context.Questions.Add(question);
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();

        var handler = new UpdateAnswerHandler(_context, _mockQAService.Object);
        var command = new UpdateAnswerCommand
        {
            AnswerId = answer.Id,
            UserId = otherUser.Id,
            Request = new UpdateAnswerRequest
            {
                Content = "Updated answer content with more comprehensive information."
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("You can only edit your own answers", result.ErrorMessage);
    }

    [Fact]
    public async Task DeleteAnswerHandler_ValidRequest_ReturnsSuccess()
    {
        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "testuser" };
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Title = "Test Question",
            Content = "This is a test question content",
            AnswersCount = 1
        };

        var answer = new Answer
        {
            Id = Guid.NewGuid(),
            QuestionId = question.Id,
            UserId = user.Id,
            Content = "Answer to be deleted",
            IsAccepted = false,
            UpvotesCount = 2 // Low vote count, should allow deletion
        };

        _context.Users.Add(user);
        _context.Questions.Add(question);
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();

        var handler = new DeleteAnswerHandler(_context, _mockReputationService.Object);
        var command = new DeleteAnswerCommand
        {
            AnswerId = answer.Id,
            UserId = user.Id
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);

        // Verify answer was soft deleted
        var deletedAnswer = await _context.Answers.FindAsync(answer.Id);
        Assert.True(deletedAnswer!.IsDeleted);
        Assert.NotNull(deletedAnswer.DeletedAt);

        // Verify question answer count was decremented
        var updatedQuestion = await _context.Questions.FindAsync(question.Id);
        Assert.Equal(0, updatedQuestion!.AnswersCount);

        // Verify reputation penalty was applied
        _mockReputationService.Verify(x => x.UpdateUserReputationAsync(
            user.Id, -5, "AnswerDeleted", answer.Id, "General"), Times.Once);
    }

    [Fact]
    public async Task DeleteAnswerHandler_AcceptedAnswer_ReturnsFailure()
    {
        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "testuser" };
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Title = "Test Question",
            Content = "This is a test question content"
        };

        var answer = new Answer
        {
            Id = Guid.NewGuid(),
            QuestionId = question.Id,
            UserId = user.Id,
            Content = "Accepted answer",
            IsAccepted = true
        };

        _context.Users.Add(user);
        _context.Questions.Add(question);
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();

        var handler = new DeleteAnswerHandler(_context, _mockReputationService.Object);
        var command = new DeleteAnswerCommand
        {
            AnswerId = answer.Id,
            UserId = user.Id
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Cannot delete an accepted answer", result.ErrorMessage);
    }

    [Fact]
    public async Task DeleteAnswerHandler_HighVoteCount_ReturnsFailure()
    {
        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "testuser" };
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Title = "Test Question",
            Content = "This is a test question content"
        };

        var answer = new Answer
        {
            Id = Guid.NewGuid(),
            QuestionId = question.Id,
            UserId = user.Id,
            Content = "Highly voted answer",
            IsAccepted = false,
            UpvotesCount = 5 // High vote count, should prevent deletion
        };

        _context.Users.Add(user);
        _context.Questions.Add(question);
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();

        var handler = new DeleteAnswerHandler(_context, _mockReputationService.Object);
        var command = new DeleteAnswerCommand
        {
            AnswerId = answer.Id,
            UserId = user.Id
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Cannot delete answers with high vote counts", result.ErrorMessage);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}