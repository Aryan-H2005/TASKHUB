import jwt from "jsonwebtoken";
import User from "../models/User.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const signToken = (id, remember = false) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: remember ? "30d" : "1d",
  });

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    if (!EMAIL_RE.test(email))
      return res.status(400).json({ message: "Please enter a valid email" });
    if (!PASSWORD_RE.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with upper case, lower case and a number",
      });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    }
    const user = await User.create({ name, email, password });
    res
      .status(201)
      .json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      token: signToken(user._id, rememberMe),
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// Used by the task form to pick an assigned user
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email").sort("name");
    res.json(users);
  } catch (err) {
    next(err);
  }
};
