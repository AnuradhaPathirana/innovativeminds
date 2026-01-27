-- Fix delivery_mode ENUM values
UPDATE programs SET delivery_mode = 'Online' WHERE delivery_mode = 'Both' OR delivery_mode IS NULL OR delivery_mode = '';
ALTER TABLE programs MODIFY COLUMN delivery_mode ENUM('Online', 'Virtual', 'Online & Virtual') DEFAULT 'Online';
SELECT id, title, delivery_mode FROM programs;
