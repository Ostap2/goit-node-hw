const { HttpError } = require("../erorr");

const validateBody = (schema) => {
  const middleware = async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error.isJoi) {
        const errorMessage = error.details.map((detail) => detail.message).join("-");
        next(HttpError(400, errorMessage));
      } else {
        next(error);
      }
    }
  };

  return middleware;
};

module.exports = validateBody;