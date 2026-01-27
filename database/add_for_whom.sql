-- Add for_whom column to programs table
-- This stores the target audience as TEXT (JSON string format)
-- Use TEXT instead of JSON for compatibility with older MySQL versions

ALTER TABLE programs 
ADD COLUMN for_whom TEXT DEFAULT NULL AFTER delivery_mode;

-- Verify the change
SELECT id, title, for_whom FROM programs LIMIT 3;
