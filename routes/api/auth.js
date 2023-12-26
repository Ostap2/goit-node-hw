const express = require("express");

const controller = require("../../controller/auth");

const router = express.Router();

const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

router.post("/register", validateBody(schemas.registerSchema), controller.register);

router.post("/login", validateBody(schemas.loginSchema), controller.login);

router.get("/current", authenticate, controller.current);

router.post("/logout", authenticate, controller.logout);

module.exports = router;