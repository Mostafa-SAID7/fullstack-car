using Application.Features.AIAgent.Interfaces;
using Application.Features.AIAgent.DTOs;
using MediatR;

namespace Application.Features.AIAgent.Commands.ChatWithAgent
{
    public record ChatWithAgentCommand(ChatRequestDTO Request) : IRequest<ChatResponseDTO>;

    public class ChatWithAgentCommandHandler : IRequestHandler<ChatWithAgentCommand, ChatResponseDTO>
    {
        private readonly IAIAgentService _aiAgentService;

        public ChatWithAgentCommandHandler(IAIAgentService aiAgentService)
        {
            _aiAgentService = aiAgentService;
        }

        public async Task<ChatResponseDTO> Handle(ChatWithAgentCommand command, CancellationToken cancellationToken)
        {
            return await _aiAgentService.ChatAsync(command.Request, cancellationToken);
        }
    }
}
