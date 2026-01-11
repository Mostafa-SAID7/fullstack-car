using Domain.Base;
using Domain.Enums.Community.QA;

namespace Domain.ValueObjects.Community
{
    public class Badge : ValueObject
    {
        public BadgeType Type { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public string IconUrl { get; private set; }
        public DateTime EarnedAt { get; private set; }
        public string? Category { get; private set; }

        private Badge() { } // For EF Core

        public Badge(BadgeType type, string name, string description, string iconUrl, string? category = null)
        {
            Type = type;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Description = description ?? throw new ArgumentNullException(nameof(description));
            IconUrl = iconUrl ?? throw new ArgumentNullException(nameof(iconUrl));
            Category = category;
            EarnedAt = DateTime.UtcNow;
        }

        public static Badge CreateContributorBadge() => new(
            BadgeType.Contributor,
            "Contributor",
            "Made your first contribution to the community",
            "/badges/contributor.svg"
        );

        public static Badge CreateHelpfulBadge() => new(
            BadgeType.Helpful,
            "Helpful",
            "Received multiple upvotes for helpful answers",
            "/badges/helpful.svg"
        );

        public static Badge CreateKnowledgeableBadge(string category) => new(
            BadgeType.Knowledgeable,
            "Knowledgeable",
            $"Demonstrated expertise in {category}",
            "/badges/knowledgeable.svg",
            category
        );

        public static Badge CreateExpertBadge(string category) => new(
            BadgeType.Expert,
            "Expert",
            $"Recognized expert in {category}",
            "/badges/expert.svg",
            category
        );

        public static Badge CreateGoodAnswerBadge() => new(
            BadgeType.GoodAnswer,
            "Good Answer",
            "Answer received significant positive feedback",
            "/badges/good-answer.svg"
        );

        public static Badge CreateGreatAnswerBadge() => new(
            BadgeType.GreatAnswer,
            "Great Answer",
            "Answer received exceptional positive feedback",
            "/badges/great-answer.svg"
        );

        public static Badge CreateReputationMilestoneBadge(int reputation) => reputation switch
        {
            >= 10000 => new(BadgeType.Reputation10000, "Reputation Master", "Reached 10,000 reputation points", "/badges/reputation-10k.svg"),
            >= 5000 => new(BadgeType.Reputation5000, "Reputation Expert", "Reached 5,000 reputation points", "/badges/reputation-5k.svg"),
            >= 2500 => new(BadgeType.Reputation2500, "Reputation Specialist", "Reached 2,500 reputation points", "/badges/reputation-2.5k.svg"),
            >= 1000 => new(BadgeType.Reputation1000, "Reputation Contributor", "Reached 1,000 reputation points", "/badges/reputation-1k.svg"),
            >= 500 => new(BadgeType.Reputation500, "Rising Star", "Reached 500 reputation points", "/badges/reputation-500.svg"),
            >= 100 => new(BadgeType.Reputation100, "Getting Started", "Reached 100 reputation points", "/badges/reputation-100.svg"),
            _ => throw new ArgumentException($"Invalid reputation milestone: {reputation}")
        };

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Type;
            yield return Name;
            yield return Category ?? string.Empty;
        }
    }
}