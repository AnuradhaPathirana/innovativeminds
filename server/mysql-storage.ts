import { type Enquiry, type InsertEnquiry } from "@shared/schema";
import { enquiryQueries } from "./mysql-db";

export interface IStorage {
    createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;
    getEnquiries(): Promise<Enquiry[]>;
    updateEnquiryStatus(id: number, status: "pending" | "contacted"): Promise<Enquiry | undefined>;
}

export class MySQLStorage implements IStorage {
    async createEnquiry(insertEnquiry: InsertEnquiry): Promise<Enquiry> {
        const dbEnquiry = await enquiryQueries.create({
            name: insertEnquiry.name,
            email: insertEnquiry.email,
            phone: insertEnquiry.phone,
            program: insertEnquiry.program,
            message: insertEnquiry.message ?? null,
        });

        return {
            id: dbEnquiry.id,
            name: dbEnquiry.name,
            email: dbEnquiry.email,
            phone: dbEnquiry.phone,
            program: dbEnquiry.program,
            message: dbEnquiry.message,
            status: dbEnquiry.status,
            createdAt: new Date(dbEnquiry.created_at),
        };
    }

    async getEnquiries(): Promise<Enquiry[]> {
        const dbEnquiries = await enquiryQueries.getAll();
        return (dbEnquiries as any[]).map(e => ({
            id: e.id,
            name: e.name,
            email: e.email,
            phone: e.phone,
            program: e.program,
            message: e.message,
            status: e.status,
            createdAt: new Date(e.created_at),
        }));
    }

    async updateEnquiryStatus(id: number, status: "pending" | "contacted"): Promise<Enquiry | undefined> {
        const updated = await enquiryQueries.updateStatus(id, status);
        if (!updated) return undefined;

        return {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            program: updated.program,
            message: updated.message,
            status: updated.status,
            createdAt: new Date(updated.created_at),
        };
    }
}

export const storage = new MySQLStorage();
