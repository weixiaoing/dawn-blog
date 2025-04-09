export const successResponse = (res, data) => {
  res.json({
    code: 1,
    message: "success",
    data,
  });
};

// module.exports.errorResponse = (res, messagem) => {
//   res.json({
//     code: 0,
//     message: error,
//   });
// };
