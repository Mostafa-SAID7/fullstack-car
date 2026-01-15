import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AIChatWidgetComponent } from './ai-chat-widget.component';
import { AIAgentService } from '../../services/ai-agent.service';
import { AgentType, ChatResponse } from '../../models/ai-agent.models';

describe('AIChatWidgetComponent', () => {
  let component: AIChatWidgetComponent;
  let fixture: ComponentFixture<AIChatWidgetComponent>;
  let aiAgentService: jasmine.SpyObj<AIAgentService>;

  const mockChatResponse: ChatResponse = {
    message: 'Test response from AI',
    conversationId: 'conv-123',
    messageId: 'msg-456',
    agent: 'general',
    timestamp: new Date().toISOString(),
    metadata: {
      tokens: 50,
      cost: 0.001,
      model: 'gpt-3.5-turbo'
    }
  };

  beforeEach(async () => {
    const aiAgentServiceSpy = jasmine.createSpyObj('AIAgentService', [
      'chat',
      'submitPositiveFeedback',
      'submitNegativeFeedback'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AIChatWidgetComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: AIAgentService, useValue: aiAgentServiceSpy }
      ]
    }).compileComponents();

    aiAgentService = TestBed.inject(AIAgentService) as jasmine.SpyObj<AIAgentService>;
    fixture = TestBed.createComponent(AIChatWidgetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.isOpen).toBe(false);
      expect(component.hasUnreadMessages).toBe(false);
      expect(component.currentMessage).toBe('');
      expect(component.isTyping).toBe(false);
      expect(component.selectedMode).toBe(AgentType.GENERAL);
    });

    it('should add welcome message on init', () => {
      fixture.detectChanges();
      expect(component.messages.length).toBe(1);
      expect(component.messages[0].isUser).toBe(false);
      expect(component.messages[0].text).toContain('Hello');
    });

    it('should have all 6 agent modes configured', () => {
      expect(component.agentModes.length).toBe(6);
      expect(component.agentModes.map(m => m.id)).toEqual([
        AgentType.GENERAL,
        AgentType.MECHANIC,
        AgentType.BUYER_GUIDE,
        AgentType.SELLER_ASSISTANT,
        AgentType.MODIFICATION_EXPERT,
        AgentType.COMMUNITY_HELPER
      ]);
    });
  });

  describe('Chat Toggle', () => {
    it('should toggle chat open/close', () => {
      expect(component.isOpen).toBe(false);
      component.toggleChat();
      expect(component.isOpen).toBe(true);
      component.toggleChat();
      expect(component.isOpen).toBe(false);
    });

    it('should clear unread messages when opening chat', () => {
      component.hasUnreadMessages = true;
      component.toggleChat();
      expect(component.hasUnreadMessages).toBe(false);
    });
  });

  describe('Agent Mode Selection', () => {
    it('should change agent mode', () => {
      fixture.detectChanges();
      const initialMessageCount = component.messages.length;
      
      component.setMode(AgentType.MECHANIC);
      
      expect(component.selectedMode).toBe(AgentType.MECHANIC);
      expect(component.showModes).toBe(false);
      expect(component.messages.length).toBe(initialMessageCount + 1);
      expect(component.messages[component.messages.length - 1].text).toContain('Mechanic');
    });

    it('should add system message when mode changes', () => {
      fixture.detectChanges();
      component.setMode(AgentType.BUYER_GUIDE);
      
      const lastMessage = component.messages[component.messages.length - 1];
      expect(lastMessage.isUser).toBe(false);
      expect(lastMessage.agent).toBe('system');
      expect(lastMessage.text).toContain('Buying Guide');
    });

    it('should get current mode label', () => {
      component.selectedMode = AgentType.MECHANIC;
      expect(component.getCurrentModeLabel()).toBe('Mechanic');
      
      component.selectedMode = AgentType.BUYER_GUIDE;
      expect(component.getCurrentModeLabel()).toBe('Buying Guide');
    });
  });

  describe('Message Sending', () => {
    beforeEach(() => {
      fixture.detectChanges();
      aiAgentService.chat.and.returnValue(of(mockChatResponse));
    });

    it('should send message successfully', fakeAsync(() => {
      component.currentMessage = 'Test message';
      component.sendMessage();
      
      expect(component.messages.length).toBe(2); // Welcome + user message
      expect(component.messages[1].text).toBe('Test message');
      expect(component.messages[1].isUser).toBe(true);
      expect(component.isTyping).toBe(true);
      expect(component.currentMessage).toBe('');
      
      tick();
      
      expect(aiAgentService.chat).toHaveBeenCalledWith(jasmine.objectContaining({
        message: 'Test message',
        mode: AgentType.GENERAL
      }));
      expect(component.isTyping).toBe(false);
      expect(component.messages.length).toBe(3); // Welcome + user + AI response
      expect(component.messages[2].text).toBe('Test response from AI');
      expect(component.messages[2].isUser).toBe(false);
    }));

    it('should not send empty message', () => {
      component.currentMessage = '   ';
      component.sendMessage();
      
      expect(aiAgentService.chat).not.toHaveBeenCalled();
      expect(component.messages.length).toBe(1); // Only welcome message
    });

    it('should not send message while typing', () => {
      component.currentMessage = 'Test';
      component.isTyping = true;
      component.sendMessage();
      
      expect(aiAgentService.chat).not.toHaveBeenCalled();
    });

    it('should include conversation ID in subsequent messages', fakeAsync(() => {
      component.currentMessage = 'First message';
      component.sendMessage();
      tick();
      
      expect(component.conversationId).toBe('conv-123');
      
      component.currentMessage = 'Second message';
      component.sendMessage();
      
      expect(aiAgentService.chat).toHaveBeenCalledWith(jasmine.objectContaining({
        conversationId: 'conv-123'
      }));
    }));

    it('should handle API error gracefully', fakeAsync(() => {
      aiAgentService.chat.and.returnValue(throwError(() => new Error('API Error')));
      
      component.currentMessage = 'Test message';
      component.sendMessage();
      tick();
      
      expect(component.isTyping).toBe(false);
      expect(component.messages.length).toBe(3);
      const errorMessage = component.messages[2];
      expect(errorMessage.text).toContain('trouble connecting');
      expect(errorMessage.agent).toBe('system');
    }));

    it('should send message with selected agent mode', fakeAsync(() => {
      component.selectedMode = AgentType.MECHANIC;
      component.currentMessage = 'Check my engine';
      component.sendMessage();
      
      expect(aiAgentService.chat).toHaveBeenCalledWith(jasmine.objectContaining({
        mode: AgentType.MECHANIC
      }));
    }));
  });

  describe('Suggestions', () => {
    beforeEach(() => {
      fixture.detectChanges();
      aiAgentService.chat.and.returnValue(of(mockChatResponse));
    });

    it('should send message when suggestion is selected', fakeAsync(() => {
      const suggestion = 'Recommend a family SUV';
      component.selectSuggestion(suggestion);
      
      expect(component.currentMessage).toBe('');
      expect(aiAgentService.chat).toHaveBeenCalledWith(jasmine.objectContaining({
        message: suggestion
      }));
    }));
  });

  describe('Image Upload', () => {
    it('should handle image file selection', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const event = { target: { files: [file] } };
      
      component.onFileSelected(event);
      
      expect(component.selectedImage).toBe(file);
    });

    it('should create image preview', (done) => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const event = { target: { files: [file] } };
      
      component.onFileSelected(event);
      
      setTimeout(() => {
        expect(component.imagePreview).toBeDefined();
        done();
      }, 100);
    });

    it('should remove selected image', () => {
      component.selectedImage = new File([''], 'test.jpg', { type: 'image/jpeg' });
      component.imagePreview = 'data:image/jpeg;base64,test';
      
      component.removeImage();
      
      expect(component.selectedImage).toBeUndefined();
      expect(component.imagePreview).toBeUndefined();
    });

    it('should send message with image', fakeAsync(() => {
      aiAgentService.chat.and.returnValue(of(mockChatResponse));
      component.selectedImage = new File([''], 'test.jpg', { type: 'image/jpeg' });
      component.imagePreview = 'data:image/jpeg;base64,test';
      
      component.sendMessage();
      tick();
      
      expect(aiAgentService.chat).toHaveBeenCalledWith(jasmine.objectContaining({
        context: jasmine.objectContaining({
          hasImage: true
        })
      }));
    }));
  });

  describe('Markdown Rendering', () => {
    it('should render bold text', () => {
      const result = component.renderMarkdown('**bold text**');
      expect(result).toContain('<strong>bold text</strong>');
    });

    it('should render italic text', () => {
      const result = component.renderMarkdown('*italic text*');
      expect(result).toContain('<em>italic text</em>');
    });

    it('should render inline code', () => {
      const result = component.renderMarkdown('`code`');
      expect(result).toContain('<code class="inline-code">code</code>');
    });

    it('should render code blocks', () => {
      const result = component.renderMarkdown('```javascript\nconst x = 1;\n```');
      expect(result).toContain('<pre class="code-block">');
      expect(result).toContain('language-javascript');
    });

    it('should render links', () => {
      const result = component.renderMarkdown('[link](https://example.com)');
      expect(result).toContain('<a href="https://example.com"');
      expect(result).toContain('link</a>');
    });

    it('should render lists', () => {
      const result = component.renderMarkdown('- item 1\n- item 2');
      expect(result).toContain('• item 1');
      expect(result).toContain('• item 2');
    });

    it('should handle empty text', () => {
      const result = component.renderMarkdown('');
      expect(result).toBe('');
    });
  });

  describe('Message Actions', () => {
    let testMessage: any;

    beforeEach(() => {
      fixture.detectChanges();
      testMessage = {
        id: 'msg-1',
        text: 'Test message',
        isUser: false,
        timestamp: new Date()
      };
    });

    it('should return empty actions for user messages', () => {
      testMessage.isUser = true;
      const actions = component.getMessageActions(testMessage);
      expect(actions.length).toBe(0);
    });

    it('should return 4 actions for AI messages', () => {
      const actions = component.getMessageActions(testMessage);
      expect(actions.length).toBe(4);
      expect(actions.map(a => a.label)).toEqual(['Copy', 'Save', 'Share', 'Rate']);
    });

    it('should copy message to clipboard', async () => {
      spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
      
      await component.copyMessage(testMessage);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test message');
    });

    it('should save message to localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('[]');
      spyOn(localStorage, 'setItem');
      
      component.saveMessage(testMessage);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'saved_messages',
        jasmine.stringContaining('Test message')
      );
    });

    it('should submit positive feedback', () => {
      aiAgentService.submitPositiveFeedback.and.returnValue(of({ success: true }));
      component.conversationId = 'conv-123';
      
      component.rateMessage(testMessage, true);
      
      expect(aiAgentService.submitPositiveFeedback).toHaveBeenCalledWith(
        'conv-123',
        'msg-1',
        5
      );
    });

    it('should submit negative feedback', () => {
      aiAgentService.submitNegativeFeedback.and.returnValue(of({ success: true }));
      component.conversationId = 'conv-123';
      
      component.rateMessage(testMessage, false);
      
      expect(aiAgentService.submitNegativeFeedback).toHaveBeenCalledWith(
        'conv-123',
        'msg-1',
        'Not helpful'
      );
    });

    it('should not submit feedback without conversation ID', () => {
      component.conversationId = undefined;
      
      component.rateMessage(testMessage, true);
      
      expect(aiAgentService.submitPositiveFeedback).not.toHaveBeenCalled();
    });
  });

  describe('Relative Time', () => {
    it('should show "just now" for recent messages', () => {
      const now = new Date();
      expect(component.getRelativeTime(now)).toBe('just now');
    });

    it('should show minutes ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(component.getRelativeTime(fiveMinutesAgo)).toBe('5m ago');
    });

    it('should show hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(component.getRelativeTime(twoHoursAgo)).toBe('2h ago');
    });

    it('should show days ago', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(component.getRelativeTime(threeDaysAgo)).toBe('3d ago');
    });

    it('should show date for old messages', () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const result = component.getRelativeTime(tenDaysAgo);
      expect(result).toContain('/');
    });
  });

  describe('Unread Messages', () => {
    it('should mark messages as unread when chat is closed', () => {
      fixture.detectChanges();
      component.isOpen = false;
      
      component['addMessage']({
        id: 'msg-1',
        text: 'New message',
        isUser: false,
        timestamp: new Date()
      });
      
      expect(component.hasUnreadMessages).toBe(true);
    });

    it('should not mark messages as unread when chat is open', () => {
      fixture.detectChanges();
      component.isOpen = true;
      component.hasUnreadMessages = false;
      
      component['addMessage']({
        id: 'msg-1',
        text: 'New message',
        isUser: false,
        timestamp: new Date()
      });
      
      expect(component.hasUnreadMessages).toBe(false);
    });

    it('should not mark user messages as unread', () => {
      fixture.detectChanges();
      component.isOpen = false;
      
      component['addMessage']({
        id: 'msg-1',
        text: 'User message',
        isUser: true,
        timestamp: new Date()
      });
      
      expect(component.hasUnreadMessages).toBe(false);
    });
  });
});
