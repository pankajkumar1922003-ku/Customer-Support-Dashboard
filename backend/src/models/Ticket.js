
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "Priority must be Low, Medium, or High",
      },
      default: "Medium",
    },

    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Resolved"],
        message: "Status must be Open, In Progress, or Resolved",
      },
      default: "Open",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Ticket", ticketSchema);