import { db } from "./db";
import { enquiries } from "@shared/schema";

async function main() {
  console.log("Seeding database...");
  try {
      const existing = await db.select().from(enquiries);
      if (existing.length > 0) {
          console.log("Database already seeded.");
          return;
      }

      await db.insert(enquiries).values([
        {
          name: "John Doe",
          email: "john@example.com",
          phone: "+94 77 123 4567",
          program: "Certificate in Virtual Assistant & Remote Support Professional",
          message: "I am interested in this course. When does the next batch start?",
          status: "pending"
        },
        {
           name: "Jane Smith",
           email: "jane@example.com",
           phone: "+94 71 987 6543",
           program: "Certificate in Practical AI Tools for Small Business",
           message: "Please send me the course syllabus and fee structure.",
           status: "contacted"
        },
        {
            name: "Kasun Perera",
            email: "kasun@example.com",
            phone: "+94 70 111 2222",
            program: "Certificate in E-commerce Entrepreneurship",
            message: "I want to start an online store.",
            status: "pending"
        }
      ]);
      console.log("Seeding complete.");
  } catch (err) {
      console.error("Seeding failed:", err);
  }
}

main().catch(console.error);
