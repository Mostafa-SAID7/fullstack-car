"""
Integration tests for conversations API endpoints.
"""
import pytest
from fastapi import status

class TestConversationsAPI:
    """Test conversation CRUD endpoints."""
    
    def test_create_conversation(self, client, sample_conversation_data):
        """Test creating a new conversation."""
        response = client.post("/api/conversations/", json=sample_conversation_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify conversation structure
        assert "id" in data
        assert data["user_id"] == sample_conversation_data["user_id"]
        assert data["title"] == sample_conversation_data["title"]
        assert "messages" in data
        assert "created_at" in data
        assert data["is_active"] is True
    
    def test_get_conversation(self, client, sample_conversation_data):
        """Test retrieving a specific conversation."""
        # Create conversation
        create_response = client.post("/api/conversations/", json=sample_conversation_data)
        conversation_id = create_response.json()["id"]
        
        # Get conversation
        response = client.get(f"/api/conversations/{conversation_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        assert data["id"] == conversation_id
        assert data["user_id"] == sample_conversation_data["user_id"]
    
    def test_get_nonexistent_conversation(self, client):
        """Test getting a conversation that doesn't exist."""
        response = client.get("/api/conversations/nonexistent_id")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_list_conversations(self, client, sample_conversation_data):
        """Test listing user conversations."""
        # Create multiple conversations
        for i in range(3):
            conv_data = sample_conversation_data.copy()
            conv_data["title"] = f"Test Conversation {i+1}"
            client.post("/api/conversations/", json=conv_data)
        
        # List conversations
        response = client.get(
            "/api/conversations/",
            params={"user_id": sample_conversation_data["user_id"]}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify response structure
        assert "conversations" in data
        assert "total" in data
        assert "page" in data
        assert "page_size" in data
        
        # Verify conversations were returned
        assert len(data["conversations"]) >= 3
        assert data["total"] >= 3
    
    def test_list_conversations_pagination(self, client, sample_conversation_data):
        """Test conversation list pagination."""
        # Create 5 conversations
        for i in range(5):
            conv_data = sample_conversation_data.copy()
            conv_data["title"] = f"Test Conversation {i+1}"
            client.post("/api/conversations/", json=conv_data)
        
        # Get first page (2 items)
        response1 = client.get(
            "/api/conversations/",
            params={
                "user_id": sample_conversation_data["user_id"],
                "page": 1,
                "page_size": 2
            }
        )
        
        assert response1.status_code == status.HTTP_200_OK
        data1 = response1.json()
        assert len(data1["conversations"]) == 2
        assert data1["page"] == 1
        
        # Get second page
        response2 = client.get(
            "/api/conversations/",
            params={
                "user_id": sample_conversation_data["user_id"],
                "page": 2,
                "page_size": 2
            }
        )
        
        assert response2.status_code == status.HTTP_200_OK
        data2 = response2.json()
        assert len(data2["conversations"]) == 2
        assert data2["page"] == 2
        
        # Verify different conversations
        conv1_ids = {c["id"] for c in data1["conversations"]}
        conv2_ids = {c["id"] for c in data2["conversations"]}
        assert conv1_ids.isdisjoint(conv2_ids)
    
    def test_delete_conversation(self, client, sample_conversation_data):
        """Test deleting a conversation."""
        # Create conversation
        create_response = client.post("/api/conversations/", json=sample_conversation_data)
        conversation_id = create_response.json()["id"]
        
        # Delete conversation
        response = client.delete(f"/api/conversations/{conversation_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["conversation_id"] == conversation_id
        
        # Verify conversation is deleted
        get_response = client.get(f"/api/conversations/{conversation_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_nonexistent_conversation(self, client):
        """Test deleting a conversation that doesn't exist."""
        response = client.delete("/api/conversations/nonexistent_id")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_archive_conversation(self, client, sample_conversation_data):
        """Test archiving a conversation."""
        # Create conversation
        create_response = client.post("/api/conversations/", json=sample_conversation_data)
        conversation_id = create_response.json()["id"]
        
        # Archive conversation
        response = client.post(f"/api/conversations/{conversation_id}/archive")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["conversation_id"] == conversation_id
        
        # Verify conversation is archived (is_active = False)
        get_response = client.get(f"/api/conversations/{conversation_id}")
        if get_response.status_code == status.HTTP_200_OK:
            conversation = get_response.json()
            assert conversation["is_active"] is False
    
    def test_get_conversation_messages(self, client, sample_conversation_data, sample_chat_message):
        """Test getting messages from a conversation."""
        # Create conversation with messages via chat
        sample_chat_message["user_id"] = sample_conversation_data["user_id"]
        chat_response = client.post("/api/chat/", json=sample_chat_message)
        conversation_id = chat_response.json()["conversation_id"]
        
        # Get messages
        response = client.get(f"/api/conversations/{conversation_id}/messages")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify response structure
        assert "conversation_id" in data
        assert "messages" in data
        assert "count" in data
        assert data["conversation_id"] == conversation_id
        assert len(data["messages"]) >= 2  # User + assistant messages
    
    def test_get_conversation_messages_pagination(self, client, sample_conversation_data, sample_chat_message):
        """Test message pagination."""
        # Create conversation with multiple messages
        sample_chat_message["user_id"] = sample_conversation_data["user_id"]
        chat_response = client.post("/api/chat/", json=sample_chat_message)
        conversation_id = chat_response.json()["conversation_id"]
        
        # Add more messages
        for i in range(3):
            msg = sample_chat_message.copy()
            msg["conversation_id"] = conversation_id
            msg["message"] = f"Follow-up question {i+1}"
            client.post("/api/chat/", json=msg)
        
        # Get messages with limit
        response = client.get(
            f"/api/conversations/{conversation_id}/messages",
            params={"limit": 3, "offset": 0}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["messages"]) <= 3
        assert data["limit"] == 3
        assert data["offset"] == 0
    
    def test_list_conversations_without_user_id(self, client):
        """Test listing conversations without user_id parameter."""
        response = client.get("/api/conversations/")
        
        # Should return validation error (user_id is required)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_conversation_ordering(self, client, sample_conversation_data):
        """Test conversations are ordered by most recent first."""
        # Create conversations with delays
        conv_ids = []
        for i in range(3):
            conv_data = sample_conversation_data.copy()
            conv_data["title"] = f"Conversation {i+1}"
            response = client.post("/api/conversations/", json=conv_data)
            conv_ids.append(response.json()["id"])
        
        # List conversations
        response = client.get(
            "/api/conversations/",
            params={"user_id": sample_conversation_data["user_id"]}
        )
        
        assert response.status_code == status.HTTP_200_OK
        conversations = response.json()["conversations"]
        
        # Most recent should be first
        assert conversations[0]["id"] == conv_ids[-1]
