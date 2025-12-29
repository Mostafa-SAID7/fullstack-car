namespace Application.Common.Interfaces.Identity
{
    public interface ICurrentUserService
    {
        string? UserId { get; }
        string? UserName { get; }
        string? Email { get; }
        bool IsAuthenticated { get; }
        bool IsInRole(string role);
        IEnumerable<string> GetRoles();
    }
}