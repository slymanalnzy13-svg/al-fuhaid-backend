import express from "express";

import { getMe, login, register } from "../controllers/authController.js";
import { authLimiter } from "../middlewares/security.js";
import { protect } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";

const router = express.Router();

router.post("/register", authLimiter, validateBody(registerSchema), register);
router.post("/login", authLimiter, validateBody(loginSchema), login);
router.get("/me", protect, getMe);

export default router;
