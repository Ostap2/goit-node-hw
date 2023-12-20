const handleMongooseError = (error, data, next) => {
  if (error.errors) {

    const errorMessage = Object.values(error.errors).map((error) => error.message).join(', ');
    error.message = errorMessage;
  }
  error.status = 400;
  next(error);
};

module.exports = handleMongooseError;
