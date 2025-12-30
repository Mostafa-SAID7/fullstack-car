using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/test-localization")]
    public class TestLocalizationController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetCulture()
        {
            var culture = CultureInfo.CurrentCulture;
            var uiCulture = CultureInfo.CurrentUICulture;

            return Ok(new
            {
                CultureName = culture.Name,
                UICultureName = uiCulture.Name,
                DateExample = DateTime.Now.ToLongDateString(),
                NumberExample = 1234.56.ToString("C"),
                Message = $"Current Culture is {culture.EnglishName}"
            });
        }
    }
}
