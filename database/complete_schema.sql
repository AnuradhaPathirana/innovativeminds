-- ================================================
-- COMPLETE DATABASE SCHEMA FOR INNOVATIVEMINDS
-- Updated with Image Upload Feature
-- ================================================

USE innovativeminds;

-- ================================================
-- 1. ADMINS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin user (password: admin123)
INSERT INTO admins (username, password, email) VALUES
('admin', 'admin123', 'admin@innovativeminds.lk')
ON DUPLICATE KEY UPDATE username=username;

-- ================================================
-- 2. PROGRAMS TABLE (WITH IMAGE SUPPORT)
-- ================================================
CREATE TABLE IF NOT EXISTS programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Laptop',
    image VARCHAR(500) DEFAULT NULL COMMENT 'Relative path to uploaded program image',
    features JSON NOT NULL,
    duration VARCHAR(50),
    price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 3. ENQUIRIES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    program VARCHAR(200) NOT NULL,
    message TEXT,
    status ENUM('pending', 'contacted', 'enrolled', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_program (program),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- VERIFY TABLES
-- ================================================
SHOW TABLES;

SELECT 'Database schema created successfully!' AS status;

-- ================================================
-- COLUMN DETAILS
-- ================================================

-- Programs Table Columns:
-- - id: Auto-incrementing primary key
-- - title: Program name (e.g., "Virtual Assistant Training")
-- - description: Detailed program description
-- - icon: Icon name for display (e.g., "Laptop", "Briefcase")
-- - image: Path to uploaded image (e.g., "/uploads/programs/image.jpg")
-- - features: JSON array of program features
-- - duration: Program duration (e.g., "3 months")
-- - price: Program price (optional)
-- - is_active: Whether program is visible on website
-- - display_order: Order of display on website
-- - created_at: Timestamp of creation
-- - updated_at: Timestamp of last update

-- Image Column Details:
-- - Type: VARCHAR(500)
-- - Nullable: YES (NULL if no image)
-- - Format: Relative path starting with /uploads/
-- - Example: "/uploads/programs/virtual-assistant-1737456789-123.jpg"
-- - Served via: Express static middleware at /uploads route

-- ================================================
