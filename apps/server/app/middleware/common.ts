export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    code: 0,
    message: err.message || "服务器错误",
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
