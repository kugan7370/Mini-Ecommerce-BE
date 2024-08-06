import multer from "multer";
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = 500;
  let message = "Internal server error. Please try again later.";

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = err.message;
  }

  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });

  next();
};

export default errorHandler;
