-- AI Agent Tables for SQL Server
-- Run this script to create the necessary tables in CCarDb database

USE CCarDb;
GO

-- Conversations table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'conversations')
BEGIN
    CREATE TABLE conversations (
        id NVARCHAR(50) PRIMARY KEY,
        user_id NVARCHAR(50) NOT NULL,
        title NVARCHAR(255),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        is_active BIT DEFAULT 1,
        metadata NVARCHAR(MAX)  -- JSON string
    );
    CREATE INDEX idx_conversations_user_id ON conversations(user_id);
    CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
END
GO

-- Messages table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'messages')
BEGIN
    CREATE TABLE messages (
        id NVARCHAR(50) PRIMARY KEY,
        conversation_id NVARCHAR(50) NOT NULL,
        role NVARCHAR(20) NOT NULL,  -- 'user', 'assistant', 'system'
        content NVARCHAR(MAX) NOT NULL,
        agent_type NVARCHAR(50),  -- 'general', 'mechanic', 'buyer_guide', etc.
        metadata NVARCHAR(MAX),  -- JSON string
        timestamp DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
    CREATE INDEX idx_messages_timestamp ON messages(timestamp DESC);
END
GO

-- Feedback table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'feedback')
BEGIN
    CREATE TABLE feedback (
        id NVARCHAR(50) PRIMARY KEY,
        conversation_id NVARCHAR(50),
        message_id NVARCHAR(50),
        type NVARCHAR(20) NOT NULL,  -- 'positive', 'negative', 'correction'
        rating INT,  -- 1-5
        comment NVARCHAR(MAX),
        data NVARCHAR(MAX),  -- JSON string for additional data
        timestamp DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_feedback_conversation_id ON feedback(conversation_id);
    CREATE INDEX idx_feedback_type ON feedback(type);
    CREATE INDEX idx_feedback_timestamp ON feedback(timestamp DESC);
END
GO

-- Analytics table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'analytics')
BEGIN
    CREATE TABLE analytics (
        id NVARCHAR(50) PRIMARY KEY,
        conversation_id NVARCHAR(50),
        user_id NVARCHAR(50),
        agent_type NVARCHAR(50),
        message_count INT DEFAULT 0,
        duration_seconds INT,
        satisfaction_score FLOAT,
        tokens_used INT,
        cost FLOAT,
        metadata NVARCHAR(MAX),  -- JSON string
        timestamp DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_analytics_conversation_id ON analytics(conversation_id);
    CREATE INDEX idx_analytics_user_id ON analytics(user_id);
    CREATE INDEX idx_analytics_agent_type ON analytics(agent_type);
    CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);
END
GO

-- Knowledge metadata table (for tracking knowledge entries)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'knowledge_metadata')
BEGIN
    CREATE TABLE knowledge_metadata (
        id NVARCHAR(50) PRIMARY KEY,
        category NVARCHAR(50) NOT NULL,
        source NVARCHAR(100),
        verified BIT DEFAULT 0,
        content_preview NVARCHAR(500),
        metadata NVARCHAR(MAX),  -- JSON string
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    CREATE INDEX idx_knowledge_category ON knowledge_metadata(category);
    CREATE INDEX idx_knowledge_verified ON knowledge_metadata(verified);
    CREATE INDEX idx_knowledge_created_at ON knowledge_metadata(created_at DESC);
END
GO

PRINT 'AI Agent tables created successfully!';
GO
