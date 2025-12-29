using Infrastructure.Data.Seeds.Community.Groups;
using Infrastructure.Data.Seeds.Community.Posts;
using Infrastructure.Data.Seeds.Community.Reviews;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.Seeds.Community
{
    public class CommunitySeeder
    {
        private readonly GroupsSeeder _groupsSeeder;
        private readonly PostsSeeder _postsSeeder;
        private readonly ReviewsSeeder _reviewsSeeder;
        private readonly ILogger<CommunitySeeder> _logger;

        public CommunitySeeder(
            GroupsSeeder groupsSeeder,
            PostsSeeder postsSeeder,
            ReviewsSeeder reviewsSeeder,
            ILogger<CommunitySeeder> logger)
        {
            _groupsSeeder = groupsSeeder;
            _postsSeeder = postsSeeder;
            _reviewsSeeder = reviewsSeeder;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                await _groupsSeeder.SeedAsync();
                await _postsSeeder.SeedAsync();
                await _reviewsSeeder.SeedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error orchestrating community data seeding");
                throw;
            }
        }
    }
}
