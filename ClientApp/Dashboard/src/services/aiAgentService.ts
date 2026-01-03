import { apiClient } from './api';
import { API_ENDPOINTS } from '../constants/api';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    response: string;
    context?: any;
}

export const aiAgentService = {
    chat: async (message: string, history: ChatMessage[] = [], context?: string): Promise<ChatResponse> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.AI_AGENT.CHAT, {
                message,
                history,
                context
            });
            return response.data;
        } catch (error) {
            console.error('Error calling AI Agent Chat:', error);
            throw error;
        }
    },

    getMaintenanceAdvice: async (params: { make: string; model: string; year: number; mileage?: number }): Promise<any> => {
        try {
            const response = await axios.post(`${AI_AGENT_URL}/maintenance/advice`, params);
            return response.data;
        } catch (error) {
            console.error('Error getting maintenance advice:', error);
            throw error;
        }
    },

    getRecommendations: async (params: { budget?: string; car_type?: string; fuel_type?: string; usage?: string; features?: string[] }): Promise<any> => {
        try {
            const response = await axios.post(`${AI_AGENT_URL}/recommendations`, params);
            return response.data;
        } catch (error) {
            console.error('Error getting car recommendations:', error);
            throw error;
        }
    },

    analyzeMarket: async (carQuery: string, location?: string): Promise<any> => {
        try {
            const response = await axios.post(`${AI_AGENT_URL}/analysis/market`, {
                car_query: carQuery,
                location
            });
            return response.data;
        } catch (error) {
            console.error('Error analyzing car market:', error);
            throw error;
        }
    },

    startTraining: async (params: { base_model: string; epochs: number; dataset_name: string }): Promise<any> => {
        try {
            const response = await axios.post(`${AI_AGENT_URL}/training/start`, params);
            return response.data;
        } catch (error) {
            console.error('Error starting model training:', error);
            throw error;
        }
    },

    getTrainingStatus: async (): Promise<any> => {
        try {
            const response = await axios.get(`${AI_AGENT_URL}/training/status`);
            return response.data;
        } catch (error) {
            console.error('Error getting training status:', error);
            throw error;
        }
    }
};
