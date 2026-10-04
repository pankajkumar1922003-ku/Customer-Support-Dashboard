
import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import { HttpError } from "../utils/httpError.js";

const STATUSES = ["Open", "In Progress", "Resolved"];
const PRIORITIES = ["Low", "Medium", "High"];

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidId = (id) => mongoose.isValidObjectId(id);

const validateTicketInput = (body, { partial = false } = {}) => {
  const errors = {};
  const input = {};

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object");
  }

  const has = (key) =>
    Object.prototype.hasOwnProperty.call(body, key);

  if (!partial || has("title")) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      errors.title = "Title is required";
    } else if (body.title.trim().length > 120) {
      errors.title = "Title cannot exceed 120 characters";
    } else {
      input.title = body.title.trim();
    }
  }

  if (!partial || has("description")) {
    if (
      typeof body.description !== "string" ||
      !body.description.trim()
    ) {
      errors.description = "Description is required";
    } else {
      input.description = body.description.trim();
    }
  }

  if (!partial || has("customerEmail")) {
    if (
      typeof body.customerEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail.trim())
    ) {
      errors.customerEmail = "Please provide a valid email address";
    } else {
      input.customerEmail = body.customerEmail.trim().toLowerCase();
    }
  }

  if (has("priority")) {
    if (!PRIORITIES.includes(body.priority)) {
      errors.priority = "Priority must be Low, Medium, or High";
    } else {
      input.priority = body.priority;
    }
  } else if (!partial) {
    input.priority = "Medium";
  }

  if (has("status")) {
    if (!STATUSES.includes(body.status)) {
      errors.status =
        "Status must be Open, In Progress, or Resolved";
    } else {
      input.status = body.status;
    }
  } else if (!partial) {
    input.status = "Open";
  }

  if (Object.keys(errors).length) {
    throw new HttpError(400, "Validation failed", errors);
  }

  if (partial && Object.keys(input).length === 0) {
    throw new HttpError(
      400,
      "Provide at least one valid field to update"
    );
  }

  return input;
};

// POST /api/tickets
export const createTicket = async (req, res) => {
  const input = validateTicketInput(req.body);
  const ticket = await Ticket.create(input);

  res.status(201).json({
    success: true,
    message: "Ticket created successfully",
    data: ticket,
  });
};

// GET /api/tickets
export const getTickets = async (req, res) => {
  const {
    search = "",
    status,
    priority,
    sort = "newest",
  } = req.query;

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  if (!Number.isSafeInteger(page) || page < 1) {
    throw new HttpError(400, "page must be a positive integer");
  }

  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(400, "limit must be between 1 and 100");
  }

  if (typeof search !== "string" || search.length > 200) {
    throw new HttpError(400, "search must be at most 200 characters");
  }

  if (status !== undefined && !STATUSES.includes(status)) {
    throw new HttpError(400, "Invalid status filter");
  }

  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    throw new HttpError(400, "Invalid priority filter");
  }

  if (!["newest", "oldest"].includes(sort)) {
    throw new HttpError(400, "sort must be newest or oldest");
  }

  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");

    filter.$or = [
      { title: regex },
      { customerEmail: regex },
    ];
  }

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .sort({
        createdAt: sort === "newest" ? -1 : 1,
        _id: sort === "newest" ? -1 : 1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Ticket.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: tickets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  });
};

// GET /api/tickets/summary
export const getTicketSummary = async (req, res) => {
  const [total, grouped] = await Promise.all([
    Ticket.countDocuments(),
    Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const counts = {
    Open: 0,
    "In Progress": 0,
    Resolved: 0,
  };

  for (const item of grouped) {
    counts[item._id] = item.count;
  }

  res.status(200).json({
    success: true,
    data: {
      total,
      counts,
    },
  });
};

// GET /api/tickets/:id
export const getTicketById = async (req, res) => {
  if (!isValidId(req.params.id)) {
    throw new HttpError(400, "Invalid ticket ID");
  }

  const ticket = await Ticket.findById(req.params.id).lean();

  if (!ticket) {
    throw new HttpError(404, "Ticket not found");
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
};

// PATCH /api/tickets/:id
export const updateTicket = async (req, res) => {
  if (!isValidId(req.params.id)) {
    throw new HttpError(400, "Invalid ticket ID");
  }

  const allowedFields = ["status", "priority"];
  const keys = Object.keys(req.body ?? {});

  if (keys.some((key) => !allowedFields.includes(key))) {
    throw new HttpError(
      400,
      "Only status and priority can be updated"
    );
  }

  const input = validateTicketInput(req.body, { partial: true });

  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { $set: input },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!ticket) {
    throw new HttpError(404, "Ticket not found");
  }

  res.status(200).json({
    success: true,
    message: "Ticket updated successfully",
    data: ticket,
  });
};