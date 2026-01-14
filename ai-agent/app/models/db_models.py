from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Vehicle(Base):
    __tablename__ = "Vehicles"
    # Assuming standard entity columns based on common .NET patterns
    # Adjust column names if they differ in the actual DB
    Id = Column(Integer, primary_key=True, index=True)
    Make = Column(String)
    Model = Column(String)
    Year = Column(Integer)
    Price = Column(Float)
    Description = Column(String, nullable=True)
    Mileage = Column(Integer, nullable=True)
    IsSold = Column(Boolean, default=False)

class Post(Base):
    __tablename__ = "Posts"
    Id = Column(Integer, primary_key=True, index=True)
    Content = Column(String)
    Created = Column(DateTime, default=datetime.utcnow)
    UserId = Column(String)

# New tables for AI Agent Enhancement

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    metadata = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    
    # Relationship
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="conversation", cascade="all, delete-orphan")
    metrics = relationship("ConversationMetric", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String, nullable=False)  # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    agent_type = Column(String, nullable=True)  # 'mechanic', 'buyer_guide', etc.
    metadata = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationship
    conversation = relationship("Conversation", back_populates="messages")
    feedback = relationship("Feedback", back_populates="message", cascade="all, delete-orphan")

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    message_id = Column(String, ForeignKey("messages.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False, index=True)  # 'positive', 'negative', 'correction'
    data = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="feedback")
    message = relationship("Message", back_populates="feedback")

class ConversationMetric(Base):
    __tablename__ = "conversation_metrics"
    
    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String, nullable=False, index=True)
    agent_type = Column(String, nullable=False, index=True)
    message_count = Column(Integer, default=0)
    duration_seconds = Column(Integer, nullable=True)
    satisfaction_score = Column(Float, nullable=True)
    resolved = Column(Boolean, default=False)
    tokens_used = Column(Integer, default=0)
    cost = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationship
    conversation = relationship("Conversation", back_populates="metrics")

class KnowledgeEntry(Base):
    __tablename__ = "knowledge_entries"
    
    id = Column(String, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False, index=True)  # 'maintenance', 'diagnostics', etc.
    metadata = Column(JSON, nullable=True)
    source = Column(String, nullable=False, index=True)  # 'manual', 'user_correction', 'community_post', 'external'
    verified = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

