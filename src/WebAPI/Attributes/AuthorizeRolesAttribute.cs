using Microsoft.AspNetCore.Authorization;

namespace WebAPI.Attributes
{
    /// <summary>
    /// Specifies that the class or method that this attribute is applied to requires authorization based on roles.
    /// </summary>
    public class AuthorizeRolesAttribute : AuthorizeAttribute
    {
        /// <summary>
        /// Initializes a new instance of the AuthorizeRolesAttribute class with the specified roles.
        /// </summary>
        /// <param name="roles">The roles that are allowed to access the resource.</param>
        public AuthorizeRolesAttribute(params string[] roles)
        {
            Roles = string.Join(",", roles);
        }
    }

    /// <summary>
    /// Specifies that the class or method requires Admin role.
    /// </summary>
    public class AdminOnlyAttribute : AuthorizeAttribute
    {
        public AdminOnlyAttribute()
        {
            Policy = "AdminOnly";
        }
    }

    /// <summary>
    /// Specifies that the class or method requires Admin or Moderator role.
    /// </summary>
    public class ModeratorOrAdminAttribute : AuthorizeAttribute
    {
        public ModeratorOrAdminAttribute()
        {
            Policy = "ModeratorOrAdmin";
        }
    }

    /// <summary>
    /// Specifies that the class or method requires ContentCreator, Moderator, or Admin role.
    /// </summary>
    public class ContentCreatorAttribute : AuthorizeAttribute
    {
        public ContentCreatorAttribute()
        {
            Policy = "ContentCreator";
        }
    }

    /// <summary>
    /// Specifies that the class or method requires media upload permissions.
    /// </summary>
    public class MediaUploadAttribute : AuthorizeAttribute
    {
        public MediaUploadAttribute()
        {
            Policy = "MediaUpload";
        }
    }

    /// <summary>
    /// Specifies that the class or method requires media management permissions.
    /// </summary>
    public class MediaManagementAttribute : AuthorizeAttribute
    {
        public MediaManagementAttribute()
        {
            Policy = "MediaManagement";
        }
    }

    /// <summary>
    /// Specifies that the class or method requires media analytics permissions.
    /// </summary>
    public class MediaAnalyticsAttribute : AuthorizeAttribute
    {
        public MediaAnalyticsAttribute()
        {
            Policy = "MediaAnalytics";
        }
    }

    /// <summary>
    /// Specifies that the class or method requires active user status.
    /// </summary>
    public class ActiveUserAttribute : AuthorizeAttribute
    {
        public ActiveUserAttribute()
        {
            Policy = "MustBeActiveUser";
        }
    }

    /// <summary>
    /// Specifies that the class or method requires verified email.
    /// </summary>
    public class VerifiedUserAttribute : AuthorizeAttribute
    {
        public VerifiedUserAttribute()
        {
            Policy = "VerifiedUser";
        }
    }
}