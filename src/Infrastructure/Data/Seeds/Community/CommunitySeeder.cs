using Infrastructure.Data.Seeds.Community.Groups;
using Infrastructure.Data.Seeds.Community.Posts;
using Infrastructure.Data.Seeds.Community.Reviews;
using Infrastructure.Data.Seeds.Community.Social;
using Infrastructure.Data.Seeds.Community.Guides;
using Infrastructure.Data;
using Microsoft.Extensions.Logging;
using GroupsSeeder = Infrastructure.Data.Seeds.Community.Groups.GroupsSeeder;
using PostsSeeder = Infrastructure.Data.Seeds.Community.Posts.PostsSeeder;

namespace Infrastructure.Data.Seeds.Community
{
    public class CommunitySeeder
    {
        private readonly GroupsSeeder _groupsSeeder;
        private readonly PostsSeeder _postsSeeder;
        private readonly ReviewsSeeder _reviewsSeeder;
        private readonly SocialSeeder _socialSeeder;
        private readonly GuidesSeeder _guidesSeeder;
        private readonly ILogger<CommunitySeeder> _logger;

        public CommunitySeeder(
            GroupsSeeder groupsSeeder,
            PostsSeeder postsSeeder,
            ReviewsSeeder reviewsSeeder,
            SocialSeeder socialSeeder,
            GuidesSeeder guidesSeeder,
            ILogger<CommunitySeeder> logger)
        {
            _groupsSeeder = groupsSeeder;
            _postsSeeder = postsSeeder;
            _reviewsSeeder = reviewsSeeder;
            _socialSeeder = socialSeeder;
            _guidesSeeder = guidesSeeder;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                await _groupsSeeder.SeedAsync();
                await _postsSeeder.SeedAsync();
                await _reviewsSeeder.SeedAsync();
                await _socialSeeder.SeedAsync();
                await _guidesSeeder.SeedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error orchestrating community data seeding");
                throw;
            }
        }
    }
}
