import mongoose from "mongoose";
import Task, { STATUSES, PRIORITIES } from "../models/Task.js";
import User from "../models/User.js";

const SORTS = {
  newest: "-createdAt",
  oldest: "createdAt",
  dueAsc: "dueDate",
  dueDesc: "-dueDate",
};
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const POPULATE = ["assignedUser", "name email"];

const bad = (res, message) => res.status(400).json({ message });
const validId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sort = "newest" } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: escapeRegex(search), $options: "i" };
    if (status) {
      if (!STATUSES.includes(status)) return bad(res, "Invalid status filter");
      filter.status = status;
    }
    if (priority) {
      if (!PRIORITIES.includes(priority))
        return bad(res, "Invalid priority filter");
      filter.priority = priority;
    }
    if (!SORTS[sort]) return bad(res, "Invalid sort option");

    const tasks = await Task.find(filter)
      .sort(SORTS[sort])
      .populate(...POPULATE);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return bad(res, "Invalid task ID");
    const task = await Task.findById(req.params.id).populate(...POPULATE);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status, assignedUser } =
      req.body;
    const assignee = assignedUser || req.user._id;
    if (!validId(assignee) || !(await User.exists({ _id: assignee }))) {
      return bad(res, "Assigned user does not exist");
    }
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
      status,
      assignedUser: assignee,
      createdBy: req.user._id,
    });
    await task.populate(...POPULATE);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return bad(res, "Invalid task ID");
    const updates = {};
    [
      "title",
      "description",
      "priority",
      "dueDate",
      "status",
      "assignedUser",
    ].forEach((k) => {
      if (req.body[k] !== undefined)
        updates[k] = req.body[k] === "" && k === "dueDate" ? null : req.body[k];
    });
    if (
      updates.assignedUser &&
      (!validId(updates.assignedUser) ||
        !(await User.exists({ _id: updates.assignedUser })))
    ) {
      return bad(res, "Assigned user does not exist");
    }
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate(...POPULATE);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return bad(res, "Invalid task ID");
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted", id: task._id });
  } catch (err) {
    next(err);
  }
};
