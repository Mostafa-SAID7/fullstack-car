-- QA System Tables Creation Script
-- This script creates the additional QA system tables required for the enhanced QA functionality

-- Create QAAnalytics table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QAAnalytics' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[QAAnalytics] (
        [Id] uniqueidentifier NOT NULL DEFAULT NEWID(),
        [Date] date NOT NULL,
        [QuestionsAsked] int NOT NULL DEFAULT 0,
        [QuestionsAnswered] int NOT NULL DEFAULT 0,
        [AnswersAccepted] int NOT NULL DEFAULT 0,
        [TotalVotes] int NOT NULL DEFAULT 0,
        [UniqueUsers] int NOT NULL DEFAULT 0,
        [AverageResponseTime] int NOT NULL DEFAULT 0,
        [TopCategory] nvarchar(100) NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_QAAnalytics] PRIMARY KEY ([Id])
    );
    
    CREATE UNIQUE INDEX [IX_QAAnalytics_Date] ON [dbo].[QAAnalytics] ([Date]);
END

-- Create QACategories table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QACategories' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[QACategories] (
        [Id] uniqueidentifier NOT NULL DEFAULT NEWID(),
        [Name] nvarchar(100) NOT NULL,
        [Description] nvarchar(500) NOT NULL,
        [IconUrl] nvarchar(2048) NULL,
        [Color] nvarchar(7) NOT NULL DEFAULT '#000000',
        [QuestionCount] int NOT NULL DEFAULT 0,
        [ExpertCount] int NOT NULL DEFAULT 0,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] nvarchar(max) NULL,
        [LastModifiedBy] nvarchar(max) NULL,
        [LastModifiedAt] datetime2 NULL,
        [Version] int NOT NULL DEFAULT 0,
        CONSTRAINT [PK_QACategories] PRIMARY KEY ([Id])
    );
    
    CREATE UNIQUE INDEX [IX_QACategories_Name] ON [dbo].[QACategories] ([Name]);
END

-- Create QATags table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QATags' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[QATags] (
        [Id] uniqueidentifier NOT NULL DEFAULT NEWID(),
        [Name] nvarchar(50) NOT NULL,
        [Description] nvarchar(200) NOT NULL,
        [UsageCount] int NOT NULL DEFAULT 0,
        [CategoryId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] nvarchar(max) NULL,
        [LastModifiedBy] nvarchar(max) NULL,
        [LastModifiedAt] datetime2 NULL,
        [Version] int NOT NULL DEFAULT 0,
        CONSTRAINT [PK_QATags] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_QATags_QuestionCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [QuestionCategories] ([Id])
    );
    
    CREATE UNIQUE INDEX [IX_QATags_Name] ON [dbo].[QATags] ([Name]);
    CREATE INDEX [IX_QATags_UsageCount] ON [dbo].[QATags] ([UsageCount]);
    CREATE INDEX [IX_QATags_CategoryId] ON [dbo].[QATags] ([CategoryId]);
END

-- Create QAExperts table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QAExperts' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[QAExperts] (
        [Id] uniqueidentifier NOT NULL DEFAULT NEWID(),
        [ExpertiseLevel] nvarchar(20) NOT NULL DEFAULT 'Beginner',
        [AnswerCount] int NOT NULL DEFAULT 0,
        [AcceptedAnswerCount] int NOT NULL DEFAULT 0,
        [AverageRating] decimal(3,2) NOT NULL DEFAULT 0,
        [ResponseRate] decimal(5,2) NOT NULL DEFAULT 0,
        [NotificationEnabled] bit NOT NULL DEFAULT 1,
        [UserId] uniqueidentifier NOT NULL,
        [CategoryId] uniqueidentifier NOT NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] nvarchar(max) NULL,
        [LastModifiedBy] nvarchar(max) NULL,
        [LastModifiedAt] datetime2 NULL,
        [Version] int NOT NULL DEFAULT 0,
        CONSTRAINT [PK_QAExperts] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_QAExperts_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [FK_QAExperts_QuestionCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [QuestionCategories] ([Id])
    );
    
    CREATE UNIQUE INDEX [IX_QAExperts_UserId_CategoryId] ON [dbo].[QAExperts] ([UserId], [CategoryId]);
    CREATE INDEX [IX_QAExperts_Category_Level] ON [dbo].[QAExperts] ([CategoryId], [ExpertiseLevel]);
    CREATE INDEX [IX_QAExperts_UserId] ON [dbo].[QAExperts] ([UserId]);
END

-- Create UserReputations table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserReputations' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[UserReputations] (
        [Id] uniqueidentifier NOT NULL DEFAULT NEWID(),
        [ReputationScore] int NOT NULL DEFAULT 0,
        [QuestionsAsked] int NOT NULL DEFAULT 0,
        [AnswersGiven] int NOT NULL DEFAULT 0,
        [AcceptedAnswers] int NOT NULL DEFAULT 0,
        [UpvotesReceived] int NOT NULL DEFAULT 0,
        [DownvotesReceived] int NOT NULL DEFAULT 0,
        [BadgesEarned] nvarchar(2000) NULL,
        [ExpertiseAreas] nvarchar(2000) NULL,
        [LastUpdated] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UserId] uniqueidentifier NOT NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] nvarchar(max) NULL,
        [LastModifiedBy] nvarchar(max) NULL,
        [LastModifiedAt] datetime2 NULL,
        [Version] int NOT NULL DEFAULT 0,
        CONSTRAINT [PK_UserReputations] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_UserReputations_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id])
    );
    
    CREATE UNIQUE INDEX [IX_UserReputations_UserId] ON [dbo].[UserReputations] ([UserId]);
    CREATE INDEX [IX_UserReputations_ReputationScore] ON [dbo].[UserReputations] ([ReputationScore]);
    CREATE INDEX [IX_UserReputations_ExpertiseAreas] ON [dbo].[UserReputations] ([ExpertiseAreas]);
END

-- Create QAVotes table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QAVotes' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[QAVotes] (
        [Id] uniqueidentifier NOT NULL DEFAULT NEWID(),
        [VoteType] int NOT NULL,
        [ContentType] nvarchar(20) NOT NULL,
        [ContentId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] nvarchar(max) NULL,
        [LastModifiedBy] nvarchar(max) NULL,
        [LastModifiedAt] datetime2 NULL,
        [Version] int NOT NULL DEFAULT 0,
        CONSTRAINT [PK_QAVotes] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_QAVotes_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id])
    );
    
    CREATE UNIQUE INDEX [IX_QAVotes_UserId_ContentId_Type] ON [dbo].[QAVotes] ([UserId], [ContentId], [ContentType]);
    CREATE INDEX [IX_QAVotes_ContentId_Type] ON [dbo].[QAVotes] ([ContentId], [ContentType]);
    CREATE INDEX [IX_QAVotes_UserId_CreatedAt] ON [dbo].[QAVotes] ([UserId], [CreatedAt]);
END

-- Create QAUserActivities table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QAUserActivities' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[QAUserActivities] (
        [Id] uniqueidentifier NOT NULL DEFAULT NEWID(),
        [ActivityType] nvarchar(50) NOT NULL,
        [ContentId] uniqueidentifier NOT NULL,
        [Category] nvarchar(100) NULL,
        [ReputationChange] int NOT NULL DEFAULT 0,
        [UserId] uniqueidentifier NOT NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NULL,
        [CreatedBy] nvarchar(max) NULL,
        [UpdatedBy] nvarchar(max) NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_QAUserActivities] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_QAUserActivities_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id])
    );
    
    CREATE INDEX [IX_QAUserActivities_UserId_Date] ON [dbo].[QAUserActivities] ([UserId], [CreatedAt]);
    CREATE INDEX [IX_QAUserActivities_Type_Date] ON [dbo].[QAUserActivities] ([ActivityType], [CreatedAt]);
END

-- Update QuestionTags table to work as junction table
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'QuestionTags' AND COLUMN_NAME = 'Name')
BEGIN
    -- Drop existing columns that are no longer needed
    ALTER TABLE [dbo].[QuestionTags] DROP COLUMN [Name];
    ALTER TABLE [dbo].[QuestionTags] DROP COLUMN [Description];
    ALTER TABLE [dbo].[QuestionTags] DROP COLUMN [Color];
    ALTER TABLE [dbo].[QuestionTags] DROP COLUMN [UsageCount];
    ALTER TABLE [dbo].[QuestionTags] DROP COLUMN [IsActive];
    
    -- Add new columns for junction table
    ALTER TABLE [dbo].[QuestionTags] ADD [QuestionId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
    ALTER TABLE [dbo].[QuestionTags] ADD [TagId] uniqueidentifier NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';
    
    -- Create indexes
    CREATE UNIQUE INDEX [IX_QuestionTags_QuestionId_TagId] ON [dbo].[QuestionTags] ([QuestionId], [TagId]);
    CREATE INDEX [IX_QuestionTags_TagId] ON [dbo].[QuestionTags] ([TagId]);
    
    -- Add foreign keys
    ALTER TABLE [dbo].[QuestionTags] ADD CONSTRAINT [FK_QuestionTags_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([Id]);
    ALTER TABLE [dbo].[QuestionTags] ADD CONSTRAINT [FK_QuestionTags_QATags_TagId] FOREIGN KEY ([TagId]) REFERENCES [QATags] ([Id]);
END

PRINT 'QA System tables created successfully!'