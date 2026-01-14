using Domain.Base;
using Domain.Enums.Community.Social;

namespace Domain.ValueObjects.Community.Social
{
    public class ProfilePrivacySettings : ValueObject
    {
        public PrivacyLevel ProfileVisibility { get; private set; }
        public PrivacyLevel PostsVisibility { get; private set; }
        public PrivacyLevel FriendsListVisibility { get; private set; }
        public PrivacyLevel EmailVisibility { get; private set; }
        public PrivacyLevel PhoneVisibility { get; private set; }
        public PrivacyLevel LocationVisibility { get; private set; }
        public PrivacyLevel DateOfBirthVisibility { get; private set; }
        public bool AllowDirectMessages { get; private set; }
        public bool ShowOnlineStatus { get; private set; }
        public bool AllowTagging { get; private set; }
        public bool AllowSearchByEmail { get; private set; }
        public bool AllowSearchByPhone { get; private set; }

        private ProfilePrivacySettings()
        {
            ProfileVisibility = PrivacyLevel.Public;
            PostsVisibility = PrivacyLevel.Public;
            FriendsListVisibility = PrivacyLevel.Friends;
            EmailVisibility = PrivacyLevel.Private;
            PhoneVisibility = PrivacyLevel.Private;
            LocationVisibility = PrivacyLevel.Friends;
            DateOfBirthVisibility = PrivacyLevel.Friends;
            AllowDirectMessages = true;
            ShowOnlineStatus = true;
            AllowTagging = true;
            AllowSearchByEmail = false;
            AllowSearchByPhone = false;
        }

        public ProfilePrivacySettings(
            PrivacyLevel profileVisibility = PrivacyLevel.Public,
            PrivacyLevel postsVisibility = PrivacyLevel.Public,
            PrivacyLevel friendsListVisibility = PrivacyLevel.Friends,
            PrivacyLevel emailVisibility = PrivacyLevel.Private,
            PrivacyLevel phoneVisibility = PrivacyLevel.Private,
            PrivacyLevel locationVisibility = PrivacyLevel.Friends,
            PrivacyLevel dateOfBirthVisibility = PrivacyLevel.Friends,
            bool allowDirectMessages = true,
            bool showOnlineStatus = true,
            bool allowTagging = true,
            bool allowSearchByEmail = false,
            bool allowSearchByPhone = false)
        {
            ProfileVisibility = profileVisibility;
            PostsVisibility = postsVisibility;
            FriendsListVisibility = friendsListVisibility;
            EmailVisibility = emailVisibility;
            PhoneVisibility = phoneVisibility;
            LocationVisibility = locationVisibility;
            DateOfBirthVisibility = dateOfBirthVisibility;
            AllowDirectMessages = allowDirectMessages;
            ShowOnlineStatus = showOnlineStatus;
            AllowTagging = allowTagging;
            AllowSearchByEmail = allowSearchByEmail;
            AllowSearchByPhone = allowSearchByPhone;
        }

        public static ProfilePrivacySettings CreateDefault()
        {
            return new ProfilePrivacySettings();
        }

        public static ProfilePrivacySettings CreatePrivate()
        {
            return new ProfilePrivacySettings(
                profileVisibility: PrivacyLevel.Private,
                postsVisibility: PrivacyLevel.Private,
                friendsListVisibility: PrivacyLevel.Private,
                emailVisibility: PrivacyLevel.Private,
                phoneVisibility: PrivacyLevel.Private,
                locationVisibility: PrivacyLevel.Private,
                dateOfBirthVisibility: PrivacyLevel.Private,
                allowDirectMessages: false,
                showOnlineStatus: false,
                allowTagging: false,
                allowSearchByEmail: false,
                allowSearchByPhone: false);
        }

        public ProfilePrivacySettings UpdateProfileVisibility(PrivacyLevel visibility)
        {
            return new ProfilePrivacySettings(
                visibility, PostsVisibility, FriendsListVisibility, EmailVisibility,
                PhoneVisibility, LocationVisibility, DateOfBirthVisibility,
                AllowDirectMessages, ShowOnlineStatus, AllowTagging,
                AllowSearchByEmail, AllowSearchByPhone);
        }

        public ProfilePrivacySettings UpdatePostsVisibility(PrivacyLevel visibility)
        {
            return new ProfilePrivacySettings(
                ProfileVisibility, visibility, FriendsListVisibility, EmailVisibility,
                PhoneVisibility, LocationVisibility, DateOfBirthVisibility,
                AllowDirectMessages, ShowOnlineStatus, AllowTagging,
                AllowSearchByEmail, AllowSearchByPhone);
        }

        public ProfilePrivacySettings UpdateDirectMessageSettings(bool allowDirectMessages)
        {
            return new ProfilePrivacySettings(
                ProfileVisibility, PostsVisibility, FriendsListVisibility, EmailVisibility,
                PhoneVisibility, LocationVisibility, DateOfBirthVisibility,
                allowDirectMessages, ShowOnlineStatus, AllowTagging,
                AllowSearchByEmail, AllowSearchByPhone);
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return ProfileVisibility;
            yield return PostsVisibility;
            yield return FriendsListVisibility;
            yield return EmailVisibility;
            yield return PhoneVisibility;
            yield return LocationVisibility;
            yield return DateOfBirthVisibility;
            yield return AllowDirectMessages;
            yield return ShowOnlineStatus;
            yield return AllowTagging;
            yield return AllowSearchByEmail;
            yield return AllowSearchByPhone;
        }
    }
}