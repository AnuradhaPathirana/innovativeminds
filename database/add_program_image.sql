-- Add image column to programs table
ALTER TABLE programs ADD COLUMN image VARCHAR(500) DEFAULT NULL AFTER icon;

-- Update existing programs with placeholder images (optional)
UPDATE programs SET image = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80' WHERE id = 1;
UPDATE programs SET image = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80' WHERE id = 2;
UPDATE programs SET image = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80' WHERE id = 3;
UPDATE programs SET image = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80' WHERE id = 4;
UPDATE programs SET image = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' WHERE id = 5;
UPDATE programs SET image = 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80' WHERE id = 6;
UPDATE programs SET image = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80' WHERE id = 7;

SELECT 'Image column added successfully!' AS status;
