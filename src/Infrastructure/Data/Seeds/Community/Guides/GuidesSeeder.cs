using Domain.Entities.Community.Guides;
using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Domain.Enums.Community.Guides;
using Domain.Enums.Community.Posts;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Community.Guides;

public class GuidesSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<GuidesSeeder> _logger;

    public GuidesSeeder(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<GuidesSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            if (await _context.Guides.AnyAsync())
            {
                _logger.LogInformation("Guides already exist, skipping seeding");
                return;
            }

            _logger.LogInformation("Seeding guides data...");
            await SeedGuidesData();
            _logger.LogInformation("Guides data seeded successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error seeding guides data");
            throw;
        }
    }

    private async Task SeedGuidesData()
    {
        var users = await _context.Users.Take(5).ToListAsync();
        if (!users.Any())
            return;

        var guides = new List<Guide>();
        var posts = new List<Post>();

        // Guide 1: Basic Car Maintenance
        var guide1 = new Guide
        {
            Title = "Complete Guide to Basic Car Maintenance",
            Content = GetMaintenanceGuideContent(),
            Summary = "Learn essential car maintenance tasks that every car owner should know. This comprehensive guide covers oil changes, tire care, fluid checks, and more.",
            Category = GuideCategory.Maintenance,
            Difficulty = GuideDifficulty.Beginner,
            EstimatedReadTime = 15,
            Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "maintenance", "beginner", "oil-change", "tires", "fluids" }),
            ThumbnailUrl = "https://example.com/images/car-maintenance.jpg",
            AuthorId = users[0].Id.ToString(),
            IsPublished = true,
            IsFeatured = true,
            ViewCount = 1250,
            LikeCount = 89,
            BookmarkCount = 156
        };

        var post1 = new Post
        {
            Title = guide1.Title,
            Content = guide1.Summary,
            Type = PostType.Guide,
            AuthorId = guide1.AuthorId,
            IsPublished = true,
            ViewCount = guide1.ViewCount,
            LikeCount = guide1.LikeCount
        };

        guides.Add(guide1);
        posts.Add(post1);

        // Guide 2: Engine Troubleshooting
        var guide2 = new Guide
        {
            Title = "Engine Troubleshooting: Common Problems and Solutions",
            Content = GetEngineGuideContent(),
            Summary = "Diagnose and fix common engine problems with this detailed troubleshooting guide. Learn to identify symptoms and apply appropriate solutions.",
            Category = GuideCategory.Engine,
            Difficulty = GuideDifficulty.Intermediate,
            EstimatedReadTime = 25,
            Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "engine", "troubleshooting", "repair", "diagnostics" }),
            ThumbnailUrl = "https://example.com/images/engine-repair.jpg",
            AuthorId = users[1].Id.ToString(),
            IsPublished = true,
            IsFeatured = false,
            ViewCount = 890,
            LikeCount = 67,
            BookmarkCount = 123
        };

        var post2 = new Post
        {
            Title = guide2.Title,
            Content = guide2.Summary,
            Type = PostType.Guide,
            AuthorId = guide2.AuthorId,
            IsPublished = true,
            ViewCount = guide2.ViewCount,
            LikeCount = guide2.LikeCount
        };

        guides.Add(guide2);
        posts.Add(post2);

        // Guide 3: Car Detailing
        var guide3 = new Guide
        {
            Title = "Professional Car Detailing at Home",
            Content = GetDetailingGuideContent(),
            Summary = "Transform your car's appearance with professional detailing techniques you can do at home. Complete step-by-step process included.",
            Category = GuideCategory.Detailing,
            Difficulty = GuideDifficulty.Beginner,
            EstimatedReadTime = 20,
            Tags = System.Text.Json.JsonSerializer.Serialize(new[] { "detailing", "cleaning", "waxing", "interior", "exterior" }),
            ThumbnailUrl = "https://example.com/images/car-detailing.jpg",
            AuthorId = users[2].Id.ToString(),
            IsPublished = true,
            IsFeatured = true,
            ViewCount = 2100,
            LikeCount = 145,
            BookmarkCount = 234
        };

        var post3 = new Post
        {
            Title = guide3.Title,
            Content = guide3.Summary,
            Type = PostType.Guide,
            AuthorId = guide3.AuthorId,
            IsPublished = true,
            ViewCount = guide3.ViewCount,
            LikeCount = guide3.LikeCount
        };

        guides.Add(guide3);
        posts.Add(post3);

        // Add posts first to get IDs
        _context.Posts.AddRange(posts);
        await _context.SaveChangesAsync();

        // Link guides to posts
        for (int i = 0; i < guides.Count; i++)
        {
            guides[i].PostId = posts[i].Id;
        }

        _context.Guides.AddRange(guides);
        await _context.SaveChangesAsync();

        // Add steps for each guide
        await AddGuideSteps(guides);
        await AddGuideRatings(guides, users);
    }

    private async Task AddGuideSteps(List<Guide> guides)
    {
        var steps = new List<GuideStep>();

        // Steps for Guide 1 (Maintenance)
        steps.AddRange(new[]
        {
            new GuideStep
            {
                GuideId = guides[0].Id,
                StepNumber = 1,
                Title = "Gather Required Tools and Materials",
                Content = "Before starting, ensure you have all necessary tools: wrench set, oil drain pan, new oil filter, motor oil, funnel, and safety equipment.",
                EstimatedTime = 5,
                IsRequired = true,
                Tips = "Always use the correct oil type specified in your owner's manual."
            },
            new GuideStep
            {
                GuideId = guides[0].Id,
                StepNumber = 2,
                Title = "Warm Up the Engine",
                Content = "Run the engine for 2-3 minutes to warm the oil. Warm oil drains more completely and carries away more contaminants.",
                EstimatedTime = 3,
                IsRequired = true,
                WarningNotes = "Be careful not to overheat the engine. The oil should be warm, not hot."
            },
            new GuideStep
            {
                GuideId = guides[0].Id,
                StepNumber = 3,
                Title = "Drain the Old Oil",
                Content = "Locate the oil drain plug, position your drain pan, and carefully remove the plug. Allow oil to drain completely.",
                EstimatedTime = 15,
                IsRequired = true,
                WarningNotes = "Oil may be hot. Wear protective gloves and eyewear."
            }
        });

        // Steps for Guide 2 (Engine)
        steps.AddRange(new[]
        {
            new GuideStep
            {
                GuideId = guides[1].Id,
                StepNumber = 1,
                Title = "Identify the Problem Symptoms",
                Content = "Listen for unusual noises, check for warning lights, note any performance issues, and observe exhaust smoke color.",
                EstimatedTime = 10,
                IsRequired = true
            },
            new GuideStep
            {
                GuideId = guides[1].Id,
                StepNumber = 2,
                Title = "Check Basic Components",
                Content = "Inspect air filter, spark plugs, fuel system, and cooling system for obvious issues.",
                EstimatedTime = 20,
                IsRequired = true
            }
        });

        // Steps for Guide 3 (Detailing)
        steps.AddRange(new[]
        {
            new GuideStep
            {
                GuideId = guides[2].Id,
                StepNumber = 1,
                Title = "Pre-wash Preparation",
                Content = "Remove all items from the car, rinse off loose dirt, and prepare your cleaning supplies.",
                EstimatedTime = 10,
                IsRequired = true
            },
            new GuideStep
            {
                GuideId = guides[2].Id,
                StepNumber = 2,
                Title = "Wash the Exterior",
                Content = "Use the two-bucket method: one for soapy water, one for rinsing. Work from top to bottom.",
                EstimatedTime = 30,
                IsRequired = true,
                Tips = "Use a microfiber wash mitt and rinse frequently to avoid scratches."
            }
        });

        _context.GuideSteps.AddRange(steps);
        await _context.SaveChangesAsync();
    }

    private async Task AddGuideRatings(List<Guide> guides, List<ApplicationUser> users)
    {
        var ratings = new List<GuideRating>();
        var random = new Random();

        foreach (var guide in guides)
        {
            // Add 3-5 ratings per guide
            var ratingCount = random.Next(3, 6);
            var usedUsers = new HashSet<string>();

            for (int i = 0; i < ratingCount && usedUsers.Count < users.Count; i++)
            {
                var user = users[random.Next(users.Count)];
                if (usedUsers.Contains(user.Id.ToString()))
                    continue;

                usedUsers.Add(user.Id.ToString());

                ratings.Add(new GuideRating
                {
                    GuideId = guide.Id,
                    UserId = user.Id.ToString(),
                    Rating = random.Next(3, 6), // 3-5 stars
                    Comment = GetRandomComment(),
                    IsHelpful = random.Next(0, 2) == 1
                });
            }
        }

        _context.GuideRatings.AddRange(ratings);
        await _context.SaveChangesAsync();
    }

    private static string GetMaintenanceGuideContent()
    {
        return @"Regular car maintenance is crucial for keeping your vehicle running smoothly and extending its lifespan. This comprehensive guide will walk you through the essential maintenance tasks that every car owner should know how to perform.

**Why Regular Maintenance Matters**

Regular maintenance prevents costly repairs, improves fuel efficiency, ensures safety, and maintains your car's resale value. By following a consistent maintenance schedule, you can catch small problems before they become major issues.

**Essential Tools You'll Need**

- Basic wrench set
- Oil drain pan
- Funnel
- Jack and jack stands
- Tire pressure gauge
- Basic multimeter
- Safety equipment (gloves, safety glasses)

**Monthly Checks**

Perform these checks monthly to stay on top of your car's condition:
- Check tire pressure and tread depth
- Inspect fluid levels (oil, coolant, brake fluid, windshield washer)
- Test lights and signals
- Check battery terminals for corrosion

**Seasonal Maintenance**

Different seasons require different attention:
- Spring: Check air conditioning, inspect for winter damage
- Summer: Monitor cooling system, check tire condition
- Fall: Prepare for winter, check heating system
- Winter: Use appropriate fluids, check battery condition

This guide will help you maintain your vehicle properly and save money on unnecessary repairs.";
    }

    private static string GetEngineGuideContent()
    {
        return @"Engine problems can be frustrating and expensive if not addressed promptly. This guide will help you identify common engine issues and provide solutions you can implement yourself or discuss knowledgeably with your mechanic.

**Common Engine Symptoms and Their Meanings**

Understanding what your engine is telling you is the first step in proper diagnosis:

**Strange Noises:**
- Knocking: Often indicates worn bearings or incorrect fuel octane
- Squealing: Usually belt-related issues
- Grinding: Serious internal damage possible
- Clicking: Often valve-related problems

**Performance Issues:**
- Rough idling: Fuel system, ignition, or air intake problems
- Loss of power: Multiple possible causes from fuel to compression
- Hard starting: Ignition, fuel delivery, or compression issues
- Stalling: Often fuel or ignition related

**Visual Indicators:**
- Blue exhaust smoke: Oil burning
- White smoke: Coolant leak into combustion chamber
- Black smoke: Rich fuel mixture
- Warning lights: Various system malfunctions

**Diagnostic Approach**

Always start with the basics:
1. Check fluid levels and condition
2. Inspect air filter
3. Examine spark plugs
4. Test fuel pressure
5. Check compression if necessary

**When to Seek Professional Help**

While many issues can be diagnosed at home, some require professional attention:
- Internal engine noises
- Compression problems
- Complex electrical issues
- Emissions system problems

Remember, early diagnosis and repair save money and prevent further damage.";
    }

    private static string GetDetailingGuideContent()
    {
        return @"Professional car detailing doesn't have to be expensive or time-consuming. With the right techniques and products, you can achieve showroom-quality results at home.

**Understanding Car Detailing**

Detailing goes beyond a simple car wash. It involves thorough cleaning, restoration, and protection of your vehicle's interior and exterior surfaces.

**Essential Detailing Supplies**

**Exterior:**
- pH-neutral car shampoo
- Microfiber wash mitts and towels
- Clay bar kit
- Polish and wax
- Tire cleaner and protectant
- Glass cleaner

**Interior:**
- Vacuum cleaner with attachments
- Interior cleaner
- Leather conditioner (if applicable)
- Microfiber cloths
- Detailing brushes

**The Detailing Process**

**Exterior Detailing:**
1. Pre-rinse to remove loose dirt
2. Wash using two-bucket method
3. Clay bar treatment for smooth finish
4. Polish to remove minor scratches
5. Apply protective wax or sealant
6. Clean and protect tires
7. Clean windows inside and out

**Interior Detailing:**
1. Remove all personal items
2. Vacuum thoroughly including crevices
3. Clean and condition surfaces
4. Protect with appropriate products
5. Clean windows from inside

**Pro Tips for Best Results**

- Work in shade, never in direct sunlight
- Keep surfaces cool to touch
- Use proper technique to avoid swirl marks
- Take your time for best results
- Maintain your tools and products properly

**Maintenance Schedule**

- Weekly: Basic wash and interior vacuum
- Monthly: Full exterior detail
- Quarterly: Complete interior and exterior detail
- Annually: Paint correction and protection renewal

Regular detailing not only keeps your car looking great but also protects your investment and maintains resale value.";
    }

    private static string GetRandomComment()
    {
        var comments = new[]
        {
            "Excellent guide! Very detailed and easy to follow.",
            "This helped me save a lot of money. Thank you!",
            "Clear instructions with great tips throughout.",
            "Perfect for beginners like me. Highly recommended!",
            "Well written and comprehensive. Great work!",
            "Followed this guide step by step with great results.",
            "Very helpful, especially the safety warnings.",
            "This should be required reading for all car owners.",
            "Great guide with practical advice that actually works.",
            "Thorough and well-organized. Bookmarked for future reference!"
        };

        return comments[new Random().Next(comments.Length)];
    }
}