"""
Integration tests for agent management API endpoints.
"""
import pytest
from fastapi import status

class TestAgentAPI:
    """Test agent management endpoints."""
    
    def test_list_agents(self, client):
        """Test listing all available agents."""
        response = client.get("/api/agents/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify response structure
        assert "agents" in data
        agents = data["agents"]
        
        # Should have 6 specialized agents
        assert len(agents) >= 6
        
        # Verify agent structure
        for agent in agents:
            assert "agent_type" in agent
            assert "is_active" in agent
            assert "total_conversations" in agent
            assert "average_satisfaction" in agent
    
    def test_get_agent_status(self, client):
        """Test getting status for a specific agent."""
        agent_types = ["general", "mechanic", "buyer_guide", "seller_assistant", 
                      "modification_expert", "community_helper"]
        
        for agent_type in agent_types:
            response = client.get(f"/api/agents/{agent_type}/status")
            
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            
            # Verify status structure
            assert data["agent_type"] == agent_type
            assert "is_active" in data
            assert "total_conversations" in data
            assert "average_satisfaction" in data
    
    def test_get_nonexistent_agent_status(self, client):
        """Test getting status for non-existent agent."""
        response = client.get("/api/agents/nonexistent_agent/status")
        
        # Should return validation error or 404
        assert response.status_code in [status.HTTP_404_NOT_FOUND, status.HTTP_422_UNPROCESSABLE_ENTITY]
    
    def test_configure_agent(self, client):
        """Test updating agent configuration."""
        config_data = {
            "config": {
                "temperature": 0.8,
                "max_tokens": 500,
                "enabled": True
            }
        }
        
        response = client.post("/api/agents/mechanic/configure", json=config_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify configuration was applied
        assert data["agent_type"] == "mechanic"
        assert "config" in data
        assert data["config"]["temperature"] == 0.8
    
    def test_configure_agent_invalid_config(self, client):
        """Test configuring agent with invalid configuration."""
        invalid_configs = [
            {"config": {"temperature": 5.0}},  # Temperature out of range
            {"config": {"max_tokens": -100}},  # Negative tokens
            {"config": {"confidence_threshold": 2.0}},  # Threshold out of range
        ]
        
        for invalid_config in invalid_configs:
            response = client.post("/api/agents/mechanic/configure", json=invalid_config)
            
            # Should return validation error
            assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_get_agent_config(self, client):
        """Test getting current agent configuration."""
        response = client.get("/api/agents/mechanic/config")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify config structure
        assert "agent_type" in data
        assert "config" in data
        assert data["agent_type"] == "mechanic"
    
    def test_test_agent(self, client):
        """Test agent with sample message."""
        test_message = {
            "message": "What's the best oil for my car?",
            "user_id": "test_user",
            "context": {"car_make": "Honda"}
        }
        
        response = client.post("/api/agents/mechanic/test", json=test_message)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify response structure
        assert "text" in data
        assert "agent" in data
        assert "confidence" in data
        assert "metadata" in data
        assert data["agent"] == "mechanic"
        assert len(data["text"]) > 0
    
    def test_test_multiple_agents(self, client):
        """Test different agents with appropriate messages."""
        test_cases = [
            {
                "agent": "buyer_guide",
                "message": "I want to buy a used sedan"
            },
            {
                "agent": "seller_assistant",
                "message": "How do I price my car for sale?"
            },
            {
                "agent": "modification_expert",
                "message": "What exhaust system should I install?"
            },
            {
                "agent": "community_helper",
                "message": "How do I create a post?"
            }
        ]
        
        for test_case in test_cases:
            test_message = {
                "message": test_case["message"],
                "user_id": "test_user"
            }
            
            response = client.post(f"/api/agents/{test_case['agent']}/test", json=test_message)
            
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert data["agent"] == test_case["agent"]
    
    def test_get_agent_metrics(self, client):
        """Test getting agent performance metrics."""
        response = client.get("/api/agents/mechanic/metrics")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify metrics structure
        assert "agent_type" in data
        assert "total_messages" in data
        assert "average_confidence" in data
        assert "success_rate" in data
        assert data["agent_type"] == "mechanic"
    
    def test_enable_agent(self, client):
        """Test enabling an agent."""
        response = client.post("/api/agents/mechanic/enable")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        assert data["agent_type"] == "mechanic"
        assert data["is_active"] is True
    
    def test_disable_agent(self, client):
        """Test disabling an agent."""
        response = client.post("/api/agents/buyer_guide/disable")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        assert data["agent_type"] == "buyer_guide"
        assert data["is_active"] is False
    
    def test_disable_general_agent(self, client):
        """Test that general agent cannot be disabled."""
        response = client.post("/api/agents/general/disable")
        
        # Should return error (general agent is fallback)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_agent_configuration_persistence(self, client):
        """Test that agent configuration persists."""
        # Configure agent
        config_data = {
            "config": {
                "temperature": 0.9,
                "max_tokens": 600
            }
        }
        
        client.post("/api/agents/mechanic/configure", json=config_data)
        
        # Get configuration
        response = client.get("/api/agents/mechanic/config")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify configuration was saved
        assert data["config"]["temperature"] == 0.9
        assert data["config"]["max_tokens"] == 600
    
    def test_agent_test_does_not_affect_stats(self, client):
        """Test that testing an agent doesn't affect its statistics."""
        # Get initial metrics
        initial_response = client.get("/api/agents/mechanic/metrics")
        initial_count = initial_response.json()["total_messages"]
        
        # Test agent
        test_message = {
            "message": "Test message",
            "user_id": "test_user"
        }
        client.post("/api/agents/mechanic/test", json=test_message)
        
        # Get metrics again
        final_response = client.get("/api/agents/mechanic/metrics")
        final_count = final_response.json()["total_messages"]
        
        # Count should not increase (test doesn't affect stats)
        assert final_count == initial_count
    
    def test_configure_agent_with_custom_prompt(self, client):
        """Test configuring agent with custom system prompt."""
        config_data = {
            "config": {
                "system_prompt": "You are a helpful car mechanic assistant.",
                "personality": "friendly"
            }
        }
        
        response = client.post("/api/agents/mechanic/configure", json=config_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify custom prompt was set
        assert "system_prompt" in data["config"]
