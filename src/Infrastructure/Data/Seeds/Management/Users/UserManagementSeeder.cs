using Domain.Entities.Identity;
using Domain.Entities.Admin.Management.Users;
using Domain.Enums.Identity;
using Domain.Enums.Admin.Management;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Management.Users
{
    public class UserManagementSeeder
    {
        private readonly ILogger<UserManagementSeeder> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public UserManagementSeeder(
            ILogger<UserManagementSeeder> logger,
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task SeedAllAsync()
        {
            _logger.LogInformation("Starting comprehensive user management seeding...");

            await SeedExtendedRolesAsync();
            await SeedRealisticUsersAsync();
            await SeedUserActivitiesAsync();
            await SeedUserSuspensionsAsync();
            await SeedUserStatisticsAsync();

            _logger.LogInformation("User management seeding completed successfully.");
        }

        private async Task SeedExtendedRolesAsync()
        {
            _logger.LogInformation("Seeding extended roles for user management...");

            var extendedRoles = new[]
            {
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "SuperAdmin",
                    NormalizedName = "SUPERADMIN",
                    Description = "Super Administrator with unrestricted access to all system functions",
                    Priority = 110,
                    IsSystemRole = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "UserManager",
                    NormalizedName = "USERMANAGER",
                    Description = "User Manager with user administration privileges",
                    Priority = 90,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "ContentManager",
                    NormalizedName = "CONTENTMANAGER",
                    Description = "Content Manager with content moderation and management privileges",
                    Priority = 85,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "SupportAgent",
                    NormalizedName = "SUPPORTAGENT",
                    Description = "Support Agent with customer support privileges",
                    Priority = 75,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Analyst",
                    NormalizedName = "ANALYST",
                    Description = "Data Analyst with reporting and analytics access",
                    Priority = 65,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "VIP",
                    NormalizedName = "VIP",
                    Description = "VIP User with exclusive features and priority support",
                    Priority = 55,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Beta",
                    NormalizedName = "BETA",
                    Description = "Beta Tester with access to experimental features",
                    Priority = 45,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                },
                new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = "Guest",
                    NormalizedName = "GUEST",
                    Description = "Guest User with limited access",
                    Priority = 10,
                    IsSystemRole = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "System"
                }
            };

            foreach (var role in extendedRoles)
            {
                if (!await _roleManager.RoleExistsAsync(role.Name))
                {
                    await _roleManager.CreateAsync(role);
                    _logger.LogInformation("Created extended role: {RoleName}", role.Name);
                }
            }
        }

        private async Task SeedRealisticUsersAsync()
        {
            _logger.LogInformation("Seeding realistic users with diverse profiles...");

            // Super Admins
            await CreateRealisticUserAsync("ceo@fully2car.com", "Alexander", "Rodriguez", "CEO123!", "SuperAdmin", 
                UserStatus.Active, "Chief Executive Officer", "Leading the vision for the future of automotive community.", 
                "+1-555-0101", "New York", "USA", true, DateTime.UtcNow.AddHours(-2));

            await CreateRealisticUserAsync("cto@fully2car.com", "Sophia", "Chen", "CTO123!", "SuperAdmin", 
                UserStatus.Active, "Chief Technology Officer", "Driving innovation through cutting-edge technology solutions.", 
                "+1-555-0102", "San Francisco", "USA", true, DateTime.UtcNow.AddHours(-5));

            // User Managers
            await CreateRealisticUserAsync("usermgr1@fully2car.com", "Marcus", "Thompson", "UserMgr123!", "UserManager", 
                UserStatus.Active, "Senior User Manager", "Passionate about creating exceptional user experiences and community growth.", 
                "+1-555-0201", "Chicago", "USA", true, DateTime.UtcNow.AddMinutes(-30));

            await CreateRealisticUserAsync("usermgr2@fully2car.com", "Isabella", "Martinez", "UserMgr123!", "UserManager", 
                UserStatus.Active, "User Experience Manager", "Dedicated to fostering positive community interactions and user satisfaction.", 
                "+1-555-0202", "Austin", "USA", true, DateTime.UtcNow.AddHours(-1));

            // Content Managers
            await CreateRealisticUserAsync("contentmgr1@fully2car.com", "James", "Wilson", "ContentMgr123!", "ContentManager", 
                UserStatus.Active, "Content Strategy Manager", "Curating engaging automotive content and maintaining community standards.", 
                "+1-555-0301", "Los Angeles", "USA", true, DateTime.UtcNow.AddMinutes(-45));

            await CreateRealisticUserAsync("contentmgr2@fully2car.com", "Emma", "Johnson", "ContentMgr123!", "ContentManager", 
                UserStatus.Active, "Community Content Manager", "Ensuring high-quality content and positive community engagement.", 
                "+1-555-0302", "Seattle", "USA", true, DateTime.UtcNow.AddHours(-3));

            // Support Agents
            var supportAgents = new[]
            {
                ("support1@fully2car.com", "David", "Brown", "Customer Support Specialist", "Helping users navigate their automotive journey with expert guidance.", "+1-555-0401", "Denver", "USA"),
                ("support2@fully2car.com", "Sarah", "Davis", "Technical Support Agent", "Resolving technical issues and ensuring smooth user experiences.", "+1-555-0402", "Miami", "USA"),
                ("support3@fully2car.com", "Michael", "Garcia", "Community Support Lead", "Building bridges between users and fostering community connections.", "+1-555-0403", "Phoenix", "USA"),
                ("support4@fully2car.com", "Lisa", "Miller", "Premium Support Specialist", "Providing exceptional support for our premium community members.", "+1-555-0404", "Boston", "USA")
            };

            foreach (var (email, firstName, lastName, jobTitle, bio, phone, city, country) in supportAgents)
            {
                await CreateRealisticUserAsync(email, firstName, lastName, "Support123!", "SupportAgent", 
                    UserStatus.Active, jobTitle, bio, phone, city, country, true, 
                    DateTime.UtcNow.AddMinutes(-Random.Shared.Next(15, 120)));
            }

            // Analysts
            var analysts = new[]
            {
                ("analyst1@fully2car.com", "Robert", "Anderson", "Senior Data Analyst", "Transforming automotive data into actionable insights for community growth.", "+1-555-0501", "Atlanta", "USA"),
                ("analyst2@fully2car.com", "Jennifer", "Taylor", "Business Intelligence Analyst", "Analyzing user behavior patterns to enhance platform effectiveness.", "+1-555-0502", "Portland", "USA"),
                ("analyst3@fully2car.com", "Christopher", "Thomas", "Market Research Analyst", "Understanding automotive market trends and user preferences.", "+1-555-0503", "Nashville", "USA")
            };

            foreach (var (email, firstName, lastName, jobTitle, bio, phone, city, country) in analysts)
            {
                await CreateRealisticUserAsync(email, firstName, lastName, "Analyst123!", "Analyst", 
                    UserStatus.Active, jobTitle, bio, phone, city, country, true, 
                    DateTime.UtcNow.AddMinutes(-Random.Shared.Next(30, 180)));
            }

            // VIP Users (High-value community members)
            var vipUsers = new[]
            {
                ("vip1@fully2car.com", "William", "Jackson", "Automotive Journalist", "Award-winning automotive journalist sharing insights on the latest industry trends.", "+1-555-0601", "Detroit", "USA"),
                ("vip2@fully2car.com", "Olivia", "White", "Car Enthusiast & Blogger", "Passionate car enthusiast with 15+ years of automotive blogging experience.", "+1-555-0602", "Las Vegas", "USA"),
                ("vip3@fully2car.com", "Benjamin", "Harris", "Professional Race Driver", "Professional racing driver sharing track experiences and performance tips.", "+1-555-0603", "Indianapolis", "USA"),
                ("vip4@fully2car.com", "Charlotte", "Martin", "Automotive Designer", "Creative automotive designer with expertise in concept car development.", "+1-555-0604", "San Diego", "USA"),
                ("vip5@fully2car.com", "Daniel", "Thompson", "Mechanic Shop Owner", "Third-generation mechanic shop owner with 25+ years of automotive expertise.", "+1-555-0605", "Houston", "USA")
            };

            foreach (var (email, firstName, lastName, jobTitle, bio, phone, city, country) in vipUsers)
            {
                await CreateRealisticUserAsync(email, firstName, lastName, "VIP123!", "VIP", 
                    UserStatus.Active, jobTitle, bio, phone, city, country, true, 
                    DateTime.UtcNow.AddMinutes(-Random.Shared.Next(5, 60)));
            }

            // Beta Testers
            var betaTesters = new[]
            {
                ("beta1@fully2car.com", "Matthew", "Lee", "Software Developer", "Full-stack developer passionate about automotive technology and innovation.", "+1-555-0701", "San Jose", "USA"),
                ("beta2@fully2car.com", "Amelia", "Wilson", "UX Designer", "User experience designer focused on automotive interface design.", "+1-555-0702", "Raleigh", "USA"),
                ("beta3@fully2car.com", "Joseph", "Moore", "Tech Enthusiast", "Early adopter and technology enthusiast with automotive industry connections.", "+1-555-0703", "Salt Lake City", "USA"),
                ("beta4@fully2car.com", "Grace", "Taylor", "Product Manager", "Product manager with expertise in automotive software solutions.", "+1-555-0704", "Minneapolis", "USA")
            };

            foreach (var (email, firstName, lastName, jobTitle, bio, phone, city, country) in betaTesters)
            {
                await CreateRealisticUserAsync(email, firstName, lastName, "Beta123!", "Beta", 
                    UserStatus.Active, jobTitle, bio, phone, city, country, true, 
                    DateTime.UtcNow.AddMinutes(-Random.Shared.Next(10, 90)));
            }

            // Diverse Regular Users with realistic profiles
            await SeedDiverseRegularUsersAsync();

            // Inactive and Suspended Users for testing
            await SeedInactiveUsersAsync();
        }

        private async Task SeedDiverseRegularUsersAsync()
        {
            var regularUsers = new[]
            {
                // Car Enthusiasts
                ("enthusiast1@gmail.com", "Carlos", "Rodriguez", "Car Collector", "Classic car collector with over 50 vintage automobiles.", "+1-555-1001", "Miami", "USA"),
                ("enthusiast2@yahoo.com", "Ashley", "Kim", "Tuning Specialist", "Performance tuning specialist focusing on Japanese imports.", "+1-555-1002", "Los Angeles", "USA"),
                ("enthusiast3@outlook.com", "Ryan", "O'Connor", "Restoration Expert", "Muscle car restoration expert with 20+ years experience.", "+1-555-1003", "Detroit", "USA"),
                
                // Daily Drivers
                ("driver1@gmail.com", "Maria", "Gonzalez", "Commuter", "Daily commuter looking for fuel-efficient and reliable transportation.", "+1-555-1101", "Phoenix", "USA"),
                ("driver2@hotmail.com", "Kevin", "Smith", "Family Driver", "Father of three seeking safe and spacious family vehicles.", "+1-555-1102", "Denver", "USA"),
                ("driver3@gmail.com", "Linda", "Johnson", "City Driver", "Urban professional navigating city traffic and parking challenges.", "+1-555-1103", "New York", "USA"),
                
                // First-time Buyers
                ("newbie1@gmail.com", "Tyler", "Brown", "College Student", "College student looking for first affordable and reliable car.", "+1-555-1201", "Austin", "USA"),
                ("newbie2@yahoo.com", "Zoe", "Davis", "Recent Graduate", "Recent graduate starting career and needing dependable transportation.", "+1-555-1202", "Seattle", "USA"),
                ("newbie3@outlook.com", "Alex", "Wilson", "Young Professional", "Young professional seeking stylish yet practical first car.", "+1-555-1203", "Chicago", "USA"),
                
                // Luxury Buyers
                ("luxury1@gmail.com", "Victoria", "Anderson", "Executive", "Corporate executive with preference for luxury and performance vehicles.", "+1-555-1301", "San Francisco", "USA"),
                ("luxury2@outlook.com", "Jonathan", "Taylor", "Entrepreneur", "Successful entrepreneur passionate about high-end automotive experiences.", "+1-555-1302", "Las Vegas", "USA"),
                ("luxury3@yahoo.com", "Stephanie", "Thomas", "Investment Banker", "Investment banker seeking prestige and performance in vehicle selection.", "+1-555-1303", "Boston", "USA"),
                
                // Eco-Conscious Users
                ("eco1@gmail.com", "Nathan", "Green", "Environmental Advocate", "Environmental advocate promoting sustainable transportation solutions.", "+1-555-1401", "Portland", "USA"),
                ("eco2@outlook.com", "Rachel", "Martinez", "Sustainability Consultant", "Sustainability consultant specializing in green transportation initiatives.", "+1-555-1402", "San Diego", "USA"),
                ("eco3@gmail.com", "Brandon", "Clark", "Renewable Energy Engineer", "Engineer working on renewable energy solutions for automotive industry.", "+1-555-1403", "Austin", "USA"),
                
                // International Users
                ("intl1@gmail.com", "Hiroshi", "Tanaka", "Automotive Engineer", "Automotive engineer from Tokyo sharing insights on Japanese car culture.", "+81-3-1234-5678", "Tokyo", "Japan"),
                ("intl2@outlook.com", "Elena", "Mueller", "Car Journalist", "European automotive journalist covering luxury and performance vehicles.", "+49-30-1234567", "Berlin", "Germany"),
                ("intl3@yahoo.com", "Alessandro", "Rossi", "Design Student", "Automotive design student passionate about Italian car heritage.", "+39-02-12345678", "Milan", "Italy"),
                ("intl4@gmail.com", "Sophie", "Dubois", "Racing Enthusiast", "French racing enthusiast and weekend track day participant.", "+33-1-23456789", "Paris", "France"),
                ("intl5@outlook.com", "James", "Mitchell", "Automotive Historian", "British automotive historian specializing in classic British marques.", "+44-20-12345678", "London", "UK"),
                
                // Diverse Age Groups
                ("senior1@gmail.com", "Robert", "Peterson", "Retired Engineer", "Retired automotive engineer sharing decades of industry experience.", "+1-555-1501", "Tampa", "USA"),
                ("senior2@yahoo.com", "Dorothy", "Williams", "Grandmother", "Grandmother of six looking for safe and comfortable transportation.", "+1-555-1502", "Phoenix", "USA"),
                ("young1@gmail.com", "Madison", "Lopez", "High School Student", "High school student dreaming of first car and learning about automotive basics.", "+1-555-1601", "Orlando", "USA"),
                ("young2@outlook.com", "Ethan", "Hill", "Apprentice Mechanic", "Young apprentice mechanic eager to learn and share automotive knowledge.", "+1-555-1602", "Nashville", "USA")
            };

            foreach (var (email, firstName, lastName, jobTitle, bio, phone, city, country) in regularUsers)
            {
                var status = Random.Shared.NextDouble() > 0.1 ? UserStatus.Active : UserStatus.Inactive;
                var lastLogin = status == UserStatus.Active ? 
                    DateTime.UtcNow.AddMinutes(-Random.Shared.Next(5, 1440)) : // Active users: 5 min to 24 hours ago
                    DateTime.UtcNow.AddDays(-Random.Shared.Next(7, 90)); // Inactive users: 1 week to 3 months ago

                await CreateRealisticUserAsync(email, firstName, lastName, "User123!", "User", 
                    status, jobTitle, bio, phone, city, country, status == UserStatus.Active, lastLogin);
            }
        }

        private async Task SeedInactiveUsersAsync()
        {
            var inactiveUsers = new[]
            {
                ("inactive1@gmail.com", "Mark", "Thompson", "Former User", "Previously active community member who has moved on.", "+1-555-2001", "Dallas", "USA"),
                ("inactive2@yahoo.com", "Susan", "Roberts", "Dormant Account", "Account created but never fully activated by user.", "+1-555-2002", "Philadelphia", "USA"),
                ("suspended1@gmail.com", "John", "Troublemaker", "Suspended User", "User suspended for community guideline violations.", "+1-555-2101", "Cleveland", "USA"),
                ("suspended2@outlook.com", "Jane", "Spammer", "Banned User", "User banned for spam and inappropriate content.", "+1-555-2102", "Kansas City", "USA")
            };

            for (int i = 0; i < 2; i++)
            {
                var (email, firstName, lastName, jobTitle, bio, phone, city, country) = inactiveUsers[i];
                await CreateRealisticUserAsync(email, firstName, lastName, "Inactive123!", "User", 
                    UserStatus.Inactive, jobTitle, bio, phone, city, country, false, 
                    DateTime.UtcNow.AddDays(-Random.Shared.Next(90, 365)));
            }

            for (int i = 2; i < 4; i++)
            {
                var (email, firstName, lastName, jobTitle, bio, phone, city, country) = inactiveUsers[i];
                await CreateRealisticUserAsync(email, firstName, lastName, "Suspended123!", "User", 
                    UserStatus.Suspended, jobTitle, bio, phone, city, country, false, 
                    DateTime.UtcNow.AddDays(-Random.Shared.Next(30, 180)));
            }
        }

        private async Task CreateRealisticUserAsync(
            string email, 
            string firstName, 
            string lastName, 
            string password, 
            string roleName, 
            UserStatus status,
            string jobTitle,
            string bio,
            string phoneNumber,
            string city,
            string country,
            bool isActive = true,
            DateTime? lastLogin = null)
        {
            var existingUser = await _userManager.FindByEmailAsync(email);
            if (existingUser != null)
            {
                _logger.LogWarning("User {Email} already exists, skipping...", email);
                return;
            }

            var createdDate = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 730)); // Created 1 day to 2 years ago
            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email,
                NormalizedUserName = email.ToUpper(),
                NormalizedEmail = email.ToUpper(),
                FirstName = firstName,
                LastName = lastName,
                EmailConfirmed = true,
                PhoneNumber = phoneNumber,
                PhoneNumberConfirmed = Random.Shared.NextDouble() > 0.3,
                TwoFactorEnabled = Random.Shared.NextDouble() > 0.8, // 20% have 2FA enabled
                LockoutEnabled = true,
                AccessFailedCount = 0,
                CreatedAt = createdDate,
                LastLoginAt = lastLogin ?? (isActive ? DateTime.UtcNow.AddDays(-Random.Shared.Next(0, 7)) : null),
                IsActive = isActive,
                Status = status,
                Bio = bio,
                IsEmailPublic = Random.Shared.NextDouble() > 0.6,
                AllowDirectMessages = Random.Shared.NextDouble() > 0.2,
                ShowOnlineStatus = Random.Shared.NextDouble() > 0.3,
                ProfileImageUrl = Random.Shared.NextDouble() > 0.4 ? $"https://api.dicebear.com/7.x/avataaars/svg?seed={firstName}{lastName}" : null
            };

            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, roleName);
                _logger.LogInformation("Created realistic user: {Email} ({FirstName} {LastName}) with role: {Role}", 
                    email, firstName, lastName, roleName);
            }
            else
            {
                _logger.LogError("Failed to create user {Email}: {Errors}", email, 
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        private async Task SeedUserActivitiesAsync()
        {
            _logger.LogInformation("Seeding user activities...");

            var users = await _context.Users.Take(20).ToListAsync();
            var activities = new List<UserActivity>();

            foreach (var user in users)
            {
                // Generate 5-15 activities per user
                var activityCount = Random.Shared.Next(5, 16);
                for (int i = 0; i < activityCount; i++)
                {
                    var activityDate = DateTime.UtcNow.AddDays(-Random.Shared.Next(0, 90));
                    var activityType = GetRandomActivityType();
                    
                    activities.Add(new UserActivity
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        ActivityType = activityType,
                        Description = GetActivityDescription(activityType, user.FirstName),
                        IpAddress = GenerateRandomIpAddress(),
                        UserAgent = GetRandomUserAgent(),
                        CreatedAt = activityDate,
                        Metadata = GenerateActivityMetadata(activityType)
                    });
                }
            }

            await _context.UserActivities.AddRangeAsync(activities);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded {Count} user activities", activities.Count);
        }

        private async Task SeedUserSuspensionsAsync()
        {
            _logger.LogInformation("Seeding user suspensions...");

            var suspendedUsers = await _context.Users
                .Where(u => u.Status == UserStatus.Suspended)
                .ToListAsync();

            var suspensions = new List<UserSuspension>();

            foreach (var user in suspendedUsers)
            {
                var suspensionDate = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60));
                var duration = Random.Shared.Next(1, 30); // 1-30 days

                suspensions.Add(new UserSuspension
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    Reason = GetRandomSuspensionReasonEnum(),
                    SuspensionStart = suspensionDate,
                    SuspensionEnd = suspensionDate.AddDays(duration),
                    IsActive = true,
                    SuspendedByUserId = await GetRandomAdminIdAsync(),
                    Notes = "Automated suspension for policy violation. User notified via email.",
                    CreatedAt = suspensionDate
                });
            }

            await _context.UserSuspensions.AddRangeAsync(suspensions);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Seeded {Count} user suspensions", suspensions.Count);
        }

        private async Task SeedUserStatisticsAsync()
        {
            _logger.LogInformation("User statistics seeding skipped - using computed properties from navigation collections");
            // Note: User statistics like PostCount, CommentCount, etc. are computed from navigation properties
            // and don't need to be seeded directly
        }

        private UserActivityType GetRandomActivityType()
        {
            var types = Enum.GetValues<UserActivityType>();
            return types[Random.Shared.Next(types.Length)];
        }

        private string GetActivityDescription(UserActivityType activityType, string firstName)
        {
            return activityType switch
            {
                UserActivityType.Login => $"{firstName} logged into the platform",
                UserActivityType.Logout => $"{firstName} logged out of the platform",
                UserActivityType.ProfileUpdate => $"{firstName} updated their profile information",
                UserActivityType.PasswordChange => $"{firstName} changed their password",
                UserActivityType.PostCreated => $"{firstName} created a new post",
                UserActivityType.CommentAdded => $"{firstName} added a comment",
                UserActivityType.LikeGiven => $"{firstName} liked content",
                UserActivityType.MessageSent => $"{firstName} sent a message",
                UserActivityType.GroupJoined => $"{firstName} joined a group",
                UserActivityType.SettingsChanged => $"{firstName} updated account settings",
                _ => $"{firstName} performed an action"
            };
        }

        private string GenerateRandomIpAddress()
        {
            return $"{Random.Shared.Next(1, 255)}.{Random.Shared.Next(1, 255)}.{Random.Shared.Next(1, 255)}.{Random.Shared.Next(1, 255)}";
        }

        private string GetRandomUserAgent()
        {
            var userAgents = new[]
            {
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
                "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
                "Mozilla/5.0 (Android 14; Mobile; rv:120.0) Gecko/120.0 Firefox/120.0"
            };
            return userAgents[Random.Shared.Next(userAgents.Length)];
        }

        private string GenerateActivityMetadata(UserActivityType activityType)
        {
            return activityType switch
            {
                UserActivityType.Login => $"{{\"device\":\"Desktop\",\"location\":\"New York, USA\"}}",
                UserActivityType.PostCreated => $"{{\"postId\":\"{Guid.NewGuid()}\",\"category\":\"General\"}}",
                UserActivityType.CommentAdded => $"{{\"commentId\":\"{Guid.NewGuid()}\",\"postId\":\"{Guid.NewGuid()}\"}}",
                UserActivityType.LikeGiven => $"{{\"targetId\":\"{Guid.NewGuid()}\",\"targetType\":\"Post\"}}",
                UserActivityType.GroupJoined => $"{{\"groupId\":\"{Guid.NewGuid()}\",\"groupName\":\"Car Enthusiasts\"}}",
                _ => "{}"
            };
        }

        private SuspensionReason GetRandomSuspensionReasonEnum()
        {
            var reasons = Enum.GetValues<SuspensionReason>();
            return reasons[Random.Shared.Next(reasons.Length)];
        }

        private async Task<Guid> GetRandomAdminIdAsync()
        {
            var admin = await _context.Users
                .Where(u => u.UserRoles.Any(ur => ur.Role.Name == "Admin" || ur.Role.Name == "SuperAdmin"))
                .FirstOrDefaultAsync();
            
            return admin?.Id ?? Guid.NewGuid();
        }
    }
}
