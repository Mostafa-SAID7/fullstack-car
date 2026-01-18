-- Add Events Entities Migration Script
-- This script adds the Events entities to the database

-- Events table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Events' AND xtype='U')
BEGIN
    CREATE TABLE [Events] (
        [Id] uniqueidentifier NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(max) NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NULL,
        [Location] nvarchar(500) NULL,
        [Address] nvarchar(1000) NULL,
        [Latitude] decimal(10,8) NULL,
        [Longitude] decimal(11,8) NULL,
        [Category] nvarchar(100) NOT NULL,
        [Tags] nvarchar(max) NULL,
        [ImageUrl] nvarchar(2000) NULL,
        [MaxAttendees] int NULL,
        [AttendeeCount] int NOT NULL DEFAULT 0,
        [RequireApproval] bit NOT NULL DEFAULT 0,
        [IsPublic] bit NOT NULL DEFAULT 1,
        [IsActive] bit NOT NULL DEFAULT 1,
        [IsFeatured] bit NOT NULL DEFAULT 0,
        [Status] nvarchar(50) NOT NULL DEFAULT 'Active',
        [OrganizerId] uniqueidentifier NOT NULL,
        [GroupId] uniqueidentifier NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedBy] uniqueidentifier NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [FK_Events_AspNetUsers_OrganizerId] FOREIGN KEY ([OrganizerId]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [FK_Events_Groups_GroupId] FOREIGN KEY ([GroupId]) REFERENCES [Groups] ([Id]),
        CONSTRAINT [FK_Events_AspNetUsers_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [AspNetUsers] ([Id])
    );
    
    CREATE INDEX [IX_Events_OrganizerId] ON [Events] ([OrganizerId]);
    CREATE INDEX [IX_Events_GroupId] ON [Events] ([GroupId]);
    CREATE INDEX [IX_Events_StartDate] ON [Events] ([StartDate]);
    CREATE INDEX [IX_Events_Category] ON [Events] ([Category]);
    CREATE INDEX [IX_Events_IsActive] ON [Events] ([IsActive]);
    CREATE INDEX [IX_Events_IsFeatured] ON [Events] ([IsFeatured]);
END

-- EventAttendances table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EventAttendances' AND xtype='U')
BEGIN
    CREATE TABLE [EventAttendances] (
        [Id] uniqueidentifier NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [EventId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [AttendanceType] nvarchar(50) NOT NULL DEFAULT 'Going',
        [ResponseDate] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [Notes] nvarchar(500) NULL,
        [IsApproved] bit NOT NULL DEFAULT 1,
        [ApprovedAt] datetime2 NULL,
        [ApprovedBy] uniqueidentifier NULL,
        [CheckedIn] bit NOT NULL DEFAULT 0,
        [CheckedInAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedBy] uniqueidentifier NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [FK_EventAttendances_Events_EventId] FOREIGN KEY ([EventId]) REFERENCES [Events] ([Id]),
        CONSTRAINT [FK_EventAttendances_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [FK_EventAttendances_AspNetUsers_ApprovedBy] FOREIGN KEY ([ApprovedBy]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [FK_EventAttendances_AspNetUsers_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [UQ_EventAttendances_EventId_UserId] UNIQUE ([EventId], [UserId])
    );
    
    CREATE INDEX [IX_EventAttendances_EventId] ON [EventAttendances] ([EventId]);
    CREATE INDEX [IX_EventAttendances_UserId] ON [EventAttendances] ([UserId]);
    CREATE INDEX [IX_EventAttendances_AttendanceType] ON [EventAttendances] ([AttendanceType]);
    CREATE INDEX [IX_EventAttendances_IsApproved] ON [EventAttendances] ([IsApproved]);
END

-- EventComments table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EventComments' AND xtype='U')
BEGIN
    CREATE TABLE [EventComments] (
        [Id] uniqueidentifier NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [EventId] uniqueidentifier NOT NULL,
        [ParentCommentId] uniqueidentifier NULL,
        [Content] nvarchar(max) NOT NULL,
        [LikeCount] int NOT NULL DEFAULT 0,
        [IsEdited] bit NOT NULL DEFAULT 0,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedBy] uniqueidentifier NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [FK_EventComments_Events_EventId] FOREIGN KEY ([EventId]) REFERENCES [Events] ([Id]),
        CONSTRAINT [FK_EventComments_EventComments_ParentCommentId] FOREIGN KEY ([ParentCommentId]) REFERENCES [EventComments] ([Id]),
        CONSTRAINT [FK_EventComments_AspNetUsers_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [AspNetUsers] ([Id])
    );
    
    CREATE INDEX [IX_EventComments_EventId] ON [EventComments] ([EventId]);
    CREATE INDEX [IX_EventComments_ParentCommentId] ON [EventComments] ([ParentCommentId]);
    CREATE INDEX [IX_EventComments_CreatedBy] ON [EventComments] ([CreatedBy]);
    CREATE INDEX [IX_EventComments_CreatedAt] ON [EventComments] ([CreatedAt]);
END

-- EventCommentLikes table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EventCommentLikes' AND xtype='U')
BEGIN
    CREATE TABLE [EventCommentLikes] (
        [Id] uniqueidentifier NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [CommentId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [LikedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedBy] uniqueidentifier NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [FK_EventCommentLikes_EventComments_CommentId] FOREIGN KEY ([CommentId]) REFERENCES [EventComments] ([Id]),
        CONSTRAINT [FK_EventCommentLikes_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [FK_EventCommentLikes_AspNetUsers_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [UQ_EventCommentLikes_CommentId_UserId] UNIQUE ([CommentId], [UserId])
    );
    
    CREATE INDEX [IX_EventCommentLikes_CommentId] ON [EventCommentLikes] ([CommentId]);
    CREATE INDEX [IX_EventCommentLikes_UserId] ON [EventCommentLikes] ([UserId]);
END

-- EventInvitations table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EventInvitations' AND xtype='U')
BEGIN
    CREATE TABLE [EventInvitations] (
        [Id] uniqueidentifier NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [EventId] uniqueidentifier NOT NULL,
        [InviterId] uniqueidentifier NOT NULL,
        [InviteeId] uniqueidentifier NOT NULL,
        [Message] nvarchar(500) NULL,
        [Status] nvarchar(50) NOT NULL DEFAULT 'Pending',
        [SentAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [RespondedAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedBy] uniqueidentifier NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [FK_EventInvitations_Events_EventId] FOREIGN KEY ([EventId]) REFERENCES [Events] ([Id]),
        CONSTRAINT [FK_EventInvitations_AspNetUsers_InviterId] FOREIGN KEY ([InviterId]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [FK_EventInvitations_AspNetUsers_InviteeId] FOREIGN KEY ([InviteeId]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [FK_EventInvitations_AspNetUsers_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [AspNetUsers] ([Id]),
        CONSTRAINT [UQ_EventInvitations_EventId_InviteeId] UNIQUE ([EventId], [InviteeId])
    );
    
    CREATE INDEX [IX_EventInvitations_EventId] ON [EventInvitations] ([EventId]);
    CREATE INDEX [IX_EventInvitations_InviterId] ON [EventInvitations] ([InviterId]);
    CREATE INDEX [IX_EventInvitations_InviteeId] ON [EventInvitations] ([InviteeId]);
    CREATE INDEX [IX_EventInvitations_Status] ON [EventInvitations] ([Status]);
END

-- EventUpdates table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EventUpdates' AND xtype='U')
BEGIN
    CREATE TABLE [EventUpdates] (
        [Id] uniqueidentifier NOT NULL PRIMARY KEY DEFAULT NEWID(),
        [EventId] uniqueidentifier NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [UpdateType] nvarchar(50) NOT NULL DEFAULT 'General',
        [IsImportant] bit NOT NULL DEFAULT 0,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedBy] uniqueidentifier NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [UpdatedBy] uniqueidentifier NULL,
        [IsDeleted] bit NOT NULL DEFAULT 0,
        [DeletedAt] datetime2 NULL,
        [DeletedBy] uniqueidentifier NULL,
        CONSTRAINT [FK_EventUpdates_Events_EventId] FOREIGN KEY ([EventId]) REFERENCES [Events] ([Id]),
        CONSTRAINT [FK_EventUpdates_AspNetUsers_CreatedBy] FOREIGN KEY ([CreatedBy]) REFERENCES [AspNetUsers] ([Id])
    );
    
    CREATE INDEX [IX_EventUpdates_EventId] ON [EventUpdates] ([EventId]);
    CREATE INDEX [IX_EventUpdates_UpdateType] ON [EventUpdates] ([UpdateType]);
    CREATE INDEX [IX_EventUpdates_IsImportant] ON [EventUpdates] ([IsImportant]);
    CREATE INDEX [IX_EventUpdates_CreatedAt] ON [EventUpdates] ([CreatedAt]);
END

PRINT 'Events entities tables created successfully!'