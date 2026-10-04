
import mongoose from "mongoose";
import { HttpError } from "../utils/httpError.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    details = Object.fromEntries(
      Object.entries(err.errors).map(([key, value]) => [
        key,
        value.message,
      ])
    );
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid value provided";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  if (!(err instanceof HttpError) &&
      !(err instanceof mongoose.Error) &&
      err.code !== 11000 &&
      !(err instanceof SyntaxError && "body" in err)) {
    console.error(err);
    statusCode = 500;
    message = "Internal server error";
    details = undefined;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { errors: details } : {}),
  });
};