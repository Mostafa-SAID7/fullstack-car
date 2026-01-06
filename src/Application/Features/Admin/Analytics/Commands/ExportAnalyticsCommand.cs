using Application.Common.Models;
using Application.Features.Admin.Analytics.DTOs.Requests;
using Application.Features.Admin.Analytics.DTOs.Responses;
using MediatR;

namespace Application.Features.Admin.Analytics.Commands
{
    public class ExportAnalyticsCommand : IRequest<Result<ExportAnalyticsResponse>>
    {
        public ExportAnalyticsRequest Request { get; set; } = new();
        public Guid AdminId { get; set; }
    }
}
