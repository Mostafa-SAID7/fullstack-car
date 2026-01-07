using Application.Common.Models;
using Application.Features.Marketplace.Integration.Commands;
using Application.Features.Shared.Notifications.Interfaces;
using MediatR;

namespace Application.Features.Marketplace.Integration.Handlers;

public class CreateMarketplacePromotionCommandHandler : IRequestHandler<CreateMarketplacePromotionCommand, Result<object>>
{
    private readonly INotificationService _notificationService;

    public CreateMarketplacePromotionCommandHandler(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task<Result<object>> Handle(CreateMarketplacePromotionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Mock promotion creation - replace with actual implementation
            var promotion = new
            {
                id = Guid.NewGuid(),
                name = request.Request.Name,
                description = request.Request.Description,
                type = request.Request.Type,
                discountType = "Percentage", // Default for now
                discountValue = request.Request.Value,
                minimumOrderAmount = request.Request.MinimumOrderValue ?? 0m,
                maximumDiscountAmount = 1000m, // Default max
                startDate = request.Request.StartDate,
                endDate = request.Request.EndDate,
                isActive = request.Request.IsActive,
                usageLimit = request.Request.MaxUsageCount ?? 1000,
                usageCount = 0,
                applicableProducts = request.Request.ApplicableProducts,
                applicableServices = request.Request.ApplicableServices,
                applicableCustomerTypes = request.Request.ApplicableCustomers,
                promoCode = GeneratePromoCode(),
                createdBy = request.AdminId,
                createdAt = DateTime.UtcNow,
                updatedAt = DateTime.UtcNow
            };

            // Send notification to admin about successful promotion creation
            await _notificationService.SendMarketplaceNotificationAsync(
                request.AdminId.ToString(),
                "Promotion Created Successfully",
                $"New promotion '{promotion.name}' has been created and is now active.",
                "Success",
                "Medium",
                $"/marketplace/promotions/{promotion.id}",
                promotion.id,
                "Promotion"
            );

            return Result<object>.Success(promotion);
        }
        catch (Exception ex)
        {
            // Send error notification
            await _notificationService.SendMarketplaceNotificationAsync(
                request.AdminId.ToString(),
                "Promotion Creation Failed",
                $"Failed to create promotion: {ex.Message}",
                "Error",
                "High"
            );

            return Result<object>.Failure($"Error creating marketplace promotion: {ex.Message}");
        }
    }

    private static string GeneratePromoCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 8)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}