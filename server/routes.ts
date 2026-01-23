import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./mysql-storage";
import { setupSimpleAuth, requireAdmin } from "./simple-auth";
import { testConnection, programQueries } from "./mysql-db";
import { api } from "@shared/routes";
import { z } from "zod";
import { upload, getImageUrl, deleteImageFile, processAndSaveImage } from "./upload";
import path from "path";
import express from "express";
import { sendEnquiryNotification } from "./email";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Test database connection
  console.log("🔌 Testing MySQL connection...");
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error("❌ MySQL connection failed!");
    console.log("📝 Please check:");
    console.log("   1. Laragon MySQL is running");
    console.log("   2. Database 'innovativeminds' exists");
    console.log("   3. Run database/schema.sql to create tables");
    process.exit(1);
  }

  // Setup simple admin authentication
  setupSimpleAuth(app);

  // Serve uploaded files statically
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));
  console.log(`📁 Serving uploads from: ${uploadsPath} `);

  // Debug endpoint (public) - helps troubleshoot setup
  app.get("/api/debug/status", (req, res) => {
    res.json({
      server: "running",
      database: "MySQL connected",
      authMode: "mysql-session",
      authenticated: !!req.session?.adminUser,
      timestamp: new Date().toISOString(),
    });
  });

  // =====================
  // PUBLIC PROGRAMS API
  // =====================
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await programQueries.getAll();
      // Parse JSON features for each program
      const parsedPrograms = (programs as any[]).map(p => ({
        ...p,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
      }));
      res.json(parsedPrograms);
    } catch (err) {
      console.error("Error fetching programs:", err);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/popular", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const programs = await programQueries.getPopular(limit);

      const parsedPrograms = (programs as any[]).map(p => ({
        ...p,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
      }));
      res.json(parsedPrograms);
    } catch (err) {
      console.error("Error fetching popular programs:", err);
      res.status(500).json({ message: "Failed to fetch popular programs" });
    }
  });

  // =====================
  // ENQUIRIES API
  // =====================
  app.post(api.enquiries.create.path, async (req, res) => {
    try {
      const input = api.enquiries.create.input.parse(req.body);
      const enquiry = await storage.createEnquiry(input);

      console.log(`[ENQUIRY] New enquiry recorded for ${enquiry.name} (${enquiry.email})`);

      // Send email notification
      try {
        await sendEnquiryNotification({
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          program: enquiry.program,
          message: enquiry.message || undefined,
        });
        console.log(`[EMAIL] Notification sent for enquiry from ${enquiry.name}`);
      } catch (emailError) {
        console.error(`[EMAIL] Failed to send notification:`, emailError);
        // Don't fail the request if email fails
      }

      res.status(201).json(enquiry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // =====================
  // PROTECTED ADMIN ROUTES
  // =====================
  app.get(api.enquiries.list.path, requireAdmin, async (req, res) => {
    try {
      const enquiries = await storage.getEnquiries();
      res.json(enquiries);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.patch(api.enquiries.updateStatus.path, requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = api.enquiries.updateStatus.input.parse(req.body);
      const updated = await storage.updateEnquiryStatus(id, status);
      if (!updated) return res.status(404).json({ message: "Enquiry not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Admin: Manage Programs
  app.post("/api/admin/programs", requireAdmin, async (req, res) => {
    try {
      const id = await programQueries.create(req.body);
      const program = await programQueries.getById(id);
      res.status(201).json(program);
    } catch (err) {
      console.error("Error creating program:", err);
      res.status(500).json({ message: "Failed to create program" });
    }
  });

  app.put("/api/admin/programs/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updated = await programQueries.update(id, req.body);
      res.json(updated);
    } catch (err) {
      console.error("Error updating program:", err);
      res.status(500).json({ message: "Failed to update program" });
    }
  });

  app.delete("/api/admin/programs/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      // Get program to delete its image
      const program = await programQueries.getById(id);
      if (program && (program as any).image) {
        deleteImageFile((program as any).image);
      }
      await programQueries.delete(id);
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting program:", err);
      res.status(500).json({ message: "Failed to delete program" });
    }
  });

  // Image upload endpoint with automatic resizing
  app.post("/api/admin/upload/program-image", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Process and save image with fixed dimensions (800x450)
      const imageUrl = await processAndSaveImage(req.file);

      console.log(`[UPLOAD] Program image uploaded and resized: ${imageUrl} `);

      res.json({
        success: true,
        imageUrl,
        message: "Image uploaded and resized to 800x450px"
      });
    } catch (err) {
      console.error("Error uploading image:", err);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  return httpServer;
}
