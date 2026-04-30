import express from "express";

import { login, register } from "../controllers/authController.js";
import { authLimiter } from "../middlewares/security.js";
import { validateBody } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";

const router = express.Router();

router.post("/register", authLimiter, validateBody(registerSchema), register);
router.post("/login", authLimiter, validateBody(loginSchema), login);

export default router;
