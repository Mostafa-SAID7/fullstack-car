using Application.Common.DTOs;
using Application.Features.Admin.Security.DTOs;
using MediatR;

namespace Application.Features.Admin.Security.Commands;

public class UpdateSecuritySettingsCommand : IRequest<ApiResponseDto<object>>
{
    public UpdateSecuritySettingsRequest Request { get; set; } = null!;
    public Guid UpdatedBy { get; set; }
}

public class BlockIpAddressCommand : IRequest<ApiResponseDto<object>>
{
    public BlockIpAddressRequest Request { get; set; } = null!;
    public Guid BlockedBy { get; set; }
}

public class UnblockIpAddressCommand : IRequest<ApiResponseDto<object>>
{
    public string IpAddress { get; set; } = string.Empty;
    public Guid UnblockedBy { get; set; }
}

public class UpdatePasswordPolicyCommand : IRequest<ApiResponseDto<object>>
{
    public UpdatePasswordPolicyRequest Request { get; set; } = null!;
    public Guid UpdatedBy { get; set; }
}

public class EnforceTwoFactorAuthenticationCommand : IRequest<ApiResponseDto<object>>
{
    public EnforceTwoFactorRequest Request { get; set; } = null!;
    public Guid EnforcedBy { get; set; }
}

public class TerminateSessionCommand : IRequest<ApiResponseDto<object>>
{
    public string SessionId { get; set; } = string.Empty;
    public Guid TerminatedBy { get; set; }
}

public class InitiateSecurityScanCommand : IRequest<ApiResponseDto<object>>
{
    public Guid InitiatedBy { get; set; }
}

// Handlers
public class UpdateSecuritySettingsCommandHandler : IRequestHandler<UpdateSecuritySettingsCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateSecuritySettingsCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Security settings updated", UpdatedBy = request.UpdatedBy });
    }
}

public class BlockIpAddressCommandHandler : IRequestHandler<BlockIpAddressCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(BlockIpAddressCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "IP address blocked", BlockedBy = request.BlockedBy });
    }
}

public class UnblockIpAddressCommandHandler : IRequestHandler<UnblockIpAddressCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UnblockIpAddressCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "IP address unblocked", UnblockedBy = request.UnblockedBy });
    }
}

public class UpdatePasswordPolicyCommandHandler : IRequestHandler<UpdatePasswordPolicyCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdatePasswordPolicyCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Password policy updated", UpdatedBy = request.UpdatedBy });
    }
}

public class EnforceTwoFactorAuthenticationCommandHandler : IRequestHandler<EnforceTwoFactorAuthenticationCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(EnforceTwoFactorAuthenticationCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Two-factor authentication enforcement updated", EnforcedBy = request.EnforcedBy });
    }
}

public class TerminateSessionCommandHandler : IRequestHandler<TerminateSessionCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(TerminateSessionCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Message = "Session terminated", TerminatedBy = request.TerminatedBy });
    }
}

public class InitiateSecurityScanCommandHandler : IRequestHandler<InitiateSecurityScanCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(InitiateSecurityScanCommand request, CancellationToken cancellationToken)
    {
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { ScanId = Guid.NewGuid(), InitiatedBy = request.InitiatedBy, Status = "Started" });
    }
}