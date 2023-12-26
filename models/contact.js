const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../erorr");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().messages({ "any.required": "missing required name field" }),
  email: Joi.string().email().messages({ "any.required": "missing required email field" }),
  phone: Joi.string().messages({ "any.required": "missing required phone field" }),
  favorite: Joi.boolean(),
}).or('name', 'email', 'phone').required().options({ abortEarly: false });


const updateSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(5).max(15),
  favorite: Joi.boolean(),
})
  .min(1)
  .messages({ 'object.min': 'missing fields' });

const updateFavSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "missing field favorite" }),
});

const schemas = {
  addSchema,
  updateFavSchema,
  updateSchema
};

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };