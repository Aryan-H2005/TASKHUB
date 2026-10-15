import { Router } from "express";
import { register, login, getUsers } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/users", protect, getUsers);

export default router;
