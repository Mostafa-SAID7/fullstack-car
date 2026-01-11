using Application.Common.Interfaces;
using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.Handlers;
using Application.Features.Community.QA.Services;
using Domain.Entities.Community.QA;
using Domain.Entities.Identity;
using Domain.Enums.Community.QA;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Infrastructure.UnitTests.QA;

public class QuestionHandlersTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<IQAService> _mockQAService;
    private readonly Mock<IReputationService> _mockReputationService;
    private readonly CreateQuestionHandler _createHandler;
    private readonly UpdateQuestionHandler _updateHandler;
    private readonly DeleteQuestionHandler _deleteHandler;
    private readonly CloseQuestionHandler _closeHandler;
    private readonly AcceptAnswerHandler _acceptHandler;

    public QuestionHandlersTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _mockQAService = new Mock<IQAService>();
        _mockReputationService = new Mock<IReputationService>();

        _createHandler = new CreateQuestionHandler(_context, _mockQAService.Object, _mockReputationService.Object);
        _updateHandler = new UpdateQuestionHandler(_context, _mockQAService.Object);
        _deleteHandler = new DeleteQuestionHandler(_context, _mockReputationService.Object);
        _closeHandler = new CloseQuestionHandler(_context);
        _acceptHandler = new AcceptAnswerHandler(_context, _mockReputationService.Object);

        // Setup default mock behaviors
        _mockQAService.Setup(x => x.ValidateContentQualityAsync(It.IsAny<string>()))
            .ReturnsAsync(true);
        _mockQAService.Setup(x => x.IsQuestionDuplicateAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(false);
        _mockReputationService.Setup(x => x.UpdateUserReputationAsync(
            It.IsAny<Guid>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);
    }

    [Fact]
    public async Task CreateQuestionHandler_WithValidRequest_CreatesQuestion()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new ApplicationUser
        {
            Id = userId,
            UserName = "testuser",
            Email = "test@example.com"
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var command = new CreateQuestionCommand
        {
            UserId = userId,
            Request = new CreateQuestionRequest
            {
                Title = "How to implement CQRS?",
                Content = "I want to learn about implementing CQRS pattern in .NET applications.",
                Category = "Technology",
                Tags = new List<string> { "cqrs", "dotnet", "architecture" }
            }
        };

        // Act
        var result = await _createHandler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(command.Request.Title, result.Data.Title);
        Assert.Equal(command.Request.Content, result.Data.Content);
        Assert.Equal(command.Request.Tags, result.Data.Tags);

        var questionInDb = await _context.Questions.FirstOrDefaultAsync(q => q.Id == result.Data.Id);
        Assert.NotNull(questionInDb);
        Assert.Equal(command.Request.Title, questionInDb.Title);
    }

    [Fact]
    public async Task UpdateQuestionHandler_WithValidRequest_UpdatesQuestion()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new ApplicationUser
        {
            Id = userId,
            UserName = "testuser",
            Email = "test@example.com"
        };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Original Title",
            Content = "Original content",
            Tags = "tag1,tag2",
            CreatedAt = DateTime.UtcNow.AddMinutes(-30), // Within 24 hours
            Status = QuestionStatus.Open,
            AnswersCount = 0
        };

        _context.Users.Add(user);
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        var command = new UpdateQuestionCommand
        {
            QuestionId = question.Id,
            UserId = userId,
            Request = new UpdateQuestionRequest
            {
                Title = "Updated Title",
                Content = "Updated content with more details",
                Category = "Technology",
                Tags = new List<string> { "updated", "tags" }
            }
        };

        // Act
        var result = await _updateHandler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Data);
        Assert.Equal(command.Request.Title, result.Data.Title);
        Assert.Equal(command.Request.Content, result.Data.Content);

        var updatedQuestion = await _context.Questions.FirstOrDefaultAsync(q => q.Id == question.Id);
        Assert.NotNull(updatedQuestion);
        Assert.Equal(command.Request.Title, updatedQuestion.Title);
        Assert.Equal(command.Request.Content, updatedQuestion.Content);
    }

    [Fact]
    public async Task DeleteQuestionHandler_WithValidRequest_SoftDeletesQuestion()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Question to delete",
            Content = "This question will be deleted",
            Status = QuestionStatus.Open,
            HasAcceptedAnswer = false,
            UpvotesCount = 2 // Less than 5, so can be deleted
        };

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        var command = new DeleteQuestionCommand
        {
            QuestionId = question.Id,
            UserId = userId
        };

        // Act
        var result = await _deleteHandler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.True(result.Data);

        var deletedQuestion = await _context.Questions.FirstOrDefaultAsync(q => q.Id == question.Id);
        Assert.NotNull(deletedQuestion);
        Assert.True(deletedQuestion.IsDeleted);
        Assert.NotNull(deletedQuestion.DeletedAt);
    }

    [Fact]
    public async Task CloseQuestionHandler_WithValidRequest_ClosesQuestion()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = "Question to close",
            Content = "This question will be closed",
            Status = QuestionStatus.Open
        };

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        var command = new CloseQuestionCommand
        {
            QuestionId = question.Id,
            UserId = userId,
            Reason = "Duplicate question"
        };

        // Act
        var result = await _closeHandler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.True(result.Data);

        var closedQuestion = await _context.Questions.FirstOrDefaultAsync(q => q.Id == question.Id);
        Assert.NotNull(closedQuestion);
        Assert.Equal(QuestionStatus.Closed, closedQuestion.Status);
    }

    [Fact]
    public async Task AcceptAnswerHandler_WithValidRequest_AcceptsAnswer()
    {
        // Arrange
        var questionUserId = Guid.NewGuid();
        var answerUserId = Guid.NewGuid();
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = questionUserId,
            Title = "Test Question",
            Content = "Test content",
            Status = QuestionStatus.Open,
            HasAcceptedAnswer = false
        };

        var answer = new Answer
        {
            Id = Guid.NewGuid(),
            QuestionId = question.Id,
            UserId = answerUserId,
            Content = "This is a great answer",
            IsAccepted = false
        };

        _context.Questions.Add(question);
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();

        var command = new AcceptAnswerCommand
        {
            AnswerId = answer.Id,
            UserId = questionUserId
        };

        // Act
        var result = await _acceptHandler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.True(result.Data);

        var acceptedAnswer = await _context.Answers.FirstOrDefaultAsync(a => a.Id == answer.Id);
        Assert.NotNull(acceptedAnswer);
        Assert.True(acceptedAnswer.IsAccepted);
        Assert.NotNull(acceptedAnswer.AcceptedAt);

        var updatedQuestion = await _context.Questions.FirstOrDefaultAsync(q => q.Id == question.Id);
        Assert.NotNull(updatedQuestion);
        Assert.True(updatedQuestion.HasAcceptedAnswer);
        Assert.Equal(answer.Id, updatedQuestion.AcceptedAnswerId);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}