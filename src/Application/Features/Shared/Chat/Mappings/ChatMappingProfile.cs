using AutoMapper;
using Application.Features.Shared.Chat.DTOs;
using Domain.Entities.Shared.Chat;

namespace Application.Features.Shared.Chat.Mappings
{
    public class ChatMappingProfile : AutoMapper.Profile
    {
        public ChatMappingProfile()
        {
            CreateMap<ChatMessage, ChatMessageDto>()
                .ForMember(dest => dest.SenderName, opt => opt.MapFrom(src => $"{src.Sender.FirstName} {src.Sender.LastName}"))
                .ForMember(dest => dest.SentAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.IsRead, opt => opt.Ignore()); // This will be calculated separately

            CreateMap<Conversation, ConversationDto>()
                .ForMember(dest => dest.LastMessage, opt => opt.MapFrom(src => src.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault()))
                .ForMember(dest => dest.Members, opt => opt.MapFrom(src => src.Members))
                .ForMember(dest => dest.UnreadCount, opt => opt.Ignore()); // This will be calculated separately

            CreateMap<ConversationMember, ConversationMemberDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.UserImageUrl, opt => opt.MapFrom(src => src.User.ProfileImageUrl));

            CreateMap<SendMessageRequest, ChatMessage>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Sender, opt => opt.Ignore())
                .ForMember(dest => dest.Conversation, opt => opt.Ignore());

            CreateMap<CreateConversationRequest, Conversation>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Messages, opt => opt.Ignore())
                .ForMember(dest => dest.Members, opt => opt.Ignore());
        }
    }
}
