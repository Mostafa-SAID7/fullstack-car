using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class ExportEventAttendeesCommand : IRequest<ApiResponseDto<object>>
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
    public string Format { get; set; } = "csv";
    public List<string> IncludeFields { get; set; } = new();
}