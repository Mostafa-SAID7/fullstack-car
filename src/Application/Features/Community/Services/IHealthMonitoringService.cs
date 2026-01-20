using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.Services;

public interface IHealthMonitoringService
{
    Task<Result<SystemHealthDto>> GetSystemHealthAsync();
    Task<Result<List<SystemAlertDto>>> GetActiveAlertsAsync();
    Task<Result<PerformanceMetricsDto>> GetPerformanceMetricsAsync();
    Task<Result<UserSatisfactionDto>> GetUserSatisfactionAsync();
    Task<Result<bool>> CheckSystemHealthAsync();
}