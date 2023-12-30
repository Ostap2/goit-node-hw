const express = require("express");
const controller = require("../../controller/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const { controllerWrapper } = require("../../erorr");
const multer = require("multer");

const upload = multer({ dest: "tmp/" });

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), controller.register);

router.post("/login", validateBody(schemas.loginSchema), controller.login);

router.get("/current", authenticate, controller.current);

router.post("/logout", authenticate, controller.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  controller.updateAvatar
);

module.exports = router;
