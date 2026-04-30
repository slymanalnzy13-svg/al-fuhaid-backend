import { z } from "zod";

const formatZodError = (error) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));

const createValidator = (schema, target) => (req, res, next) => {
  try {
    const parsed = schema.parse(req[target]);
    req[target] = parsed;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatZodError(error)
      });
    }

    next(error);
  }
};

export const validateBody = (schema) => createValidator(schema, "body");
export const validateParams = (schema) => createValidator(schema, "params");
export const validateQuery = (schema) => createValidator(schema, "query");
