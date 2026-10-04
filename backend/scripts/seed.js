
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import Ticket from "../src/models/Ticket.js";

const titles = [
  "Unable to log in",
  "Password reset not working",
  "Payment failed",
  "Invoice download issue",
  "Page loading slowly",
  "Profile update failed",
  "Email verification missing",
  "Account access issue",
  "Order confirmation missing",
  "Refund request",
  "Application crashes",
  "Incorrect billing amount",
  "Unable to upload document",
  "Notification not received",
  "Dashboard not loading",
  "Duplicate payment",
  "Mobile layout issue",
  "Cannot change password",
  "Account deactivation request",
  "Missing transaction record",
  "Search feature not working",
  "Report export failed",
  "Incorrect customer details",
  "Session expires early",
  "Support attachment issue",
  "API response delayed",
  "Unable to update settings",
  "Subscription renewal issue",
  "Two-factor login problem",
  "Feature access request",
];

const statuses = ["Open", "In Progress", "Resolved"];
const priorities = ["Low", "Medium", "High"];

const seed = async () => {
  try {
    await connectDB();

    const tickets = titles.map((title, index) => {
      const createdAt = new Date(
        Date.now() - index * 60 * 60 * 1000
      );

      return {
        title,
        description:
          `Customer reported the following issue: ${title}. ` +
          "Please investigate and provide an update.",
        customerEmail: `customer${index + 1}@example.com`,
        status: statuses[index % statuses.length],
        priority: priorities[index % priorities.length],
        createdAt,
        updatedAt: createdAt,
      };
    });

    // WARNING: This deletes all existing tickets in this collection.
    // Run only on a disposable development database.
    await Ticket.deleteMany({});
    await Ticket.insertMany(tickets);

    console.log(`Successfully seeded ${tickets.length} tickets.`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

await seed();