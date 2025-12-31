using Domain.Base;

namespace Domain.ValueObjects.Community.Posts
{
    public class PostContent : ValueObject
    {
        public string Value { get; private set; }
        public int WordCount { get; private set; }
        public int CharacterCount { get; private set; }

        private PostContent(string value)
        {
            Value = value;
            WordCount = CountWords(value);
            CharacterCount = value.Length;
        }

        public static PostContent Create(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Post content cannot be empty", nameof(content));

            if (content.Length > 10000)
                throw new ArgumentException("Post content cannot exceed 10,000 characters", nameof(content));

            return new PostContent(content.Trim());
        }

        private static int CountWords(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return 0;

            return text.Split(new char[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries).Length;
        }

        public bool IsLongForm => WordCount > 100;
        public bool IsShortForm => WordCount <= 100;

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }

        public static implicit operator string(PostContent content) => content.Value;
        public override string ToString() => Value;
    }
}