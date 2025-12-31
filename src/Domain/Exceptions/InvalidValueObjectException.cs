namespace Domain.Exceptions
{
    public class InvalidValueObjectException : DomainException
    {
        public InvalidValueObjectException(string message) : base(message)
        {
        }

        public InvalidValueObjectException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}