-- Add for_whom column to programs table
-- This stores the target audience as JSON array

ALTER TABLE programs 
ADD COLUMN for_whom JSON DEFAULT NULL AFTER delivery_mode;

-- Verify the change
SELECT id, title, for_whom FROM programs LIMIT 3;
