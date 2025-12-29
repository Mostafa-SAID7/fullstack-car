namespace Application.Common.Constants
{
    public static class LocalizationKeys
    {
        public static class Identity
        {
            public static class Auth
            {
                public const string Title = "identity.auth.title";
                public const string Login = "identity.auth.login";
                public const string Logout = "identity.auth.logout";
                public const string Register = "identity.auth.register";
                public const string LoginSuccess = "identity.auth.loginSuccess";
                public const string RegistrationSuccess = "identity.auth.registrationSuccess";
                public const string RefreshSuccess = "identity.auth.refreshSuccess";
                public const string ExternalLoginSuccess = "identity.auth.externalLoginSuccess";
                public const string LogoutSuccess = "identity.auth.logoutSuccess";
                public const string ForgotPasswordSuccess = "identity.auth.forgotPasswordSuccess";
                public const string ResetPasswordSuccess = "identity.auth.resetPasswordSuccess";
                public const string EmailVerifiedSuccess = "identity.auth.emailVerifiedSuccess";
            }

            public static class Profile
            {
                public const string Title = "identity.profile.title";
                public const string UpdateProfile = "identity.profile.updateProfile";
                public const string UpdateSuccess = "identity.profile.updateSuccess";
                public const string AvatarUploadSuccess = "identity.profile.avatarUploadSuccess";
            }

            public static class Security
            {
                public const string PasswordChangeSuccess = "identity.security.passwordChangeSuccess";
                public const string TwoFactorEnabled = "identity.security.twoFactorEnabled";
                public const string TwoFactorDisabled = "identity.security.twoFactorDisabled";
            }

            public static class Validation
            {
                public const string InvalidCredentials = "identity.validation.invalidCredentials";
                public const string AccountLocked = "identity.validation.accountLocked";
                public const string EmailNotConfirmed = "identity.validation.emailNotConfirmed";
                public const string UserNotFound = "identity.validation.userNotFound";
                public const string AccountDisabled = "identity.validation.accountDisabled";
                public const string InvalidToken = "identity.validation.invalidToken";
                public const string TokenAndEmailRequired = "identity.validation.tokenAndEmailRequired";
            }

            public static class Shared
            {
                public const string NoFileUploaded = "shared.files.noFileUploaded";
            }
        }
    }
}
