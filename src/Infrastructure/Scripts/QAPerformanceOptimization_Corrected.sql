-- QA System Performance Optimization Script (Corrected for Existing Schema)
-- This script creates optimized indexes and performance enhancements for the QA system

USE [CCarDb]
GO

-- =============================================
-- QA Performance Optimization Indexes
-- =============================================

PRINT 'Starting QA Performance Optimization (Corrected for Existing Schema)...'

-- Questions Table Optimizations
PRINT 'Optimizing Questions table indexes...'

-- Composite index for category-based queries with vote sorting
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Questions_Category_Votes_CreatedAt_Optimized')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Questions_Category_Votes_CreatedAt_Optimized]
    ON [Questions] ([CategoryId], [UpvotesCount] DESC, [CreatedAt] DESC)
    INCLUDE ([Id], [Title], [ViewsCount], [AnswersCount], [AcceptedAnswerId], [Status])
    WITH (FILLFACTOR = 90)
    PRINT 'Created optimized category-vote-date index for Questions'
END

-- Index for unanswered questions (expert notifications)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Questions_Unanswered_Category_CreatedAt')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Questions_Unanswered_Category_CreatedAt]
    ON [Questions] ([AnswersCount], [CategoryId], [CreatedAt] DESC)
    INCLUDE ([Id], [Title], [UserId])
    WHERE [AnswersCount] = 0 AND [Status] != 'Closed' AND [IsDeleted] = 0
    WITH (FILLFACTOR = 95)
    PRINT 'Created unanswered questions index'
END

-- Index for trending questions (high activity)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Questions_Trending_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Questions_Trending_Performance]
    ON [Questions] ([CreatedAt] DESC, [ViewsCount] DESC, [UpvotesCount] DESC)
    INCLUDE ([Id], [Title], [CategoryId], [AnswersCount])
    WHERE [IsDeleted] = 0
    WITH (FILLFACTOR = 90)
    PRINT 'Created trending questions performance index'
END

-- Index for question search by status and priority
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Questions_Status_Priority_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Questions_Status_Priority_Performance]
    ON [Questions] ([Status], [Priority], [CreatedAt] DESC)
    INCLUDE ([Id], [Title], [CategoryId], [UserId], [UpvotesCount])
    WHERE [IsDeleted] = 0
    WITH (FILLFACTOR = 90)
    PRINT 'Created status-priority performance index for Questions'
END

-- Answers Table Optimizations
PRINT 'Optimizing Answers table indexes...'

-- Check if Answers table has the expected columns
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Answers' AND COLUMN_NAME = 'QuestionId')
BEGIN
    -- Composite index for question answers with vote sorting
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Answers_QuestionId_Votes_IsAccepted_Optimized')
    BEGIN
        CREATE NONCLUSTERED INDEX [IX_Answers_QuestionId_Votes_IsAccepted_Optimized]
        ON [Answers] ([QuestionId], [IsAccepted] DESC, [UpvotesCount] DESC, [CreatedAt] ASC)
        INCLUDE ([Id], [UserId], [Content], [AcceptedAt])
        WHERE [IsDeleted] = 0
        WITH (FILLFACTOR = 90)
        PRINT 'Created optimized question-answers index'
    END

    -- Index for user answer history
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Answers_UserId_CreatedAt_Performance')
    BEGIN
        CREATE NONCLUSTERED INDEX [IX_Answers_UserId_CreatedAt_Performance]
        ON [Answers] ([UserId], [CreatedAt] DESC)
        INCLUDE ([Id], [QuestionId], [UpvotesCount], [IsAccepted])
        WHERE [IsDeleted] = 0
        WITH (FILLFACTOR = 95)
        PRINT 'Created user answer history performance index'
    END
END
ELSE
BEGIN
    PRINT 'Answers table schema differs from expected - skipping Answers optimizations'
END

-- QuestionVotes Table Optimizations (if exists)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'QuestionVotes')
BEGIN
    PRINT 'Optimizing QuestionVotes table indexes...'

    -- Composite index for vote aggregation
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QuestionVotes_QuestionId_VoteType_Performance')
    BEGIN
        CREATE NONCLUSTERED INDEX [IX_QuestionVotes_QuestionId_VoteType_Performance]
        ON [QuestionVotes] ([QuestionId], [VoteType])
        INCLUDE ([UserId], [CreatedAt])
        WITH (FILLFACTOR = 95)
        PRINT 'Created question vote aggregation performance index'
    END

    -- Index for user voting history
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QuestionVotes_UserId_CreatedAt_Performance')
    BEGIN
        CREATE NONCLUSTERED INDEX [IX_QuestionVotes_UserId_CreatedAt_Performance]
        ON [QuestionVotes] ([UserId], [CreatedAt] DESC)
        INCLUDE ([QuestionId], [VoteType])
        WITH (FILLFACTOR = 95)
        PRINT 'Created user voting history performance index'
    END
END

-- AnswerVotes Table Optimizations (if exists)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AnswerVotes')
BEGIN
    PRINT 'Optimizing AnswerVotes table indexes...'

    -- Composite index for answer vote aggregation
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AnswerVotes_AnswerId_VoteType_Performance')
    BEGIN
        CREATE NONCLUSTERED INDEX [IX_AnswerVotes_AnswerId_VoteType_Performance]
        ON [AnswerVotes] ([AnswerId], [VoteType])
        INCLUDE ([UserId], [CreatedAt])
        WITH (FILLFACTOR = 95)
        PRINT 'Created answer vote aggregation performance index'
    END
END

-- QuestionCategories Table Optimizations
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'QuestionCategories')
BEGIN
    PRINT 'Optimizing QuestionCategories table indexes...'

    -- Index for category-based queries
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QuestionCategories_Name_Performance')
    BEGIN
        CREATE NONCLUSTERED INDEX [IX_QuestionCategories_Name_Performance]
        ON [QuestionCategories] ([Name])
        INCLUDE ([Id], [Description], [IsActive])
        WHERE [IsDeleted] = 0
        WITH (FILLFACTOR = 95)
        PRINT 'Created category name performance index'
    END
END

-- QuestionTags Table Optimizations
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'QuestionTags')
BEGIN
    PRINT 'Optimizing QuestionTags table indexes...'

    -- Index for tag-based searches
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QuestionTags_TagId_Performance')
    BEGIN
        CREATE NONCLUSTERED INDEX [IX_QuestionTags_TagId_Performance]
        ON [QuestionTags] ([TagId])
        INCLUDE ([QuestionId])
        WITH (FILLFACTOR = 95)
        PRINT 'Created tag-based search performance index'
    END

    -- Index for question-tag relationships
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QuestionTags_QuestionId_Performance')
    BEGIN
        CREATE NONCLUSTERED INDEX [IX_QuestionTags_QuestionId_Performance]
        ON [QuestionTags] ([QuestionId])
        INCLUDE ([TagId])
        WITH (FILLFACTOR = 95)
        PRINT 'Created question-tag relationship performance index'
    END
END

-- QuestionViews Table Optimizations (for analytics)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'QuestionViews')
BEGIN
    PRINT 'Optimizing QuestionViews table indexes...'

    -- Index for view analytics
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QuestionViews_QuestionId_ViewedAt_Performance')
    BEGIN
        CREATE NONCLUSTERED INDEX [IX_QuestionViews_QuestionId_ViewedAt_Performance]
        ON [QuestionViews] ([QuestionId], [ViewedAt] DESC)
        INCLUDE ([UserId], [IpAddress])
        WITH (FILLFACTOR = 90)
        PRINT 'Created question views analytics performance index'
    END
END

-- =============================================
-- Performance Statistics Updates
-- =============================================

PRINT 'Updating table statistics for optimal query plans...'

-- Update statistics for all existing QA tables
DECLARE @TableName NVARCHAR(128)
DECLARE table_cursor CURSOR FOR
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME IN ('Questions', 'Answers', 'QuestionVotes', 'AnswerVotes', 'QuestionCategories', 'QuestionTags', 'QuestionViews', 'QuestionBookmarks', 'AnswerComments')

OPEN table_cursor
FETCH NEXT FROM table_cursor INTO @TableName

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @sql NVARCHAR(MAX) = 'UPDATE STATISTICS [' + @TableName + '] WITH FULLSCAN'
    EXEC sp_executesql @sql
    PRINT 'Updated statistics for table: ' + @TableName
    
    FETCH NEXT FROM table_cursor INTO @TableName
END

CLOSE table_cursor
DEALLOCATE table_cursor

PRINT 'Statistics updated successfully'

-- =============================================
-- Performance Monitoring Views (Updated)
-- =============================================

PRINT 'Creating/updating performance monitoring views...'

-- Drop and recreate the performance view with correct table names
IF OBJECT_ID('vw_QATablePerformance', 'V') IS NOT NULL
    DROP VIEW vw_QATablePerformance
GO

CREATE VIEW vw_QATablePerformance AS
SELECT 
    t.name as table_name,
    p.rows as row_count,
    (SUM(a.total_pages) * 8) / 1024.0 as total_space_mb,
    (SUM(a.used_pages) * 8) / 1024.0 as used_space_mb,
    ((SUM(a.total_pages) - SUM(a.used_pages)) * 8) / 1024.0 as unused_space_mb,
    i.name as clustered_index_name
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id AND i.index_id IN (0, 1)
JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
JOIN sys.allocation_units a ON p.partition_id = a.container_id
WHERE t.name IN ('Questions', 'Answers', 'QuestionVotes', 'AnswerVotes', 'QuestionCategories', 'QuestionTags', 'QuestionViews')
GROUP BY t.name, p.rows, i.name
GO

PRINT 'Updated QA table performance metrics view'

-- Create view for QA performance metrics
IF OBJECT_ID('vw_QAPerformanceMetrics', 'V') IS NOT NULL
    DROP VIEW vw_QAPerformanceMetrics
GO

CREATE VIEW vw_QAPerformanceMetrics AS
SELECT 
    'Questions' as entity_type,
    COUNT(*) as total_count,
    COUNT(CASE WHEN CreatedAt >= DATEADD(day, -1, GETUTCDATE()) THEN 1 END) as last_24h_count,
    COUNT(CASE WHEN CreatedAt >= DATEADD(day, -7, GETUTCDATE()) THEN 1 END) as last_week_count,
    AVG(CAST(ViewsCount as FLOAT)) as avg_views,
    AVG(CAST(UpvotesCount as FLOAT)) as avg_upvotes,
    AVG(CAST(AnswersCount as FLOAT)) as avg_answers
FROM Questions
WHERE IsDeleted = 0

UNION ALL

SELECT 
    'Answers' as entity_type,
    COUNT(*) as total_count,
    COUNT(CASE WHEN CreatedAt >= DATEADD(day, -1, GETUTCDATE()) THEN 1 END) as last_24h_count,
    COUNT(CASE WHEN CreatedAt >= DATEADD(day, -7, GETUTCDATE()) THEN 1 END) as last_week_count,
    0 as avg_views,
    AVG(CAST(UpvotesCount as FLOAT)) as avg_upvotes,
    0 as avg_answers
FROM Answers
WHERE IsDeleted = 0
GO

PRINT 'Created QA performance metrics view'

-- =============================================
-- Updated Maintenance Procedures
-- =============================================

PRINT 'Creating/updating maintenance procedures...'

-- Drop and recreate the maintenance procedure
IF OBJECT_ID('sp_QAIndexMaintenance', 'P') IS NOT NULL
    DROP PROCEDURE sp_QAIndexMaintenance
GO

CREATE PROCEDURE sp_QAIndexMaintenance
AS
BEGIN
    SET NOCOUNT ON
    
    DECLARE @sql NVARCHAR(MAX)
    DECLARE @table_name NVARCHAR(128)
    DECLARE @index_name NVARCHAR(128)
    DECLARE @fragmentation FLOAT
    
    -- Cursor for QA table indexes
    DECLARE index_cursor CURSOR FOR
    SELECT 
        t.name as table_name,
        i.name as index_name,
        COALESCE(s.avg_fragmentation_in_percent, 0) as avg_fragmentation_in_percent
    FROM sys.tables t
    JOIN sys.indexes i ON t.object_id = i.object_id
    LEFT JOIN sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') s 
        ON t.object_id = s.object_id AND i.index_id = s.index_id
    WHERE t.name IN ('Questions', 'Answers', 'QuestionVotes', 'AnswerVotes', 'QuestionCategories', 'QuestionTags', 'QuestionViews')
        AND i.name IS NOT NULL
        AND COALESCE(s.avg_fragmentation_in_percent, 0) > 5
    
    OPEN index_cursor
    FETCH NEXT FROM index_cursor INTO @table_name, @index_name, @fragmentation
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @fragmentation > 30
        BEGIN
            -- Rebuild index if fragmentation > 30%
            SET @sql = 'ALTER INDEX [' + @index_name + '] ON [' + @table_name + '] REBUILD WITH (FILLFACTOR = 90)'
            PRINT 'Rebuilding index: ' + @index_name + ' on table: ' + @table_name + ' (Fragmentation: ' + CAST(@fragmentation AS VARCHAR(10)) + '%)'
        END
        ELSE IF @fragmentation > 5
        BEGIN
            -- Reorganize index if fragmentation 5-30%
            SET @sql = 'ALTER INDEX [' + @index_name + '] ON [' + @table_name + '] REORGANIZE'
            PRINT 'Reorganizing index: ' + @index_name + ' on table: ' + @table_name + ' (Fragmentation: ' + CAST(@fragmentation AS VARCHAR(10)) + '%)'
        END
        
        IF @sql IS NOT NULL
        BEGIN
            EXEC sp_executesql @sql
            SET @sql = NULL
        END
        
        FETCH NEXT FROM index_cursor INTO @table_name, @index_name, @fragmentation
    END
    
    CLOSE index_cursor
    DEALLOCATE index_cursor
    
    -- Update statistics after maintenance
    PRINT 'Updating statistics after index maintenance...'
    
    DECLARE @StatsSql NVARCHAR(MAX)
    DECLARE stats_cursor CURSOR FOR
    SELECT TABLE_NAME 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_NAME IN ('Questions', 'Answers', 'QuestionVotes', 'AnswerVotes', 'QuestionCategories', 'QuestionTags', 'QuestionViews')
    
    OPEN stats_cursor
    FETCH NEXT FROM stats_cursor INTO @table_name
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @StatsSql = 'UPDATE STATISTICS [' + @table_name + '] WITH FULLSCAN'
        EXEC sp_executesql @StatsSql
        PRINT 'Updated statistics for: ' + @table_name
        
        FETCH NEXT FROM stats_cursor INTO @table_name
    END
    
    CLOSE stats_cursor
    DEALLOCATE stats_cursor
    
    PRINT 'QA index maintenance completed successfully'
END
GO

PRINT 'Updated QA index maintenance procedure'

-- =============================================
-- Performance Baseline Update
-- =============================================

PRINT 'Updating performance baseline...'

-- Update baseline metrics with current performance targets
IF EXISTS (SELECT * FROM QAPerformanceBaseline WHERE MetricName = 'AverageQuestionQueryTime')
BEGIN
    UPDATE QAPerformanceBaseline 
    SET MetricValue = 150.0, CreatedAt = GETUTCDATE()
    WHERE MetricName = 'AverageQuestionQueryTime'
    PRINT 'Updated existing performance baselines'
END
ELSE
BEGIN
    INSERT INTO QAPerformanceBaseline (MetricName, MetricValue, MetricUnit, Category) VALUES
    ('AverageQuestionQueryTime', 150.0, 'milliseconds', 'Database'),
    ('AverageAnswerQueryTime', 100.0, 'milliseconds', 'Database'),
    ('AverageSearchTime', 1500.0, 'milliseconds', 'Search'),
    ('AverageVoteQueryTime', 50.0, 'milliseconds', 'Database'),
    ('MaxConcurrentConnections', 1000, 'connections', 'SignalR'),
    ('CacheHitRate', 85.0, 'percentage', 'Caching'),
    ('CDNCacheHitRate', 90.0, 'percentage', 'CDN'),
    ('DatabaseCPUUsage', 60.0, 'percentage', 'System'),
    ('DatabaseMemoryUsage', 70.0, 'percentage', 'System')
    PRINT 'Inserted new performance baseline metrics'
END

PRINT 'QA Performance Optimization completed successfully!'
PRINT 'Summary:'
PRINT '- Created optimized indexes for existing QA tables'
PRINT '- Updated table statistics for all QA tables'
PRINT '- Created/updated performance monitoring views'
PRINT '- Created/updated maintenance procedures'
PRINT '- Updated performance baselines'
PRINT '- Optimized for dual frontend usage (Angular + React)'