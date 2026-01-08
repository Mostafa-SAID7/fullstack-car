using Application.Common.Specifications;
using Domain.Entities.Media;

namespace Application.Common.Specifications.Media;

public class MediaAnalyticsSpecification : BaseSpecification<MediaAnalytics>
{
    public MediaAnalyticsSpecification(Guid mediaId) 
        : base(x => x.MediaId == mediaId)
    {
    }

    public MediaAnalyticsSpecification(Guid mediaId, Domain.Enums.Media.MediaType mediaType) 
        : base(x => x.MediaId == mediaId && x.MediaType == mediaType)
    {
    }
}