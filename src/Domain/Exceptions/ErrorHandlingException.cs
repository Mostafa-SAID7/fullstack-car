namespace Domain.Exceptions;

public class ErrorHandlingException : DomainException
{
    public ErrorHandlingException(string message) : base(message)
    {
    }

    public ErrorHandlingException(string message, Exception innerException) : base(message, innerException)
    {
    }

    public static ErrorHandlingException LoggingFailed(string errorId)
    {
        return new ErrorHandlingException($"Failed to log error with ID: '{errorId}'");
    }

    public static ErrorHandlingException PatternMatchingFailed(string pattern)
    {
        return new ErrorHandlingException($"Error pattern matching failed for pattern: '{pattern}'");
    }
}