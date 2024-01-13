const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const { promises: fs } = require("fs");
const Jimp = require("jimp");
const uuid = require("uuid");

const { SECRET_KEY } = process.env;

const { HttpError, controllerWrapper } = require("../erorr");
const { User } = require("../models/user");

const { sendVerificationEmail } = require('../utils/sendEmail');

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const promisifiedRename = fs.rename;

const register = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const verificationToken = uuid.v4();
  await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({
    user: {
      email,
      subscription: req.body.subscription || "starter",
    },
  });
});

const login = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(403, "Email is not verified");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});


const current = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = controllerWrapper(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
});

const updateAvatar = controllerWrapper(async (req, res) => {
  if(!req.file) { res.status(400).json({message: 'No file uploaded'}) }
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await promisifiedRename(tempUpload, resultUpload);

  const avatarJimp = await Jimp.read(resultUpload);
  avatarJimp.resize(250, 250).write(resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
});

const verifyEmail = controllerWrapper(async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  if (user.verify) {
    throw HttpError(400, 'Email has already been verified');
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

  res.status(200).json({ message: 'Verification successful' });
});
const resendVerification = controllerWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  // Генеруємо новий токен для повторної відправки
  const newVerificationToken = uuid.v4();
  await User.findByIdAndUpdate(user._id, { verificationToken: newVerificationToken });

  // Відправляємо новий токен на емейл
  await sendVerificationEmail(email, newVerificationToken);

  res.status(200).json({ message: 'Verification email sent' });
});


module.exports = {
  register,
  login,
  current: controllerWrapper(current),
  logout,
  updateAvatar,
  verifyEmail,
  resendVerification,
};
