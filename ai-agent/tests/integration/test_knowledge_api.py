"""
Integration tests for knowledge base API endpoints.
"""
import pytest
from fastapi import status
import io

class TestKnowledgeAPI:
    """Test knowledge base endpoints."""
    
    def test_add_knowledge(self, client, sample_knowledge_entry):
        """Test adding a knowledge entry."""
        response = client.post("/api/knowledge/", json=sample_knowledge_entry)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify entry structure
        assert "id" in data
        assert data["content"] == sample_knowledge_entry["content"]
        assert data["category"] == sample_knowledge_entry["category"]
        assert data["source"] == sample_knowledge_entry["source"]
    
    def test_search_knowledge(self, client, sample_knowledge_entry):
        """Test searching knowledge base."""
        # Add knowledge entry
        client.post("/api/knowledge/", json=sample_knowledge_entry)
        
        # Search for it
        response = client.get(
            "/api/knowledge/search",
            params={"query": "oil change", "limit": 10}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify search results
        assert "results" in data
        assert "total" in data
        assert len(data["results"]) > 0
        
        # Verify result structure
        result = data["results"][0]
        assert "content" in result
        assert "category" in result
        assert "similarity" in result
    
    def test_search_knowledge_by_category(self, client, sample_knowledge_entry):
        """Test searching knowledge with category filter."""
        # Add knowledge entry
        client.post("/api/knowledge/", json=sample_knowledge_entry)
        
        # Search with category filter
        response = client.get(
            "/api/knowledge/search",
            params={
                "query": "oil",
                "category": "maintenance",
                "limit": 10
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # All results should be in maintenance category
        for result in data["results"]:
            assert result["category"] == "maintenance"
    
    def test_search_knowledge_empty_query(self, client):
        """Test searching with empty query."""
        response = client.get(
            "/api/knowledge/search",
            params={"query": "", "limit": 10}
        )
        
        # Should handle gracefully
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_422_UNPROCESSABLE_ENTITY]
    
    def test_update_knowledge(self, client, sample_knowledge_entry):
        """Test updating a knowledge entry."""
        # Add knowledge entry
        add_response = client.post("/api/knowledge/", json=sample_knowledge_entry)
        entry_id = add_response.json()["id"]
        
        # Update entry
        updated_entry = sample_knowledge_entry.copy()
        updated_entry["content"] = "Updated: Oil changes should be done every 3,000-5,000 miles."
        
        response = client.put(f"/api/knowledge/{entry_id}", json=updated_entry)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify update
        assert data["id"] == entry_id
        assert "Updated:" in data["content"]
    
    def test_update_nonexistent_knowledge(self, client, sample_knowledge_entry):
        """Test updating a knowledge entry that doesn't exist."""
        response = client.put("/api/knowledge/nonexistent_id", json=sample_knowledge_entry)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_knowledge(self, client, sample_knowledge_entry):
        """Test deleting a knowledge entry."""
        # Add knowledge entry
        add_response = client.post("/api/knowledge/", json=sample_knowledge_entry)
        entry_id = add_response.json()["id"]
        
        # Delete entry
        response = client.delete(f"/api/knowledge/{entry_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["entry_id"] == entry_id
        
        # Verify deletion - search should not find it
        search_response = client.get(
            "/api/knowledge/search",
            params={"query": sample_knowledge_entry["content"][:50], "limit": 10}
        )
        
        # Entry should not be in results or have lower similarity
        if search_response.status_code == status.HTTP_200_OK:
            results = search_response.json()["results"]
            matching_results = [r for r in results if r["id"] == entry_id]
            assert len(matching_results) == 0
    
    def test_delete_nonexistent_knowledge(self, client):
        """Test deleting a knowledge entry that doesn't exist."""
        response = client.delete("/api/knowledge/nonexistent_id")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_upload_knowledge_text_file(self, client):
        """Test uploading a text file to knowledge base."""
        # Create a text file
        file_content = b"This is a test document about car maintenance. Regular oil changes are important."
        file = io.BytesIO(file_content)
        
        response = client.post(
            "/api/knowledge/upload",
            files={"file": ("test.txt", file, "text/plain")},
            data={"category": "maintenance", "source": "upload"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify upload
        assert "entry_id" in data
        assert data["filename"] == "test.txt"
        assert data["content_length"] > 0
    
    def test_upload_knowledge_markdown_file(self, client):
        """Test uploading a markdown file."""
        file_content = b"# Car Maintenance Guide\n\n## Oil Changes\n\nChange oil every 5,000 miles."
        file = io.BytesIO(file_content)
        
        response = client.post(
            "/api/knowledge/upload",
            files={"file": ("guide.md", file, "text/markdown")},
            data={"category": "maintenance", "source": "upload"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        assert data["filename"] == "guide.md"
        assert data["content_length"] > 0
    
    def test_upload_knowledge_unsupported_file(self, client):
        """Test uploading an unsupported file type."""
        file_content = b"Binary content"
        file = io.BytesIO(file_content)
        
        response = client.post(
            "/api/knowledge/upload",
            files={"file": ("test.exe", file, "application/octet-stream")},
            data={"category": "maintenance", "source": "upload"}
        )
        
        # Should return error for unsupported file type
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_bulk_upload_knowledge(self, client):
        """Test bulk uploading multiple files."""
        # Create multiple text files
        files = [
            ("file1.txt", b"Content about oil changes"),
            ("file2.txt", b"Content about tire maintenance"),
            ("file3.txt", b"Content about brake inspection")
        ]
        
        file_objects = [
            ("files", (name, io.BytesIO(content), "text/plain"))
            for name, content in files
        ]
        
        response = client.post(
            "/api/knowledge/upload/bulk",
            files=file_objects,
            data={"category": "maintenance", "source": "bulk_upload"}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify bulk upload results
        assert "total" in data
        assert "successful" in data
        assert "failed" in data
        assert "entries" in data
        
        assert data["total"] == 3
        assert data["successful"] >= 0
        assert len(data["entries"]) == 3
    
    def test_list_categories(self, client):
        """Test listing all knowledge categories."""
        response = client.get("/api/knowledge/categories")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify categories
        assert "categories" in data
        categories = data["categories"]
        
        # Should have all defined categories
        assert len(categories) >= 7
        
        # Verify category structure
        for category in categories:
            assert "value" in category
            assert "label" in category
    
    def test_get_knowledge_stats(self, client, sample_knowledge_entry):
        """Test getting knowledge base statistics."""
        # Add some knowledge entries
        for i in range(3):
            entry = sample_knowledge_entry.copy()
            entry["content"] = f"Test content {i+1}"
            client.post("/api/knowledge/", json=entry)
        
        response = client.get("/api/knowledge/stats")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify stats structure
        assert "total_entries" in data or "count" in data
    
    def test_verify_knowledge(self, client, sample_knowledge_entry):
        """Test marking a knowledge entry as verified."""
        # Add knowledge entry
        add_response = client.post("/api/knowledge/", json=sample_knowledge_entry)
        entry_id = add_response.json()["id"]
        
        # Verify entry
        response = client.post(f"/api/knowledge/{entry_id}/verify")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        assert data["entry_id"] == entry_id
        assert data["verified"] is True
    
    def test_search_knowledge_similarity_threshold(self, client, sample_knowledge_entry):
        """Test that search returns results with good similarity scores."""
        # Add knowledge entry
        client.post("/api/knowledge/", json=sample_knowledge_entry)
        
        # Search with relevant query
        response = client.get(
            "/api/knowledge/search",
            params={"query": "oil change maintenance", "limit": 10}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify similarity scores
        if len(data["results"]) > 0:
            for result in data["results"]:
                # Similarity should be between 0 and 1
                assert 0 <= result["similarity"] <= 1
    
    def test_add_knowledge_with_metadata(self, client):
        """Test adding knowledge with custom metadata."""
        entry_with_metadata = {
            "content": "Synthetic oil lasts longer than conventional oil.",
            "category": "maintenance",
            "source": "test",
            "metadata": {
                "topic": "oil_types",
                "difficulty": "beginner",
                "tags": ["oil", "synthetic", "maintenance"]
            }
        }
        
        response = client.post("/api/knowledge/", json=entry_with_metadata)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Verify metadata was saved
        assert "metadata" in data
        assert data["metadata"]["topic"] == "oil_types"
    
    def test_knowledge_search_limit(self, client, sample_knowledge_entry):
        """Test search respects limit parameter."""
        # Add multiple entries
        for i in range(5):
            entry = sample_knowledge_entry.copy()
            entry["content"] = f"Oil change tip {i+1}: {sample_knowledge_entry['content']}"
            client.post("/api/knowledge/", json=entry)
        
        # Search with limit
        response = client.get(
            "/api/knowledge/search",
            params={"query": "oil change", "limit": 3}
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Should return at most 3 results
        assert len(data["results"]) <= 3
