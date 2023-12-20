const express = require("express");

const ctrl = require("../../controller/contacts");

const { validateBody, isValidId } = require("../../middlewares");

const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", ctrl.listContacts);

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId", isValidId, ctrl.removeContact);

router.put("/:contactId", isValidId, validateBody(schemas.updateSchema), ctrl.updateContact);

router.patch("/:contactId/favorite", isValidId, validateBody(schemas.updateFavSchema), ctrl.updateFavorite);

module.exports = router;
