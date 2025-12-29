using Application.Common.Interfaces.Identity;
using Application.Common.Interfaces.Localization;
using Application.Common.Constants;
using Application.Features.Identity.DTOs.Requests;
using Application.Features.Identity.Profile.Commands;
using Application.Features.Identity.Profile.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Identity
{
    [Authorize]
    [Route("api/identity/profile")]
    public class ProfileController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILocalizationProvider _localizationProvider;
        private readonly ILanguageDetector _languageDetector;

        public ProfileController(
            ICurrentUserService currentUserService,
            ILocalizationProvider localizationProvider,
            ILanguageDetector languageDetector)
        {
            _currentUserService = currentUserService;
            _localizationProvider = localizationProvider;
            _languageDetector = languageDetector;
        }

        private async Task<string> T(string key)
        {
            var acceptLanguage = Request.Headers["Accept-Language"].ToString() ?? "en-US";
            var userAgent = Request.Headers["User-Agent"].ToString() ?? "";
            var language = await _languageDetector.DetectLanguageAsync(acceptLanguage, userAgent);
            return await _localizationProvider.GetTranslationAsync(language, key);
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = Guid.Parse(_currentUserService.UserId!);
            var result = await Mediator.Send(new GetProfileQuery { UserId = userId });
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = Guid.Parse(_currentUserService.UserId!);
            var result = await Mediator.Send(new UpdateProfileCommand { UserId = userId, Request = request });
            return result.Succeeded ? Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { Message = await T("shared.files.noFileUploaded") }); // Need to ensure this exists or use shared key

            var userId = Guid.Parse(_currentUserService.UserId!);
            using var stream = file.OpenReadStream();

            var result = await Mediator.Send(new UploadAvatarCommand
            {
                UserId = userId,
                FileStream = stream,
                FileName = file.FileName,
                ContentType = file.ContentType
            });

            return result.Succeeded ? Ok(new { Url = result.Data }) : BadRequest(result.Errors);
        }
    }
}
