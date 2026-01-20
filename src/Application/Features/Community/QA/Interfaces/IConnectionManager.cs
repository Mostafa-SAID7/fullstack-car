using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.QA.Interfaces;

public interface IConnectionManager
{
    void TrackConnection(string connectionId, Guid userId, string userName, string userAgent);
    void TrackDisconnection(string connectionId, string reason);
    void TrackGroupJoin(string connectionId, string groupName);
    void TrackGroupLeave(string connectionId, string groupName);
    void UpdateConnectionActivity(string connectionId);
    Task<int> GetActiveConnectionCountAsync();
    Task<ConnectionHealthDto> GetConnectionHealthAsync();
    Task<List<ActiveConnectionDto>> GetActiveConnectionsAsync();
}