using Microsoft.AspNetCore.Mvc.Filters;
using System.Reflection;
using System.Text.RegularExpressions;

namespace WebAPI.Filters
{
    public class SanitizeInputFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            foreach (var argument in context.ActionArguments.Values)
            {
                if (argument == null) continue;
                SanitizeObject(argument);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context) { }

        private void SanitizeObject(object obj)
        {
            var properties = obj.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p => p.PropertyType == typeof(string) && p.CanWrite && p.CanRead);

            foreach (var prop in properties)
            {
                var value = (string?)prop.GetValue(obj);
                if (!string.IsNullOrEmpty(value))
                {
                    prop.SetValue(obj, Sanitize(value));
                }
            }
        }

        private string Sanitize(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;

            // Basic HTML strip
            return Regex.Replace(input, "<.*?>", string.Empty);
        }
    }
}
