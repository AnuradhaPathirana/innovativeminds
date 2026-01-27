-- Add delivery_mode column to programs table
-- Run this migration to add support for delivery mode (Online, Virtual, or Online & Virtual)

ALTER TABLE programs 
ADD COLUMN delivery_mode ENUM('Online', 'Virtual', 'Online & Virtual') DEFAULT 'Online' AFTER duration;

-- Update existing programs to have a default delivery_mode
UPDATE programs SET delivery_mode = 'Online' WHERE delivery_mode IS NULL;

-- Verify the change
SELECT id, title, duration, delivery_mode FROM programs;
