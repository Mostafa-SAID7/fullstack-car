namespace Domain.DomainEvents.Identity.Auth;

public class UserRegisteredEvent : BaseDomainEvent
{
    public Guid UserId { get; }
    public string Email { get; }
    public string UserName { get; }
    public DateTime RegistrationDate { get; }

    public UserRegisteredEvent(Guid userId, string email, string userName, DateTime registrationDate)
    {
        UserId = userId;
        Email = email;
        UserName = userName;
        RegistrationDate = registrationDate;
    }
}
