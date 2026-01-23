-- ================================================
-- PROGRAMS TABLE - SQL Schema
-- Run this in HeidiSQL to create the programs table
-- ================================================

USE innovativeminds;

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Laptop',
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

-- Verify
SELECT * FROM programs ORDER BY display_order;
