-- ================================================
-- ADD IMAGE COLUMN TO PROGRAMS TABLE
-- This migration adds support for uploaded program images
-- ================================================

USE innovativeminds;

-- Add image column if it doesn't exist
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS image VARCHAR(500) DEFAULT NULL 
AFTER icon;

-- Add comment to the column
ALTER TABLE programs 
MODIFY COLUMN image VARCHAR(500) DEFAULT NULL 
COMMENT 'Relative path to uploaded program image (e.g., /uploads/programs/image.jpg)';

-- Verify the change
DESCRIBE programs;

SELECT 'Image column added/updated successfully!' AS status;

-- ================================================
-- UPDATED PROGRAMS TABLE SCHEMA
-- ================================================
-- 
-- CREATE TABLE programs (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(200) NOT NULL,
--     description TEXT NOT NULL,
--     icon VARCHAR(50) NOT NULL DEFAULT 'Laptop',
--     image VARCHAR(500) DEFAULT NULL COMMENT 'Path to uploaded image',
--     features JSON NOT NULL,
--     duration VARCHAR(50),
--     price DECIMAL(10,2),
--     is_active BOOLEAN DEFAULT TRUE,
--     display_order INT DEFAULT 0,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     INDEX idx_active (is_active),
--     INDEX idx_order (display_order)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- 
-- ================================================
