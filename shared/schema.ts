import { pgTable, text, serial, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models so they are included in the schema
export * from "./models/auth";

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  program: text("program").notNull(),
  message: text("message"),
  status: text("status", { enum: ["pending", "contacted"] }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEnquirySchema = createInsertSchema(enquiries).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type UpdateEnquiryStatus = { status: "pending" | "contacted" };
