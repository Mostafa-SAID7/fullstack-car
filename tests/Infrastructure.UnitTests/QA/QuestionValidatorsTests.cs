using Application.Features.Community.QA.Commands;
using Application.Features.Community.QA.DTOs.Requests;
using Application.Features.Community.QA.Validators;
using FluentValidation.TestHelper;
using Xunit;

namespace Infrastructure.UnitTests.QA;

public class QuestionValidatorsTests
{
    private readonly CreateQuestionValidator _createValidator;
    private readonly UpdateQuestionValidator _updateValidator;
    private readonly DeleteQuestionValidator _deleteValidator;
    private readonly CloseQuestionValidator _closeValidator;
    private readonly AcceptAnswerValidator _acceptValidator;

    public QuestionValidatorsTests()
    {
        _createValidator = new CreateQuestionValidator();
        _updateValidator = new UpdateQuestionValidator();
        _deleteValidator = new DeleteQuestionValidator();
        _closeValidator = new CloseQuestionValidator();
        _acceptValidator = new AcceptAnswerValidator();
    }

    [Fact]
    public void CreateQuestionValidator_WithValidCommand_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var command = new CreateQuestionCommand
        {
            UserId = Guid.NewGuid(),
            Request = new CreateQuestionRequest
            {
                Title = "How to implement CQRS pattern?",
                Content = "I want to learn about implementing CQRS pattern in .NET applications with proper separation of concerns.",
                Category = "Technology",
                Tags = new List<string> { "cqrs", "dotnet" }
            }
        };

        // Act
        var result = _createValidator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void CreateQuestionValidator_WithShortTitle_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateQuestionCommand
        {
            UserId = Guid.NewGuid(),
            Request = new CreateQuestionRequest
            {
                Title = "Short", // Too short
                Content = "This is a valid content that meets the minimum length requirement.",
                Category = "Technology",
                Tags = new List<string> { "test" }
            }
        };

        // Act
        var result = _createValidator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Request.Title);
    }

    [Fact]
    public void CreateQuestionValidator_WithTooManyTags_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateQuestionCommand
        {
            UserId = Guid.NewGuid(),
            Request = new CreateQuestionRequest
            {
                Title = "Valid question title here",
                Content = "This is a valid content that meets the minimum length requirement.",
                Category = "Technology",
                Tags = new List<string> { "tag1", "tag2", "tag3", "tag4", "tag5", "tag6" } // Too many tags
            }
        };

        // Act
        var result = _createValidator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Request.Tags);
    }

    [Fact]
    public void UpdateQuestionValidator_WithValidCommand_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var command = new UpdateQuestionCommand
        {
            QuestionId = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Request = new UpdateQuestionRequest
            {
                Title = "Updated question title",
                Content = "Updated content with more details and information.",
                Category = "Technology",
                Tags = new List<string> { "updated", "tags" }
            }
        };

        // Act
        var result = _updateValidator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void CloseQuestionValidator_WithEmptyReason_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CloseQuestionCommand
        {
            QuestionId = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            Reason = "" // Empty reason
        };

        // Act
        var result = _closeValidator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Reason);
    }

    [Fact]
    public void AcceptAnswerValidator_WithValidCommand_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var command = new AcceptAnswerCommand
        {
            AnswerId = Guid.NewGuid(),
            UserId = Guid.NewGuid()
        };

        // Act
        var result = _acceptValidator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }
}