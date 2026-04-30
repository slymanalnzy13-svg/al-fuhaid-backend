export const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({ success: false, message });
};
