-- ================================================
-- INNOVATIVE MINDS - Complete Database Schema
-- Version: 2.0
-- Last Updated: 2026-01-20
-- ================================================

-- Create Database (if not exists)
CREATE DATABASE IF NOT EXISTS innovativeminds
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE innovativeminds;

-- ================================================
-- Drop existing tables (for fresh install)
-- ================================================
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS enquiries;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS admins;

-- ================================================
-- Table: admins
-- Stores admin user credentials
-- ================================================
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin account
-- Username: admin | Password: admin123
INSERT INTO admins (username, password, name, email) VALUES
('admin', '$2b$10$OHIrMhsYAj1KTMNNVY9XqeApQBVrcVOsptMMT0TNq5p68b0U/aLyq', 'Administrator', 'admin@example.com');

-- ================================================
-- Table: programs (Course Modules)
-- Stores course/program information
-- ================================================
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Laptop',
    image VARCHAR(255) DEFAULT NULL,
    features JSON NOT NULL,
    duration VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default programs
INSERT INTO programs (title, description, icon, features, duration, display_order) VALUES
(
    'Virtual Assistant & Remote Support',
    'Master the essential skills needed to support global businesses remotely. Learn calendar management, email handling, and remote tools.',
    'Laptop',
    '["Remote Office Tools", "Communication Skills", "Time Management", "Client Relations"]',
     '3 months',
    1
),
(
    'Virtual Business Manager',
    'Step up from assistance to management. Learn to oversee operations, manage teams, and drive business growth virtually.',
    'Briefcase',
    '["Project Management", "Team Leadership", "Business Strategy", "Operations"]',
    '4 months',
    2
),
(
    'Practical AI Tools for Small Business',
    'Leverage the power of Artificial Intelligence to automate tasks, create content, and optimize small business workflows.',
    'Bot',
    '["Prompt Engineering", "Content Automation", "AI for Marketing", "Process Optimization"]',
    '2 months',
    3
),
(
    'Digital Business Entrepreneurship',
    'The complete blueprint for starting and scaling a digital-first business in the modern economy.',
    'Globe',
    '["Business Modeling", "Digital Marketing", "Financial Basics", "Growth Hacking"]',
    '6 months',
    4
),
(
    'E-commerce Entrepreneurship',
    'Learn to build, launch, and manage successful online stores using modern e-commerce platforms.',
    'ShoppingCart',
    '["Store Setup", "Inventory Management", "Digital Payments", "Customer Service"]',
    '3 months',
    5
),
(
    'Office Administration and Ethics',
    'Core administrative skills combined with professional ethics for the modern workplace.',
    'FileSpreadsheet',
    '["Doc Management", "Professional Ethics", "Office Software", "Data Privacy"]',
    '2 months',
    6
),
(
    'Entrepreneurial Skill Development',
    'Specially designed program in Sinhala medium to empower local entrepreneurs with global skills.',
    'Lightbulb',
    '["Sinhala Medium", "Local Context", "Business Basics", "Digital Literacy"]',
    '3 months',
    7
);

-- ================================================
-- Table: enquiries
-- Stores contact form submissions
-- ================================================
CREATE TABLE enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    program VARCHAR(200) NOT NULL,
    message TEXT,
    status ENUM('pending', 'contacted') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample enquiries (optional)
INSERT INTO enquiries (name, email, phone, program, message, status) VALUES
('John Doe', 'john@example.com', '+94771234567', 'Virtual Assistant & Remote Support', 'I am interested in learning more about this program.', 'pending'),
('Jane Smith', 'jane@example.com', '+94779876543', 'Digital Business Entrepreneurship', 'Please send me the brochure and admission details.', 'contacted'),
('Mike Johnson', 'mike@example.com', '+94775551234', 'Practical AI Tools for Small Business', 'When is the next intake?', 'pending');

-- ================================================
-- Table: sessions
-- Stores user login sessions (for express-session)
-- ================================================
CREATE TABLE sessions (
    session_id VARCHAR(128) NOT NULL PRIMARY KEY,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT,
    INDEX idx_expires (expires)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Verification Queries
-- ================================================
SELECT '✅ Database schema created successfully!' AS status;

SELECT 'Tables Created:' AS info;
SHOW TABLES;

SELECT 'Admin Account:' AS info;
SELECT id, username, name, email FROM admins;

SELECT 'Programs Count:' AS info;
SELECT COUNT(*) AS total_programs FROM programs;

SELECT 'Sample Programs:' AS info;
SELECT id, title, icon, duration, display_order FROM programs ORDER BY display_order;
