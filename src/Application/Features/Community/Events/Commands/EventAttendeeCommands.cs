using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Events.Commands;

public class ExportEventAttendeesCommand : IRequest<ApiResponseDto<ExportFileResult>>
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
    public string Format { get; set; } = "csv";
    public List<string> IncludeFields { get; set; } = new();
}

public class ExportFileResult
{
    public byte[] FileContent { get; set; } = Array.Empty<byte>();
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
}
public class ExportEventAttendeesCommandHandler : IRequestHandler<ExportEventAttendeesCommand, ApiResponseDto<ExportFileResult>>
{
    public async Task<ApiResponseDto<ExportFileResult>> Handle(ExportEventAttendeesCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        
        var result = new ExportFileResult
        {
            FileContent = System.Text.Encoding.UTF8.GetBytes("Sample CSV Content"),
            FileName = $"event-attendees-{DateTime.Now:yyyyMMdd}.{request.Format}",
            ContentType = request.Format.ToLower() == "csv" ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };
        
        return ApiResponseDto<ExportFileResult>.Success(result);
    }
}
