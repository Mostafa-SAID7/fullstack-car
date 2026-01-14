"""
Integration tests for chat API endpoints.
"""
import pytest
from fastapi import status

class TestChatAPI:
    """Test chat endpoint flow."""
    
    def test_chat_without_conversation_id(self, client, sample_chat_message):
        """Test chat creates new conversation when no conversation_id provided."""
        response = client.post("/api/chat/", json=sample_chat_message)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify response structure
        assert "message" in data
        assert "conversation_id" in data
        assert "agent" in data
        assert "metadata" in data
        
        # Verify conversation was created
        assert data["conversation_id"] is not None
        assert len(data["message"]) > 0
    
    def test_chat_with_conversation_id(self, client, sample_chat_message):
        """Test chat continues existing conversation."""
        # First message - creates conversation
        response1 = client.post("/api/chat/", json=sample_chat_message)
        assert response1.status_code == status.HTTP_200_OK
        conversation_id = response1.json()["conversation_id"]
        
        # Second message - continues conversation
        sample_chat_message["conversation_id"] = conversation_id
        sample_chat_message["message"] = "How often should I change it?"
        
        response2 = client.post("/api/chat/", json=sample_chat_message)
        assert response2.status_code == status.HTTP_200_OK
        data = response2.json()
        
        # Verify same conversation
        assert data["conversation_id"] == conversation_id
        assert len(data["message"]) > 0
    
    def test_chat_with_explicit_agent_mode(self, client, sample_chat_message):
        """Test chat with explicit agent mode selection."""
        sample_chat_message["mode"] = "mechanic"
        
        response = client.post("/api/chat/", json=sample_chat_message)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify mechanic agent was used
        assert data["agent"] == "mechanic"
    
    def test_chat_intent_detection(self, client):
        """Test automatic intent detection and agent routing."""
        # Maintenance question should route to mechanic
        maintenance_msg = {
            "message": "My engine is making a strange noise",
            "user_id": "test_user"
        }
        
        response = client.post("/api/chat/", json=maintenance_msg)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Should route to mechanic agent
        assert data["agent"] in ["mechanic", "general"]
    
    def test_chat_with_context(self, client):
        """Test chat with additional context."""
        message_with_context = {
            "message": "What's the recommended tire pressure?",
            "user_id": "test_user",
            "context": {
                "car_make": "Toyota",
                "car_model": "Camry",
                "car_year": 2020
            }
        }
        
        response = client.post("/api/chat/", json=message_with_context)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["message"]) > 0
    
    def test_chat_invalid_request(self, client):
        """Test chat with invalid request data."""
        invalid_message = {
            "user_id": "test_user"
            # Missing required 'message' field
        }
        
        response = client.post("/api/chat/", json=invalid_message)
        
        # Should return validation error
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_chat_empty_message(self, client):
        """Test chat with empty message."""
        empty_message = {
            "message": "",
            "user_id": "test_user"
        }
        
        response = client.post("/api/chat/", json=empty_message)
        
        # Should handle gracefully or return validation error
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_422_UNPROCESSABLE_ENTITY]
    
    def test_chat_response_metadata(self, client, sample_chat_message):
        """Test chat response includes proper metadata."""
        response = client.post("/api/chat/", json=sample_chat_message)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify metadata structure
        assert "metadata" in data
        metadata = data["metadata"]
        
        # Should include performance metrics
        assert isinstance(metadata, dict)
    
    def test_chat_multiple_agents(self, client):
        """Test different types of questions route to appropriate agents."""
        test_cases = [
            {
                "message": "I want to buy a used car",
                "expected_agents": ["buyer_guide", "general"]
            },
            {
                "message": "How do I list my car for sale?",
                "expected_agents": ["seller_assistant", "general"]
            },
            {
                "message": "What modifications can I do to my car?",
                "expected_agents": ["modification_expert", "general"]
            },
            {
                "message": "How do I join a car group?",
                "expected_agents": ["community_helper", "general"]
            }
        ]
        
        for test_case in test_cases:
            message = {
                "message": test_case["message"],
                "user_id": "test_user"
            }
            
            response = client.post("/api/chat/", json=message)
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            
            # Verify agent is one of the expected types
            assert data["agent"] in test_case["expected_agents"]
    
    def test_chat_conversation_persistence(self, client, sample_chat_message):
        """Test that chat messages are persisted in conversation."""
        # Send first message
        response1 = client.post("/api/chat/", json=sample_chat_message)
        conversation_id = response1.json()["conversation_id"]
        
        # Get conversation to verify message was saved
        conv_response = client.get(f"/api/conversations/{conversation_id}")
        assert conv_response.status_code == status.HTTP_200_OK
        
        conversation = conv_response.json()
        assert len(conversation["messages"]) >= 2  # User message + assistant response
