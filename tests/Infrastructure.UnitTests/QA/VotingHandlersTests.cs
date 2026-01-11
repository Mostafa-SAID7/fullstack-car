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

public class VotingHandlersTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<IReputationService> _mockReputationService;
    private readonly Mock<ILogger<CreateVoteHandler>> _mockCreateLogger;
    private readonly Mock<ILogger<RemoveVoteHandler>> _mockRemoveLogger;
    private readonly Mock<ILogger<ChangeVoteHandler>> _mockChangeLogger;

    public VotingHandlersTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _mockReputationService = new Mock<IReputationService>();
        _mockCreateLogger = new Mock<ILogger<CreateVoteHandler>>();
        _mockRemoveLogger = new Mock<ILogger<RemoveVoteHandler>>();
        _mockChangeLogger = new Mock<ILogger<ChangeVoteHandler>>();

        // Setup default reputation service behavior
        _mockReputationService.Setup(x => x.HasSufficientReputationAsync(It.IsAny<Guid>(), It.IsAny<string>()))
            .ReturnsAsync(true);
        _mockReputationService.Setup(x => x.CalculateReputationChangeAsync(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<Guid>()))
            .ReturnsAsync(10);
        _mockReputationService.Setup(x => x.UpdateUserReputationAsync(It.IsAny<Guid>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);
    }

    [Fact]
    public async Task CreateVoteHandler_ValidUpvoteOnQuestion_ReturnsSuccess()
    {
        // Arrange
        var user1 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user1@test.com", UserName = "user1@test.com" };
        var user2 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user2@test.com", UserName = "user2@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user1.Id,
            Title = "Test Question",
            Content = "Test Content",
            Status = QuestionStatus.Open,
            UpvotesCount = 0,
            DownvotesCount = 0,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user1.Id.ToString()
        };

        _context.Users.AddRange(user1, user2);
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        var handler = new CreateVoteHandler(_context, _mockReputationService.Object, _mockCreateLogger.Object);
        var command = new CreateVoteCommand
        {
            UserId = user2.Id,
            Request = new CreateVoteRequest
            {
                ContentId = question.Id,
                ContentType = "Question",
                VoteType = "Up"
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.True(result.Data);

        var vote = await _context.QAVotes.FirstOrDefaultAsync(v => v.UserId == user2.Id && v.ContentId == question.Id);
        Assert.NotNull(vote);
        Assert.Equal(VoteType.Upvote, vote.VoteType);
        Assert.Equal("Question", vote.ContentType);

        var updatedQuestion = await _context.Questions.FindAsync(question.Id);
        Assert.Equal(1, updatedQuestion!.UpvotesCount);
        Assert.Equal(0, updatedQuestion.DownvotesCount);
    }

    [Fact]
    public async Task CreateVoteHandler_ValidDownvoteOnAnswer_ReturnsSuccess()
    {
        // Arrange
        var user1 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user1@test.com", UserName = "user1@test.com" };
        var user2 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user2@test.com", UserName = "user2@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user1.Id,
            Title = "Test Question",
            Content = "Test Content",
            Status = QuestionStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user1.Id.ToString()
        };

        var answer = new Answer
        {
            Id = Guid.NewGuid(),
            QuestionId = question.Id,
            UserId = user1.Id,
            Content = "Test Answer",
            UpvotesCount = 0,
            DownvotesCount = 0,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user1.Id.ToString()
        };

        _context.Users.AddRange(user1, user2);
        _context.Questions.Add(question);
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();

        var handler = new CreateVoteHandler(_context, _mockReputationService.Object, _mockCreateLogger.Object);
        var command = new CreateVoteCommand
        {
            UserId = user2.Id,
            Request = new CreateVoteRequest
            {
                ContentId = answer.Id,
                ContentType = "Answer",
                VoteType = "Down"
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.True(result.Data);

        var vote = await _context.QAVotes.FirstOrDefaultAsync(v => v.UserId == user2.Id && v.ContentId == answer.Id);
        Assert.NotNull(vote);
        Assert.Equal(VoteType.Downvote, vote.VoteType);
        Assert.Equal("Answer", vote.ContentType);

        var updatedAnswer = await _context.Answers.FindAsync(answer.Id);
        Assert.Equal(0, updatedAnswer!.UpvotesCount);
        Assert.Equal(1, updatedAnswer.DownvotesCount);
    }

    [Fact]
    public async Task CreateVoteHandler_SelfVote_ReturnsFailure()
    {
        // Arrange
        var user = new ApplicationUser { Id = Guid.NewGuid(), Email = "user@test.com", UserName = "user@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Title = "Test Question",
            Content = "Test Content",
            Status = QuestionStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user.Id.ToString()
        };

        _context.Users.Add(user);
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        var handler = new CreateVoteHandler(_context, _mockReputationService.Object, _mockCreateLogger.Object);
        var command = new CreateVoteCommand
        {
            UserId = user.Id,
            Request = new CreateVoteRequest
            {
                ContentId = question.Id,
                ContentType = "Question",
                VoteType = "Up"
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Users cannot vote on their own content.", result.ErrorMessage);

        var voteCount = await _context.QAVotes.CountAsync();
        Assert.Equal(0, voteCount);
    }

    [Fact]
    public async Task CreateVoteHandler_DuplicateVote_ReturnsFailure()
    {
        // Arrange
        var user1 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user1@test.com", UserName = "user1@test.com" };
        var user2 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user2@test.com", UserName = "user2@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user1.Id,
            Title = "Test Question",
            Content = "Test Content",
            Status = QuestionStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user1.Id.ToString()
        };

        var existingVote = new QAVote
        {
            Id = Guid.NewGuid(),
            UserId = user2.Id,
            ContentId = question.Id,
            ContentType = "Question",
            VoteType = VoteType.Upvote,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user2.Id.ToString()
        };

        _context.Users.AddRange(user1, user2);
        _context.Questions.Add(question);
        _context.QAVotes.Add(existingVote);
        await _context.SaveChangesAsync();

        var handler = new CreateVoteHandler(_context, _mockReputationService.Object, _mockCreateLogger.Object);
        var command = new CreateVoteCommand
        {
            UserId = user2.Id,
            Request = new CreateVoteRequest
            {
                ContentId = question.Id,
                ContentType = "Question",
                VoteType = "Down"
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("User has already voted on this content. Use change vote instead.", result.ErrorMessage);

        var voteCount = await _context.QAVotes.CountAsync();
        Assert.Equal(1, voteCount); // Only the original vote should exist
    }

    [Fact]
    public async Task CreateVoteHandler_InsufficientReputationForDownvote_ReturnsFailure()
    {
        // Arrange
        var user1 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user1@test.com", UserName = "user1@test.com" };
        var user2 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user2@test.com", UserName = "user2@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user1.Id,
            Title = "Test Question",
            Content = "Test Content",
            Status = QuestionStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user1.Id.ToString()
        };

        _context.Users.AddRange(user1, user2);
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        // Setup reputation service to return false for downvote permission
        _mockReputationService.Setup(x => x.HasSufficientReputationAsync(user2.Id, "Downvote"))
            .ReturnsAsync(false);

        var handler = new CreateVoteHandler(_context, _mockReputationService.Object, _mockCreateLogger.Object);
        var command = new CreateVoteCommand
        {
            UserId = user2.Id,
            Request = new CreateVoteRequest
            {
                ContentId = question.Id,
                ContentType = "Question",
                VoteType = "Down"
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Insufficient reputation to downvote. Minimum reputation required.", result.ErrorMessage);

        var voteCount = await _context.QAVotes.CountAsync();
        Assert.Equal(0, voteCount);
    }

    [Fact]
    public async Task RemoveVoteHandler_ValidRemoval_ReturnsSuccess()
    {
        // Arrange
        var user1 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user1@test.com", UserName = "user1@test.com" };
        var user2 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user2@test.com", UserName = "user2@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user1.Id,
            Title = "Test Question",
            Content = "Test Content",
            Status = QuestionStatus.Open,
            UpvotesCount = 1,
            DownvotesCount = 0,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user1.Id.ToString()
        };

        var vote = new QAVote
        {
            Id = Guid.NewGuid(),
            UserId = user2.Id,
            ContentId = question.Id,
            ContentType = "Question",
            VoteType = VoteType.Upvote,
            CreatedAt = DateTime.UtcNow, // Recent vote, within 5 minutes
            CreatedBy = user2.Id.ToString()
        };

        _context.Users.AddRange(user1, user2);
        _context.Questions.Add(question);
        _context.QAVotes.Add(vote);
        await _context.SaveChangesAsync();

        var handler = new RemoveVoteHandler(_context, _mockReputationService.Object, _mockRemoveLogger.Object);
        var command = new RemoveVoteCommand
        {
            UserId = user2.Id,
            ContentId = question.Id,
            ContentType = "Question"
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.True(result.Data);

        var voteExists = await _context.QAVotes.AnyAsync(v => v.Id == vote.Id);
        Assert.False(voteExists);

        var updatedQuestion = await _context.Questions.FindAsync(question.Id);
        Assert.Equal(0, updatedQuestion!.UpvotesCount);
    }

    [Fact]
    public async Task RemoveVoteHandler_OldVote_ReturnsFailure()
    {
        // Arrange
        var user1 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user1@test.com", UserName = "user1@test.com" };
        var user2 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user2@test.com", UserName = "user2@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user1.Id,
            Title = "Test Question",
            Content = "Test Content",
            Status = QuestionStatus.Open,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user1.Id.ToString()
        };

        var vote = new QAVote
        {
            Id = Guid.NewGuid(),
            UserId = user2.Id,
            ContentId = question.Id,
            ContentType = "Question",
            VoteType = VoteType.Upvote,
            CreatedAt = DateTime.UtcNow.AddMinutes(-10), // Old vote, more than 5 minutes
            CreatedBy = user2.Id.ToString()
        };

        _context.Users.AddRange(user1, user2);
        _context.Questions.Add(question);
        _context.QAVotes.Add(vote);
        await _context.SaveChangesAsync();

        var handler = new RemoveVoteHandler(_context, _mockReputationService.Object, _mockRemoveLogger.Object);
        var command = new RemoveVoteCommand
        {
            UserId = user2.Id,
            ContentId = question.Id,
            ContentType = "Question"
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Votes can only be removed within 5 minutes of casting.", result.ErrorMessage);

        var voteExists = await _context.QAVotes.AnyAsync(v => v.Id == vote.Id);
        Assert.True(voteExists); // Vote should still exist
    }

    [Fact]
    public async Task ChangeVoteHandler_ValidChange_ReturnsSuccess()
    {
        // Arrange
        var user1 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user1@test.com", UserName = "user1@test.com" };
        var user2 = new ApplicationUser { Id = Guid.NewGuid(), Email = "user2@test.com", UserName = "user2@test.com" };
        
        var question = new Question
        {
            Id = Guid.NewGuid(),
            UserId = user1.Id,
            Title = "Test Question",
            Content = "Test Content",
            Status = QuestionStatus.Open,
            UpvotesCount = 1,
            DownvotesCount = 0,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = user1.Id.ToString()
        };

        var vote = new QAVote
        {
            Id = Guid.NewGuid(),
            UserId = user2.Id,
            ContentId = question.Id,
            ContentType = "Question",
            VoteType = VoteType.Upvote,
            CreatedAt = DateTime.UtcNow, // Recent vote, within 5 minutes
            CreatedBy = user2.Id.ToString()
        };

        _context.Users.AddRange(user1, user2);
        _context.Questions.Add(question);
        _context.QAVotes.Add(vote);
        await _context.SaveChangesAsync();

        var handler = new ChangeVoteHandler(_context, _mockReputationService.Object, _mockChangeLogger.Object);
        var command = new ChangeVoteCommand
        {
            UserId = user2.Id,
            Request = new ChangeVoteRequest
            {
                ContentId = question.Id,
                ContentType = "Question",
                NewVoteType = "Down"
            }
        };

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.True(result.Data);

        var updatedVote = await _context.QAVotes.FindAsync(vote.Id);
        Assert.Equal(VoteType.Downvote, updatedVote!.VoteType);

        var updatedQuestion = await _context.Questions.FindAsync(question.Id);
        Assert.Equal(0, updatedQuestion!.UpvotesCount);
        Assert.Equal(1, updatedQuestion.DownvotesCount);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}