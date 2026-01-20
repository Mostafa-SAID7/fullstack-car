using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.Services;

public interface IAlertService
{
    Task<Result<bool>> CreateAlertAsync(string type, string title, string message, string severity);
    Task<Result<List<SystemAlertDto>>> GetActiveAlertsAsync();
    Task<Result<bool>> ResolveAlertAsync(Guid alertId);
    Task<Result<bool>> DismissAlertAsync(Guid alertId);
    Task<Result<int>> GetAlertCountAsync(string severity = null);
}