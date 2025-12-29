using Microsoft.AspNetCore.Antiforgery;

namespace WebAPI.Middleware
{
    public class AntiforgeryMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IAntiforgery _antiforgery;

        public AntiforgeryMiddleware(RequestDelegate next, IAntiforgery antiforgery)
        {
            _next = next;
            _antiforgery = antiforgery;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Set the XSRF token cookie for the frontend
            var tokens = _antiforgery.GetAndStoreTokens(context);
            context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, 
                new CookieOptions { HttpOnly = false, Secure = true, SameSite = SameSiteMode.Strict });

            // On non-GET requests, the Antiforgery system will automatically validate 
            // the token if we have [ValidateAntiForgeryToken] or [AutoValidateAntiforgeryToken]
            // but for a pure API, we often want to handle it more explicitly or via a filter.

            await _next(context);
        }
    }
}
