import type { Express, RequestHandler } from "express";
import session from "express-session";
// @ts-ignore - express-mysql-session doesn't have types
import MySQLStore from "express-mysql-session";
import { adminQueries, pool } from "./mysql-db";

declare module "express-session" {
    interface SessionData {
        adminUser?: {
            username: string;
            name: string;
        };
    }
}

export function setupSimpleAuth(app: Express) {
    // Create MySQL session store
    const MySQLStoreConstructor = MySQLStore(session);
    const sessionStore = new MySQLStoreConstructor({}, pool as any);

    // Setup session middleware
    app.use(
        session({
            secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            },
        })
    );

    // Login endpoint
    app.post("/api/admin/login", async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: "Username and password required" });
            }

            // Validate credentials against MySQL
            const admin = await adminQueries.validateCredentials(username, password);

            if (!admin) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Set session
            req.session.adminUser = {
                username: admin.username,
                name: admin.name,
            };

            res.json({
                success: true,
                user: {
                    username: admin.username,
                    name: admin.name,
                },
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // Logout endpoint
    app.post("/api/admin/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Logout failed" });
            }
            res.json({ success: true });
        });
    });

    // Get current user
    app.get("/api/admin/user", (req, res) => {
        if (req.session.adminUser) {
            res.json(req.session.adminUser);
        } else {
            res.status(401).json({ message: "Not authenticated" });
        }
    });
}

export const requireAdmin: RequestHandler = (req, res, next) => {
    if (req.session.adminUser) {
        next();
    } else {
        res.status(401).json({ message: "Authentication required" });
    }
};
