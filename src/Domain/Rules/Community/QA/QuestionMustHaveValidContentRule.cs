using Domain.Rules;

namespace Domain.Rules.Community.QA
{
    public class QuestionMustHaveValidContentRule : IBusinessRule
    {
        private readonly string _title;
        private readonly string _content;

        public QuestionMustHaveValidContentRule(string title, string content)
        {
            _title = title;
            _content = content;
        }

        public string Message => "Question must have valid title and content";

        public bool IsBroken()
        {
            return string.IsNullOrWhiteSpace(_title) || 
                   string.IsNullOrWhiteSpace(_content) ||
                   _title.Length < 10 ||
                   _content.Length < 20;
        }
    }
}