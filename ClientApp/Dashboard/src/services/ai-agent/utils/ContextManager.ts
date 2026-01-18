// AI Agent Utility - Context Management
// Handles token estimation and context window truncation

import type { AIMessage } from '../../types/ai-agent';

export interface ContextWindowOptions {
    maxTokens: number;
    reserveTokens: number; // Tokens reserved for the next response
    modelId: string;
}

export class ContextManager {
    // Rough token estimation: ~4 characters per token for English text
    // This is a heuristic and should be replaced with a real tokenizer if possible
    static estimateTokens(text: string): number {
        if (!text) return 0;
        return Math.ceil(text.length / 4);
    }

    static estimateMessageTokens(message: AIMessage): number {
        let tokens = this.estimateTokens(message.content);
        // Add overhead for roles and formatting
        tokens += 4;
        return tokens;
    }

    /**
     * Truncates message history to fit within a token limit
     * Keeps the most recent messages and always prioritizes the system prompt
     */
    static fitToContextWindow(
        messages: AIMessage[],
        options: ContextWindowOptions
    ): AIMessage[] {
        const { maxTokens, reserveTokens } = options;
        const availableTokens = maxTokens - reserveTokens;

        let currentTokens = 0;
        const result: AIMessage[] = [];

        // Separate system message if exists (usually at index 0)
        const systemMessage = messages.find(m => m.role === 'system');
        if (systemMessage) {
            currentTokens += this.estimateMessageTokens(systemMessage);
        }

        // Process other messages from newest to oldest
        const otherMessages = messages.filter(m => m.role !== 'system');
        for (let i = otherMessages.length - 1; i >= 0; i--) {
            const msg = otherMessages[i];
            const msgTokens = this.estimateMessageTokens(msg);

            if (currentTokens + msgTokens <= availableTokens) {
                result.unshift(msg);
                currentTokens += msgTokens;
            } else {
                break; // Context window full
            }
        }

        // Re-add system message at the beginning
        if (systemMessage) {
            result.unshift(systemMessage);
        }

        return result;
    }

    /**
     * Get metadata summary for a conversation context
     */
    static getContextStatus(messages: AIMessage[]) {
        const totalTokens = messages.reduce((sum, msg) => sum + this.estimateMessageTokens(msg), 0);
        return {
            totalTokens,
            messageCount: messages.length,
            isNearLimit: (limit: number) => totalTokens > limit * 0.8
        };
    }
}
