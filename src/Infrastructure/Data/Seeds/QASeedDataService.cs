using Domain.Entities.Community.QA;
using Domain.Entities.Identity;
using Domain.Enums.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Infrastructure.Data.Seeds
{
    public class QASeedDataService
    {
        private readonly ILogger<QASeedDataService> _logger;
        private readonly ApplicationDbContext _context;
        private readonly Random _random = new();

        public QASeedDataService(ILogger<QASeedDataService> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task SeedAllQADataAsync()
        {
            _logger.LogInformation("Starting comprehensive QA system seeding...");

            try
            {
                await SeedQACategoriesAsync();
                await SeedQATagsAsync();
                await SeedQuestionsAsync();
                await SeedAnswersAsync();
                await SeedVotingDataAsync();
                await SeedUserReputationAsync();
                await SeedExpertProfilesAsync();
                await SeedAnalyticsDataAsync();
                await SeedUserActivityAsync();

                await _context.SaveChangesAsync();
                _logger.LogInformation("QA system seeding completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during QA system seeding: {Message}", ex.Message);
                throw;
            }
        }

        private async Task SeedQACategoriesAsync()
        {
            _logger.LogInformation("Seeding QA categories...");

            if (await _context.QuestionCategories.AnyAsync())
            {
                _logger.LogInformation("Question categories already exist, skipping...");
                return;
            }

            var categories = new[]
            {
                new QuestionCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Web Development",
                    Description = "Frontend and backend web development questions",
                    IconUrl = "/icons/web-dev.svg",
                    Color = "#3B82F6",
                    QuestionsCount = 0,
                    SortOrder = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-365),
                    CreatedBy = "System"
                },
                new QuestionCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Mobile Development",
                    Description = "iOS, Android, and cross-platform mobile development",
                    IconUrl = "/icons/mobile-dev.svg",
                    Color = "#10B981",
                    QuestionsCount = 0,
                    SortOrder = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-350),
                    CreatedBy = "System"
                },
                new QuestionCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Database Design",
                    Description = "SQL, NoSQL, database architecture and optimization",
                    IconUrl = "/icons/database.svg",
                    Color = "#8B5CF6",
                    QuestionsCount = 0,
                    SortOrder = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-340),
                    CreatedBy = "System"
                },
                new QuestionCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "DevOps & Cloud",
                    Description = "CI/CD, containerization, cloud platforms",
                    IconUrl = "/icons/devops.svg",
                    Color = "#F59E0B",
                    QuestionsCount = 0,
                    SortOrder = 4,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-330),
                    CreatedBy = "System"
                },
                new QuestionCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Data Science",
                    Description = "Machine learning, analytics, data processing",
                    IconUrl = "/icons/data-science.svg",
                    Color = "#EF4444",
                    QuestionsCount = 0,
                    SortOrder = 5,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-320),
                    CreatedBy = "System"
                },
                new QuestionCategory
                {
                    Id = Guid.NewGuid(),
                    Name = "Cybersecurity",
                    Description = "Security best practices, vulnerability assessment",
                    IconUrl = "/icons/security.svg",
                    Color = "#6B7280",
                    QuestionsCount = 0,
                    SortOrder = 6,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-310),
                    CreatedBy = "System"
                }
            };

            _context.QuestionCategories.AddRange(categories);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Created {Count} question categories", categories.Length);
        }
        private async Task SeedQATagsAsync()
        {
            _logger.LogInformation("Seeding QA tags...");

            if (await _context.QATags.AnyAsync())
            {
                _logger.LogInformation("QA tags already exist, skipping...");
                return;
            }

            var categories = await _context.QuestionCategories.ToListAsync();
            var webDevCategory = categories.FirstOrDefault(c => c.Name == "Web Development");
            var mobileDevCategory = categories.FirstOrDefault(c => c.Name == "Mobile Development");
            var databaseCategory = categories.FirstOrDefault(c => c.Name == "Database Design");
            var devopsCategory = categories.FirstOrDefault(c => c.Name == "DevOps & Cloud");
            var dataScienceCategory = categories.FirstOrDefault(c => c.Name == "Data Science");

            var tags = new[]
            {
                // Web Development Tags
                new QATag { Id = Guid.NewGuid(), Name = "javascript", Description = "JavaScript programming language", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-300), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "react", Description = "React.js frontend framework", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-295), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "nodejs", Description = "Node.js backend runtime", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-290), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "typescript", Description = "TypeScript programming language", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-285), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "angular", Description = "Angular frontend framework", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-280), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "aspnet-core", Description = "ASP.NET Core framework", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-275), CreatedBy = "System" },
                
                // Database Tags
                new QATag { Id = Guid.NewGuid(), Name = "sql-server", Description = "Microsoft SQL Server database", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-270), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "entity-framework", Description = "Entity Framework ORM", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-265), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "mongodb", Description = "MongoDB NoSQL database", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-260), CreatedBy = "System" },
                
                // DevOps Tags
                new QATag { Id = Guid.NewGuid(), Name = "docker", Description = "Docker containerization", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-255), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "azure", Description = "Microsoft Azure cloud platform", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-250), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "kubernetes", Description = "Kubernetes container orchestration", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-245), CreatedBy = "System" },
                
                // Data Science Tags
                new QATag { Id = Guid.NewGuid(), Name = "python", Description = "Python programming language", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-240), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "machine-learning", Description = "Machine learning algorithms and techniques", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-235), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "data-analysis", Description = "Data analysis and visualization", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-230), CreatedBy = "System" },
                
                // Mobile Development Tags
                new QATag { Id = Guid.NewGuid(), Name = "ios", Description = "iOS mobile development", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-225), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "android", Description = "Android mobile development", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-220), CreatedBy = "System" },
                new QATag { Id = Guid.NewGuid(), Name = "flutter", Description = "Flutter cross-platform framework", UsageCount = 0, CategoryId = null, CreatedAt = DateTime.UtcNow.AddDays(-215), CreatedBy = "System" }
            };

            _context.QATags.AddRange(tags);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Created {Count} QA tags", tags.Length);
        }
        private async Task SeedQuestionsAsync()
        {
            _logger.LogInformation("Seeding questions...");

            if (await _context.Questions.AnyAsync())
            {
                _logger.LogInformation("Questions already exist, skipping...");
                return;
            }

            var users = await _context.Users.ToListAsync();
            var categories = await _context.QuestionCategories.ToListAsync();
            var tags = await _context.QATags.ToListAsync();

            if (!users.Any() || !categories.Any())
            {
                _logger.LogWarning("No users or categories found, skipping question seeding");
                return;
            }

            var sampleQuestions = new[]
            {
                new { Title = "How to implement JWT authentication in ASP.NET Core 9?", Content = "I'm building a new web API using ASP.NET Core 9 and need to implement JWT token-based authentication. I want to understand the best practices for:\n\n1. Token generation and validation\n2. Refresh token implementation\n3. Role-based authorization\n4. Security considerations\n\nI've looked at the Microsoft documentation but would appreciate real-world examples and common pitfalls to avoid.", Category = "Web Development", TagNames = new[] { "aspnet-core", "javascript", "typescript" } },
                
                new { Title = "Best practices for React state management in large applications?", Content = "Our React application is growing and we're experiencing state management issues. We're currently using useState and useContext, but considering:\n\n- Redux Toolkit\n- Zustand\n- Jotai\n- React Query for server state\n\nWhat are the trade-offs and when should we choose each approach? Looking for guidance based on team size (8 developers) and app complexity (50+ components).", Category = "Web Development", TagNames = new[] { "react", "javascript", "typescript" } },
                
                new { Title = "SQL Server performance optimization for large datasets?", Content = "Working with a SQL Server database containing 10M+ records in the main table. Queries are becoming slow (5+ seconds). Current issues:\n\n- Complex JOIN operations across 6 tables\n- Full table scans on filtered queries\n- Index fragmentation\n- Blocking and deadlocks during peak hours\n\nWhat systematic approach should I take to identify and resolve these performance bottlenecks?", Category = "Database Design", TagNames = new[] { "sql-server", "entity-framework" } },
                
                new { Title = "Docker multi-stage builds for .NET applications?", Content = "I want to optimize my Docker images for .NET applications. Currently using a simple Dockerfile but the images are 800MB+.\n\nQuestions:\n1. How to implement multi-stage builds effectively?\n2. Best base images for .NET 9 applications?\n3. Security scanning and vulnerability management?\n4. CI/CD integration with Azure DevOps?\n\nLooking for a complete example with explanations.", Category = "DevOps & Cloud", TagNames = new[] { "docker", "azure" } },
                
                new { Title = "Machine Learning model deployment on Azure?", Content = "I've trained a Python-based ML model for image classification and need to deploy it to production. Considering Azure ML Studio vs Azure Container Instances vs Azure Functions.\n\nRequirements:\n- Handle 1000+ requests per day\n- Low latency (< 2 seconds)\n- Cost-effective\n- Easy monitoring and logging\n\nWhat's the best approach for this use case?", Category = "Data Science", TagNames = new[] { "python", "machine-learning", "azure" } }
            };

            var questions = new List<Question>();

            // Create the sample questions
            foreach (var sample in sampleQuestions)
            {
                var category = categories.FirstOrDefault(c => c.Name == sample.Category);
                var user = users[_random.Next(users.Count)];
                var questionTags = tags.Where(t => sample.TagNames.Contains(t.Name)).ToList();

                var question = new Question
                {
                    Id = Guid.NewGuid(),
                    Title = sample.Title,
                    Content = sample.Content,
                    Status = QuestionStatus.Open,
                    Priority = QuestionPriority.Normal,
                    ViewsCount = _random.Next(50, 500),
                    UpvotesCount = _random.Next(5, 25),
                    DownvotesCount = _random.Next(0, 3),
                    AnswersCount = 0, // Will be updated when answers are added
                    HasAcceptedAnswer = false,
                    Tags = JsonSerializer.Serialize(questionTags.Select(t => t.Name).ToArray()),
                    BountyAmount = _random.Next(10) > 7 ? _random.Next(50, 200) : 0,
                    UserId = user.Id,
                    CategoryId = category?.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-_random.Next(1, 30)),
                    CreatedBy = user.Id.ToString()
                };

                questions.Add(question);
            }

            // Generate additional random questions
            var questionTemplates = new[]
            {
                "How to optimize {0} performance in {1}?",
                "Best practices for {0} development with {1}?",
                "Troubleshooting {0} issues in {1} environment?",
                "Integration between {0} and {1} - need advice",
                "Security considerations when using {0} with {1}?",
                "Deployment strategies for {0} applications on {1}?",
                "Testing approaches for {0} projects using {1}?",
                "Error handling patterns in {0} with {1}?",
                "Scaling {0} applications - {1} vs alternatives?",
                "Migration from legacy {0} to modern {1} stack?"
            };

            var contentTemplates = new[]
            {
                "I'm working on a project that involves {0} and {1}. I've encountered some challenges and would appreciate guidance from the community.",
                "Our team is evaluating {0} for our {1} project. What are the pros and cons we should consider?",
                "I've been using {0} with {1} but facing performance issues. Any suggestions for optimization?",
                "Looking for best practices when implementing {0} in a {1} environment. What should I avoid?",
                "Need help with {0} configuration for {1}. The documentation is unclear on this specific use case.",
                "Comparing different approaches for {0} in {1}. What has worked well for your team?",
                "Debugging {0} issues in {1} - what tools and techniques do you recommend?",
                "Planning to migrate from {0} to {1}. What challenges should I expect?",
                "Security review flagged concerns with our {0} and {1} setup. How to address them?",
                "Performance bottleneck in {0} when integrated with {1}. Any optimization tips?"
            };

            for (int i = 0; i < 45; i++) // Create 45 more questions to reach 50 total
            {
                var category = categories[_random.Next(categories.Count)];
                var user = users[_random.Next(users.Count)];
                var categoryTags = tags.Where(t => t.CategoryId == category.Id).ToList();
                var selectedTags = categoryTags.OrderBy(x => _random.Next()).Take(_random.Next(1, 4)).ToList();

                var tech1 = selectedTags.FirstOrDefault()?.Name ?? "technology";
                var tech2 = selectedTags.Skip(1).FirstOrDefault()?.Name ?? category.Name;

                var titleTemplate = questionTemplates[_random.Next(questionTemplates.Length)];
                var contentTemplate = contentTemplates[_random.Next(contentTemplates.Length)];

                var question = new Question
                {
                    Id = Guid.NewGuid(),
                    Title = string.Format(titleTemplate, tech1, tech2),
                    Content = string.Format(contentTemplate, tech1, tech2),
                    Status = _random.Next(10) > 1 ? QuestionStatus.Open : QuestionStatus.Closed,
                    Priority = (QuestionPriority)_random.Next(0, 3),
                    ViewsCount = _random.Next(10, 1000),
                    UpvotesCount = _random.Next(0, 50),
                    DownvotesCount = _random.Next(0, 5),
                    AnswersCount = 0,
                    HasAcceptedAnswer = false,
                    Tags = JsonSerializer.Serialize(selectedTags.Select(t => t.Name).ToArray()),
                    BountyAmount = _random.Next(20) > 17 ? _random.Next(25, 150) : 0,
                    UserId = user.Id,
                    CategoryId = category.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-_random.Next(1, 180)),
                    CreatedBy = user.Id.ToString()
                };

                questions.Add(question);
            }

            _context.Questions.AddRange(questions);
            await _context.SaveChangesAsync();

            // Create QuestionTag relationships
            foreach (var question in questions)
            {
                if (!string.IsNullOrEmpty(question.Tags))
                {
                    var tagNames = JsonSerializer.Deserialize<string[]>(question.Tags) ?? Array.Empty<string>();
                    foreach (var tagName in tagNames)
                    {
                        var tag = tags.FirstOrDefault(t => t.Name == tagName);
                        if (tag != null)
                        {
                            _context.QuestionTags.Add(new QuestionTag
                            {
                                QuestionId = question.Id,
                                TagId = tag.Id
                            });
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Created {Count} questions with tag relationships", questions.Count);
        }
        private async Task SeedAnswersAsync()
        {
            _logger.LogInformation("Seeding answers...");

            if (await _context.Answers.AnyAsync())
            {
                _logger.LogInformation("Answers already exist, skipping...");
                return;
            }

            var users = await _context.Users.ToListAsync();
            var questions = await _context.Questions.ToListAsync();

            if (!users.Any() || !questions.Any())
            {
                _logger.LogWarning("No users or questions found, skipping answer seeding");
                return;
            }

            var highQualityAnswers = new[]
            {
                @"Here's a comprehensive approach to implementing JWT authentication in ASP.NET Core 9:

## 1. JWT Token Generation

```csharp
public class JwtTokenService
{
    private readonly IConfiguration _configuration;
    
    public string GenerateToken(ApplicationUser user, IList<string> roles)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration[""Jwt:Secret""]);
        
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(15), // Short-lived access token
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
```

## 2. Security Best Practices

1. **Use HTTPS only** in production
2. **Short-lived access tokens** (15 minutes)
3. **Secure refresh token storage** (HttpOnly cookies)
4. **Token rotation** on refresh
5. **Rate limiting** on auth endpoints

This approach provides a secure, scalable authentication system. Let me know if you need clarification on any part!",

                @"For a team of 8 developers with 50+ components, here's my recommendation based on 5 years of React experience:

## Decision Matrix

| Solution | Learning Curve | Boilerplate | DevTools | Team Size Fit |
|----------|---------------|-------------|----------|---------------|
| Redux Toolkit | Medium | Low | Excellent | Perfect |
| Zustand | Low | Very Low | Good | Good |
| Jotai | Medium | Low | Good | Medium |
| React Query | Low | Very Low | Excellent | Perfect |

## My Recommendation: Redux Toolkit + React Query

### Why Redux Toolkit?
- **Predictable state updates** - crucial for team collaboration
- **Excellent DevTools** - time-travel debugging saves hours
- **Mature ecosystem** - extensive middleware and tooling
- **Team scalability** - clear patterns everyone can follow

```typescript
// store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  currentUser: User | null
  preferences: UserPreferences
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    }
  }
})
```

### Why React Query for Server State?
- **Automatic caching** and background updates
- **Optimistic updates** for better UX
- **Error handling** and retry logic built-in

This hybrid approach gives you the best of both worlds without over-engineering.",

                @"Here's a systematic approach to SQL Server performance optimization:

## 1. Identify the Problem

```sql
-- Find slow queries
SELECT TOP 10 
    qs.total_elapsed_time / qs.execution_count AS avg_elapsed_time,
    qs.total_logical_reads / qs.execution_count AS avg_logical_reads,
    qs.execution_count,
    SUBSTRING(qt.text, qs.statement_start_offset/2+1, 
        (CASE WHEN qs.statement_end_offset = -1 
         THEN LEN(CONVERT(nvarchar(max), qt.text)) * 2 
         ELSE qs.statement_end_offset END - qs.statement_start_offset)/2) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY avg_elapsed_time DESC
```

## 2. Index Optimization

1. **Missing Index Analysis**
2. **Index Fragmentation Check**
3. **Unused Index Removal**
4. **Covering Indexes** for frequent queries

## 3. Query Optimization

- Use **SARGABLE** predicates
- Avoid **SELECT *** 
- Implement proper **JOIN** order
- Use **EXISTS** instead of **IN** for large datasets

## 4. Blocking and Deadlocks

```sql
-- Monitor blocking
SELECT 
    blocking_session_id,
    session_id,
    wait_type,
    wait_time,
    wait_resource
FROM sys.dm_exec_requests
WHERE blocking_session_id <> 0
```

Start with query analysis, then move to indexing strategy. Happy to dive deeper into any specific area!"
            };

            var answers = new List<Answer>();
            var answerIndex = 0;

            // Add high-quality answers to the first few questions
            foreach (var question in questions.Take(3))
            {
                if (answerIndex < highQualityAnswers.Length)
                {
                    var user = users[_random.Next(users.Count)];
                    var answer = new Answer
                    {
                        Id = Guid.NewGuid(),
                        Content = highQualityAnswers[answerIndex],
                        Status = AnswerStatus.Active,
                        UpvotesCount = _random.Next(10, 30),
                        DownvotesCount = _random.Next(0, 2),
                        IsAccepted = _random.Next(3) == 0, // 33% chance of being accepted
                        AcceptedAt = _random.Next(3) == 0 ? DateTime.UtcNow.AddDays(-_random.Next(1, 10)) : null,
                        IsVerified = _random.Next(5) == 0, // 20% chance of being verified
                        VerificationSource = _random.Next(5) == 0 ? "Expert Review" : null,
                        QuestionId = question.Id,
                        UserId = user.Id,
                        CreatedAt = question.CreatedAt.AddHours(_random.Next(1, 48)),
                        CreatedBy = user.Id.ToString()
                    };
                    answers.Add(answer);
                    answerIndex++;
                }
            }

            // Generate additional answers for other questions
            var answerTemplates = new[]
            {
                "I've encountered a similar issue before. Here's what worked for me:\n\n{0}\n\nHope this helps! Let me know if you need more details.",
                "Great question! I've been working with this technology for a while. Here are my recommendations:\n\n{0}\n\nFeel free to ask if you need clarification on any point.",
                "I had the exact same problem last month. After some research and testing, I found that:\n\n{0}\n\nThis approach has been working well in production for us.",
                "Based on my experience with similar projects:\n\n{0}\n\nI'd recommend starting with this approach and then optimizing based on your specific needs.",
                "This is a common challenge. Here's a step-by-step solution:\n\n{0}\n\nMake sure to test thoroughly in your environment before deploying to production."
            };

            var solutionSnippets = new[]
            {
                "1. Check your configuration settings\n2. Update to the latest version\n3. Clear cache and restart the service\n4. Monitor performance metrics",
                "• Use proper error handling\n• Implement logging for debugging\n• Follow security best practices\n• Test with realistic data volumes",
                "The key is to:\n- Understand the root cause\n- Apply the appropriate pattern\n- Validate the solution\n- Document for future reference",
                "Consider these factors:\n→ Performance requirements\n→ Scalability needs\n→ Maintenance overhead\n→ Team expertise",
                "Here's what I'd suggest:\n\nFirst, analyze your current setup.\nThen, implement the changes gradually.\nFinally, measure the impact and adjust as needed."
            };

            // Add answers to remaining questions (aim for ~3 answers per question on average)
            foreach (var question in questions.Skip(3))
            {
                var answerCount = _random.Next(1, 6); // 1-5 answers per question
                for (int i = 0; i < answerCount; i++)
                {
                    var user = users[_random.Next(users.Count)];
                    var template = answerTemplates[_random.Next(answerTemplates.Length)];
                    var snippet = solutionSnippets[_random.Next(solutionSnippets.Length)];
                    
                    var answer = new Answer
                    {
                        Id = Guid.NewGuid(),
                        Content = string.Format(template, snippet),
                        Status = AnswerStatus.Active,
                        UpvotesCount = _random.Next(0, 15),
                        DownvotesCount = _random.Next(0, 3),
                        IsAccepted = i == 0 && _random.Next(4) == 0, // First answer has 25% chance of acceptance
                        AcceptedAt = i == 0 && _random.Next(4) == 0 ? DateTime.UtcNow.AddDays(-_random.Next(1, 5)) : null,
                        IsVerified = _random.Next(10) == 0, // 10% chance of verification
                        VerificationSource = _random.Next(10) == 0 ? "Community Review" : null,
                        QuestionId = question.Id,
                        UserId = user.Id,
                        CreatedAt = question.CreatedAt.AddHours(_random.Next(1, 72)),
                        CreatedBy = user.Id.ToString()
                    };
                    answers.Add(answer);
                }
            }

            _context.Answers.AddRange(answers);
            await _context.SaveChangesAsync();

            // Update question answer counts and accepted answer IDs
            foreach (var question in questions)
            {
                var questionAnswers = answers.Where(a => a.QuestionId == question.Id).ToList();
                question.AnswersCount = questionAnswers.Count;
                
                var acceptedAnswer = questionAnswers.FirstOrDefault(a => a.IsAccepted);
                if (acceptedAnswer != null)
                {
                    question.HasAcceptedAnswer = true;
                    question.AcceptedAnswerId = acceptedAnswer.Id;
                }
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Created {Count} answers", answers.Count);
        }
        private async Task SeedVotingDataAsync()
        {
            _logger.LogInformation("Seeding voting data...");

            if (await _context.QAVotes.AnyAsync())
            {
                _logger.LogInformation("QA votes already exist, skipping...");
                return;
            }

            var users = await _context.Users.ToListAsync();
            var questions = await _context.Questions.ToListAsync();
            var answers = await _context.Answers.ToListAsync();

            if (!users.Any() || (!questions.Any() && !answers.Any()))
            {
                _logger.LogWarning("No users or content found, skipping voting data seeding");
                return;
            }

            var votes = new List<QAVote>();

            // Vote on questions
            foreach (var question in questions)
            {
                var voterCount = Math.Min(_random.Next(1, 15), users.Count);
                var voters = users.OrderBy(x => _random.Next()).Take(voterCount).ToList();

                foreach (var voter in voters)
                {
                    // Prevent self-voting
                    if (voter.Id == question.UserId) continue;

                    var voteType = _random.Next(10) > 1 ? VoteType.Upvote : VoteType.Downvote; // 90% upvotes
                    
                    votes.Add(new QAVote
                    {
                        Id = Guid.NewGuid(),
                        UserId = voter.Id,
                        ContentId = question.Id,
                        ContentType = "Question",
                        VoteType = voteType,
                        CreatedAt = question.CreatedAt.AddHours(_random.Next(1, 48)),
                        CreatedBy = voter.Id.ToString()
                    });
                }
            }

            // Vote on answers
            foreach (var answer in answers)
            {
                var voterCount = Math.Min(_random.Next(1, 12), users.Count);
                var voters = users.OrderBy(x => _random.Next()).Take(voterCount).ToList();

                foreach (var voter in voters)
                {
                    // Prevent self-voting
                    if (voter.Id == answer.UserId) continue;

                    var voteType = _random.Next(10) > 2 ? VoteType.Upvote : VoteType.Downvote; // 80% upvotes
                    
                    votes.Add(new QAVote
                    {
                        Id = Guid.NewGuid(),
                        UserId = voter.Id,
                        ContentId = answer.Id,
                        ContentType = "Answer",
                        VoteType = voteType,
                        CreatedAt = answer.CreatedAt.AddHours(_random.Next(1, 24)),
                        CreatedBy = voter.Id.ToString()
                    });
                }
            }

            _context.QAVotes.AddRange(votes);
            await _context.SaveChangesAsync();

            // Update vote counts on questions and answers
            foreach (var question in questions)
            {
                var questionVotes = votes.Where(v => v.ContentId == question.Id && v.ContentType == "Question").ToList();
                question.UpvotesCount = questionVotes.Count(v => v.VoteType == VoteType.Upvote);
                question.DownvotesCount = questionVotes.Count(v => v.VoteType == VoteType.Downvote);
            }

            foreach (var answer in answers)
            {
                var answerVotes = votes.Where(v => v.ContentId == answer.Id && v.ContentType == "Answer").ToList();
                answer.UpvotesCount = answerVotes.Count(v => v.VoteType == VoteType.Upvote);
                answer.DownvotesCount = answerVotes.Count(v => v.VoteType == VoteType.Downvote);
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Created {Count} votes", votes.Count);
        }
        private async Task SeedUserReputationAsync()
        {
            _logger.LogInformation("Seeding user reputation data...");

            if (await _context.UserReputations.AnyAsync())
            {
                _logger.LogInformation("User reputation data already exists, skipping...");
                return;
            }

            var users = await _context.Users.ToListAsync();
            var questions = await _context.Questions.ToListAsync();
            var answers = await _context.Answers.ToListAsync();
            var votes = await _context.QAVotes.ToListAsync();

            if (!users.Any())
            {
                _logger.LogWarning("No users found, skipping reputation seeding");
                return;
            }

            var reputations = new List<UserReputation>();
            var badgeTypes = new[] { "Contributor", "Helpful", "Knowledgeable", "Expert", "Great Answer", "Popular Question", "Scholar", "Teacher" };
            var expertiseAreas = new[] { "Web Development", "Mobile Development", "Database Design", "DevOps & Cloud", "Data Science", "Cybersecurity" };

            foreach (var user in users)
            {
                var userQuestions = questions.Where(q => q.UserId == user.Id).ToList();
                var userAnswers = answers.Where(a => a.UserId == user.Id).ToList();
                var userAcceptedAnswers = userAnswers.Where(a => a.IsAccepted).ToList();

                // Calculate reputation based on activity
                var upvotesReceived = 0;
                var downvotesReceived = 0;

                // Count votes on user's questions
                foreach (var question in userQuestions)
                {
                    var questionVotes = votes.Where(v => v.ContentId == question.Id && v.ContentType == "Question").ToList();
                    upvotesReceived += questionVotes.Count(v => v.VoteType == VoteType.Upvote);
                    downvotesReceived += questionVotes.Count(v => v.VoteType == VoteType.Downvote);
                }

                // Count votes on user's answers
                foreach (var answer in userAnswers)
                {
                    var answerVotes = votes.Where(v => v.ContentId == answer.Id && v.ContentType == "Answer").ToList();
                    upvotesReceived += answerVotes.Count(v => v.VoteType == VoteType.Upvote);
                    downvotesReceived += answerVotes.Count(v => v.VoteType == VoteType.Downvote);
                }

                // Calculate reputation score
                var reputationScore = (upvotesReceived * 10) + (userAcceptedAnswers.Count * 25) + (userQuestions.Count * 2) - (downvotesReceived * 2);
                reputationScore = Math.Max(0, reputationScore); // Ensure non-negative

                // Determine badges based on activity
                var earnedBadges = new List<string>();
                if (userQuestions.Count > 0) earnedBadges.Add("Contributor");
                if (userAnswers.Count >= 5) earnedBadges.Add("Helpful");
                if (userAcceptedAnswers.Count >= 3) earnedBadges.Add("Knowledgeable");
                if (reputationScore >= 1000) earnedBadges.Add("Expert");
                if (userAnswers.Any(a => a.UpvotesCount >= 10)) earnedBadges.Add("Great Answer");
                if (userQuestions.Any(q => q.ViewsCount >= 100)) earnedBadges.Add("Popular Question");
                if (userQuestions.Count >= 10) earnedBadges.Add("Scholar");
                if (userAnswers.Count >= 10) earnedBadges.Add("Teacher");

                // Determine expertise areas based on question/answer categories
                var userExpertise = new List<string>();
                var userCategories = userQuestions.Where(q => q.CategoryId.HasValue)
                    .Select(q => q.CategoryId.Value)
                    .Concat(userAnswers.Where(a => a.Question?.CategoryId.HasValue == true)
                        .Select(a => a.Question.CategoryId.Value))
                    .Distinct()
                    .ToList();

                var categories = await _context.QuestionCategories.Where(c => userCategories.Contains(c.Id)).ToListAsync();
                userExpertise.AddRange(categories.Select(c => c.Name));

                // Add some random expertise for variety
                if (!userExpertise.Any() && _random.Next(3) == 0)
                {
                    userExpertise.Add(expertiseAreas[_random.Next(expertiseAreas.Length)]);
                }

                var reputation = new UserReputation
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    ReputationScore = reputationScore,
                    QuestionsAsked = userQuestions.Count,
                    AnswersGiven = userAnswers.Count,
                    AcceptedAnswers = userAcceptedAnswers.Count,
                    UpvotesReceived = upvotesReceived,
                    DownvotesReceived = downvotesReceived,
                    BadgesEarned = earnedBadges.Any() ? JsonSerializer.Serialize(earnedBadges.ToArray()) : null,
                    ExpertiseAreas = userExpertise.Any() ? JsonSerializer.Serialize(userExpertise.ToArray()) : null,
                    LastUpdated = DateTime.UtcNow,
                    CreatedAt = user.CreatedAt,
                    CreatedBy = "System"
                };

                reputations.Add(reputation);
            }

            _context.UserReputations.AddRange(reputations);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Created {Count} user reputation records", reputations.Count);
        }
        private async Task SeedExpertProfilesAsync()
        {
            _logger.LogInformation("Seeding expert profiles...");

            if (await _context.QAExperts.AnyAsync())
            {
                _logger.LogInformation("Expert profiles already exist, skipping...");
                return;
            }

            var users = await _context.Users.ToListAsync();
            var categories = await _context.QuestionCategories.ToListAsync();
            var reputations = await _context.UserReputations.ToListAsync();
            var answers = await _context.Answers.ToListAsync();

            if (!users.Any() || !categories.Any())
            {
                _logger.LogWarning("No users or categories found, skipping expert profile seeding");
                return;
            }

            var experts = new List<QAExpert>();
            var expertiseLevels = new[] { "Beginner", "Intermediate", "Expert", "Master" };

            // Identify potential experts based on reputation and activity
            var highReputationUsers = reputations
                .Where(r => r.ReputationScore >= 500 || r.AnswersGiven >= 5)
                .OrderByDescending(r => r.ReputationScore)
                .Take(Math.Min(20, users.Count / 2)) // Up to 20 experts or half the users
                .ToList();

            foreach (var userReputation in highReputationUsers)
            {
                var user = users.FirstOrDefault(u => u.Id == userReputation.UserId);
                if (user == null) continue;

                // Determine expertise areas from user's reputation data
                var expertiseAreas = new List<string>();
                if (!string.IsNullOrEmpty(userReputation.ExpertiseAreas))
                {
                    try
                    {
                        expertiseAreas = JsonSerializer.Deserialize<string[]>(userReputation.ExpertiseAreas)?.ToList() ?? new List<string>();
                    }
                    catch
                    {
                        // If deserialization fails, assign random expertise
                        expertiseAreas.Add(categories[_random.Next(categories.Count)].Name);
                    }
                }

                // If no expertise areas found, assign based on activity or randomly
                if (!expertiseAreas.Any())
                {
                    var userAnswers = answers.Where(a => a.UserId == user.Id).ToList();
                    if (userAnswers.Any())
                    {
                        // Find categories where user has answered questions
                        var answeredCategories = userAnswers
                            .Where(a => a.Question?.CategoryId.HasValue == true)
                            .Select(a => a.Question.CategoryId.Value)
                            .Distinct()
                            .ToList();

                        var userCategories = categories.Where(c => answeredCategories.Contains(c.Id)).ToList();
                        expertiseAreas.AddRange(userCategories.Select(c => c.Name));
                    }

                    // Still no expertise? Assign randomly
                    if (!expertiseAreas.Any())
                    {
                        expertiseAreas.Add(categories[_random.Next(categories.Count)].Name);
                    }
                }

                // Create expert profiles for each expertise area
                foreach (var expertiseArea in expertiseAreas.Take(3)) // Limit to 3 areas per expert
                {
                    var category = categories.FirstOrDefault(c => c.Name == expertiseArea);
                    if (category == null) continue;

                    // Calculate expert metrics
                    var userAnswersInCategory = answers
                        .Where(a => a.UserId == user.Id && a.Question?.CategoryId == category.Id)
                        .ToList();

                    var acceptedAnswersInCategory = userAnswersInCategory.Where(a => a.IsAccepted).Count();
                    var totalAnswersInCategory = userAnswersInCategory.Count;
                    var averageRating = totalAnswersInCategory > 0 
                        ? Math.Round((decimal)userAnswersInCategory.Average(a => Math.Max(1, a.UpvotesCount - a.DownvotesCount + 3)), 2)
                        : 4.0m;

                    // Determine expertise level based on reputation and activity
                    var expertiseLevel = "Beginner";
                    if (userReputation.ReputationScore >= 2000 && acceptedAnswersInCategory >= 10)
                        expertiseLevel = "Master";
                    else if (userReputation.ReputationScore >= 1000 && acceptedAnswersInCategory >= 5)
                        expertiseLevel = "Expert";
                    else if (userReputation.ReputationScore >= 500 && totalAnswersInCategory >= 3)
                        expertiseLevel = "Intermediate";

                    // Calculate response rate (simulate based on activity level)
                    var responseRate = Math.Min(95m, Math.Max(30m, 
                        (decimal)(50 + (userReputation.ReputationScore / 50) + (totalAnswersInCategory * 5))));

                    var expert = new QAExpert
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        CategoryId = category.Id,
                        ExpertiseLevel = expertiseLevel,
                        AnswerCount = totalAnswersInCategory,
                        AcceptedAnswerCount = acceptedAnswersInCategory,
                        AverageRating = Math.Min(5.0m, Math.Max(1.0m, averageRating)),
                        ResponseRate = responseRate,
                        NotificationEnabled = _random.Next(10) > 2, // 80% have notifications enabled
                        CreatedAt = user.CreatedAt.AddDays(_random.Next(30, 180)),
                        CreatedBy = "System"
                    };

                    experts.Add(expert);
                }
            }

            // Add some additional experts for categories that don't have enough
            foreach (var category in categories)
            {
                var categoryExperts = experts.Where(e => e.CategoryId == category.Id).Count();
                if (categoryExperts < 2) // Ensure at least 2 experts per category
                {
                    var availableUsers = users
                        .Where(u => !experts.Any(e => e.UserId == u.Id && e.CategoryId == category.Id))
                        .OrderBy(x => _random.Next())
                        .Take(3 - categoryExperts)
                        .ToList();

                    foreach (var user in availableUsers)
                    {
                        var userReputation = reputations.FirstOrDefault(r => r.UserId == user.Id);
                        var reputationScore = userReputation?.ReputationScore ?? 0;

                        var expert = new QAExpert
                        {
                            Id = Guid.NewGuid(),
                            UserId = user.Id,
                            CategoryId = category.Id,
                            ExpertiseLevel = reputationScore >= 1000 ? "Expert" : 
                                           reputationScore >= 500 ? "Intermediate" : "Beginner",
                            AnswerCount = _random.Next(1, 8),
                            AcceptedAnswerCount = _random.Next(0, 3),
                            AverageRating = Math.Round((decimal)(_random.NextDouble() * 2 + 3), 2), // 3.0 - 5.0
                            ResponseRate = _random.Next(40, 90),
                            NotificationEnabled = _random.Next(10) > 3, // 70% have notifications enabled
                            CreatedAt = user.CreatedAt.AddDays(_random.Next(60, 300)),
                            CreatedBy = "System"
                        };

                        experts.Add(expert);
                    }
                }
            }

            _context.QAExperts.AddRange(experts);
            await _context.SaveChangesAsync();

            // Update category question counts will be done after questions are seeded
            // Note: QuestionCategory doesn't have ExpertCount property

            await _context.SaveChangesAsync();
            _logger.LogInformation("Created {Count} expert profiles across {CategoryCount} categories", 
                experts.Count, categories.Count);
        }
        private async Task SeedAnalyticsDataAsync()
        {
            _logger.LogInformation("Seeding analytics data...");

            if (await _context.QAAnalytics.AnyAsync())
            {
                _logger.LogInformation("QA analytics data already exists, skipping...");
                return;
            }

            var questions = await _context.Questions.ToListAsync();
            var answers = await _context.Answers.ToListAsync();
            var votes = await _context.QAVotes.ToListAsync();
            var categories = await _context.QuestionCategories.ToListAsync();

            if (!questions.Any() && !answers.Any())
            {
                _logger.LogWarning("No questions or answers found, skipping analytics seeding");
                return;
            }

            var analytics = new List<QAAnalytics>();
            var startDate = DateTime.UtcNow.AddDays(-90); // 90 days of analytics data

            for (var date = startDate.Date; date <= DateTime.UtcNow.Date; date = date.AddDays(1))
            {
                var questionsOnDate = questions.Where(q => q.CreatedAt.Date == date).ToList();
                var answersOnDate = answers.Where(a => a.CreatedAt.Date == date).ToList();
                var votesOnDate = votes.Where(v => v.CreatedAt.Date == date).ToList();
                var acceptedAnswersOnDate = answersOnDate.Where(a => a.IsAccepted && a.AcceptedAt?.Date == date).ToList();

                // Calculate unique users active on this date
                var uniqueUserIds = new HashSet<Guid>();
                questionsOnDate.ForEach(q => uniqueUserIds.Add(q.UserId));
                answersOnDate.ForEach(a => uniqueUserIds.Add(a.UserId));
                votesOnDate.ForEach(v => uniqueUserIds.Add(v.UserId));

                // Calculate average response time for questions answered on this date
                var averageResponseTime = 0;
                if (answersOnDate.Any())
                {
                    var responseTimes = new List<int>();
                    foreach (var answer in answersOnDate)
                    {
                        var question = questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                        if (question != null && question.CreatedAt != default)
                        {
                            var responseTimeMinutes = (int)(answer.CreatedAt - question.CreatedAt).TotalMinutes;
                            if (responseTimeMinutes > 0 && responseTimeMinutes < 10080) // Less than a week
                            {
                                responseTimes.Add(responseTimeMinutes);
                            }
                        }
                    }
                    
                    if (responseTimes.Any())
                    {
                        averageResponseTime = (int)responseTimes.Average();
                    }
                }

                // Determine top category for the day
                string? topCategory = null;
                if (questionsOnDate.Any())
                {
                    var categoryActivity = questionsOnDate
                        .Where(q => q.CategoryId.HasValue)
                        .GroupBy(q => q.CategoryId.Value)
                        .OrderByDescending(g => g.Count())
                        .FirstOrDefault();

                    if (categoryActivity != null)
                    {
                        var category = categories.FirstOrDefault(c => c.Id == categoryActivity.Key);
                        topCategory = category?.Name;
                    }
                }

                // If no questions on this date, use a random category based on overall activity
                if (topCategory == null && categories.Any())
                {
                    var weights = new Dictionary<string, int>
                    {
                        { "Web Development", 35 },
                        { "Database Design", 20 },
                        { "DevOps & Cloud", 15 },
                        { "Mobile Development", 15 },
                        { "Data Science", 10 },
                        { "Cybersecurity", 5 }
                    };

                    var randomValue = _random.Next(100);
                    var cumulativeWeight = 0;
                    foreach (var weight in weights)
                    {
                        cumulativeWeight += weight.Value;
                        if (randomValue < cumulativeWeight)
                        {
                            topCategory = weight.Key;
                            break;
                        }
                    }
                }

                var dailyAnalytics = new QAAnalytics
                {
                    Id = Guid.NewGuid(),
                    Date = date,
                    QuestionsAsked = questionsOnDate.Count,
                    QuestionsAnswered = questionsOnDate.Count(q => answersOnDate.Any(a => a.QuestionId == q.Id)),
                    AnswersAccepted = acceptedAnswersOnDate.Count,
                    TotalVotes = votesOnDate.Count,
                    UniqueUsers = uniqueUserIds.Count,
                    AverageResponseTime = averageResponseTime,
                    TopCategory = topCategory,
                    CreatedAt = date.AddHours(23).AddMinutes(59) // End of day
                };

                analytics.Add(dailyAnalytics);
            }

            _context.QAAnalytics.AddRange(analytics);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Created {Count} days of analytics data", analytics.Count);
        }

        private async Task SeedUserActivityAsync()
        {
            _logger.LogInformation("Seeding user activity data...");

            if (await _context.QAUserActivities.AnyAsync())
            {
                _logger.LogInformation("QA user activity data already exists, skipping...");
                return;
            }

            var questions = await _context.Questions.ToListAsync();
            var answers = await _context.Answers.ToListAsync();
            var votes = await _context.QAVotes.ToListAsync();
            var categories = await _context.QuestionCategories.ToListAsync();

            var activities = new List<QAUserActivity>();

            // Create activity records for questions
            foreach (var question in questions)
            {
                var category = categories.FirstOrDefault(c => c.Id == question.CategoryId);
                
                activities.Add(new QAUserActivity
                {
                    Id = Guid.NewGuid(),
                    UserId = question.UserId,
                    ActivityType = "QuestionAsked",
                    ContentId = question.Id,
                    Category = category?.Name,
                    ReputationChange = 2, // Base points for asking a question
                    CreatedAt = question.CreatedAt
                });
            }

            // Create activity records for answers
            foreach (var answer in answers)
            {
                var question = questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                var category = categories.FirstOrDefault(c => c.Id == question?.CategoryId);
                
                var reputationChange = 5; // Base points for answering
                if (answer.IsAccepted)
                {
                    reputationChange += 25; // Bonus for accepted answer
                }
                reputationChange += answer.UpvotesCount * 10; // Points for upvotes
                reputationChange -= answer.DownvotesCount * 2; // Penalty for downvotes

                activities.Add(new QAUserActivity
                {
                    Id = Guid.NewGuid(),
                    UserId = answer.UserId,
                    ActivityType = "AnswerGiven",
                    ContentId = answer.Id,
                    Category = category?.Name,
                    ReputationChange = reputationChange,
                    CreatedAt = answer.CreatedAt
                });

                // Add separate activity for answer acceptance
                if (answer.IsAccepted && answer.AcceptedAt.HasValue)
                {
                    activities.Add(new QAUserActivity
                    {
                        Id = Guid.NewGuid(),
                        UserId = answer.UserId,
                        ActivityType = "AnswerAccepted",
                        ContentId = answer.Id,
                        Category = category?.Name,
                        ReputationChange = 25,
                        CreatedAt = answer.AcceptedAt.Value
                    });
                }
            }

            // Create activity records for votes (sample, not all votes to avoid too much data)
            var sampleVotes = votes.OrderBy(x => _random.Next()).Take(votes.Count / 3).ToList(); // Sample 1/3 of votes
            foreach (var vote in sampleVotes)
            {
                var category = "";
                if (vote.ContentType == "Question")
                {
                    var question = questions.FirstOrDefault(q => q.Id == vote.ContentId);
                    var questionCategory = categories.FirstOrDefault(c => c.Id == question?.CategoryId);
                    category = questionCategory?.Name ?? "";
                }
                else if (vote.ContentType == "Answer")
                {
                    var answer = answers.FirstOrDefault(a => a.Id == vote.ContentId);
                    var question = questions.FirstOrDefault(q => q.Id == answer?.QuestionId);
                    var questionCategory = categories.FirstOrDefault(c => c.Id == question?.CategoryId);
                    category = questionCategory?.Name ?? "";
                }

                activities.Add(new QAUserActivity
                {
                    Id = Guid.NewGuid(),
                    UserId = vote.UserId,
                    ActivityType = "VoteCast",
                    ContentId = vote.ContentId,
                    Category = category,
                    ReputationChange = 0, // Voting doesn't change voter's reputation
                    CreatedAt = vote.CreatedAt
                });
            }

            _context.QAUserActivities.AddRange(activities);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Created {Count} user activity records", activities.Count);
        }
    }
}