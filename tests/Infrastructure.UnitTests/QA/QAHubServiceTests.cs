using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Interfaces;
using Infrastructure.Hubs;
using Infrastructure.Services.QA;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Infrastructure.UnitTests.QA;

public class QAHubServiceTests
{
    private readonly Mock<IHubContext<QAHub, IQAHub>> _mockHubContext;
    private readonly Mock<ILogger<QAHubService>> _mockLogger;
    private readonly Mock<IHubCallerClients<IQAHub>> _mockClients;
    private readonly Mock<IQAHub> _mockQAHub;
    private readonly QAHubService _qaHubService;

    public QAHubServiceTests()
    {
        _mockHubContext = new Mock<IHubContext<QAHub, IQAHub>>();
        _mockLogger = new Mock<ILogger<QAHubService>>();
        _mockClients = new Mock<IHubCallerClients<IQAHub>>();
        _mockQAHub = new Mock<IQAHub>();

        _mockHubContext.Setup(x => x.Clients).Returns(_mockClients.Object);
        
        _qaHubService = new QAHubService(_mockHubContext.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task NotifyNewAnswerAsync_ShouldSendNotificationToQuestionGroup()
    {
        // Arrange
        var answer = new AnswerDto
        {
            Id = Guid.NewGuid(),
            QuestionId = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Content = "Test answer content",
            VoteScore = 0,
            UserName = "Test User",
            CreatedAt = DateTime.UtcNow
        };

        var mockGroupClient = new Mock<IQAHub>();
        var mockUserClient = new Mock<IQAHub>();

        _mockClients.Setup(x => x.Group($"question_{answer.QuestionId}"))
            .Returns(mockGroupClient.Object);
        _mockClients.Setup(x => x.Group($"user_{answer.UserId}"))
            .Returns(mockUserClient.Object);

        // Act
        await _qaHubService.NotifyNewAnswerAsync(answer);

        // Assert
        mockGroupClient.Verify(x => x.ReceiveNewAnswer(answer), Times.Once);
        mockUserClient.Verify(x => x.ReceiveNewAnswer(answer), Times.Once);
    }

    [Fact]
    public async Task NotifyVoteUpdateAsync_ShouldSendNotificationForQuestionVote()
    {
        // Arrange
        var voteUpdate = new VoteUpdateDto
        {
            ContentId = Guid.NewGuid(),
            ContentType = "Question",
            NewVoteScore = 5,
            UpvotesCount = 6,
            DownvotesCount = 1,
            VoterId = Guid.NewGuid(),
            VoteType = "Up",
            Timestamp = DateTime.UtcNow
        };

        var mockGroupClient = new Mock<IQAHub>();
        _mockClients.Setup(x => x.Group($"question_{voteUpdate.ContentId}"))
            .Returns(mockGroupClient.Object);

        // Act
        await _qaHubService.NotifyVoteUpdateAsync(voteUpdate);

        // Assert
        mockGroupClient.Verify(x => x.ReceiveVoteUpdate(voteUpdate), Times.Once);
    }

    [Fact]
    public async Task NotifyAnswerAcceptedAsync_ShouldSendNotificationToRelevantUsers()
    {
        // Arrange
        var answerAccepted = new AnswerAcceptedDto
        {
            AnswerId = Guid.NewGuid(),
            QuestionId = Guid.NewGuid(),
            AcceptedByUserId = Guid.NewGuid(),
            AcceptedByUserName = "Question Author",
            AnswerAuthorId = Guid.NewGuid(),
            AnswerAuthorName = "Answer Author",
            ReputationBonus = 25,
            AcceptedAt = DateTime.UtcNow,
            QuestionTitle = "Test Question"
        };

        var mockQuestionGroupClient = new Mock<IQAHub>();
        var mockUserClient = new Mock<IQAHub>();

        _mockClients.Setup(x => x.Group($"question_{answerAccepted.QuestionId}"))
            .Returns(mockQuestionGroupClient.Object);
        _mockClients.Setup(x => x.Group($"user_{answerAccepted.AnswerAuthorId}"))
            .Returns(mockUserClient.Object);

        // Act
        await _qaHubService.NotifyAnswerAcceptedAsync(answerAccepted);

        // Assert
        mockQuestionGroupClient.Verify(x => x.ReceiveAnswerAccepted(answerAccepted), Times.Once);
        mockUserClient.Verify(x => x.ReceiveAnswerAccepted(answerAccepted), Times.Once);
    }

    [Fact]
    public async Task NotifyReputationUpdateAsync_ShouldSendNotificationToUser()
    {
        // Arrange
        var reputationUpdate = new ReputationUpdateDto
        {
            UserId = Guid.NewGuid(),
            UserName = "Test User",
            OldReputation = 100,
            NewReputation = 125,
            Change = 25,
            Reason = "Answer Accepted",
            RelatedContentId = Guid.NewGuid(),
            RelatedContentType = "Answer",
            Timestamp = DateTime.UtcNow,
            BadgesEarned = new List<string> { "Great Answer" }
        };

        var mockUserClient = new Mock<IQAHub>();
        var mockModeratorsClient = new Mock<IQAHub>();

        _mockClients.Setup(x => x.Group($"user_{reputationUpdate.UserId}"))
            .Returns(mockUserClient.Object);
        _mockClients.Setup(x => x.Group("moderators"))
            .Returns(mockModeratorsClient.Object);

        // Act
        await _qaHubService.NotifyReputationUpdateAsync(reputationUpdate);

        // Assert
        mockUserClient.Verify(x => x.ReceiveReputationUpdate(reputationUpdate), Times.Once);
        mockModeratorsClient.Verify(x => x.ReceiveReputationUpdate(reputationUpdate), Times.Once);
    }

    [Fact]
    public async Task NotifyExpertsAsync_ShouldSendNotificationToExpertsAndSpecificUsers()
    {
        // Arrange
        var expertNotification = new ExpertNotificationDto
        {
            QuestionId = Guid.NewGuid(),
            QuestionTitle = "Test Question for Experts",
            Category = "Web Development",
            Tags = new List<string> { "javascript", "react" },
            QuestionAuthorId = Guid.NewGuid(),
            QuestionAuthorName = "Question Author",
            QuestionAuthorReputation = 150,
            QuestionCreatedAt = DateTime.UtcNow,
            NotifiedExpertIds = new List<Guid> { Guid.NewGuid(), Guid.NewGuid() },
            NotificationReason = "Category Expert"
        };

        var mockExpertsGroupClient = new Mock<IQAHub>();
        var mockExpert1Client = new Mock<IQAHub>();
        var mockExpert2Client = new Mock<IQAHub>();

        _mockClients.Setup(x => x.Group("experts"))
            .Returns(mockExpertsGroupClient.Object);
        _mockClients.Setup(x => x.Group($"user_{expertNotification.NotifiedExpertIds[0]}"))
            .Returns(mockExpert1Client.Object);
        _mockClients.Setup(x => x.Group($"user_{expertNotification.NotifiedExpertIds[1]}"))
            .Returns(mockExpert2Client.Object);

        // Act
        await _qaHubService.NotifyExpertsAsync(expertNotification);

        // Assert
        mockExpertsGroupClient.Verify(x => x.ReceiveExpertNotification(expertNotification), Times.Once);
        mockExpert1Client.Verify(x => x.ReceiveExpertNotification(expertNotification), Times.Once);
        mockExpert2Client.Verify(x => x.ReceiveExpertNotification(expertNotification), Times.Once);
    }

    [Fact]
    public async Task SendConnectionStatusAsync_ShouldBroadcastToAllClients()
    {
        // Arrange
        var connectionStatus = new ConnectionStatusDto
        {
            Status = "Connected",
            Timestamp = DateTime.UtcNow,
            Message = "QA Hub connection established",
            ActiveConnections = 42
        };

        var mockAllClients = new Mock<IQAHub>();
        _mockClients.Setup(x => x.All).Returns(mockAllClients.Object);

        // Act
        await _qaHubService.SendConnectionStatusAsync(connectionStatus);

        // Assert
        mockAllClients.Verify(x => x.ReceiveConnectionStatus(connectionStatus), Times.Once);
    }
}