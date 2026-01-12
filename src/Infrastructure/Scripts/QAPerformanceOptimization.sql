-- QA System Performance Optimization Script
-- This script creates optimized indexes and performance enhancements for the QA system

USE [CCarDb]
GO

-- =============================================
-- QA Performance Optimization Indexes
-- =============================================

PRINT 'Starting QA Performance Optimization...'

-- Questions Table Optimizations
PRINT 'Optimizing Questions table indexes...'

-- Composite index for category-based queries with vote sorting
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Questions_Category_VoteScore_CreatedAt_Optimized')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Questions_Category_VoteScore_CreatedAt_Optimized]
    ON [Questions] ([Category], [VoteScore] DESC, [CreatedAt] DESC)
    INCLUDE ([Id], [Title], [ViewCount], [AnswerCount], [AcceptedAnswerId], [IsClosed])
    WITH (ONLINE = ON, FILLFACTOR = 90)
    PRINT 'Created optimized category-vote-date index for Questions'
END

-- Index for unanswered questions (expert notifications)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Questions_Unanswered_Category_CreatedAt')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Questions_Unanswered_Category_CreatedAt]
    ON [Questions] ([AnswerCount], [Category], [CreatedAt] DESC)
    WHERE [AnswerCount] = 0 AND [IsClosed] = 0 AND [IsDeleted] = 0
    INCLUDE ([Id], [Title], [UserId])
    WITH (ONLINE = ON, FILLFACTOR = 95)
    PRINT 'Created unanswered questions index'
END

-- Index for trending questions (high activity)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Questions_Trending_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Questions_Trending_Performance]
    ON [Questions] ([CreatedAt] DESC, [ViewCount] DESC, [VoteScore] DESC)
    WHERE [CreatedAt] >= DATEADD(day, -7, GETUTCDATE()) AND [IsDeleted] = 0
    INCLUDE ([Id], [Title], [Category], [AnswerCount])
    WITH (ONLINE = ON, FILLFACTOR = 90)
    PRINT 'Created trending questions performance index'
END

-- Full-text search optimization
IF NOT EXISTS (SELECT * FROM sys.fulltext_indexes WHERE object_id = OBJECT_ID('Questions'))
BEGIN
    -- Create full-text catalog if it doesn't exist
    IF NOT EXISTS (SELECT * FROM sys.fulltext_catalogs WHERE name = 'QASearchCatalog')
    BEGIN
        CREATE FULLTEXT CATALOG QASearchCatalog AS DEFAULT
        PRINT 'Created QA search catalog'
    END
    
    -- Create full-text index on Questions
    CREATE FULLTEXT INDEX ON [Questions] 
    (
        [Title] LANGUAGE 1033,
        [Content] LANGUAGE 1033
    )
    KEY INDEX [PK_Questions]
    ON QASearchCatalog
    WITH CHANGE_TRACKING AUTO
    PRINT 'Created full-text index for Questions'
END

-- Answers Table Optimizations
PRINT 'Optimizing Answers table indexes...'

-- Composite index for question answers with vote sorting
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Answers_QuestionId_VoteScore_IsAccepted_Optimized')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Answers_QuestionId_VoteScore_IsAccepted_Optimized]
    ON [Answers] ([QuestionId], [IsAccepted] DESC, [VoteScore] DESC, [CreatedAt] ASC)
    INCLUDE ([Id], [UserId], [Content], [AcceptedAt])
    WHERE [IsDeleted] = 0
    WITH (ONLINE = ON, FILLFACTOR = 90)
    PRINT 'Created optimized question-answers index'
END

-- Index for user answer history
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Answers_UserId_CreatedAt_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Answers_UserId_CreatedAt_Performance]
    ON [Answers] ([UserId], [CreatedAt] DESC)
    INCLUDE ([Id], [QuestionId], [VoteScore], [IsAccepted])
    WHERE [IsDeleted] = 0
    WITH (ONLINE = ON, FILLFACTOR = 95)
    PRINT 'Created user answer history performance index'
END

-- Full-text search for answers
IF NOT EXISTS (SELECT * FROM sys.fulltext_indexes WHERE object_id = OBJECT_ID('Answers'))
BEGIN
    CREATE FULLTEXT INDEX ON [Answers] 
    (
        [Content] LANGUAGE 1033
    )
    KEY INDEX [PK_Answers]
    ON QASearchCatalog
    WITH CHANGE_TRACKING AUTO
    PRINT 'Created full-text index for Answers'
END

-- QAVotes Table Optimizations
PRINT 'Optimizing QAVotes table indexes...'

-- Composite index for vote aggregation
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QAVotes_ContentId_Type_VoteType_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_QAVotes_ContentId_Type_VoteType_Performance]
    ON [QAVotes] ([ContentId], [ContentType], [VoteType])
    INCLUDE ([UserId], [CreatedAt])
    WITH (ONLINE = ON, FILLFACTOR = 95)
    PRINT 'Created vote aggregation performance index'
END

-- Index for user voting history
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QAVotes_UserId_CreatedAt_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_QAVotes_UserId_CreatedAt_Performance]
    ON [QAVotes] ([UserId], [CreatedAt] DESC)
    INCLUDE ([ContentId], [ContentType], [VoteType])
    WITH (ONLINE = ON, FILLFACTOR = 95)
    PRINT 'Created user voting history performance index'
END

-- UserReputation Table Optimizations
PRINT 'Optimizing UserReputation table indexes...'

-- Index for reputation leaderboard
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_UserReputation_Score_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_UserReputation_Score_Performance]
    ON [UserReputation] ([ReputationScore] DESC)
    INCLUDE ([UserId], [QuestionsAsked], [AnswersGiven], [AcceptedAnswers], [ExpertiseAreas])
    WITH (ONLINE = ON, FILLFACTOR = 90)
    PRINT 'Created reputation leaderboard performance index'
END

-- QAExperts Table Optimizations
PRINT 'Optimizing QAExperts table indexes...'

-- Index for expert notifications
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QAExperts_Category_Level_Notifications')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_QAExperts_Category_Level_Notifications]
    ON [QAExperts] ([CategoryId], [ExpertiseLevel], [NotificationEnabled])
    INCLUDE ([UserId], [ResponseRate], [AverageRating])
    WITH (ONLINE = ON, FILLFACTOR = 95)
    PRINT 'Created expert notifications performance index'
END

-- QAAnalytics Table Optimizations
PRINT 'Optimizing QAAnalytics table indexes...'

-- Index for analytics queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QAAnalytics_Date_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_QAAnalytics_Date_Performance]
    ON [QAAnalytics] ([Date] DESC)
    INCLUDE ([QuestionsAsked], [QuestionsAnswered], [AnswersAccepted], [TotalVotes], [UniqueUsers], [AverageResponseTime], [TopCategory])
    WITH (ONLINE = ON, FILLFACTOR = 90)
    PRINT 'Created analytics performance index'
END

-- QAUserActivity Table Optimizations
PRINT 'Optimizing QAUserActivity table indexes...'

-- Composite index for user activity queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QAUserActivity_UserId_Date_Type_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_QAUserActivity_UserId_Date_Type_Performance]
    ON [QAUserActivity] ([UserId], [CreatedAt] DESC, [ActivityType])
    INCLUDE ([ContentId], [Category], [ReputationChange])
    WITH (ONLINE = ON, FILLFACTOR = 90)
    PRINT 'Created user activity performance index'
END

-- Index for activity type analysis
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QAUserActivity_Type_Date_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_QAUserActivity_Type_Date_Performance]
    ON [QAUserActivity] ([ActivityType], [CreatedAt] DESC)
    INCLUDE ([UserId], [Category], [ReputationChange])
    WITH (ONLINE = ON, FILLFACTOR = 95)
    PRINT 'Created activity type analysis performance index'
END

-- QuestionTags Table Optimizations
PRINT 'Optimizing QuestionTags table indexes...'

-- Index for tag-based searches
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_QuestionTags_TagId_Performance')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_QuestionTags_TagId_Performance]
    ON [QuestionTags] ([TagId])
    INCLUDE ([QuestionId])
    WITH (ONLINE = ON, FILLFACTOR = 95)
    PRINT 'Created tag-based search performance index'
END

-- =============================================
-- Performance Statistics Updates
-- =============================================

PRINT 'Updating table statistics for optimal query plans...'

-- Update statistics for all QA tables with full scan
UPDATE STATISTICS [Questions] WITH FULLSCAN
UPDATE STATISTICS [Answers] WITH FULLSCAN
UPDATE STATISTICS [QAVotes] WITH FULLSCAN
UPDATE STATISTICS [UserReputation] WITH FULLSCAN
UPDATE STATISTICS [QAExperts] WITH FULLSCAN
UPDATE STATISTICS [QAAnalytics] WITH FULLSCAN
UPDATE STATISTICS [QAUserActivity] WITH FULLSCAN
UPDATE STATISTICS [QACategories] WITH FULLSCAN
UPDATE STATISTICS [QATags] WITH FULLSCAN
UPDATE STATISTICS [QuestionTags] WITH FULLSCAN

PRINT 'Statistics updated successfully'

-- =============================================
-- Query Store Configuration
-- =============================================

PRINT 'Configuring Query Store for performance monitoring...'

-- Enable Query Store if not already enabled
IF (SELECT is_query_store_on FROM sys.databases WHERE name = DB_NAME()) = 0
BEGIN
    ALTER DATABASE CURRENT SET QUERY_STORE = ON
    PRINT 'Query Store enabled'
END

-- Configure Query Store settings for optimal performance monitoring
ALTER DATABASE CURRENT SET QUERY_STORE (
    OPERATION_MODE = READ_WRITE,
    CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30),
    DATA_FLUSH_INTERVAL_SECONDS = 900,
    INTERVAL_LENGTH_MINUTES = 60,
    MAX_STORAGE_SIZE_MB = 1000,
    QUERY_CAPTURE_MODE = AUTO,
    SIZE_BASED_CLEANUP_MODE = AUTO
)

PRINT 'Query Store configured for performance monitoring'

-- =============================================
-- Performance Monitoring Views
-- =============================================

PRINT 'Creating performance monitoring views...'

-- View for slow QA queries
IF OBJECT_ID('vw_QASlowQueries', 'V') IS NOT NULL
    DROP VIEW vw_QASlowQueries
GO

CREATE VIEW vw_QASlowQueries AS
SELECT 
    qsq.query_id,
    qsq.object_id,
    OBJECT_NAME(qsq.object_id) as object_name,
    qsrs.avg_duration / 1000.0 as avg_duration_ms,
    qsrs.max_duration / 1000.0 as max_duration_ms,
    qsrs.avg_cpu_time / 1000.0 as avg_cpu_time_ms,
    qsrs.avg_logical_io_reads,
    qsrs.count_executions,
    qsrs.last_execution_time,
    qst.query_sql_text
FROM sys.query_store_query qsq
JOIN sys.query_store_plan qsp ON qsq.query_id = qsp.query_id
JOIN sys.query_store_runtime_stats qsrs ON qsp.plan_id = qsrs.plan_id
JOIN sys.query_store_query_text qst ON qsq.query_text_id = qst.query_text_id
WHERE qsrs.avg_duration > 200000 -- Queries taking more than 200ms
    AND qst.query_sql_text LIKE '%Questions%' 
    OR qst.query_sql_text LIKE '%Answers%'
    OR qst.query_sql_text LIKE '%QAVotes%'
GO

PRINT 'Created slow QA queries monitoring view'

-- View for QA table performance metrics
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
    i.name as clustered_index_name,
    s.avg_fragmentation_in_percent,
    s.page_count
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id AND i.index_id IN (0, 1)
JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
JOIN sys.allocation_units a ON p.partition_id = a.container_id
LEFT JOIN sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') s 
    ON t.object_id = s.object_id AND i.index_id = s.index_id
WHERE t.name IN ('Questions', 'Answers', 'QAVotes', 'UserReputation', 'QAExperts', 'QAAnalytics', 'QAUserActivity')
GROUP BY t.name, p.rows, i.name, s.avg_fragmentation_in_percent, s.page_count
GO

PRINT 'Created QA table performance metrics view'

-- =============================================
-- Maintenance Procedures
-- =============================================

PRINT 'Creating maintenance procedures...'

-- Procedure for QA index maintenance
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
        s.avg_fragmentation_in_percent
    FROM sys.tables t
    JOIN sys.indexes i ON t.object_id = i.object_id
    JOIN sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') s 
        ON t.object_id = s.object_id AND i.index_id = s.index_id
    WHERE t.name IN ('Questions', 'Answers', 'QAVotes', 'UserReputation', 'QAExperts', 'QAAnalytics', 'QAUserActivity')
        AND i.name IS NOT NULL
        AND s.avg_fragmentation_in_percent > 5
    
    OPEN index_cursor
    FETCH NEXT FROM index_cursor INTO @table_name, @index_name, @fragmentation
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @fragmentation > 30
        BEGIN
            -- Rebuild index if fragmentation > 30%
            SET @sql = 'ALTER INDEX [' + @index_name + '] ON [' + @table_name + '] REBUILD WITH (ONLINE = ON, FILLFACTOR = 90)'
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
    UPDATE STATISTICS [Questions] WITH FULLSCAN
    UPDATE STATISTICS [Answers] WITH FULLSCAN
    UPDATE STATISTICS [QAVotes] WITH FULLSCAN
    UPDATE STATISTICS [UserReputation] WITH FULLSCAN
    UPDATE STATISTICS [QAExperts] WITH FULLSCAN
    UPDATE STATISTICS [QAAnalytics] WITH FULLSCAN
    UPDATE STATISTICS [QAUserActivity] WITH FULLSCAN
    
    PRINT 'QA index maintenance completed successfully'
END
GO

PRINT 'Created QA index maintenance procedure'

-- =============================================
-- Performance Baseline Creation
-- =============================================

PRINT 'Creating performance baseline...'

-- Create performance baseline table if it doesn't exist
IF OBJECT_ID('QAPerformanceBaseline', 'U') IS NULL
BEGIN
    CREATE TABLE QAPerformanceBaseline (
        Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        MetricName NVARCHAR(100) NOT NULL,
        MetricValue DECIMAL(18,4) NOT NULL,
        MetricUnit NVARCHAR(20) NOT NULL,
        Category NVARCHAR(50) NOT NULL,
        CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
        INDEX IX_QAPerformanceBaseline_Category_CreatedAt (Category, CreatedAt DESC)
    )
    PRINT 'Created QA performance baseline table'
END

-- Insert baseline metrics
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

PRINT 'Inserted performance baseline metrics'

PRINT 'QA Performance Optimization completed successfully!'
PRINT 'Summary:'
PRINT '- Created optimized indexes for all QA tables'
PRINT '- Configured full-text search indexes'
PRINT '- Updated table statistics'
PRINT '- Configured Query Store for monitoring'
PRINT '- Created performance monitoring views'
PRINT '- Created maintenance procedures'
PRINT '- Established performance baselines'