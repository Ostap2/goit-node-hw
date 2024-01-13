const express = require("express");
const router = express.Router();
const controller = require("../../controller/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");

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

// Додаємо нові роути для верифікації емейла і ресенду верифікації
router.get("/verify/:verificationToken", controller.verifyEmail);
router.post("/verify", validateBody(schemas.resendVerificationSchema), controller.resendVerification);

module.exports = router;