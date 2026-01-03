import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIAgentService } from '../../services/ai-agent.service';
import { ChatRequest } from '../../models/ai-agent.models';

interface ChatMessage {
    text: string;
    isUser: boolean;
    timestamp: Date;
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
    mode: 'chat' | 'maintenance' | 'recommendation' = 'chat';
    showModes = false;

    suggestions = [
        "Recommend a family SUV",
        "Maintenance advice for Toyota Camry",
        "Best cars under $30k"
    ];

    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    constructor(private aiAgentService: AIAgentService) { }

    ngOnInit(): void {
        this.addMessage("Hello! I'm your AI automotive assistant. **How can I help you today?**", false);
    }

    toggleChat(): void {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.hasUnreadMessages = false;
            this.scrollToBottom();
        }
    }

    setMode(mode: any): void {
        this.mode = mode;
        this.showModes = false;
    }

    selectSuggestion(suggestion: string): void {
        this.currentMessage = suggestion;
        this.sendMessage();
    }

    sendMessage(): void {
        if (!this.currentMessage.trim() || this.isTyping) return;

        const userMsg = this.currentMessage;
        this.addMessage(userMsg, true);
        this.currentMessage = '';
        this.isTyping = true;
        this.scrollToBottom();

        const request: ChatRequest = {
            message: this.mode !== 'chat' ? `[${this.mode.toUpperCase()} MODE] ${userMsg}` : userMsg,
            context: 'Car community platform user'
        };

        this.aiAgentService.chat(request).subscribe({
            next: (response) => {
                this.isTyping = false;
                this.addMessage(response?.message || 'No response from AI.', false);
            },
            error: (error) => {
                this.isTyping = false;
                this.addMessage("I'm having trouble connecting right now. Please try again later.", false);
                console.error('AI Chat Error:', error);
            }
        });
    }

    parseMarkdown(text: string | undefined): string {
        if (!text) return '';
        let parsed = text;
        parsed = parsed
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n- (.*)/g, '<br>• $1')
            .replace(/\n/g, '<br>');

        return parsed;
    }

    private addMessage(text: string, isUser: boolean): void {
        this.messages.push({
            text,
            isUser,
            timestamp: new Date()
        });

        if (!this.isOpen && !isUser) {
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
}
