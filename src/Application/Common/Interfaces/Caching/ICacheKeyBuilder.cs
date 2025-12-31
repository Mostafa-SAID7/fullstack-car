using System;
using System.Collections.Generic;

namespace Application.Common.Interfaces.Caching
{
    public interface ICacheKeyBuilder
    {
        string BuildKey(string prefix, params object[] parameters);
        string BuildKey(Type type, params object[] parameters);
        string BuildUserSpecificKey(string prefix, string userId, params object[] parameters);
        string BuildRoleSpecificKey(string prefix, string role, params object[] parameters);
        string BuildTagKey(string tag);
        string BuildPatternKey(string pattern);
    }
}