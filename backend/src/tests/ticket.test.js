
import { beforeAll, afterAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import Ticket from "../models/Ticket.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  await Ticket.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const makeTicket = (overrides = {}) => ({
  title: "Cannot log in",
  description: "Login fails after entering valid credentials.",
  customerEmail: "customer@example.com",
  priority: "High",
  status: "Open",
  ...overrides,
});

describe("Support Ticket API", () => {
  it("creates a ticket with default status Open", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .send({
        title: "Login issue",
        description: "Cannot log in to my account.",
        customerEmail: "USER@example.com",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("Open");
    expect(response.body.data.priority).toBe("Medium");
    expect(response.body.data.customerEmail).toBe(
      "user@example.com"
    );
    expect(response.body.data.createdAt).toBeTruthy();
    expect(response.body.data.updatedAt).toBeTruthy();
  });

  it("rejects an invalid email", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .send(makeTicket({ customerEmail: "invalid-email" }));

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.customerEmail).toBeTruthy();
  });

  it("combines search, filters, and pagination", async () => {
    await Ticket.create([
      makeTicket({
        title: "Login problem one",
        customerEmail: "one@example.com",
        status: "Open",
        priority: "High",
      }),
      makeTicket({
        title: "Login problem two",
        customerEmail: "two@example.com",
        status: "Open",
        priority: "High",
      }),
      makeTicket({
        title: "Login problem three",
        customerEmail: "three@example.com",
        status: "Resolved",
        priority: "High",
      }),
      makeTicket({
        title: "Payment issue",
        customerEmail: "four@example.com",
        status: "Open",
        priority: "Low",
      }),
    ]);

    const response = await request(app).get(
      "/api/tickets?search=login&status=Open&priority=High&page=1&limit=1&sort=newest"
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.pagination.total).toBe(2);
    expect(response.body.pagination.totalPages).toBe(2);
    expect(response.body.pagination.hasNextPage).toBe(true);
  });

  it("updates status and priority persistently", async () => {
    const ticket = await Ticket.create(makeTicket());

    const response = await request(app)
      .patch(`/api/tickets/${ticket._id}`)
      .send({
        status: "Resolved",
        priority: "Low",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("Resolved");
    expect(response.body.data.priority).toBe("Low");

    const savedTicket = await Ticket.findById(ticket._id);

    expect(savedTicket.status).toBe("Resolved");
    expect(savedTicket.priority).toBe("Low");
  });
});