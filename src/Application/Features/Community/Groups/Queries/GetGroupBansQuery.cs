using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupBansQuery : IRequest<Result<GroupBansPagedResponse>>
    {
        public Guid GroupId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public bool? IsActive { get; set; }
    }

    public class GetGroupBansQueryHandler : IRequestHandler<GetGroupBansQuery, Result<GroupBansPagedResponse>>
    {
        private readonly IRepository<GroupBan> _banRepository;

        public GetGroupBansQueryHandler(IRepository<GroupBan> banRepository)
        {
            _banRepository = banRepository;
        }

        public async Task<Result<GroupBansPagedResponse>> Handle(GetGroupBansQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var bans = await _banRepository.GetAllAsync(cancellationToken);
                var filteredBans = bans.Where(b => b.GroupId == request.GroupId);

                if (request.IsActive.HasValue)
                {
                    filteredBans = filteredBans.Where(b => b.IsActive == request.IsActive.Value);
                }

                var totalCount = filteredBans.Count();
                var pagedBans = filteredBans
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(b => new GroupBanDto
                    {
                        Id = b.Id,
                        GroupId = b.GroupId,
                        UserId = b.UserId,
                        Username = b.User?.UserName ?? string.Empty,
                        DisplayName = $"{b.User?.FirstName} {b.User?.LastName}".Trim(),
                        Reason = b.Reason,
                        BannedAt = b.BannedAt,
                        BanUntil = b.BanUntil,
                        IsPermanent = b.IsPermanent,
                        BannedBy = new GroupUserDto
                        {
                            Id = b.BannedByUser?.Id ?? Guid.Empty,
                            Username = b.BannedByUser?.UserName ?? string.Empty,
                            DisplayName = $"{b.BannedByUser?.FirstName} {b.BannedByUser?.LastName}".Trim(),
                            AvatarUrl = b.BannedByUser?.ProfileImageUrl
                        }
                    })
                    .ToList();

                var stats = new GroupBanStatsDto
                {
                    TotalBans = totalCount,
                    ActiveBans = filteredBans.Count(b => b.IsActive),
                    PermanentBans = filteredBans.Count(b => b.IsPermanent),
                    TemporaryBans = filteredBans.Count(b => !b.IsPermanent),
                    ExpiredBans = filteredBans.Count(b => b.BanUntil.HasValue && b.BanUntil.Value <= DateTime.UtcNow)
                };

                var response = new GroupBansPagedResponse
                {
                    Items = pagedBans,
                    TotalCount = totalCount,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize),
                    Stats = stats
                };

                return Result<GroupBansPagedResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<GroupBansPagedResponse>.Failure($"Failed to get group bans: {ex.Message}");
            }
        }
    }
}