import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // SEO: Serve robots.txt with correct content type
  app.get("/robots.txt", (_req, res) => {
    const filePath = path.resolve(distPath, "robots.txt");
    if (fs.existsSync(filePath)) {
      res.type("text/plain").sendFile(filePath);
    } else {
      res.type("text/plain").send("User-agent: *\nAllow: /\n");
    }
  });

  // SEO: Serve sitemap.xml with correct content type
  app.get("/sitemap.xml", (_req, res) => {
    const filePath = path.resolve(distPath, "sitemap.xml");
    if (fs.existsSync(filePath)) {
      res.type("application/xml").sendFile(filePath);
    } else {
      res.status(404).send("Sitemap not found");
    }
  });

  // Serve static assets with cache headers
  app.use(express.static(distPath, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      // Don't cache HTML pages (SPA needs fresh content)
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

