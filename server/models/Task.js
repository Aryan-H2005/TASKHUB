import mongoose from "mongoose";

export const STATUSES = ["pending", "in-progress", "completed"];
export const PRIORITIES = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: "Invalid priority" },
      default: "medium",
    },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: { values: STATUSES, message: "Invalid status" },
      default: "pending",
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
