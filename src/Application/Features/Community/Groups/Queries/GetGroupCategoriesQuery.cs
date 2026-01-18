using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupCategoriesQuery : IRequest<Result<List<GroupCategoryDto>>>
    {
        public bool IncludeGroupCounts { get; set; } = true;
    }

    public class GetGroupCategoriesQueryHandler : IRequestHandler<GetGroupCategoriesQuery, Result<List<GroupCategoryDto>>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetGroupCategoriesQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<List<GroupCategoryDto>>> Handle(GetGroupCategoriesQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // Get category counts from repository
                var categoryCounts = await _groupRepository.GetGroupCountsByCategoryAsync(cancellationToken);

                // Define predefined categories with display information
                var predefinedCategories = new List<GroupCategoryDto>
                {
                    new GroupCategoryDto
                    {
                        Name = "Automotive",
                        DisplayName = "Automotive",
                        Description = "Car enthusiasts, mechanics, and automotive professionals",
                        IconUrl = "/icons/automotive.svg",
                        GroupCount = categoryCounts.GetValueOrDefault("Automotive", 0),
                        IsActive = true
                    },
                    new GroupCategoryDto
                    {
                        Name = "Technology",
                        DisplayName = "Technology",
                        Description = "Tech discussions, programming, and innovation",
                        IconUrl = "/icons/technology.svg",
                        GroupCount = categoryCounts.GetValueOrDefault("Technology", 0),
                        IsActive = true
                    },
                    new GroupCategoryDto
                    {
                        Name = "Sports",
                        DisplayName = "Sports",
                        Description = "Sports teams, fitness, and athletic activities",
                        IconUrl = "/icons/sports.svg",
                        GroupCount = categoryCounts.GetValueOrDefault("Sports", 0),
                        IsActive = true
                    },
                    new GroupCategoryDto
                    {
                        Name = "Hobbies",
                        DisplayName = "Hobbies",
                        Description = "Personal interests and hobby groups",
                        IconUrl = "/icons/hobbies.svg",
                        GroupCount = categoryCounts.GetValueOrDefault("Hobbies", 0),
                        IsActive = true
                    },
                    new GroupCategoryDto
                    {
                        Name = "Professional",
                        DisplayName = "Professional",
                        Description = "Career development and professional networking",
                        IconUrl = "/icons/professional.svg",
                        GroupCount = categoryCounts.GetValueOrDefault("Professional", 0),
                        IsActive = true
                    },
                    new GroupCategoryDto
                    {
                        Name = "Education",
                        DisplayName = "Education",
                        Description = "Learning, teaching, and educational resources",
                        IconUrl = "/icons/education.svg",
                        GroupCount = categoryCounts.GetValueOrDefault("Education", 0),
                        IsActive = true
                    },
                    new GroupCategoryDto
                    {
                        Name = "Community",
                        DisplayName = "Community",
                        Description = "Local communities and neighborhood groups",
                        IconUrl = "/icons/community.svg",
                        GroupCount = categoryCounts.GetValueOrDefault("Community", 0),
                        IsActive = true
                    },
                    new GroupCategoryDto
                    {
                        Name = "Entertainment",
                        DisplayName = "Entertainment",
                        Description = "Movies, music, games, and entertainment",
                        IconUrl = "/icons/entertainment.svg",
                        GroupCount = categoryCounts.GetValueOrDefault("Entertainment", 0),
                        IsActive = true
                    }
                };

                // Add any additional categories found in the database that aren't predefined
                foreach (var categoryCount in categoryCounts)
                {
                    if (!predefinedCategories.Any(c => c.Name.Equals(categoryCount.Key, StringComparison.OrdinalIgnoreCase)))
                    {
                        predefinedCategories.Add(new GroupCategoryDto
                        {
                            Name = categoryCount.Key,
                            DisplayName = categoryCount.Key,
                            Description = $"{categoryCount.Key} related groups",
                            IconUrl = "/icons/default.svg",
                            GroupCount = categoryCount.Value,
                            IsActive = true
                        });
                    }
                }

                // Sort by group count descending, then by name
                var sortedCategories = predefinedCategories
                    .OrderByDescending(c => c.GroupCount)
                    .ThenBy(c => c.DisplayName)
                    .ToList();

                return Result<List<GroupCategoryDto>>.Success(sortedCategories);
            }
            catch (Exception ex)
            {
                return Result<List<GroupCategoryDto>>.Failure($"Failed to retrieve group categories: {ex.Message}");
            }
        }
    }
}