import express from "express";

import { getUsers, grantAdminAccess } from "../controllers/userController.js";
import { protect, requireAdmin } from "../middlewares/auth.js";
import { validateParams } from "../middlewares/validate.js";
import { userIdParamSchema } from "../validators/userSchemas.js";

const router = express.Router();

router.get("/", protect, requireAdmin, getUsers);
router.put("/:id/role", protect, requireAdmin, validateParams(userIdParamSchema), grantAdminAccess);

export default router;
