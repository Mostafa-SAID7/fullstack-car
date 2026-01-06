namespace Application.Features.Admin.Management.Users.Reports.DTOs.Requests
{
    public class ResolveReportRequest
    {
        public string Resolution { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string ActionTaken { get; set; } = string.Empty;
    }

    public class DismissReportRequest
    {
        public string Reason { get; set; } = string.Empty;
    }
}