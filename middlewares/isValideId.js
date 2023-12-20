const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../erorr");

const isValidId = (req, res, next) => {
  try {
    const { contactId } = req.params;
    console.log(contactId);

    if (!isValidObjectId(contactId)) {
      throw HttpError(400, `${contactId} is not a valid ObjectId`);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isValidId;
