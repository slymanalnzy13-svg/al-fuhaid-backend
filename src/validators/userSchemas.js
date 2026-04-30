import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const userIdParamSchema = z
  .object({
    id: z.string().regex(objectIdRegex, "Invalid user id format")
  })
  .strict();
