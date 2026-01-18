using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Queries
{
    public class GetEventCategoriesQuery : IRequest<Result<List<EventCategoryDto>>>
    {
        public bool IncludeEventCounts { get; set; } = true;
    }

    public class GetEventCategoriesQueryHandler : IRequestHandler<GetEventCategoriesQuery, Result<List<EventCategoryDto>>>
    {
        private readonly IEventRepository _eventRepository;

        public GetEventCategoriesQueryHandler(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<Result<List<EventCategoryDto>>> Handle(GetEventCategoriesQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // Get predefined categories with counts
                var categoryCounts = request.IncludeEventCounts 
                    ? await _eventRepository.GetEventCountsByCategoryAsync(cancellationToken)
                    : new Dictionary<string, int>();

                // Define standard event categories
                var categories = new List<EventCategoryDto>
                {
                    new EventCategoryDto
                    {
                        Name = "Automotive",
                        DisplayName = "Automotive Events",
                        Description = "Car shows, racing events, automotive meetups",
                        IconUrl = "/icons/automotive.svg",
                        Color = "#FF6B35",
                        EventCount = categoryCounts.GetValueOrDefault("Automotive", 0),
                        IsActive = true,
                        SortOrder = 1
                    },
                    new EventCategoryDto
                    {
                        Name = "Community",
                        DisplayName = "Community Gatherings",
                        Description = "Local meetups, community events, social gatherings",
                        IconUrl = "/icons/community.svg",
                        Color = "#4ECDC4",
                        EventCount = categoryCounts.GetValueOrDefault("Community", 0),
                        IsActive = true,
                        SortOrder = 2
                    },
                    new EventCategoryDto
                    {
                        Name = "Educational",
                        DisplayName = "Educational Events",
                        Description = "Workshops, seminars, training sessions",
                        IconUrl = "/icons/education.svg",
                        Color = "#45B7D1",
                        EventCount = categoryCounts.GetValueOrDefault("Educational", 0),
                        IsActive = true,
                        SortOrder = 3
                    },
                    new EventCategoryDto
                    {
                        Name = "Racing",
                        DisplayName = "Racing Events",
                        Description = "Track days, racing competitions, motorsports",
                        IconUrl = "/icons/racing.svg",
                        Color = "#F7DC6F",
                        EventCount = categoryCounts.GetValueOrDefault("Racing", 0),
                        IsActive = true,
                        SortOrder = 4
                    },
                    new EventCategoryDto
                    {
                        Name = "Maintenance",
                        DisplayName = "Maintenance & Repair",
                        Description = "DIY workshops, maintenance sessions, repair clinics",
                        IconUrl = "/icons/maintenance.svg",
                        Color = "#BB8FCE",
                        EventCount = categoryCounts.GetValueOrDefault("Maintenance", 0),
                        IsActive = true,
                        SortOrder = 5
                    },
                    new EventCategoryDto
                    {
                        Name = "Social",
                        DisplayName = "Social Events",
                        Description = "Parties, celebrations, casual meetups",
                        IconUrl = "/icons/social.svg",
                        Color = "#F8C471",
                        EventCount = categoryCounts.GetValueOrDefault("Social", 0),
                        IsActive = true,
                        SortOrder = 6
                    },
                    new EventCategoryDto
                    {
                        Name = "Business",
                        DisplayName = "Business Events",
                        Description = "Networking, conferences, business meetings",
                        IconUrl = "/icons/business.svg",
                        Color = "#85C1E9",
                        EventCount = categoryCounts.GetValueOrDefault("Business", 0),
                        IsActive = true,
                        SortOrder = 7
                    },
                    new EventCategoryDto
                    {
                        Name = "Charity",
                        DisplayName = "Charity Events",
                        Description = "Fundraisers, charity drives, volunteer events",
                        IconUrl = "/icons/charity.svg",
                        Color = "#82E0AA",
                        EventCount = categoryCounts.GetValueOrDefault("Charity", 0),
                        IsActive = true,
                        SortOrder = 8
                    },
                    new EventCategoryDto
                    {
                        Name = "Other",
                        DisplayName = "Other Events",
                        Description = "Miscellaneous events and activities",
                        IconUrl = "/icons/other.svg",
                        Color = "#D5DBDB",
                        EventCount = categoryCounts.GetValueOrDefault("Other", 0),
                        IsActive = true,
                        SortOrder = 9
                    }
                };

                // Sort by sort order
                categories = categories.OrderBy(c => c.SortOrder).ToList();

                return Result<List<EventCategoryDto>>.Success(categories);
            }
            catch (Exception ex)
            {
                return Result<List<EventCategoryDto>>.Failure($"Failed to retrieve event categories: {ex.Message}");
            }
        }
    }
}