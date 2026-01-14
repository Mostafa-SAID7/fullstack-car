import { Component, ElementRef, OnInit, ViewChild, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AIAgentService } from '../../services/ai-agent.service';
import { ChatRequest, ChatResponse, AgentType } from '../../models/ai-agent.models';

interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    agent?: string;
    metadata?: any;
    imageUrl?: string;
}

interface QuickAction {
    label: string;
    icon: string;
    action: () => void;
}

@Component({
    selector: 'app-ai-chat-widget',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './ai-chat-widget.component.html',
    styleUrls: ['./ai-chat-widget.component.scss']
})
export class AIChatWidgetComponent implements OnInit {
    isOpen = false;
    hasUnreadMessages = false;
    currentMessage = '';
    isTyping = false;
    messages: ChatMessage[] = [];
    conversationId?: string;
    selectedMode: AgentType = AgentType.GENERAL;
    showModes = false;
    selectedImage?: File;
    imagePreview?: string;

    agentModes = [
        { id: AgentType.GENERAL, label: 'General Chat', icon: 'fa-comments', description: 'General automotive questions' },
        { id: AgentType.MECHANIC, label: 'Mechanic', icon: 'fa-wrench', description: 'Maintenance & diagnostics' },
        { id: AgentType.BUYER_GUIDE, label: 'Buying Guide', icon: 'fa-shopping-cart', description: 'Find your perfect car' },
        { id: AgentType.SELLER_ASSISTANT, label: 'Selling Help', icon: 'fa-tag', description: 'List your car for sale' },
        { id: AgentType.MODIFICATION_EXPERT, label: 'Modifications', icon: 'fa-cog', description: 'Upgrade & customize' },
        { id: AgentType.COMMUNITY_HELPER, label: 'Community', icon: 'fa-users', description: 'Platform features help' }
    ];

    suggestions = [
        "Recommend a family SUV",
        "Maintenance advice for Toyota Camry",
        "Best cars under $30k"
    ];

    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
    @ViewChild('fileInput') private fileInput!: ElementRef;

    constructor(
        private aiAgentService: AIAgentService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.addMessage({
            id: this.generateId(),
            text: "Hello! I'm your AI automotive assistant. **How can I help you today?**",
            isUser: false,
            timestamp: new Date()
        });
    }

    toggleChat(): void {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.hasUnreadMessages = false;
            this.scrollToBottom();
        }
    }

    setMode(mode: AgentType): void {
        this.selectedMode = mode;
        this.showModes = false;
        const modeLabel = this.agentModes.find(m => m.id === mode)?.label || 'General';
        this.addMessage({
            id: this.generateId(),
            text: `Switched to **${modeLabel}** mode. How can I assist you?`,
            isUser: false,
            timestamp: new Date(),
            agent: 'system'
        });
    }

    selectSuggestion(suggestion: string): void {
        this.currentMessage = suggestion;
        this.sendMessage();
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.selectedImage = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage(): void {
        this.selectedImage = undefined;
        this.imagePreview = undefined;
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }

    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }

    sendMessage(): void {
        if ((!this.currentMessage.trim() && !this.selectedImage) || this.isTyping) return;

        const userMsg = this.currentMessage;
        const userMessage: ChatMessage = {
            id: this.generateId(),
            text: userMsg,
            isUser: true,
            timestamp: new Date(),
            imageUrl: this.imagePreview
        };

        this.addMessage(userMessage);
        this.currentMessage = '';
        const tempImage = this.imagePreview;
        this.removeImage();
        this.isTyping = true;
        this.scrollToBottom();

        const request: ChatRequest = {
            message: userMsg || 'Please analyze this image',
            conversationId: this.conversationId,
            mode: this.selectedMode,
            context: { 
                source: 'Car community platform user',
                hasImage: !!tempImage
            }
        };

        this.aiAgentService.chat(request).subscribe({
            next: (response: ChatResponse) => {
                this.isTyping = false;
                this.conversationId = response.conversationId;
                this.addMessage({
                    id: response.messageId,
                    text: response.message || 'No response from AI.',
                    isUser: false,
                    timestamp: new Date(response.timestamp),
                    agent: response.agent,
                    metadata: response.metadata
                });
            },
            error: (error) => {
                this.isTyping = false;
                this.addMessage({
                    id: this.generateId(),
                    text: "I'm having trouble connecting right now. Please try again later.",
                    isUser: false,
                    timestamp: new Date(),
                    agent: 'system'
                });
                console.error('AI Chat Error:', error);
            }
        });
    }

    renderMarkdown(text: string): SafeHtml {
        if (!text) return '';
        
        // Enhanced markdown parsing
        let parsed = text;
        
        // Code blocks with syntax highlighting placeholder
        parsed = parsed.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre class="code-block"><code class="language-${lang || 'text'}">${this.escapeHtml(code.trim())}</code></pre>`;
        });
        
        // Inline code
        parsed = parsed.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // Bold
        parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Links
        parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary hover:underline">$1</a>');
        
        // Lists
        parsed = parsed.replace(/\n- (.*)/g, '<br>• $1');
        parsed = parsed.replace(/\n\d+\. (.*)/g, '<br>$1. ');
        
        // Line breaks
        parsed = parsed.replace(/\n/g, '<br>');

        return this.sanitizer.sanitize(SecurityContext.HTML, parsed) || '';
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getRelativeTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Date(date).toLocaleDateString();
    }

    getMessageActions(message: ChatMessage): QuickAction[] {
        if (message.isUser) return [];

        return [
            {
                label: 'Copy',
                icon: 'fa-copy',
                action: () => this.copyMessage(message)
            },
            {
                label: 'Save',
                icon: 'fa-bookmark',
                action: () => this.saveMessage(message)
            },
            {
                label: 'Share',
                icon: 'fa-share',
                action: () => this.shareMessage(message)
            },
            {
                label: 'Rate',
                icon: 'fa-thumbs-up',
                action: () => this.rateMessage(message, true)
            }
        ];
    }

    copyMessage(message: ChatMessage): void {
        navigator.clipboard.writeText(message.text).then(() => {
            console.log('Message copied to clipboard');
            // Could show a toast notification here
        }).catch(err => {
            console.error('Failed to copy message:', err);
        });
    }

    saveMessage(message: ChatMessage): void {
        const saved = localStorage.getItem('saved_messages') || '[]';
        const messages = JSON.parse(saved);
        messages.push({
            id: message.id,
            text: message.text,
            timestamp: message.timestamp,
            agent: message.agent
        });
        localStorage.setItem('saved_messages', JSON.stringify(messages));
        console.log('Message saved');
    }

    shareMessage(message: ChatMessage): void {
        const shareText = `AI Assistant: ${message.text}`;
        if (navigator.share) {
            navigator.share({
                title: 'AI Assistant Message',
                text: shareText
            }).catch(err => console.log('Error sharing:', err));
        } else {
            this.copyMessage(message);
        }
    }

    rateMessage(message: ChatMessage, positive: boolean): void {
        if (!this.conversationId) return;

        if (positive) {
            this.aiAgentService.submitPositiveFeedback(this.conversationId, message.id, 5).subscribe({
                next: () => console.log('Positive feedback submitted'),
                error: (err) => console.error('Failed to submit feedback:', err)
            });
        } else {
            this.aiAgentService.submitNegativeFeedback(this.conversationId, message.id, 'Not helpful').subscribe({
                next: () => console.log('Negative feedback submitted'),
                error: (err) => console.error('Failed to submit feedback:', err)
            });
        }
    }

    private addMessage(message: ChatMessage): void {
        this.messages.push(message);

        if (!this.isOpen && !message.isUser) {
            this.hasUnreadMessages = true;
        }

        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            if (this.scrollContainer) {
                this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
            }
        }, 100);
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    getCurrentModeLabel(): string {
        return this.agentModes.find(m => m.id === this.selectedMode)?.label || 'General';
    }
}
