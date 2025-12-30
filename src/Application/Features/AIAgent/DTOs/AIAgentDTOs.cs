using System;
using System.Collections.Generic;

namespace Application.Features.AIAgent.DTOs
{
    public class ChatRequestDTO
    {
        public string Message { get; set; } = string.Empty;
        public string? Context { get; set; }
        public string? UserId { get; set; }
    }

    public class ChatResponseDTO
    {
        public string Message { get; set; } = string.Empty;
        public string? ConversationId { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class RecommendationRequestDTO
    {
        public string? Budget { get; set; }
        public string? CarType { get; set; }
        public string? FuelType { get; set; }
        public string? Usage { get; set; }
        public List<string>? Features { get; set; }
    }

    public class RecommendationResponseDTO
    {
        public List<CarRecommendationDTO> Recommendations { get; set; } = new();
        public int TotalCount { get; set; }
    }

    public class CarRecommendationDTO
    {
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string? PriceRange { get; set; }
        public string? Reason { get; set; }
        public double ConfidenceScore { get; set; }
    }

    public class MaintenanceRequestDTO
    {
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public int? Mileage { get; set; }
        public string? LastService { get; set; }
        public List<string>? ServiceHistory { get; set; }
    }

    public class MaintenanceResponseDTO
    {
        public List<string> PriorityItems { get; set; } = new();
        public List<string> UpcomingServices { get; set; } = new();
        public Dictionary<string, string> EstimatedCosts { get; set; } = new();
        public string Recommendations { get; set; } = string.Empty;
        public string? NextServiceDate { get; set; }
    }

    public class MarketAnalysisRequestDTO
    {
        public string CarQuery { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? TimeFrame { get; set; }
    }

    public class MarketAnalysisResponseDTO
    {
        public string Analysis { get; set; } = string.Empty;
        public string MarketTrend { get; set; } = string.Empty;
        public string PriceTrend { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
        public double Confidence { get; set; }
    }
}
