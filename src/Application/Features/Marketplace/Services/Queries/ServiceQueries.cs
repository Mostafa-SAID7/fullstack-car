using Application.Common.Models;
using Application.Features.Marketplace.Services.DTOs.Responses;
using MediatR;

namespace Application.Features.Marketplace.Services.Queries;

public class ExportServicesQuery : IRequest<Result<byte[]>>
{
    public string Format { get; set; } = "csv";
    public string? SearchTerm { get; set; }
    public Domain.Enums.Marketplace.ServiceType? Type { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? IsEmergencyService { get; set; }
    public bool? IsAvailable24x7 { get; set; }
    public decimal? MinRating { get; set; }
}

public class GetPopularServicesQuery : IRequest<Result<List<CarServiceDto>>>
{
    public int Limit { get; set; } = 10;
    public string Period { get; set; } = "30d";
}

public class GetServiceStatisticsQuery : IRequest<Result<object>>
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}