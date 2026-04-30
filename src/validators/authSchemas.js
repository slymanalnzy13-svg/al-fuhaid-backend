import { z } from "zod";

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(160),
    password: z.string().min(8).max(128)
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().email().max(160),
    password: z.string().min(8).max(128)
  })
  .strict();
