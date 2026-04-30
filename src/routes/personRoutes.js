import express from "express";

import {
  createChild,
  deletePerson,
  getChildrenByPersonId,
  getPersonById,
  getRootPerson,
  searchPersons,
  updatePerson
} from "../controllers/personController.js";
import { protect, requireAdmin } from "../middlewares/auth.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate.js";
import {
  createChildSchema,
  personIdParamSchema,
  searchQuerySchema,
  updatePersonSchema
} from "../validators/personSchemas.js";

const router = express.Router();

router.get("/root", getRootPerson);
router.get("/search", validateQuery(searchQuerySchema), searchPersons);
router.get("/:id", validateParams(personIdParamSchema), getPersonById);
router.get("/:id/children", validateParams(personIdParamSchema), getChildrenByPersonId);
router.post("/", protect, requireAdmin, validateBody(createChildSchema), createChild);
router.put("/:id", protect, requireAdmin, validateParams(personIdParamSchema), validateBody(updatePersonSchema), updatePerson);
router.delete("/:id", protect, requireAdmin, validateParams(personIdParamSchema), deletePerson);

export default router;
