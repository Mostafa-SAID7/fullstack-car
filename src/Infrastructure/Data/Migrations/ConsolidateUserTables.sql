-- Migration script to consolidate DomainUsers data into AspNetUsers
-- This script should be run after updating the code but before running the application

-- Step 1: Update AspNetUsers with additional fields from DomainUsers where they exist
UPDATE AspNetUsers 
SET 
    PhoneNumber = COALESCE(AspNetUsers.PhoneNumber, du.PhoneNumber),
    -- Add any other fields that might be different
    -- Note: Most fields should already be synchronized
FROM DomainUsers du 
WHERE AspNetUsers.Id = du.Id;

-- Step 2: Insert any DomainUsers that don't exist in AspNetUsers (shouldn't happen in normal cases)
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, 
    EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp,
    PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnd,
    LockoutEnabled, AccessFailedCount, FirstName, LastName, 
    ProfileImageUrl, Bio, CreatedAt, LastLoginAt, IsActive, Status
)
SELECT 
    du.Id, 
    du.Email, -- UserName
    UPPER(du.Email), -- NormalizedUserName
    du.Email,
    UPPER(du.Email), -- NormalizedEmail
    du.EmailVerified, -- EmailConfirmed
    du.PasswordHash,
    NEWID(), -- SecurityStamp
    NEWID(), -- ConcurrencyStamp
    du.PhoneNumber,
    0, -- PhoneNumberConfirmed
    0, -- TwoFactorEnabled
    NULL, -- LockoutEnd
    1, -- LockoutEnabled
    0, -- AccessFailedCount
    du.FirstName,
    du.LastName,
    du.ProfileImageUrl,
    du.Bio,
    du.CreatedAt,
    du.LastLoginAt,
    CASE WHEN du.Status = 'Active' THEN 1 ELSE 0 END, -- IsActive
    du.Status
FROM DomainUsers du
WHERE NOT EXISTS (
    SELECT 1 FROM AspNetUsers au WHERE au.Id = du.Id
);

-- Step 3: Update all foreign key references from DomainUsers to AspNetUsers
-- (This should already be handled by the entity updates, but included for completeness)

-- Step 4: Drop the DomainUsers table (commented out for safety)
-- DROP TABLE DomainUsers;

-- Note: After running this migration, you should:
-- 1. Test the application thoroughly
-- 2. Verify all user data is accessible
-- 3. Only then uncomment and run the DROP TABLE statement