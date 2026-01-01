using Domain.Rules;

namespace Domain.Rules.Community.News
{
    public class ArticleMustHaveUniqueSlugRule : IBusinessRule
    {
        private readonly string _slug;
        private readonly Func<string, bool> _slugExists;

        public ArticleMustHaveUniqueSlugRule(string slug, Func<string, bool> slugExists)
        {
            _slug = slug;
            _slugExists = slugExists;
        }

        public string Message => "Article slug must be unique";

        public bool IsBroken()
        {
            return string.IsNullOrWhiteSpace(_slug) || _slugExists(_slug);
        }
    }
}