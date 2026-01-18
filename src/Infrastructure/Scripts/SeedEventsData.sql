-- Seed Events Data Script
-- This script adds sample data for the Events system

-- Insert sample events
DECLARE @AdminUserId uniqueidentifier = (SELECT TOP 1 Id FROM AspNetUsers WHERE Email = 'admin@communitycar.com')
DECLARE @TestUserId uniqueidentifier = (SELECT TOP 1 Id FROM AspNetUsers WHERE Email LIKE '%test%' OR UserName LIKE '%test%')
DECLARE @SampleGroupId uniqueidentifier = (SELECT TOP 1 Id FROM Groups WHERE IsActive = 1)

-- If no admin user found, create a placeholder
IF @AdminUserId IS NULL
BEGIN
    SET @AdminUserId = NEWID()
END

-- If no test user found, use admin user
IF @TestUserId IS NULL
BEGIN
    SET @TestUserId = @AdminUserId
END

-- Sample Events
INSERT INTO [Events] ([Id], [Title], [Description], [StartDate], [EndDate], [Location], [Address], [Category], [Tags], [ImageUrl], [MaxAttendees], [AttendeeCount], [RequireApproval], [IsPublic], [IsActive], [IsFeatured], [Status], [OrganizerId], [GroupId], [CreatedAt], [CreatedBy])
VALUES 
    (NEWID(), 'Car Enthusiasts Meetup', 'Monthly gathering for car enthusiasts to share experiences and showcase their vehicles.', DATEADD(day, 7, GETUTCDATE()), DATEADD(day, 7, DATEADD(hour, 3, GETUTCDATE())), 'Central Park', '123 Park Avenue, New York, NY', 'Automotive', 'cars,meetup,enthusiasts', '/images/events/car-meetup.jpg', 50, 12, 0, 1, 1, 1, 'Active', @AdminUserId, @SampleGroupId, GETUTCDATE(), @AdminUserId),
    
    (NEWID(), 'Electric Vehicle Workshop', 'Learn about the latest in electric vehicle technology and maintenance tips.', DATEADD(day, 14, GETUTCDATE()), DATEADD(day, 14, DATEADD(hour, 4, GETUTCDATE())), 'Tech Center', '456 Innovation Drive, San Francisco, CA', 'Education', 'electric,workshop,technology', '/images/events/ev-workshop.jpg', 30, 8, 1, 1, 1, 0, 'Active', @TestUserId, NULL, GETUTCDATE(), @TestUserId),
    
    (NEWID(), 'Classic Car Show', 'Annual classic car exhibition featuring vintage automobiles from the 1950s-1980s.', DATEADD(day, 21, GETUTCDATE()), DATEADD(day, 21, DATEADD(hour, 6, GETUTCDATE())), 'Exhibition Center', '789 Display Boulevard, Los Angeles, CA', 'Exhibition', 'classic,vintage,show', '/images/events/classic-show.jpg', 200, 45, 0, 1, 1, 1, 'Active', @AdminUserId, NULL, GETUTCDATE(), @AdminUserId),
    
    (NEWID(), 'Racing Track Day', 'Experience the thrill of racing on a professional track with your own vehicle.', DATEADD(day, 28, GETUTCDATE()), DATEADD(day, 28, DATEADD(hour, 8, GETUTCDATE())), 'Speedway Track', '321 Racing Circuit, Austin, TX', 'Racing', 'racing,track,speed', '/images/events/track-day.jpg', 25, 18, 1, 1, 1, 0, 'Active', @TestUserId, @SampleGroupId, GETUTCDATE(), @TestUserId),
    
    (NEWID(), 'Car Maintenance Workshop', 'Hands-on workshop covering basic car maintenance and repair techniques.', DATEADD(day, 35, GETUTCDATE()), DATEADD(day, 35, DATEADD(hour, 5, GETUTCDATE())), 'Auto Shop', '654 Mechanic Street, Detroit, MI', 'Education', 'maintenance,repair,workshop', '/images/events/maintenance-workshop.jpg', 15, 6, 0, 1, 1, 0, 'Active', @AdminUserId, NULL, GETUTCDATE(), @AdminUserId);

-- Get event IDs for sample data
DECLARE @Event1Id uniqueidentifier = (SELECT TOP 1 Id FROM Events WHERE Title = 'Car Enthusiasts Meetup')
DECLARE @Event2Id uniqueidentifier = (SELECT TOP 1 Id FROM Events WHERE Title = 'Electric Vehicle Workshop')
DECLARE @Event3Id uniqueidentifier = (SELECT TOP 1 Id FROM Events WHERE Title = 'Classic Car Show')

-- Sample Event Attendances
INSERT INTO [EventAttendances] ([Id], [EventId], [UserId], [AttendanceType], [ResponseDate], [Notes], [IsApproved], [ApprovedAt], [CheckedIn], [CreatedAt], [CreatedBy])
VALUES 
    (NEWID(), @Event1Id, @AdminUserId, 'Going', GETUTCDATE(), 'Looking forward to this event!', 1, GETUTCDATE(), 0, GETUTCDATE(), @AdminUserId),
    (NEWID(), @Event1Id, @TestUserId, 'Maybe', DATEADD(hour, -2, GETUTCDATE()), 'Will try to make it', 1, DATEADD(hour, -2, GETUTCDATE()), 0, DATEADD(hour, -2, GETUTCDATE()), @TestUserId),
    (NEWID(), @Event2Id, @TestUserId, 'Going', DATEADD(hour, -1, GETUTCDATE()), 'Excited about EV technology', 1, DATEADD(hour, -1, GETUTCDATE()), 0, DATEADD(hour, -1, GETUTCDATE()), @TestUserId),
    (NEWID(), @Event3Id, @AdminUserId, 'Going', DATEADD(minute, -30, GETUTCDATE()), 'Love classic cars!', 1, DATEADD(minute, -30, GETUTCDATE()), 0, DATEADD(minute, -30, GETUTCDATE()), @AdminUserId);

-- Sample Event Comments
INSERT INTO [EventComments] ([Id], [EventId], [ParentCommentId], [Content], [LikeCount], [IsEdited], [CreatedAt], [CreatedBy])
VALUES 
    (NEWID(), @Event1Id, NULL, 'This looks like a great event! Can''t wait to see everyone''s cars.', 3, 0, DATEADD(hour, -3, GETUTCDATE()), @TestUserId),
    (NEWID(), @Event1Id, NULL, 'Will there be food trucks at the event?', 1, 0, DATEADD(hour, -2, GETUTCDATE()), @AdminUserId),
    (NEWID(), @Event2Id, NULL, 'Great topic! I''m particularly interested in battery technology.', 2, 0, DATEADD(hour, -1, GETUTCDATE()), @AdminUserId),
    (NEWID(), @Event3Id, NULL, 'Amazing lineup of classic cars expected this year!', 5, 0, DATEADD(minute, -45, GETUTCDATE()), @TestUserId);

-- Sample Event Invitations
INSERT INTO [EventInvitations] ([Id], [EventId], [InviterId], [InviteeId], [Message], [Status], [SentAt], [RespondedAt], [CreatedAt], [CreatedBy])
VALUES 
    (NEWID(), @Event1Id, @AdminUserId, @TestUserId, 'Hey! You should definitely come to this meetup. It''s going to be awesome!', 'Accepted', DATEADD(day, -2, GETUTCDATE()), DATEADD(day, -1, GETUTCDATE()), DATEADD(day, -2, GETUTCDATE()), @AdminUserId),
    (NEWID(), @Event2Id, @TestUserId, @AdminUserId, 'This workshop looks really interesting. Want to join me?', 'Pending', DATEADD(hour, -6, GETUTCDATE()), NULL, DATEADD(hour, -6, GETUTCDATE()), @TestUserId);

-- Sample Event Updates
INSERT INTO [EventUpdates] ([Id], [EventId], [Title], [Content], [UpdateType], [IsImportant], [CreatedAt], [CreatedBy])
VALUES 
    (NEWID(), @Event1Id, 'Parking Information Updated', 'We''ve secured additional parking spaces at the nearby mall. Free parking will be available for all attendees.', 'Logistics', 1, DATEADD(hour, -4, GETUTCDATE()), @AdminUserId),
    (NEWID(), @Event2Id, 'Guest Speaker Confirmed', 'We''re excited to announce that Dr. Sarah Johnson, EV technology expert, will be joining us as a guest speaker.', 'Speaker', 1, DATEADD(hour, -2, GETUTCDATE()), @TestUserId),
    (NEWID(), @Event3Id, 'Weather Update', 'The weather forecast looks great for the show! Sunny skies and perfect temperature for outdoor viewing.', 'Weather', 0, DATEADD(hour, -1, GETUTCDATE()), @AdminUserId);

PRINT 'Events seed data inserted successfully!'
PRINT 'Sample events, attendances, comments, invitations, and updates have been created.'