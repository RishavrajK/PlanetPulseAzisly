/**
 * Global Express error handler middleware.
 * Normalises all thrown errors into a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join(', ') });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid resource ID' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
