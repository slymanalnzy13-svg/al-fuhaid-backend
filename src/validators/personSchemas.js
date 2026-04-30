import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const personIdParamSchema = z
  .object({
    id: z.string().regex(objectIdRegex, "Invalid id format")
  })
  .strict();

export const searchQuerySchema = z
  .object({
    q: z.string().trim().min(1).max(120).optional()
  })
  .strict();

export const createChildSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    father_id: z.string().regex(objectIdRegex, "Invalid father_id format")
  })
  .strict();

export const updatePersonSchema = z
  .object({
    name: z.string().trim().min(2).max(120)
  })
  .strict();
