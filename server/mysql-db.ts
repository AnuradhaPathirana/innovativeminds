import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// MySQL Connection Configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'innovativeminds',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Test connection
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ MySQL connection failed:', error);
        return false;
    }
}

// Admin queries
export const adminQueries = {
    findByUsername: async (username: string) => {
        const [rows] = await pool.execute(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );
        return (rows as any[])[0];
    },

    validateCredentials: async (username: string, password: string) => {
        // Get user by username first
        const [rows] = await pool.execute(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );
        const admin = (rows as any[])[0];

        if (!admin) return null;

        // Check if password matches (bcrypt or plain text fallback)
        const isHashed = admin.password.startsWith('$2');
        let isValid = false;

        if (isHashed) {
            isValid = await bcrypt.compare(password, admin.password);
        } else if (admin.password === password) {
            // Plain text match - migrate to hash
            isValid = true;
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                await pool.execute(
                    'UPDATE admins SET password = ? WHERE id = ?',
                    [hashedPassword, admin.id]
                );
                console.log(`[AUTH] Migrated password for admin ${username} to hash`);
            } catch (err) {
                console.error('[AUTH] Failed to migrate password:', err);
            }
        }

        return isValid ? admin : null;
    }
};

// Enquiry queries
export const enquiryQueries = {
    getAll: async () => {
        const [rows] = await pool.execute(
            'SELECT * FROM enquiries ORDER BY created_at DESC'
        );
        return rows;
    },

    create: async (data: any) => {
        const [result] = await pool.execute(
            'INSERT INTO enquiries (name, email, phone, program, message) VALUES (?, ?, ?, ?, ?)',
            [data.name, data.email, data.phone, data.program, data.message || null]
        );
        const insertId = (result as any).insertId;

        // Return the created enquiry
        const [rows] = await pool.execute(
            'SELECT * FROM enquiries WHERE id = ?',
            [insertId]
        );
        return (rows as any[])[0];
    },

    updateStatus: async (id: number, status: string) => {
        await pool.execute(
            'UPDATE enquiries SET status = ? WHERE id = ?',
            [status, id]
        );

        const [rows] = await pool.execute(
            'SELECT * FROM enquiries WHERE id = ?',
            [id]
        );
        return (rows as any[])[0];
    }
};

// Program queries
export const programQueries = {
    getAll: async () => {
        const [rows] = await pool.execute(
            'SELECT * FROM programs WHERE is_active = TRUE ORDER BY display_order ASC'
        );
        return rows;
    },

    getById: async (id: number) => {
        const [rows] = await pool.execute(
            'SELECT * FROM programs WHERE id = ?',
            [id]
        );
        return (rows as any[])[0];
    },

    getPopular: async (limit: number = 4) => {
        const [rows] = await pool.execute(
            `SELECT p.*, COUNT(e.id) as enquiryCount 
             FROM programs p 
             LEFT JOIN enquiries e ON e.program = p.title 
             WHERE p.is_active = TRUE 
             GROUP BY p.id 
             ORDER BY enquiryCount DESC, p.display_order ASC 
             LIMIT ?`,
            [limit.toString()]
        );
        return rows;
    },

    create: async (data: any) => {
        console.log('[DEBUG] Creating program with data:', JSON.stringify(data, null, 2));

        const title = data.title ?? '';
        const description = data.description ?? '';
        const icon = data.icon ?? 'Laptop';
        const image = data.image !== undefined ? data.image : null;
        const features = Array.isArray(data.features) ? JSON.stringify(data.features) : '[]';
        const duration = data.duration !== undefined ? data.duration : null;
        const display_order = typeof data.display_order === 'number' ? data.display_order : 0;

        console.log('[DEBUG] Processed values:', { title, description, icon, image, features, duration, display_order });

        const [result] = await pool.execute(
            'INSERT INTO programs (title, description, icon, image, features, duration, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, icon, image, features, duration, display_order]
        );
        return (result as any).insertId;
    },

    update: async (id: number, data: any) => {
        console.log('[DEBUG] Updating program', id, 'with data:', JSON.stringify(data, null, 2));

        const title = data.title ?? '';
        const description = data.description ?? '';
        const icon = data.icon ?? 'Laptop';
        const image = data.image !== undefined ? data.image : null;
        const features = Array.isArray(data.features) ? JSON.stringify(data.features) : '[]';
        const duration = data.duration !== undefined ? data.duration : null;
        const display_order = typeof data.display_order === 'number' ? data.display_order : 0;

        console.log('[DEBUG] Processed values:', { title, description, icon, image, features, duration, display_order, id });

        await pool.execute(
            'UPDATE programs SET title = ?, description = ?, icon = ?, image = ?, features = ?, duration = ?, display_order = ? WHERE id = ?',
            [title, description, icon, image, features, duration, display_order, id]
        );
        return programQueries.getById(id);
    },

    delete: async (id: number) => {
        await pool.execute(
            'UPDATE programs SET is_active = FALSE WHERE id = ?',
            [id]
        );
    }
};
