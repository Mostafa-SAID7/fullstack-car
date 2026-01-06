using Domain.Base;
using Domain.Exceptions;

namespace Domain.ValueObjects.Community
{
    public class TagCollection : ValueObject
    {
        public IReadOnlyList<string> Tags { get; private set; }

        public TagCollection(IEnumerable<string> tags)
        {
            var tagList = tags?.Where(t => !string.IsNullOrWhiteSpace(t))
                              .Select(t => t.Trim().ToLowerInvariant())
                              .Distinct()
                              .ToList() ?? new List<string>();

            if (tagList.Count > 20)
                throw new InvalidValueObjectException("Cannot have more than 20 tags");

            if (tagList.Any(t => t.Length > 50))
                throw new InvalidValueObjectException("Tag cannot be longer than 50 characters");

            Tags = tagList.AsReadOnly();
        }

        public bool Contains(string tag)
        {
            return Tags.Contains(tag.Trim().ToLowerInvariant());
        }

        public TagCollection Add(string tag)
        {
            if (string.IsNullOrWhiteSpace(tag))
                return this;

            var newTags = Tags.ToList();
            var normalizedTag = tag.Trim().ToLowerInvariant();

            if (!newTags.Contains(normalizedTag))
                newTags.Add(normalizedTag);

            return new TagCollection(newTags);
        }

        public TagCollection Remove(string tag)
        {
            var normalizedTag = tag.Trim().ToLowerInvariant();
            var newTags = Tags.Where(t => t != normalizedTag);
            return new TagCollection(newTags);
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            foreach (var tag in Tags.OrderBy(t => t))
                yield return tag;
        }

        public override string ToString()
        {
            return string.Join(", ", Tags);
        }

        public static implicit operator TagCollection(string[] tags)
        {
            return new TagCollection(tags);
        }
    }
}
