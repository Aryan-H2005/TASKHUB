// Creates the test accounts required for evaluation + a few sample tasks.
// Run once:  npm run seed
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/User.js";
import Task from "./models/Task.js";

await mongoose.connect(process.env.MONGODB_URI);

await Task.deleteMany({});
await User.deleteMany({
  email: { $in: ["testuser@example.com", "admin@example.com"] },
});

const user = await User.create({
  name: "Test User",
  email: "testuser@example.com",
  password: "Test@1234",
  role: "user",
});
const admin = await User.create({
  name: "Admin User",
  email: "admin@example.com",
  password: "Admin@1234",
  role: "admin",
});

const day = 86400000;
const t = (title, description, priority, status, offset, who) => ({
  title,
  description,
  priority,
  status,
  dueDate: new Date(Date.now() + offset * day),
  assignedUser: who._id,
  createdBy: admin._id,
});

await Task.insertMany([
  t(
    "Design login page",
    "Create the login and register screens",
    "high",
    "completed",
    -2,
    user,
  ),
  t(
    "Build REST APIs",
    "Auth and task endpoints with JWT",
    "high",
    "in-progress",
    2,
    admin,
  ),
  t(
    "Write README",
    "Setup steps, API docs and screenshots",
    "medium",
    "pending",
    4,
    user,
  ),
  t(
    "Deploy to Vercel and Render",
    "Frontend on Vercel, backend on Render",
    "medium",
    "pending",
    5,
    admin,
  ),
  t(
    "Fix dashboard spacing",
    "Tidy up card layout on mobile",
    "low",
    "in-progress",
    1,
    user,
  ),
]);

console.log(
  "Seeded: testuser@example.com / Test@1234 and admin@example.com / Admin@1234",
);
await mongoose.disconnect();
